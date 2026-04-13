# base/urls.py
from django.urls import path
from . import views

app_name = 'base' 

urlpatterns = [
    path('', views.base, name='index'), 
    path('messages/', views.message_list, name='message_list'),
    path('about_us/', views.about_us, name='about_us'),
    path('admin_links/', views.admin_links, name='admin_links'),
    path('terms/', views.terms, name='terms'),
    path('search/', views.search_results, name='search_results'),
]
