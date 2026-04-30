from django.shortcuts import render, redirect
from django.contrib import messages as django_messages
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from datetime import datetime

from .forms import MessageForm
from .models import Message

from houses.models import House
from dairyfarm.models import DairyFarmer
from electronics.models import Product as ElectronicsProduct
from clothings.models import ClothingItem as Clothing
from poultryfarm.models import Item as PoultryItem

from conversation.models import Conversation
from cart.models import CartItem
from cart.views import _get_cart


def base(request):
    User = get_user_model()

    context = {
        'users_count': User.objects.count(),
        'active_users_count': User.objects.filter(is_active=True).count(),
        'items_count': PoultryItem.objects.count(),
        'conversations_count': Conversation.objects.count(),

        'dairyfarm_count': DairyFarmer.objects.count(),
        'house_count': House.objects.count(),
        'electronics_count': ElectronicsProduct.objects.count(),
        'clothing_count': Clothing.objects.count(),
        'poultry_count': PoultryItem.objects.count(),
    }

    return render(request, 'base/index.html', context)


def message_list(request):
    messages = Message.objects.all().order_by('-created_at')
    return render(request, 'base/messages.html', {'messages': messages})


def about_us(request):
    return render(request, 'base/about_us.html')


def terms(request):
    return render(request, 'base/terms.html')


# =========================
# SEARCH (FIXED)
# =========================
def search_results(request):
    query = request.GET.get('q', '').strip()

    if not query:
        return render(request, 'base/search_results.html', {
            'query': '',
            'results': [],
            'no_query': True
        })

    results = []

    # Houses
    houses = House.objects.filter(
        Q(title__icontains=query) |
        Q(description__icontains=query)
    )[:10]

    for house in houses:
        results.append({
            'type': 'house',
            'object': house,
            'title': house.title,
            'description': house.description,
        })

    # DairyFarm (FIXED MODEL)
    dairy = DairyFarmer.objects.filter(
        Q(farm_name__icontains=query) |
        Q(location__icontains=query) |
        Q(description__icontains=query)
    )[:10]

    for farm in dairy:
        results.append({
            'type': 'dairyfarm',
            'object': farm,
            'title': farm.farm_name,
            'description': farm.description,
        })

    # Electronics
    electronics = ElectronicsProduct.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query)
    )[:10]

    for item in electronics:
        results.append({
            'type': 'electronics',
            'object': item,
            'title': item.name,
            'description': item.description,
        })

    # Clothing
    clothing = Clothing.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query)
    )[:10]

    for item in clothing:
        results.append({
            'type': 'clothing',
            'object': item,
            'title': item.name,
            'description': item.description,
        })

    # Poultry
    poultry = PoultryItem.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query)
    )[:10]

    for item in poultry:
        results.append({
            'type': 'poultry',
            'object': item,
            'title': item.name,
            'description': item.description,
        })

    return render(request, 'base/search_results.html', {
        'query': query,
        'results': results,
        'results_count': len(results),
    })