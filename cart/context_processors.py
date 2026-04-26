from .models import Cart

def cart_item_count(request):
    count = 0
    try:
        if request.user.is_authenticated:
            cart = Cart.objects.filter(user=request.user).first()
            if cart:
                count = cart.items.count()
        else:
            
            if not request.session.session_key:
                request.session.create() 
            cart = Cart.objects.filter(session_key=request.session.session_key).first()
            if cart:
                count = cart.items.count()
    except Exception:
        count = 0
    
    return {'cart_item_count': count}