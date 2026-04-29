from django.urls import path
from . import views

app_name = "admin_app"

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('houses/', views.manage_houses, name='manage_houses'),
    path('vehicles/', views.manage_vehicles, name='manage_vehicles'),
    path('electronics/', views.manage_electronics, name='manage_electronics'),
    path('clothings/', views.manage_clothings, name='manage_clothings'),
    path('poultryfarm/', views.manage_poultry, name='manage_poultry'),
    path('users/', views.manage_users, name='manage_users'),
    path('conversations/', views.manage_conversations, name='manage_conversations'),
    path('admin_links/', views.admin_links, name='admin_links'),
]
