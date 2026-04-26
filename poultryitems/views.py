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


# ----------------------------
# ITEMS
# ----------------------------

@require_POST
@csrf_exempt
def like_item(request, pk):
    item = get_object_or_404(Item, pk=pk)
    new_count = item.toggle_like(request.user)

    return JsonResponse({
        'status': 'success',
        'like_count': new_count,
        'has_liked': item.has_liked(request.user),
        'item_id': pk
    })


def share_item(request, pk):
    item = get_object_or_404(Item, pk=pk)
    item.share_count += 1
    item.save()
    return JsonResponse({'shares': item.share_count})


# ----------------------------
# INDEX
# ----------------------------

def index(request):
    featured_products = Item.objects.all().order_by('-created_at')[:3]
    return render(request, 'poultryitems/index.html', {
        'featured_products': featured_products
    })


# ----------------------------
# ITEMS CRUD
# ----------------------------

class ItemListView(ListView):
    model = Item
    template_name = 'poultryitems/item_list.html'
    context_object_name = 'items'
    paginate_by = 12
    ordering = ['-created_at']


class ItemDetailView(DetailView):
    model = Item
    template_name = 'poultryitems/item_detail.html'
    context_object_name = 'item'


class ItemCreateView(LoginRequiredMixin, CreateView):
    model = Item
    form_class = ItemForm
    template_name = 'poultryitems/item_create.html'

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        item = form.save()
        messages.success(self.request, "Item created successfully!")
        return redirect('poultryitems:item_detail', pk=item.pk)


def item_edit(request, pk):
    item = get_object_or_404(Item, pk=pk)
    form = ItemForm(request.POST or None, request.FILES or None, instance=item)

    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect('poultryitems:item_detail', pk=item.pk)

    return render(request, 'poultryitems/item_create.html', {'form': form})


def item_delete(request, pk):
    item = get_object_or_404(Item, pk=pk)
    if request.method == "POST":
        item.delete()
    return redirect('poultryitems:item_list')


# ----------------------------
# CONSULTANCY
# ----------------------------

def veterinary_consultancy(request):
    consultants = Consultant.objects.filter(is_available=True).prefetch_related('services')
    return render(request, 'poultryitems/veterinary_consultancy.html', {
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


# ----------------------------
# EGG SELLERS
# ----------------------------

def egg_sellers(request):
    sellers = EggSeller.objects.filter(is_active=True).select_related('user__profile')
    form = EggSellerFilterForm(request.GET or None)

    if form.is_valid():
        if form.cleaned_data.get('city'):
            sellers = sellers.filter(city__icontains=form.cleaned_data['city'])

        if form.cleaned_data.get('min_price'):
            sellers = sellers.filter(price_per_dozen__gte=form.cleaned_data['min_price'])

        if form.cleaned_data.get('max_price'):
            sellers = sellers.filter(price_per_dozen__lte=form.cleaned_data['max_price'])

    return render(request, 'poultryitems/egg_sellers.html', {
        'sellers': sellers,
        'filter_form': form
    })


@login_required
def add_egg_seller(request):
    if hasattr(request.user, 'egg_seller'):
        messages.error(request, "You already have a seller profile.")
        return redirect('poultryitems:egg_sellers')

    form = EggSellerForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        seller = form.save(commit=False)
        seller.user = request.user

        # FIX: no need for get_full_name or profile mandatory fields
        seller.owner_name = request.user.username

        seller.save()

        messages.success(request, "Egg seller created!")
        return redirect('poultryitems:egg_sellers')

    return render(request, 'poultryitems/add_egg_seller.html', {'form': form})


@login_required
def edit_egg_seller(request, pk):
    seller = get_object_or_404(EggSeller, pk=pk)
    form = EggSellerForm(request.POST or None, instance=seller)

    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect('poultryitems:egg_sellers')

    return render(request, 'poultryitems/edit_egg_seller.html', {
        'form': form,
        'seller': seller
    })

def egg_seller_orders(request):
    return render(request, 'poultryitems/egg_seller_orders.html')

@login_required
def place_egg_order(request):
    if request.method == 'POST':
        seller_id = request.POST.get('seller_id')
        customer_address = request.POST.get('customer_address')
        quantity = request.POST.get('quantity')
        messages.success(request, "Order placed successfully!")
        return redirect('poultryitems:egg_sellers')
    return redirect('poultryitems:egg_sellers')

@login_required
@require_POST
def delete_egg_seller_ajax(request, pk):
    seller = get_object_or_404(EggSeller, pk=pk)
    seller.delete()
    return JsonResponse({'success': True})


# ----------------------------
# CHICKEN SELLERS
# ----------------------------

def chicken_sellers_list(request):
    sellers = ChickenSeller.objects.filter(is_active=True)

    search = request.GET.get('search')
    if search:
        sellers = sellers.filter(
            Q(farm_name__icontains=search) |
            Q(description__icontains=search)
        )

    return render(request, 'poultryitems/chicken_sellers.html', {
        'sellers': sellers
    })


@login_required
def register_seller(request):
    form = ChickenSellerForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        seller = form.save(commit=False)
        seller.user = request.user
        seller.save()
        return redirect('poultryitems:chicken_sellers_list')

    return render(request, 'poultryitems/register_seller.html', {'form': form})


# ----------------------------
# TRAINING
# ----------------------------

def poultry_trainings(request):
    form = TrainingEnrollmentForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Enrollment successful!")
        return redirect('poultryitems:poultry_trainings')

    return render(request, 'poultryitems/poultry_trainings.html', {'form': form})


@login_required
def poultry_trainees(request):
    trainees = TrainingEnrollment.objects.all().order_by('-created_at')
    return render(request, 'poultryitems/poultry_trainees.html', {
        'trainees': trainees
    })

def chicken_seller_detail(request, seller_id):
    seller = get_object_or_404(ChickenSeller, id=seller_id)
    return render(request, 'poultryitems/chicken_seller_detail.html', {'seller': seller})
edit_seller = login_required(lambda request, seller_id: render(request, 'poultryitems/edit_seller.html', {}))
delete_seller = login_required(lambda request, seller_id: redirect('poultryitems:chicken_sellers_list'))
delete_seller_ajax = login_required(lambda request, seller_id: JsonResponse({'success': True}))