# poultryitems/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, DetailView, CreateView
from .models import Item, SubImage
from .forms import ItemForm
from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.mixins import LoginRequiredMixin
from cart.models import CartItem
from cart.views import _get_cart
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext_lazy as _
import json
from .models import Consultant, ConsultationService, ConsultationBooking
from .forms import ConsultationBookingForm
from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Q
from django.contrib import messages
from .models import EggSeller, EggOrder
from .forms import EggSellerForm, EggOrderForm, EggSellerFilterForm
from django.contrib.auth.decorators import login_required, user_passes_test
from .models import ChickenSeller
from .forms import ChickenSellerForm
from django.shortcuts import render, redirect
from .forms import TrainingEnrollmentForm
from django.contrib import messages
from .models import TrainingEnrollment
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from decimal import Decimal, InvalidOperation

@require_POST
@csrf_exempt
def like_item(request, pk):
    try:
        item = get_object_or_404(Item, pk=pk)
        new_count = item.toggle_like(request.user)
        has_liked = item.liked_by.filter(pk=request.user.pk).exists()
        return JsonResponse({
            'status': 'success',
            'like_count': new_count,
            'has_liked': has_liked,
            'item_id': pk
        })
    except Item.DoesNotExist:
        return JsonResponse({'status': 'error'}, status=404)
def share_item(request, pk):
    item = get_object_or_404(Item, pk=pk)
    item.share_count += 1
    item.save()
    return JsonResponse({'shares': item.share_count})

@login_required
@require_POST
def add_to_cart(request, pk):
    item = get_object_or_404(Item, pk=pk)
    cart = _get_cart(request)
    item_ct = ContentType.objects.get_for_model(Item)

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        content_type=item_ct,
        object_id=item.id
    )

    if created:
        message = "Item added to cart."
    else:
        message = "Item is already in the cart."

    return JsonResponse({'status': 'success', 'message': message})

def index(request):

    featured_products = Item.objects.all().order_by('-created_at')[:3] 
    context = {
        'featured_products': featured_products
    }
    return render(request, 'poultryitems/index.html', context)

class ItemListView(ListView):
    model = Item
    template_name = 'poultryitems/item_list.html'
    context_object_name = 'items'
    paginate_by = 12
    ordering = ['-created_at']

    def get_queryset(self):
        return Item.objects.filter(is_featured=True).order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        items = context['items']

        cart = _get_cart(self.request)
        item_ct = ContentType.objects.get_for_model(Item)
        cart_item_ids = CartItem.objects.filter(
            cart=cart,
            content_type=item_ct,
            object_id__in=items.values_list('id', flat=True)
        ).values_list('object_id', flat=True)

        liked_item_ids = []
        if self.request.user.is_authenticated:
            liked_item_ids = self.request.user.liked_items.values_list('id', flat=True)

        for item in items:
            item.is_carted = item.id in cart_item_ids
            item.has_liked = item.id in liked_item_ids

        return context

class ItemDetailView(DetailView):
    model = Item
    template_name = 'poultryitems/item_detail.html'
    context_object_name = 'item'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        item = self.object
        context['app_label'] = item._meta.app_label
        context['model_name'] = item._meta.model_name
        context['related_items'] = Item.objects.filter(category=item.category).exclude(id=item.id)[:4]
        cart = _get_cart(self.request)
        item_ct = ContentType.objects.get_for_model(Item)
        user = self.request.user
        context['has_liked'] = (
            user.is_authenticated
            and item.liked_by.filter(pk=user.pk).exists()
        )

        return context
    
class ItemCreateView(LoginRequiredMixin, CreateView):
    model = Item
    form_class = ItemForm
    template_name = 'poultryitems/item_create.html'
    success_message = "Item was created successfully!"
    login_url = 'login'

    def form_valid(self, form):
        if self.request.user.is_authenticated:
            form.instance.created_by = self.request.user
        
        item = form.save()
        
        for img in self.request.FILES.getlist('sub_images'):
            SubImage.objects.create(item=item, image=img)
        messages.success(self.request, self.success_message)
        return redirect('poultryitems:item_detail', pk=item.pk)

def item_edit(request, pk):
    item = get_object_or_404(Item, pk=pk)
    if request.method == 'POST':
        form = ItemForm(request.POST, request.FILES, instance=item)
        if form.is_valid():
            form.save()
            return redirect('poultryitems:item_detail', pk=item.pk)
    else:
        form = ItemForm(instance=item)
    return render(request, 'poultryitems/item_create.html', {'form': form})

def item_delete(request, pk):
    item = get_object_or_404(Item, pk=pk)
    if request.method == 'POST':
        item.delete()
    return redirect('poultryitems:item_list')

def chicken_sellers(request):
    return render(request, 'poultryitems/chicken_sellers.html')


def veterinary_consultancy(request):
    consultants = Consultant.objects.filter(is_available=True).prefetch_related('services')
    form = ConsultationBookingForm()

    context = {
        'consultants': consultants,
        'form': form,
    }
    return render(request, 'poultryitems/veterinary_consultancy.html', context)

@require_POST
@csrf_exempt 
def book_consultation(request):
    data = json.loads(request.body)
    
    try:
        consultant_id = data.get('consultant_id')
        service_id = data.get('service_id')
        
        consultant = get_object_or_404(Consultant, id=consultant_id, is_available=True)
        service = get_object_or_404(ConsultationService, id=service_id, consultant=consultant)
        
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
            booking = form.save()
            return JsonResponse({
                'success': True,
                'message': _('Your consultation request has been submitted successfully! We will contact you shortly.')
            })
        else:
            return JsonResponse({
                'success': False,
                'errors': form.errors
            }, status=400)
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': _('An error occurred. Please try again.')
        }, status=500)
    

# eggs for sell
def egg_sellers(request):
    sellers = EggSeller.objects.filter(is_active=True).select_related('user__profile')
    form = EggSellerFilterForm(request.GET or None)
    
    if form.is_valid():
        egg_type = form.cleaned_data.get('egg_type')
        city = form.cleaned_data.get('city')
        min_price = form.cleaned_data.get('min_price')
        max_price = form.cleaned_data.get('max_price')
        certified_only = form.cleaned_data.get('certified_only')
        
        if egg_type:
            sellers = sellers.filter(egg_type=egg_type)
        if city:
            sellers = sellers.filter(city__icontains=city)
        if min_price:
            sellers = sellers.filter(price_per_dozen__gte=min_price)
        if max_price:
            sellers = sellers.filter(price_per_dozen__lte=max_price)
        if certified_only:
            sellers = sellers.filter(~Q(certification='none'))
    
    sellers = sellers.order_by('-is_verified', '-rating')
    
    context = {
        'sellers': sellers,
        'filter_form': form,
    }
    return render(request, 'poultryitems/egg_sellers.html', context)

@require_POST
@csrf_exempt
def place_egg_order(request):
    try:
        data = json.loads(request.body)
        seller_id = data.get('seller_id')
        
        seller = get_object_or_404(EggSeller, id=seller_id, is_active=True)
        
        form = EggOrderForm({
            'customer_name': data.get('customer_name'),
            'customer_email': data.get('customer_email'),
            'customer_phone': data.get('customer_phone'),
            'customer_address': data.get('customer_address'),
            'quantity': data.get('quantity'),
            'preferred_delivery_date': data.get('preferred_delivery_date'),
            'special_instructions': data.get('special_instructions'),
        })
        
        if form.is_valid():
            order = form.save(commit=False)
            order.seller = seller
            order.total_price = int(data.get('quantity')) * seller.price_per_dozen
            order.save()
           
            return JsonResponse({
                'success': True,
                'message': _('Your order has been placed successfully! The seller will contact you soon.'),
                'order_id': order.id
            })
        else:
            return JsonResponse({
                'success': False,
                'errors': form.errors
            }, status=400)
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': _('An error occurred while processing your order. Please try again.')
        }, status=500)


def is_staff(user):
    return user.is_staff

@login_required
@user_passes_test(is_staff)
def add_egg_seller(request):
    
    if hasattr(request.user, 'egg_seller'):
        messages.error(request, _('You already have an egg seller profile!'))
        return redirect('poultryitems:egg_sellers')
    
    if request.method == 'POST':
        form = EggSellerForm(request.POST)
        if form.is_valid():
            egg_seller = form.save(commit=False)
            egg_seller.user = request.user
            egg_seller.save()
            messages.success(request, _('Egg seller added successfully!'))
            return redirect('poultryitems:egg_sellers')
    else:
        form = EggSellerForm()
    
    return render(request, 'poultryitems/add_egg_seller.html', {'form': form})

@login_required
@user_passes_test(is_staff)
def edit_egg_seller(request, pk):
    seller = get_object_or_404(EggSeller, pk=pk)
    if request.method == 'POST':
        form = EggSellerForm(request.POST, instance=seller)
        if form.is_valid():
            egg_seller = form.save(commit=False)
            # For safety, ensure the user remains the same (though it shouldn't change)
            egg_seller.user = seller.user  # Keep the original user
            egg_seller.save()
            messages.success(request, _('Egg seller updated successfully!'))
            return redirect('poultryitems:egg_sellers')
    else:
        form = EggSellerForm(instance=seller)
    
    return render(request, 'poultryitems/edit_egg_seller.html', {'form': form, 'seller': seller})

@login_required
def egg_seller_orders(request):
    seller = get_object_or_404(EggSeller, user=request.user)
    orders = EggOrder.objects.filter(seller=seller).order_by('-order_date')

    # Optional: sanitize problematic decimal fields
    valid_orders = []
    for order in orders:
        try:
            # Force conversion to Decimal to catch errors
            if order.total_price is not None:
                Decimal(order.total_price)
            if order.quantity is not None:
                Decimal(order.quantity)
            valid_orders.append(order)
        except InvalidOperation:
            print(f"Problematic order: {order.id}")
            continue

    return render(request, 'poultryitems/egg_seller_orders.html', {'orders': valid_orders})



def chicken_sellers_list(request):
    sellers = ChickenSeller.objects.filter(is_active=True)
    
    location_filter = request.GET.get('location', '')
    search_query = request.GET.get('search', '')
    
    if location_filter:
        sellers = sellers.filter(location__icontains=location_filter)
    
    if search_query:
        sellers = sellers.filter(
            Q(farm_name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(breeds__icontains=search_query)
        )
    
    locations = ChickenSeller.objects.filter(is_active=True).values_list('location', flat=True).distinct()
    
    context = {
        'sellers': sellers,
        'locations': locations,
        'selected_location': location_filter,
        'search_query': search_query,
    }
    
    return render(request, 'poultryitems/chicken_sellers.html', context)

def chicken_seller_detail(request, seller_id):
    seller = get_object_or_404(ChickenSeller, id=seller_id, is_active=True)
    return render(request, 'poultryitems/chicken_seller_detail.html', {'seller': seller})

@login_required
def register_seller(request):
    if hasattr(request.user, 'chicken_seller') and request.user.chicken_seller.is_active:
        messages.info(request, 'You already have an active seller profile.')
        return redirect('poultryitems:chicken_sellers_list')
    
    if request.method == 'POST':
        form = ChickenSellerForm(request.POST)
        if form.is_valid():
            if hasattr(request.user, 'chicken_seller'):
                request.user.chicken_seller.delete()
            
            seller = form.save(commit=False)
            seller.user = request.user
            seller.save()
            messages.success(request, 'Chicken seller created successfully!')
            return redirect('poultryitems:chicken_sellers_list')
    else:
        form = ChickenSellerForm()
      
    return render(request, 'poultryitems/register_seller.html', {'form': form})

@login_required
def edit_seller(request, seller_id):
    seller = get_object_or_404(ChickenSeller, id=seller_id, is_active=True)
    
    if seller.user != request.user and not request.user.is_staff:
        messages.error(request, 'You do not have permission to edit this profile.')
        return redirect('poultryitems:chicken_sellers_list')
    
    if request.method == 'POST':
        form = ChickenSellerForm(request.POST, instance=seller)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('poultryitems:chicken_sellers_list')
    else:
        form = ChickenSellerForm(instance=seller)
    
    return render(request, 'poultryitems/edit_seller.html', {
        'form': form,
        'seller': seller
    })

@login_required
def delete_seller(request, seller_id):
    seller = get_object_or_404(ChickenSeller, id=seller_id, is_active=True)
    
    if seller.user != request.user and not request.user.is_staff:
        messages.error(request, 'You do not have permission to delete this profile.')
        return redirect('poultryitems:chicken_sellers_list')
    
    if request.method == 'POST':
        seller.is_active = False
        seller.save()
        messages.success(request, 'Seller profile deleted successfully!')
        return redirect('poultryitems:chicken_sellers_list')
    
    return render(request, 'poultryitems/delete_seller.html', {'seller': seller})

@login_required
def delete_seller_ajax(request, seller_id):
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        seller = get_object_or_404(ChickenSeller, id=seller_id, is_active=True)
        
        if seller.user != request.user and not request.user.is_staff:
            return JsonResponse({'success': False, 'error': 'Permission denied'})
        
        seller.is_active = False
        seller.save()
        
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})

@login_required
@user_passes_test(is_staff)
@require_POST
def delete_egg_seller_ajax(request, pk):
    try:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            seller = get_object_or_404(EggSeller, pk=pk)
            seller_name = seller.farm_name
            seller.delete()
            return JsonResponse({
                'success': True, 
                'message': f'{seller_name} has been deleted successfully!'
            })
        else:
            return JsonResponse({
                'success': False, 
                'error': 'Invalid request method. Only AJAX requests are allowed.'
            }, status=400)
    except EggSeller.DoesNotExist:
        return JsonResponse({
            'success': False, 
            'error': 'Seller not found.'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': f'Error deleting seller: {str(e)}'
        }, status=500)

def poultry_trainings(request):
    if request.method == 'POST':
        form = TrainingEnrollmentForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "🎉 Enrollment successful! We will contact you soon.")
            return redirect('poultryitems:poultry_trainings')
    else:
        form = TrainingEnrollmentForm()
    return render(request, 'poultryitems/poultry_trainings.html', {'form': form})

@login_required
def poultry_trainees(request):
    trainees = TrainingEnrollment.objects.all().order_by('-created_at')
    return render(request, 'poultryitems/poultry_trainees.html', {'trainees': trainees})
