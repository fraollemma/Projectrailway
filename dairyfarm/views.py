# project/dairyfarm/views.py
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy, reverse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.contenttypes.models import ContentType

import dairyfarm
from .models import DairyFarm, VehicleCategory
from .forms import VehicleForm
from cart.models import CartItem
from cart.views import _get_cart 

@require_POST
@csrf_exempt
def like_dairyfarm(request, vehicle_id):
    try:
        vehicle = DairyFarm.objects.get(id=vehicle_id)
        new_count = vehicle.toggle_like(request.user)
        return JsonResponse({
            'status': 'success',
            'like_count': new_count,
            'vehicle_id': vehicle_id
        })
    except DairyFarm.DoesNotExist:
        return JsonResponse({'status': 'error'}, status=404)


@require_POST
@csrf_exempt
def share_dairyfarm(request, vehicle_id):
    try:
        vehicle = DairyFarm.objects.get(id=vehicle_id)
        new_count = vehicle.increment_shares()
        return JsonResponse({
            'status': 'success',
            'share_count': new_count,
            'vehicle_id': vehicle_id
        })
    except DairyFarm.DoesNotExist:
        return JsonResponse({'status': 'error'}, status=404)


class VehicleListView(ListView):
    model = DairyFarm
    template_name = 'dairyfarm/dairyfarm_list.html'
    context_object_name = 'dairyfarm'
    paginate_by = 12
 
    def get_queryset(self):
        return DairyFarm.objects.filter(is_featured=True).order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        dairyfarm = context['dairyfarm']

        cart = _get_cart(self.request)
        vehicle_ct = ContentType.objects.get_for_model(DairyFarm)
        cart_dairyfarm_ids = CartItem.objects.filter(
            cart=cart,
            content_type=vehicle_ct,
            object_id__in=dairyfarm.values_list('id', flat=True)
        ).values_list('object_id', flat=True)

        liked_dairyfarm_ids = []
        if self.request.user.is_authenticated:
            liked_dairyfarm_ids = self.request.user.dairyfarm.values_list('id', flat=True)

        for dairyfarm in dairyfarm:
            dairyfarm.is_carted = dairyfarm.id in cart_dairyfarm_ids
            dairyfarm.has_liked = dairyfarm.id in liked_dairyfarm_ids

        return context


class VehicleDetailView(DetailView):
    model = DairyFarm
    template_name = 'dairyfarm/dairyfarm_detail.html'
    context_object_name = 'vehicle'
    slug_field = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        vehicle = self.object
        context['app_label'] = vehicle._meta.app_label
        context['model_name'] = vehicle._meta.model_name

        cart = _get_cart(self.request)
        vehicle_ct = ContentType.objects.get_for_model(vehicle)
        context['vehicle'].is_carted = CartItem.objects.filter(
            cart=cart,
            content_type=vehicle_ct,
            object_id=vehicle.id
        ).exists()
        user = self.request.user
        context['has_liked'] = (
            user.is_authenticated
            and dairyfarm.liked_by.filter(pk=user.pk).exists()
        )

        return context


class CategoryView(ListView):
    model = DairyFarm
    template_name = 'dairyfarm/dairyfarm_list.html'
    context_object_name = 'dairyfarm'
    paginate_by = 12

    def get_queryset(self):
        return DairyFarm.objects.filter(category__slug=self.kwargs['slug']).order_by('-created_at')


class VehicleCreateView(LoginRequiredMixin, CreateView):
    model = DairyFarm
    form_class = VehicleForm
    template_name = 'dairyfarm/vehicle_form.html'
    success_url = reverse_lazy('dairyfarm:dairyfarm_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs


class VehicleEditView(LoginRequiredMixin, UpdateView):
    model = DairyFarm
    form_class = VehicleForm
    template_name = 'dairyfarm/vehicle_form.html'

    def get_object(self, queryset=None):
        return DairyFarm.objects.get(slug=self.kwargs['slug'])

    def get_success_url(self):
        return reverse_lazy('dairyfarm:dairyfarm_detail', kwargs={'slug': self.object.slug})


class VehicleDeleteView(LoginRequiredMixin, DeleteView):
    model = DairyFarm
    template_name = 'dairyfarm/vehicle_confirm_delete.html'

    def get_object(self, queryset=None):
        return DairyFarm.objects.get(slug=self.kwargs['slug'])

    def get_success_url(self):
        return reverse_lazy('dairyfarm:dairyfarm_list')


def add_dairyfarm_to_cart(request, vehicle_id):
    app_label = 'dairyfarm'
    model_name = 'dairyfarm'
    return redirect(reverse('cart:add_to_cart', kwargs={
        'app_label': app_label,
        'model_name': model_name,
        'product_id': vehicle_id,
    }))
