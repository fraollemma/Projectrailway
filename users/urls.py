# users/urls.py
from django.urls import path
from .views import user_login, dashboard
from . import views
from django.contrib.auth import views as auth_views

app_name = 'users'

urlpatterns = [
    path('login/', user_login, name='login'),
    path('dashboard/', dashboard, name='dashboard'),
    path('logout/', views.user_logout, name='logout'),
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.profile_update, name='profile_update'),
    path('api/unread-count/', views.unread_count_api, name='unread_count_api'),
    path('seller_profile/<int:user_id>/', views.seller_profile, name='seller_profile'),
    path('users/', views.user_list, name='user_list'),
    path('profile/create/', views.profile_create, name='profile_create'),

    path('ban-user/<int:user_id>/', views.ban_user, name='ban_user'),
    path('delete-user/<int:user_id>/', views.delete_user, name='delete_user'),
    path('promote-user/<int:user_id>/', views.promote_user, name='promote_user'),
] 