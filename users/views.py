# users/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import logout as auth_logout
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm, ProfileUpdateForm, ProfileCreateForm  # Add ProfileCreateForm
from django.conf import settings
from .models import Profile
from django.http import JsonResponse
from conversation.models import Conversation, ConversationMessage 
from django.contrib.auth import get_user_model
from .models import CustomUser

@login_required
def unread_count_api(request):
    """API endpoint to get unread message count"""
    conversations = Conversation.objects.filter(members=request.user)
    total_unread = sum(
        ConversationMessage.objects.filter(
            conversation=conv,
            is_read=False
        ).exclude(created_by=request.user).count()
        for conv in conversations
    )
    return JsonResponse({'total_unread': total_unread})

def user_logout(request):
    """Logout view"""
    auth_logout(request)
    return redirect('base:index')

@login_required
def dashboard(request):
    """Dashboard view after successful login"""
    return render(request, 'users/dashboard.html')

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            # Redirect to profile creation instead of update
            return redirect('users:profile_create')
    else:
        form = UserRegisterForm()
    return render(request, 'users/register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        phone_number = request.POST.get('phone_number')

        user = authenticate(request, username=username, phone_number=phone_number)
        if user:
            login(request, user)
            return redirect('users:dashboard')
        else:
            return render(request, 'users/login.html', {
                'error': 'Invalid username or phone number'
            })
    return render(request, 'users/login.html')

@login_required
def profile_create(request):
    """View for creating a new profile"""
    # Check if profile already exists
    if hasattr(request.user, 'profile'):
        return redirect('users:profile_update')

    if request.method == 'POST':
        form = ProfileCreateForm(request.POST, request.FILES)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.user = request.user
            profile.save()
            return redirect('users:dashboard')
    else:
        form = ProfileCreateForm()
    
    return render(request, 'users/profile_create.html', {'form': form})

@login_required
def profile_update(request):
    """View for updating an existing profile"""
    # Ensure the user has a profile before updating 
    if not hasattr(request.user, 'profile'):
        return redirect('users:profile_create')
        
    if request.method == 'POST':
        form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid():
            form.save()
            return redirect('users:profile')
    else:
        form = ProfileUpdateForm(instance=request.user.profile)
    return render(request, 'users/profile_update.html', {'form': form})

@login_required
def profile(request):
    """View for displaying the user's profile"""
    # Ensure profile exists
    if not hasattr(request.user, 'profile'):
        return redirect('users:profile_create')
    return render(request, 'users/profile.html', {'user': request.user})

def seller_profile(request, user_id):
    """View for displaying another user's profile"""
    User = get_user_model()
    seller = get_object_or_404(User, id=user_id)
    return render(request, 'users/seller_profile.html', {'seller': seller})

@login_required
def user_list(request):
    """View for listing all users"""
    users = CustomUser.objects.all().select_related('profile')
    return render(request, 'users/users.html', {'users': users})