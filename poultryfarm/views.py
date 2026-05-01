from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, DetailView, CreateView
from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
import json
from decimal import Decimal
from django.db.models import Count
# models
from .models import (
    Item, SubImage,
    Consultant, ConsultationService, ConsultationBooking,
    EggSeller, EggOrder,
    ChickenSeller,
    TrainingEnrollment
)

# forms
from .forms import (
    ItemForm,
    ConsultationBookingForm,
    EggSellerForm,
    EggOrderForm,
    EggSellerFilterForm,
    ChickenSellerForm,
    TrainingEnrollmentForm
)

# cart
from cart.models import CartItem
from cart.views import _get_cart
from django.contrib.contenttypes.models import ContentType

@login_required
@require_POST
@csrf_exempt
def like_item(request, slug):
    item = get_object_or_404(Item, slug=slug)
    new_count = item.toggle_like(request.user)

    return JsonResponse({
        'status': 'success',
        'like_count': new_count,
        'has_liked': item.has_liked(request.user),
        'item_id': slug
    })


def share_item(request, slug):
    item = get_object_or_404(Item, slug=slug)
    item.share_count += 1
    item.save()
    return JsonResponse({
    'status': 'success',
    'share_count': item.share_count
})
 

def index(request):
    featured_products = Item.objects.all().order_by('-created_at')[:3]
    return render(request, 'poultryfarm/index.html', {
        'featured_products': featured_products
    })

 
class ItemListView(ListView):
    model = Item
    template_name = 'poultryfarm/item_list.html'
    context_object_name = 'poultry'
    paginate_by = 12
    ordering = ['-created_at']

 
class ItemDetailView(DetailView):
    model = Item
    template_name = 'poultryfarm/item_detail.html'
    context_object_name = 'item'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        item = self.object
        context['app_label'] = item._meta.app_label
        context['model_name'] = item._meta.model_name
        return context


class ItemCreateView(LoginRequiredMixin, CreateView):
    model = Item
    form_class = ItemForm
    template_name = 'poultryfarm/item_create.html'
    success_message = "Item was created successfully!"
    login_url = 'login'

    def form_valid(self, form):
        if self.request.user.is_authenticated:
            form.instance.created_by = self.request.user
        
        item = form.save()
        
        return redirect('poultryfarm:item_detail', slug=item.slug)

def item_edit(request, slug):
    item = get_object_or_404(Item, slug=slug)
    form = ItemForm(request.POST or None, request.FILES or None, instance=item)

    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect('poultryfarm:item_detail', slug=item.slug)

    return render(request, 'poultryfarm/item_create.html', {'form': form})


def item_delete(request, slug):
    item = get_object_or_404(Item, slug=slug)
    if request.method == "POST":
        item.delete()
    return redirect('poultryfarm:item_list')
 
def veterinary_consultancy(request):
    consultants = Consultant.objects.filter(is_available=True).prefetch_related('services')
    return render(request, 'poultryfarm/veterinary_consultancy.html', {
        'consultants': consultants,
        'form': ConsultationBookingForm()
    })
 

@require_POST
@csrf_exempt
def book_consultation(request):
    data = json.loads(request.body)

    consultant = get_object_or_404(Consultant, id=data.get('consultant_id'))
    service = get_object_or_404(ConsultationService, id=data.get('service_id'))

    form = ConsultationBookingForm({
        'consultant': consultant.id,
        'service': service.id,
        'user_name': data.get('user_name'),
        'user_email': data.get('user_email'),
        'user_phone': data.get('user_phone'),
        'preferred_date': data.get('preferred_date'),
        'preferred_time': data.get('preferred_time'),
        'message': data.get('message'),
    })

    if form.is_valid():
        form.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'errors': form.errors}, status=400)
 
def egg_sellers(request):
    sellers = EggSeller.objects.filter(is_active=True).select_related('user__profile')
    form = EggSellerFilterForm(request.GET or None)

    if form.is_valid():
        sellers = sellers.filter(
            user__profile__city__icontains=form.cleaned_data['city']
        )
        if form.cleaned_data.get('min_price'):
            sellers = sellers.filter(price_per_dozen__gte=form.cleaned_data['min_price'])

        if form.cleaned_data.get('max_price'):
            sellers = sellers.filter(price_per_dozen__lte=form.cleaned_data['max_price'])

    # Add order count annotation to each seller
    sellers = sellers.annotate(egg_order_count=Count('orders'))

    return render(request, 'poultryfarm/egg_sellers.html', {
        'sellers': sellers,
        'filter_form': form
    })


@login_required
def add_egg_seller(request):
    if hasattr(request.user, 'egg_seller'):
        messages.error(request, "You already have a seller profile.")
        return redirect('poultryfarm:egg_sellers')

    form = EggSellerForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        seller = form.save(commit=False)
        seller.user = request.user

        seller.owner_name = request.user.username

        seller.save()

        messages.success(request, "Egg seller created!")
        return redirect('poultryfarm:egg_sellers')

    return render(request, 'poultryfarm/add_egg_seller.html', {'form': form})


@login_required
def edit_egg_seller(request, pk):
    seller = get_object_or_404(EggSeller, pk=pk)
    form = EggSellerForm(request.POST or None, instance=seller)

    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect('poultryfarm:egg_sellers')

    return render(request, 'poultryfarm/edit_egg_seller.html', {
        'form': form,
        'seller': seller
    })
@login_required
def egg_seller_orders(request):
    seller = getattr(request.user, 'egg_seller', None)

    if not seller:
        return render(request, 'poultryfarm/egg_seller_orders.html', {
            'orders': []
        })

    orders = seller.orders.all().order_by('-order_date')

    return render(request, 'poultryfarm/egg_seller_orders.html', {
        'orders': orders
    })

@login_required
@require_POST
def place_egg_order(request):
    try:
        if request.content_type == "application/json":
            data = json.loads(request.body)
        else:
            data = request.POST

        seller_id = data.get('seller_id')
        if not seller_id:
            return JsonResponse({
                "success": False,
                "message": "Seller ID is missing"
            }, status=400)

        seller = get_object_or_404(EggSeller, id=seller_id)

        quantity = int(data.get('quantity'))
        address = data.get('customer_address')

        preferred_date = data.get('preferred_delivery_date') or None
        instructions = data.get('special_instructions', '')

        order = EggOrder.objects.create(
            seller=seller,
            user=request.user,
            customer_address=address,
            quantity=quantity,
            preferred_delivery_date=preferred_date,
            special_instructions=instructions,
        )

        return JsonResponse({
            "success": True,
            "message": "Order placed successfully!"
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)

@login_required
@require_POST
def delete_egg_seller_ajax(request, pk):
    seller = get_object_or_404(EggSeller, pk=pk)
    seller.delete()
    return JsonResponse({'success': True})
 
def chicken_sellers_list(request):
    sellers = ChickenSeller.objects.filter(is_active=True)

    search = request.GET.get('search')
    if search:
        sellers = sellers.filter(
            Q(farm_name__icontains=search) |
            Q(description__icontains=search)
        )

    return render(request, 'poultryfarm/chicken_sellers.html', {
        'sellers': sellers
    })


@login_required
def register_seller(request):
    form = ChickenSellerForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        seller = form.save(commit=False)
        seller.user = request.user
        seller.save()
        return redirect('poultryfarm:chicken_sellers_list')

    return render(request, 'poultryfarm/register_seller.html', {'form': form})

 
def poultry_trainings(request):
    form = TrainingEnrollmentForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Enrollment successful!")
        return redirect('poultryfarm:poultry_trainings')

    return render(request, 'poultryfarm/poultry_trainings.html', {'form': form})


@login_required
def poultry_trainees(request):
    trainees = TrainingEnrollment.objects.all().order_by('-created_at')
    return render(request, 'poultryfarm/poultry_trainees.html', {
        'trainees': trainees
    })

def chicken_seller_detail(request, seller_id):
    seller = get_object_or_404(ChickenSeller, id=seller_id)
    return render(request, 'poultryfarm/chicken_seller_detail.html', {'seller': seller})
edit_seller = login_required(lambda request, seller_id: render(request, 'poultryfarm/edit_seller.html', {}))
delete_seller = login_required(lambda request, seller_id: redirect('poultryfarm:chicken_sellers_list'))
delete_seller_ajax = login_required(lambda request, seller_id: JsonResponse({'success': True}))