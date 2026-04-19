from django.urls import path
from . import views

app_name = 'companies'

urlpatterns = [
    path('', views.companies_view, name='index'),
    path('alema/', views.alema_view, name='alema'),
    path('ethiochicken/', views.ethiochicken_view, name='ethiochicken'),
    path('nvi/', views.nvi_view, name='nvi'),
] 