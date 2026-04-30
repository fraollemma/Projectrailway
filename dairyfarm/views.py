from django.views.generic import ListView, DetailView, CreateView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import DairyProduct, DairyCategory, DairyOrder


# =========================
# PRODUCT LIST
# =========================
class DairyProductListView(ListView):
    model = DairyProduct
    template_name = "dairyfarm/dairyfarm_list.html"
    context_object_name = "products"
    paginate_by = 12

    def get_queryset(self):
        return DairyProduct.objects.filter(
            is_featured=True
        ).order_by("-created_at")


# =========================
# PRODUCT DETAIL
# =========================
class DairyProductDetailView(DetailView):
    model = DairyProduct
    template_name = "dairyfarm/dairyfarm_detail.html"
    context_object_name = "product"
    slug_field = "slug"
    slug_url_kwarg = "slug"


# =========================
# CREATE PRODUCT
# =========================
class DairyProductCreateView(LoginRequiredMixin, CreateView):
    model = DairyProduct
    fields = [
        "name", "description", "price",
        "category", "quantity_available", "unit"
    ]
    template_name = "dairyfarm/dairyfarm_form.html"
    success_url = reverse_lazy("dairyfarm:dairyfarm_list")

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)


# =========================
# FILTER BY CATEGORY
# =========================
class DairyCategoryView(ListView):
    model = DairyProduct
    template_name = "dairyfarm/dairyfarm_list.html"
    context_object_name = "products"

    def get_queryset(self):
        return DairyProduct.objects.filter(
            category__slug=self.kwargs.get("slug")
        ).order_by("-created_at")


# =========================
# CREATE ORDER
# =========================
class CreateOrderView(LoginRequiredMixin, CreateView):
    model = DairyOrder
    fields = ["quantity", "address"]
    template_name = "dairyfarm/order_form.html"

    def form_valid(self, form):
        product = DairyProduct.objects.get(slug=self.kwargs.get("slug"))

        form.instance.product = product
        form.instance.buyer = self.request.user

        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy("dairyfarm:dairyfarm_list")