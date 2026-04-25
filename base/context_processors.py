from django.core.cache import cache

def category_counts(request):
    cache_key = 'category_counts'
    counts = cache.get(cache_key)

    if counts:
        return counts

    counts = {
        'vehicle_count': 0,
        'house_count': 0,
        'electronics_count': 0,
        'clothing_count': 0,
        'poultry_count': 0,
    }

    try:
        from vehicles.models import Vehicle
        counts['vehicle_count'] = Vehicle.objects.count()
    except:
        pass

    try:
        from houses.models import House
        counts['house_count'] = House.objects.count()
    except:
        pass

    try:
        from electronics.models import Product
        counts['electronics_count'] = Product.objects.count()
    except:
        pass

    try:
        from clothings.models import ClothingItem
        counts['clothing_count'] = ClothingItem.objects.count()
    except:
        pass

    try:
        from poultryitems.models import Item
        counts['poultry_count'] = Item.objects.count()
    except:
        pass

    # Cache for 5 minutes
    cache.set(cache_key, counts, timeout=300)

    return counts