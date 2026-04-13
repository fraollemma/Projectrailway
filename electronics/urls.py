# project/electronics/urls.py
from django.urls import path
from . import views

app_name = 'electronics'

urlpatterns = [
    path('', views.product_list, name='product_list'),
    path('product/<int:pk>/', views.product_detail, name='product_detail'),
    path('product/add/', views.product_create, name='product_create'),
    path('product/<int:pk>/edit/', views.product_update, name='product_update'),
    path('product/<int:pk>/delete/', views.product_delete, name='product_delete'),
    
    path('product/<int:product_id>/like/', views.like_product, name='like_product'),
    path('product/<int:product_id>/share/', views.share_product, name='share_product'),

]
