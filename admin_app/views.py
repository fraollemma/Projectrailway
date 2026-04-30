from django.shortcuts import render
from houses.models import House
from dairyfarm.models import DairyProduct
from electronics.models import Product
from clothings.models import ClothingItem
from poultryfarm.models import Item, EggSeller, ChickenSeller, Consultant, TrainingEnrollment
from users.models import Profile
from conversation.models import Conversation
from django.contrib.auth.decorators import user_passes_test


def admin_required(view_func):
    decorated = user_passes_test(lambda u: u.is_superuser)(view_func)
    return decorated


@admin_required
def dashboard(request):
    context = {
        "houses_count": House.objects.count(),
        "dairyfarm_count": DairyProduct.objects.count(),
        "electronics_count": Product.objects.count(),
        "clothings_count": ClothingItem.objects.count(),
        "poultry_items_count": Item.objects.count(),
        "egg_sellers_count": EggSeller.objects.count(),
        "chicken_sellers_count": ChickenSeller.objects.count(),
        "consultants_count": Consultant.objects.count(),
        "trainings_count": TrainingEnrollment.objects.count(),
        "users_count": Profile.objects.count(),
        "conversations_count": Conversation.objects.count(),
    }
    return render(request, "admin_app/dashboard.html", context)


@admin_required
def manage_houses(request):
    return render(request, "admin_app/manage_houses.html", {"houses": House.objects.all()})


@admin_required
def manage_dairy(request):
    return render(request, "admin_app/manage_dairy.html", {"dairyfarm": Vehicle.objects.all()})


@admin_required
def manage_electronics(request):
    return render(request, "admin_app/manage_electronics.html", {"electronics": Product.objects.all()})


@admin_required
def manage_clothings(request):
    return render(request, "admin_app/manage_clothings.html", {"clothings": ClothingItem.objects.all()})


@admin_required
def manage_poultry(request):
    context = {
        "items": Item.objects.all(),
        "egg_sellers": EggSeller.objects.all(),
        "chicken_sellers": ChickenSeller.objects.all(),
        "consultants": Consultant.objects.all(),
        "trainings": TrainingEnrollment.objects.all(),
    }
    return render(request, "admin_app/manage_poultry.html", context)


@admin_required
def manage_users(request):
    return render(request, "admin_app/manage_users.html", {"users": Profile.objects.all()})


@admin_required
def manage_conversations(request):
    return render(request, "admin_app/manage_conversations.html", {"conversations": Conversation.objects.all()})

@admin_required
def admin_links(request):
    return render(request, 'admin_app/admin_links.html')
