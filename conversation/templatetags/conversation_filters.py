from django import template
from django.core.cache import cache
from conversation.models import ConversationMessage

register = template.Library()

@register.filter(name='get_unread_count')
def get_unread_count(unread_counts, conversation_id):
    """
    Gets unread count from dictionary safely.
    Usage: {{ unread_counts|get_unread_count:conversation.id }}
    """
    return unread_counts.get(str(conversation_id), 0)

@register.filter(name='unread_messages_count')
def unread_messages_count(user):
    """
    Get unread messages count for user with caching
    """
    if not user or not user.is_authenticated:
        return 0
    
    cache_key = f"user_{user.id}_total_unread"
    count = cache.get(cache_key)
    
    if count is None:
        count = ConversationMessage.objects.filter(
            conversation__members=user,
            is_read=False
        ).exclude(created_by=user).count()
        cache.set(cache_key, count, timeout=300)  # Cache for 5 minutes
    
    return count

@register.filter
def get_item_image_url(item):
    """
    Get the main image URL for any item model
    """
    if not item:
        return None
    
    # Debug: Print the item type
    print(f"DEBUG: Getting image for {item.__class__.__name__}")
    
    try:
        # PoultryItems: Item model has main_image field
        if hasattr(item, 'main_image') and item.main_image:
            print("DEBUG: Using main_image field")
            return item.main_image.url
        
        # VEHICLES: Specific handling for Vehicle model
        elif item.__class__.__name__ == 'Vehicle':
            print("DEBUG: Processing Vehicle item")
            if hasattr(item, 'images'):
                # Try to get featured image first
                try:
                    featured_image = item.images.filter(is_featured=True).first()
                    if featured_image and featured_image.image:
                        print("DEBUG: Using featured vehicle image")
                        return featured_image.image.url
                except (AttributeError, ValueError):
                    pass
                
                # Get first available image
                try:
                    first_image = item.images.first()
                    if first_image and first_image.image:
                        print("DEBUG: Using first vehicle image")
                        return first_image.image.url
                except (AttributeError, ValueError):
                    pass
        
        # HOUSES: Specific handling for House model
        elif item.__class__.__name__ == 'House':
            print("DEBUG: Processing House item")
            if hasattr(item, 'images'):
                # Try to get featured image first
                try:
                    featured_image = item.images.filter(is_featured=True).first()
                    if featured_image and featured_image.image:
                        return featured_image.image.url
                except (AttributeError, ValueError):
                    pass
                
                # Get first available image
                try:
                    first_image = item.images.first()
                    if first_image and first_image.image:
                        return first_image.image.url
                except (AttributeError, ValueError):
                    pass
        
        # ELECTRONICS: Specific handling for Product model
        elif item.__class__.__name__ == 'Product':
            print("DEBUG: Processing Electronics Product item")
            if hasattr(item, 'images'):
                # Try to get featured image first
                try:
                    featured_image = item.images.filter(is_featured=True).first()
                    if featured_image and featured_image.image:
                        return featured_image.image.url
                except (AttributeError, ValueError):
                    pass
                
                # Get first available image
                try:
                    first_image = item.images.first()
                    if first_image and first_image.image:
                        return first_image.image.url
                except (AttributeError, ValueError):
                    pass
        
        # CLOTHINGS: Specific handling for ClothingItem model
        elif item.__class__.__name__ == 'ClothingItem':
            print("DEBUG: Processing ClothingItem item")
            if hasattr(item, 'images'):
                # Try to get main image first
                try:
                    main_image = item.images.filter(is_main=True).first()
                    if main_image and main_image.image:
                        return main_image.image.url
                except (AttributeError, ValueError):
                    pass
                
                # Get first available image
                try:
                    first_image = item.images.first()
                    if first_image and first_image.image:
                        return first_image.image.url
                except (AttributeError, ValueError):
                    pass
        
        # Generic fallback for other models
        elif hasattr(item, 'images') and hasattr(item.images, 'all'):
            print("DEBUG: Using generic images relation")
            # Try to get featured image first
            try:
                if hasattr(item.images, 'filter'):
                    featured_image = item.images.filter(is_featured=True).first()
                    if featured_image and hasattr(featured_image, 'image'):
                        return featured_image.image.url
            except (AttributeError, ValueError):
                pass
            
            # Get first available image
            try:
                first_image = item.images.first()
                if first_image and hasattr(first_image, 'image'):
                    return first_image.image.url
            except (AttributeError, ValueError):
                pass
        
        # Check for direct image fields
        image_fields = ['image', 'photo', 'picture', 'avatar', 'profile_picture']
        for field_name in image_fields:
            if hasattr(item, field_name):
                field = getattr(item, field_name)
                if field and hasattr(field, 'url'):
                    print(f"DEBUG: Using {field_name} field")
                    return field.url
        
    except (ValueError, AttributeError, Exception) as e:
        print(f"DEBUG: Error getting image URL: {e}")
        pass
    
    print("DEBUG: No image found")
    return None

@register.filter
def get_item_name(item):
    """Get the display name for any item"""
    if not item:
        return "Unknown Item"
    
    if hasattr(item, 'name') and item.name:
        return item.name
    elif hasattr(item, 'title') and item.title:
        return item.title
    elif hasattr(item, 'make') and hasattr(item, 'model'):
        make = getattr(item, 'make', '')
        model = getattr(item, 'model', '')
        return f"{make} {model}".strip()
    elif hasattr(item, 'farm_name') and item.farm_name:
        return item.farm_name
    
    # Fallback to string representation
    return str(item)

@register.filter
def get_item_description(item):
    """Get description for any item"""
    if not item:
        return ""
    
    description_fields = ['description', 'desc', 'details', 'info']
    for field in description_fields:
        if hasattr(item, field):
            value = getattr(item, field, '')
            if value:
                return str(value)
    
    return ""