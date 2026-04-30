# project/electronics/urls.py
from django.urls import path
from . import views

app_name = 'electronics'

urlpatterns = [
    path('', views.dairyfarm_list, name='dairyfarm_list'),
    path('product/<int:pk>/', views.product_detail, name='dairyfarm_detail'),
    path('product/add/', views.product_create, name='dairyfarm_create'),
    path('product/<int:pk>/edit/', views.product_update, name='dairyfarm_update'),
    path('product/<int:pk>/delete/', views.product_delete, name='dairyfarm_delete'),
    
    path('product/<int:product_id>/like/', views.like_product, name='like_product'),
    path('product/<int:product_id>/share/', views.share_product, name='share_product'),

]
