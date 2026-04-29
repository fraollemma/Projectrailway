from django import template
from django.utils import timezone
from datetime import timedelta

register = template.Library()

@register.filter(name='short_timesince')
def short_timesince(date):
    """
    Returns a short format of time since like '12h,30m' instead of '12 hours, 30 minutes'
    """
    if not date:
        return ''
    
    now = timezone.now()
    
    # Handle future dates
    if date > now:
        return '0m'
    
    diff = now - date
    seconds = diff.total_seconds()
    
    if seconds < 60:
        return '0m'
    
    minutes = int(seconds // 60)
    hours = minutes // 60
    remaining_minutes = minutes % 60
    days = hours // 24
    remaining_hours = hours % 24
    
    if days > 0:
        return f'{days}d,{remaining_hours}h'
    elif hours > 0:
        return f'{hours}h,{remaining_minutes}m'
    else:
        return f'{minutes}m'