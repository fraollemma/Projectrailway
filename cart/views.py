# cart/views.py
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.contenttypes.models import ContentType
from django.views.decorators.http import require_POST
from .models import Cart, CartItem
from poultryfarm.models import Item   # Import the Item model (adjust if needed for other apps)
import logging
logger = logging.getLogger(__name__)

# ---------- Helper: get or create cart for user/session ----------
def _get_cart(request):
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()
        cart, created = Cart.objects.get_or_create(session_key=request.session.session_key)
    return cart


# ---------- Existing add_to_cart (for non‑AJAX, if still needed) ----------
def add_to_cart(request, app_label, model_name, product_id):
    content_type = get_object_or_404(ContentType, app_label=app_label, model=model_name)
    try:
        product = content_type.get_object_for_this_type(pk=product_id)
    except Exception:
        return redirect("cart:cart_detail")
    cart = _get_cart(request)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        content_type=content_type,
        object_id=product.id,
        defaults={'quantity': 1}
    )
    if not created:
        item.quantity += 1
        item.save()

    return redirect("cart:cart_detail")


# ---------- Cart detail page ----------
def cart_detail(request):
    cart = _get_cart(request)

    # Filter out items whose product no longer exists
    valid_items = []
    for item in cart.items.all():
        try:
            if item.product:   # GenericForeignKey resolves the actual object
                valid_items.append(item)
        except Exception:
            continue

    return render(request, "cart/cart_detail.html", {
        "cart": cart,
        "cart_items": valid_items
    })


# ---------- Remove item by CartItem ID ----------
def remove_from_cart(request, item_id):
    item = get_object_or_404(CartItem, id=item_id)
    item.delete()
    return redirect("cart:cart_detail")

@require_POST
def toggle_cart_item(request, slug):
    logger.info(f"toggle_cart_item called with slug={slug}, method={request.method}")
    try:
        item = get_object_or_404(Item, slug=slug)
        content_type = ContentType.objects.get_for_model(item)
        cart = _get_cart(request)

        cart_item = CartItem.objects.filter(
            cart=cart,
            content_type=content_type,
            object_id=item.id
        ).first()

        if cart_item:
            cart_item.delete()
            in_cart = False
            message = "Removed from cart"
        else:
            CartItem.objects.create(
                cart=cart,
                content_type=content_type,
                object_id=item.id,
                quantity=1
            )
            in_cart = True
            message = "Added to cart"

        return JsonResponse({'success': True, 'in_cart': in_cart, 'message': message})
    except Exception as e:
        logger.exception("Error in toggle_cart_item")
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
    