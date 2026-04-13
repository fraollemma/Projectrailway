# base/context_processors.py
from django.db.models import Count

def category_counts(request):
    counts = {
        'vehicle_count': 9999999,
        'house_count': 9999999,
        'electronics_count': 9999999,
        'clothing_count': 9999999,
        'poultry_count': 9999999,
    }
    
    # Try to import and count each model safely
    try:
        from vehicles.models import Vehicle
        counts['vehicle_count'] = Vehicle.objects.count()
    except ImportError:
        pass
    
    try:
        from houses.models import House
        counts['house_count'] = House.objects.count()
    except ImportError:
        pass
    
    try:
        # Try common electronics model names
        try:
            from electronics.models import Product
            counts['electronics_count'] = Product.objects.count()
        except ImportError:
            try:
                from electronics.models import Electronic
                counts['electronics_count'] = Electronic.objects.count()
            except ImportError:
                pass
    except ImportError:
        pass
    
    try:
        # Use the correct model name: ClothingItem
        from clothings.models import ClothingItem
        counts['clothing_count'] = ClothingItem.objects.count()
    except ImportError:
        pass
    
    try:
        from poultryitems.models import Item
        counts['poultry_count'] = Item.objects.count()
    except ImportError:
        pass
    
    return counts