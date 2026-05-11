from django.urls import path
from . import views

app_name = "admin_app"

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('dairyfarm/', views.manage_dairy, name='manage_dairy'),
    path('poultryfarm/', views.manage_poultry, name='manage_poultry'),
    path('users/', views.manage_users, name='manage_users'),
    path('conversations/', views.manage_conversations, name='manage_conversations'),
    path('admin_links/', views.admin_links, name='admin_links'),
]
 