from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.decorators import login_required
from .models import Conversation, ConversationMessage
from .forms import ConversationMessageForm
from django.core.cache import cache
from django.http import JsonResponse
from asgiref.sync import sync_to_async
from django.views.decorators.cache import never_cache
from django.contrib import messages
from cart.context_processors import cart_item_count

from poultryfarm.models import EggOrder

@login_required
@never_cache
def unread_count_api(request):
    conversations = Conversation.objects.filter(members=request.user)

    unread_counts = {
        str(conv.id): ConversationMessage.objects.filter(
            conversation=conv,
            is_read=False
        ).exclude(created_by=request.user).count()
        for conv in conversations
    }

    # ===== CART COUNT =====
    cart_count = 0
    try:
        from cart.models import Cart
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart_count = cart.items.count()
    except Exception:
        pass

    # ===== EGG ORDER COUNT (🔥 MISSING FIX) =====
    try:
        seller = getattr(request.user, 'egg_seller', None)
        if seller:
            egg_order_count = EggOrder.objects.filter(seller=seller).count()
        else:
            egg_order_count = 0
    except Exception:
        egg_order_count = 0

    # ===== TOTAL =====
    total_unread = sum(unread_counts.values())

    return JsonResponse({
        'total_unread': total_unread,
        'cart_count': cart_count,
        'egg_order_count': egg_order_count,   # 🔥 THIS WAS MISSING
        'total_notifications': total_unread + cart_count + egg_order_count,
        'by_conversation': unread_counts
    })

@login_required(login_url='login')
def inbox(request):
    conversations = Conversation.objects.filter(
        members=request.user
    ).prefetch_related('members', 'messages')
    
    unread_counts = {}
    for conv in conversations:
        cache_key = f"unread_{request.user.id}_{conv.id}"
        unread = cache.get(cache_key)
        
        if unread is None:
            unread = ConversationMessage.objects.filter(
                conversation=conv,
                is_read=False
            ).exclude(created_by=request.user).count()
            cache.set(cache_key, unread, timeout=300)
        
        unread_counts[str(conv.id)] = unread
    
    return render(request, 'conversation/inbox.html', {
        'conversations': conversations,
        'unread_counts': unread_counts,
    })

@login_required(login_url='login')
def new_conversation(request, app_label, model_name, object_id):
    content_type = ContentType.objects.get(app_label=app_label, model=model_name)
    model_class = content_type.model_class()
    item = get_object_or_404(model_class, id=object_id)
    
    if hasattr(item, 'created_by'):
        item_owner = item.created_by
    elif hasattr(item, 'seller'): 
        item_owner = item.seller
    else:
        messages.error(request, "Could not determine item owner.")
        return redirect('/')
    
    if item_owner == request.user:
        messages.error(request, "You cannot start a conversation with yourself.")
        redirect_map = {
            'dairyfarm': 'dairyfarm:dairyfarm_detail',
            'clothings': 'clothings:clothing_detail',
            'electronics': 'electronics:electronic_detail',
            'houses': 'houses:house_detail',
            'poultryfarm': 'poultryfarm:item_detail',
        }
        if app_label in redirect_map:
            if hasattr(item, 'slug'):
                return redirect(redirect_map[app_label], slug=item.slug)
            else:
                return redirect(redirect_map[app_label], pk=item.id)
        else:
            return redirect('/')
    
    conversation = Conversation.objects.filter(
        content_type=content_type,
        object_id=item.id,
        members__id=request.user.id 
    ).first()
    
    if conversation:
        return redirect('conversation:detail', pk=conversation.id)

    if request.method == 'POST':
        form = ConversationMessageForm(request.POST)
        if form.is_valid():
            conversation = Conversation.objects.create(
                content_type=content_type,
                object_id=item.id
            )
            conversation.members.add(request.user, item_owner)
            
            conversation_message = form.save(commit=False)
            conversation_message.conversation = conversation
            conversation_message.created_by = request.user
            conversation_message.save()
            
            return redirect('conversation:detail', pk=conversation.id)
    else:
        form = ConversationMessageForm()

    return render(request, 'conversation/new.html', {
        'form': form,
        'item': item
    })

@login_required(login_url='login')
def detail(request, pk):
    conversation = get_object_or_404(
        Conversation.objects.filter(members__id=request.user.id),  
        pk=pk
    )
    
    ConversationMessage.objects.filter(
        conversation=conversation,
        is_read=False
    ).exclude(created_by=request.user).update(is_read=True)

    if request.method == 'POST':
        form = ConversationMessageForm(request.POST)
        if form.is_valid():
            conversation_message = form.save(commit=False)
            conversation_message.conversation = conversation
            conversation_message.created_by = request.user
            conversation_message.save()
             
            return redirect('conversation:detail', pk=pk)
    else:
        form = ConversationMessageForm()

    return render(request, 'conversation/detail.html', {
        'conversation': conversation,
        'form': form
    })

@login_required
def mark_all_read(request):
    if request.method == 'POST':
        try:
            conversations = Conversation.objects.filter(members=request.user)
            
            for conversation in conversations:
                ConversationMessage.objects.filter(
                    conversation=conversation,
                    is_read=False
                ).exclude(created_by=request.user).update(is_read=True)
                
                cache_key = f"unread_{request.user.id}_{conversation.id}"
                cache.delete(cache_key)
            
            return JsonResponse({'status': 'success', 'message': 'All messages marked as read'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Only POST requests allowed'}, status=400)

def get_unread_count(user, conversation):
    return ConversationMessage.objects.filter(
        conversation=conversation,
        is_read=False
    ).exclude(created_by=user).count()