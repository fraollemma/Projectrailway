# project\houses\urls.py
from django.urls import path
from . import views

app_name = 'houses'

urlpatterns = [
    path('', views.HouseListView.as_view(), name='house_list'),
    path('category/<slug:category_slug>/', views.HouseListView.as_view(), name='category_houses'),
    path('<int:pk>/', views.HouseDetailView.as_view(), name='house_detail'),
    path('create/', views.HouseCreateView.as_view(), name='house_create'),
    path('<int:pk>/update/', views.HouseUpdateView.as_view(), name='house_update'),
    path('<int:pk>/delete/', views.HouseDeleteView.as_view(), name='house_delete'),
    path('house/<int:house_id>/like/', views.like_house, name='like_house'),
    path('house/<int:house_id>/share/', views.share_house, name='share_house'),
]