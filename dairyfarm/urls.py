# project\dairyfarm\urls.py
from django.urls import path, reverse_lazy
from . import views
from django.shortcuts import redirect

app_name = 'dairyfarm'

urlpatterns = [
    path('', views.VehicleListView.as_view(), name='dairyfarm_list'),
    path('add/', views.VehicleCreateView.as_view(), name='dairyfarm_add'),
    path('<slug:slug>/', views.VehicleDetailView.as_view(), name='dairyfarm_detail'),
    path('category/<slug:slug>/', views.CategoryView.as_view(), name='category'),
    path('<slug:slug>/edit/', views.VehicleEditView.as_view(), name='dairyfarm_edit'),
    path('<slug:slug>/delete/', views.VehicleDeleteView.as_view(), name='dairyfarm_delete'),
    
    path('vehicle/<int:vehicle_id>/like/', views.like_dairyfarm, name='like_dairyfarm'),
    path('vehicle/<int:vehicle_id>/share/', views.share_dairyfarm, name='share_dairyfarm'),
    
    path('add-to-cart/<int:vehicle_id>/', views.add_dairyfarm_to_cart, name='add_to_cart'),
]
