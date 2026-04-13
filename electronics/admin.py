# electronics/admin.py
from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'seller', 'price', 'stock', 'condition')
    list_filter = ('category', 'condition')
    search_fields = ('name', 'description')
    raw_id_fields = ('seller', 'category')
