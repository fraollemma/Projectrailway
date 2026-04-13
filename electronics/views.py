# electronics/views.py
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Product
from .models import Product
from .forms import ProductForm
from .models import ProductImage

from cart.models import CartItem
from cart.views import _get_cart
from django.contrib.contenttypes.models import ContentType
from django.views.decorators.http import require_POST

@require_POST
@login_required
def like_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        new_count = product.toggle_like(request.user)
        return JsonResponse({
            'status': 'success',
            'like_count': new_count,
            'product_id': product_id,
        })
    except Product.DoesNotExist:
        return JsonResponse({'status':'errror'})


@require_POST
@login_required
def share_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    new_share_count = product.increment_shares()
    return JsonResponse({
        'status': 'success',
        'share_count': new_share_count,
        'product_id': product_id,
    })

def product_list(request):
    products = Product.objects.select_related('category', 'seller').all().order_by('-created_at')

    cart = _get_cart(request)
    product_ct = ContentType.objects.get_for_model(Product)
    cart_product_ids = CartItem.objects.filter(
        cart=cart,
        content_type=product_ct,
        object_id__in=products.values_list('id', flat=True)
    ).values_list('object_id', flat=True)

    user = request.user
    for product in products:
        product.is_carted = product.id in cart_product_ids
        product.has_liked = product.has_liked(user) if hasattr(product, 'has_liked') else False

    return render(request, 'electronics/product_list.html', {'products': products})

def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)

    cart = _get_cart(request)
    product_ct = ContentType.objects.get_for_model(Product)
    product.is_carted = CartItem.objects.filter(
        cart=cart,
        content_type=product_ct,
        object_id=product.id
    ).exists()
    user = request.user
    product.has_liked = product.has_liked(user) if hasattr(product, 'has_liked') else False

    return render(request, 'electronics/product_detail.html', {
        'product': product,
        'app_label': product._meta.app_label,
        'model_name': product._meta.model_name
    })


@login_required
def product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save(commit=False)
            product.seller = request.user
            product.save()
            for image in request.FILES.getlist('images'):
                ProductImage.objects.create(
                    product=product,
                    image=image,
                    alt_text=product.name
                )
            messages.success(request, 'Product added successfully.')
            return redirect('electronics:product_detail', pk=product.pk)
    else:
        form = ProductForm()
    return render(request, 'electronics/product_form.html', {'form': form})

@login_required
def product_update(request, pk):
    product = get_object_or_404(Product, pk=pk, seller=request.user)
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            messages.success(request, 'Product updated.')
            return redirect('electronics:product_detail', pk=pk)
    else:
        form = ProductForm(instance=product)
    return render(request, 'electronics/product_form.html', {'form': form})

@login_required
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk, seller=request.user)
    if request.method == 'POST':
        product.delete()
        messages.success(request, 'Product deleted.')
        return redirect('electronics:product_list')
    return render(request, 'electronics/product_confirm_delete.html', {'product': product})

