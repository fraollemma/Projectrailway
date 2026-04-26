from django.core.cache import cache
from conversation.models import Conversation

def notification_counts(request):
    total_unread = 0

    if request.user.is_authenticated:
        conversations = Conversation.objects.filter(members=request.user)

        for convo in conversations:
            cache_key = f"unread_{request.user.id}_{convo.id}"
            count = cache.get(cache_key) or 0
            total_unread += count

    return {
        "total_notifications": total_unread
    }