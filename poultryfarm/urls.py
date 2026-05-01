# poultryfarm/urls.py
from django.urls import path, include
from . import views
from .views import (
    ItemListView,
    ItemDetailView,
    ItemCreateView,
    item_edit,
    item_delete,
)
from rest_framework.routers import DefaultRouter
from poultryfarm.api.views import ItemListAPIView, ItemDetailAPIView
from django.views.generic import RedirectView

app_name = 'poultryfarm'

urlpatterns = [ 
    path('', views.index, name='index'),
 
    path('items/', ItemListView.as_view(), name='item_list'),
 
    path('items/create/', ItemCreateView.as_view(), name='item_create'),
    path('items/<slug:slug>/', ItemDetailView.as_view(), name='item_detail'),

    path('items/<slug:slug>/edit/', item_edit, name='item_edit'),
    path('items/<slug:slug>/delete/', item_delete, name='item_delete'),

    path('items/<slug:slug>/like/', views.like_item, name='like_item'),
    path('items/<slug:slug>/share/', views.share_item, name='share_item'),
 
    path('api/items/', ItemListAPIView.as_view(), name='api_item_list'),
    path('api/items/<slug:slug>/', ItemDetailAPIView.as_view(), name='api_item_detail'),
 
    path('egg-sellers/delete-ajax/<slug:slug>/', views.delete_egg_seller_ajax, name='delete_egg_seller_ajax'),
    path('egg-sellers/add/', views.add_egg_seller, name='add_egg_seller'),
    path('egg-sellers/edit/<slug:slug>/', views.edit_egg_seller, name='edit_egg_seller'),
    path('egg-sellers/place-order/', views.place_egg_order, name='place_egg_order'),
    path('egg-sellers/', views.egg_sellers, name='egg_sellers'),
    path('my-orders/', views.egg_seller_orders, name='egg_seller_orders'),
 
    path('chicken-sellers/', views.chicken_sellers_list, name='chicken_sellers_list'),
    path('chicken-seller/<int:seller_id>/', views.chicken_seller_detail, name='chicken_seller_detail'),
    path('register-seller/', views.register_seller, name='register_seller'),
    path('edit-seller/<int:seller_id>/', views.edit_seller, name='edit_seller'),
    path('delete-seller/<int:seller_id>/', views.delete_seller, name='delete_seller'),
    path('delete-seller-ajax/<int:seller_id>/', views.delete_seller_ajax, name='delete_seller_ajax'),

    path('veterinary-consultancy/', views.veterinary_consultancy, name='veterinary_consultancy'),
    path('book-consultation/', views.book_consultation, name='book_consultation'),
    path('trainings/', views.poultry_trainings, name='poultry_trainings'),
    path('trainees/', views.poultry_trainees, name='poultry_trainees'),
]