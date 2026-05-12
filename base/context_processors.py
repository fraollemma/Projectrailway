# base/context_processors.py
from django.core.cache import cache
from conversation.models import Conversation
from cart.models import Cart
from poultryfarm.models import EggOrder, EggSeller


def notification_counts(request):
    total = 0
    unread_messages = 0
    cart_count = 0
    egg_order_count = 0

    if request.user.is_authenticated:
        conversations = Conversation.objects.filter(members=request.user)

        for convo in conversations:
            key = f"unread_{request.user.id}_{convo.id}"
            total += cache.get(key) or 0

        unread_messages = total

        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart_count = cart.items.count()

        egg_order_count = EggOrder.objects.filter(
            seller__user=request.user
        ).count()

        total = unread_messages + cart_count + egg_order_count

    return {
        "total_notifications": total,
        "unread_messages": unread_messages,
        "cart_item_count": cart_count,
        "egg_order_count": egg_order_count
    }


def category_counts(request):
    """
    Context processor that provides total counts for different product categories.
    (No filtering by availability – counts all items in each model.)
    """
    counts = {
        'poultry_count': 0,
        'dairy_count': 0,
    }

    try:
        from poultryfarm.models import Item as PoultryItem
        counts['poultry_count'] = PoultryItem.objects.count()
    except ImportError:
        pass
    
    try:
        from dairyfarm.models import DairyFarmer
        counts['dairy_count'] = DairyFarmer.objects.count()
    except ImportError:
        pass
    return counts