from django.contrib import admin
from .models import (
    DairyCategory,
    DairyProduct,
    DairyProductImage,
    DairyFarmer,
    DairyOrder
)


# =========================
# Product Images Inline
# =========================
class DairyProductImageInline(admin.TabularInline):
    model = DairyProductImage
    extra = 1


# =========================
# Dairy Product Admin
# =========================
@admin.register(DairyProduct)
class DairyProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'quantity_available', 'is_featured')
    list_filter = ('category', 'is_featured')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [DairyProductImageInline]


# =========================
# Category Admin
# =========================
@admin.register(DairyCategory)
class DairyCategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

# =========================
# Farmer Admin
# =========================
@admin.register(DairyFarmer)
class DairyFarmerAdmin(admin.ModelAdmin):
    list_display = ('farm_name', 'location', 'total_cows', 'daily_milk_production', 'is_verified')
    list_filter = ('is_verified',)


# =========================
# Order Admin
# =========================
@admin.register(DairyOrder)
class DairyOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'buyer', 'quantity', 'total_price', 'status')
    list_filter = ('status',)
    search_fields = ('product__name', 'buyer__username')