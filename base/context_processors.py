from django.core.cache import cache
from conversation.models import Conversation


def notification_counts(request):
    total = 0

    if request.user.is_authenticated:
        from conversation.models import Conversation

        conversations = Conversation.objects.filter(members=request.user)

        for convo in conversations:
            key = f"unread_{request.user.id}_{convo.id}"
            total += cache.get(key) or 0

    return {"total_notifications": total}