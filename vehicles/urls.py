# project\vehicles\urls.py
from django.urls import path, reverse_lazy
from . import views
from django.shortcuts import redirect

app_name = 'vehicles'

urlpatterns = [
    path('', views.VehicleListView.as_view(), name='vehicle_list'),
    path('add/', views.VehicleCreateView.as_view(), name='vehicle_add'),
    path('<slug:slug>/', views.VehicleDetailView.as_view(), name='vehicle_detail'),
    path('category/<slug:slug>/', views.CategoryView.as_view(), name='category'),
    path('<slug:slug>/edit/', views.VehicleEditView.as_view(), name='vehicle_edit'),
    path('<slug:slug>/delete/', views.VehicleDeleteView.as_view(), name='vehicle_delete'),
    
    path('vehicle/<int:vehicle_id>/like/', views.like_vehicle, name='like_vehicle'),
    path('vehicle/<int:vehicle_id>/share/', views.share_vehicle, name='share_vehicle'),
    
    path('add-to-cart/<int:vehicle_id>/', views.add_vehicle_to_cart, name='add_to_cart'),
]
