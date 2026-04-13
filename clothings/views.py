# project/clothings/views.py
from django.views.generic import ListView, DetailView
from django.db.models import Q
from .models import ClothingCategory, ClothingItem
from .forms import ClothingCreateForm
from django.views.generic import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.utils.text import slugify
from django.shortcuts import render, get_object_or_404, redirect
from cart.views import _get_cart
from cart.models import CartItem
from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.views.decorators.csrf import csrf_protect
from .forms import ClothingItemForm
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import ClothingItemForm as ClothingFormForm

@require_POST
@login_required
def like_clothing(request, clothing_id):
    try:
        clothing = ClothingItem.objects.get(id=clothing_id)
        new_count = clothing.toggle_like(request.user)
        return JsonResponse({
            'status': 'success',
            'like_count': new_count,
            'clothing_id': clothing_id
        })
    except ClothingItem.DoesNotExist:
        return JsonResponse({'status': 'error'}, status=404)

@require_POST
@login_required
@csrf_protect
def share_clothing(request, clothing_id):
        clothing = get_object_or_404(ClothingItem, id=clothing_id)
        new_share_count = clothing.increment_shares()
        return JsonResponse({
            'status': 'success',
            'share_count': new_share_count,
            'clothing_id': clothing_id
        })

class ClothingListView(ListView):
    model = ClothingItem
    template_name = 'clothings/clothing_list.html'
    context_object_name = 'clothes'
    paginate_by = 12
    
    def get_queryset(self):
        qs = ClothingItem.objects.filter(stock_quantity__gt=0).order_by('-created_at')
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        clothes = context['clothes']

        cart = _get_cart(self.request)
        clothing_ct = ContentType.objects.get_for_model(ClothingItem)
        cart_clothing_ids = CartItem.objects.filter(
            cart=cart,
            content_type=clothing_ct,
            object_id__in=clothes.values_list('id', flat=True)
        ).values_list('object_id', flat=True)

        liked_clothe_ids = []
        if self.request.user.is_authenticated:
            liked_clothe_ids = self.request.user.liked_clothings.values_list('id', flat=True)

        for item in clothes:
            item.is_carted = item.id in cart_clothing_ids
            item.has_liked = item.id in liked_clothe_ids
        return context


class CategoryView(ListView):
    model = ClothingItem
    template_name = 'clothings/clothing_list.html'
    context_object_name = 'clothes'
    paginate_by = 12
    
    def get_queryset(self):
        return ClothingItem.objects.filter(
            category__slug=self.kwargs['slug'],
            stock_quantity__gt=0
        ).order_by('-created_at')

class GenderView(ListView):
    model = ClothingItem
    template_name = 'clothings/clothing_list.html'
    context_object_name = 'clothes'
    paginate_by = 12
    
    def get_queryset(self):
        gender = self.kwargs['gender'].upper()
        return ClothingItem.objects.filter(
            category__gender=gender,
            stock_quantity__gt=0
        ).order_by('-created_at')

class ClothingSearchView(ListView):
    model = ClothingItem
    template_name = 'clothings/clothing_list.html'
    context_object_name = 'clothes'
    paginate_by = 12
    
    def get_queryset(self):
        query = self.request.GET.get('q')
        return ClothingItem.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(brand__icontains=query),
            stock_quantity__gt=0
        ).order_by('-created_at')

class ClothingDetailView(DetailView):
    model = ClothingItem
    template_name = 'clothings/clothing_detail.html'
    context_object_name = 'clothing'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        product = self.object
        context['app_label'] = product._meta.app_label
        context['model_name'] = product._meta.model_name
        context['related_items'] = ClothingItem.objects.filter(
            category=self.object.category
        ).exclude(
            pk=self.object.pk
        )[:4]

        cart = _get_cart(self.request)
        clothing_ct = ContentType.objects.get_for_model(ClothingItem)
        product.is_carted = CartItem.objects.filter(
            cart=cart,
            content_type=clothing_ct,
            object_id=product.id
        ).exists()
        user = self.request.user
        context['has_liked'] = (
            user.is_authenticated 
            and product.liked_by.filter(pk=user.pk).exists()
        )

        return context
    
def generate_unique_slug(name):
    base_slug = slugify(name)
    slug = base_slug
    counter = 1
    while ClothingItem.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug

class ClothingCreateView(CreateView):
    model = ClothingItem
    form_class = ClothingCreateForm
    template_name = 'clothings/clothing_create.html'
    login_url = 'users:login'
    
    def get_form_kwargs(self):
        """Pass the user to the form"""
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs
    
    def form_valid(self, form):
        form.instance.slug = generate_unique_slug(form.instance.name)
        return super().form_valid(form)

    def form_invalid(self, form):
        print("Form errors:", form.errors)
        return super().form_invalid(form)
    
    def get_success_url(self):
        return reverse_lazy('clothings:clothing_detail', kwargs={'slug': self.object.slug})

class ClothingUpdateView(LoginRequiredMixin, UpdateView):
    model = ClothingItem
    form_class = ClothingFormForm 
    template_name = 'clothings/clothing_create.html'
    login_url = 'users:login'
    
    def get_success_url(self):
        return reverse_lazy('clothings:clothing_detail', kwargs={'slug': self.object.slug})


class ClothingDeleteView(DeleteView):
    model = ClothingItem
    template_name = 'clothings/clothing_confirm_delete.html'
    success_url = reverse_lazy('clothings:clothing_list')

def product_detail(request, pk):
    product = get_object_or_404(ClothingItem, pk=pk)
    context = {
        'product': product,
        'app_label': product._meta.app_label,
        'model_name': product._meta.model_name,
    }
    return render(request, 'clothings/product_detail.html', context)
