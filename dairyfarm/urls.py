from django.urls import path
from . import views

app_name = "dairyfarm"

urlpatterns = [
    path("", views.DairyProductListView.as_view(), name="dairyfarm_list"),
    path("add/", views.DairyProductCreateView.as_view(), name="dairyfarm_add"),
    path("<slug:slug>/", views.DairyProductDetailView.as_view(), name="dairyfarm_detail"),
    path("category/<slug:slug>/", views.DairyCategoryView.as_view(), name="category"),
    path("<slug:slug>/order/", views.CreateOrderView.as_view(), name="order"),
]