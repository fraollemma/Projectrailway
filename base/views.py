# project/base/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.contrib import messages as django_messages
from poultryitems.models import Item 
from conversation.models import Conversation 
from .forms import MessageForm
from .models import Message
from houses.models import House
from vehicles.models import Vehicle
from electronics.models import Product as ElectronicsProduct
from clothings.models import ClothingItem as Clothing
from poultryitems.models import Item
from electronics.models import Product
from django.contrib.contenttypes.models import ContentType
from cart.models import CartItem
from cart.views import _get_cart
from datetime import datetime
# search
from django.db.models import Q
from django.shortcuts import render
from houses.models import House
from vehicles.models import Vehicle
from electronics.models import Product as ElectronicsProduct
from clothings.models import ClothingItem as Clothing
from poultryitems.models import Item as PoultryItem

def base(request):
    User = get_user_model()
    users_count = User.objects.count()
    active_users_count = User.objects.filter(is_active=True).count()
    items_count = Item.objects.count() 
    conversations_count = Conversation.objects.count()
    featured_houses = House.objects.filter(is_featured=True)\
        .prefetch_related('images')\
        .order_by('-created_at')[:200]
    featured_vehicles = Vehicle.objects.filter(is_featured=True)\
        .prefetch_related('images')\
        .order_by('-created_at')[:200]
    featured_electronics = ElectronicsProduct.objects.filter(is_featured=True)\
        .prefetch_related('images')\
        .order_by('-created_at')[:200]
    featured_clothing = Clothing.objects.filter(is_featured=True)\
        .prefetch_related('images')\
        .order_by('-created_at')[:200]
    featured_poultry = Item.objects.filter(is_featured=True)\
        .select_related('category')\
        .prefetch_related('sub_images')\
        .order_by('-created_at')[:200]
    
    for vehicle in featured_vehicles:
        vehicle.product_type = 'vehicle'

    for house in featured_houses:
        house.product_type = 'house'
    
    for electronics in featured_electronics:
        electronics.product_type = 'electronics'
    
    for clothing in featured_clothing:
        clothing.product_type = 'clothing'
    
    for poultry in featured_poultry:
        poultry.product_type = 'poultry'
    
    all_featured = list(featured_vehicles) + list(featured_houses) + list(featured_electronics) + list(featured_clothing) + list(featured_poultry)
    
    def safe_sort_key(obj):
        """
        Safe sorting that handles both datetime and integer fallbacks
        """
        try:
            created = obj.created_at
        except AttributeError:
            
            created = getattr(obj, 'date_added', None)
        
        if isinstance(created, datetime):
            return created.timestamp()
        else:
            return float(getattr(obj, 'pk', 0))
    all_featured.sort(key=safe_sort_key, reverse=True)

    cart = _get_cart(request)
    for product in all_featured:
        content_type = ContentType.objects.get_for_model(product)
        product.is_carted = CartItem.objects.filter(
            cart=cart,
            content_type=content_type,
            object_id=product.id
        ).exists()
    
    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            Message.objects.create(
                phone=form.cleaned_data['phone'],
                message=form.cleaned_data['message']
            )
            django_messages.success(request, 'Message sent successfully!')
            return redirect('base:index')
    else:
        form = MessageForm()

    context = {
        'users_count': users_count,
        'active_users_count': active_users_count,
        'items_count': items_count,
        'conversations_count': conversations_count,
        'form': form,
        'all_featured': all_featured,
        'vehicle_count': Vehicle.objects.count(),
        'house_count': House.objects.count(),
        'electronics_count': ElectronicsProduct.objects.count(),
        'clothing_count': Clothing.objects.count(),
        'poultry_count': Item.objects.count(),
    }

    return render(request, 'base/index.html', context)

def message_list(request):
    all_messages = Message.objects.all().order_by('-created_at')
    return render(request, 'base/messages.html', {'messages': all_messages})

def about_us(request):
    return render(request, 'base/about_us.html')

def admin_links(request):
    return render(request, 'base/admin_links.html')

def terms(request):
    return render(request, 'base/terms.html')

# search
def search_results(request):
    query = request.GET.get('q', '').strip()
    
    if not query:
        return render(request, 'base/search_results.html', {
            'query': '',
            'results': [],
            'no_query': True
        })
    
    # Search across all models
    results = []
    
    # Search Houses
    houses = House.objects.filter(
        Q(title__icontains=query) |
        Q(description__icontains=query) |
        Q(address__icontains=query) |
        Q(city__icontains=query) |
        Q(state__icontains=query)
    ).select_related('created_by').prefetch_related('images')[:10]
    
    for house in houses:
        results.append({
            'type': 'house',
            'object': house,
            'title': house.title,
            'description': house.description,
            'price': house.price,
            'url': house.get_absolute_url()  # Make sure you have this method
        })
    
    # Search Vehicles
    vehicles = Vehicle.objects.filter(
        Q(make__icontains=query) |
        Q(model__icontains=query) |
        Q(description__icontains=query)
    ).select_related('created_by').prefetch_related('images')[:10]
    
    for vehicle in vehicles:
        results.append({
            'type': 'vehicle',
            'object': vehicle,
            'title': f"{vehicle.year} {vehicle.make} {vehicle.model}",
            'description': vehicle.description,
            'price': vehicle.price,
            'url': vehicle.get_absolute_url()
        })
    
    # Search Electronics
    electronics = ElectronicsProduct.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query)
    ).select_related('seller', 'category').prefetch_related('images')[:10]
    
    for electronic in electronics:
        results.append({
            'type': 'electronics',
            'object': electronic,
            'title': electronic.name,
            'description': electronic.description,
            'price': electronic.price,
            'url': electronic.get_absolute_url()
        })
    
    # Search Clothing
    clothing = Clothing.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query)
    ).select_related('created_by').prefetch_related('images')[:10]
    
    for item in clothing:
        results.append({
            'type': 'clothing',
            'object': item,
            'title': item.name,
            'description': item.description,
            'price': item.price,
            'url': item.get_absolute_url()
        })
    
    # Search Poultry
    poultry = PoultryItem.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query)
    ).select_related('created_by').prefetch_related('sub_images')[:10]
    
    for item in poultry:
        results.append({
            'type': 'poultry',
            'object': item,
            'title': item.name,
            'description': item.description,
            'price': item.price,
            'url': item.get_absolute_url()
        })
    
    context = {
        'query': query,
        'results': results,
        'results_count': len(results),
        'houses_count': len([r for r in results if r['type'] == 'house']),
        'vehicles_count': len([r for r in results if r['type'] == 'vehicle']),
        'electronics_count': len([r for r in results if r['type'] == 'electronics']),
        'clothing_count': len([r for r in results if r['type'] == 'clothing']),
        'poultry_count': len([r for r in results if r['type'] == 'poultry']),
    }
    
    return render(request, 'base/search_results.html', context)
