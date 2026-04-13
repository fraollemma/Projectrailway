# project/clothings/admin.py
from django.contrib import admin
from .models import ClothingItem, ClothingImage, ClothingCategory
from django.utils.html import format_html

class ClothingImageInline(admin.TabularInline):
    model = ClothingImage
    extra = 1
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Preview"

class ClothingItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock_quantity', 'is_featured', 'created_at']
    list_filter = ['category']
    search_fields = ['name', 'description', 'brand']
    list_editable = ['price', 'stock_quantity', 'is_featured']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    inlines = [ClothingImageInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'category', 'description')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'discount_price', 'stock_quantity')
        }),
        ('Details', {
            'fields': ('size', 'age_group', 'color', 'material', 'brand')
        }),
        ('Status', {
            'fields': ('is_featured', 'created_at', 'updated_at')
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category')

class ClothingCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'gender', 'slug', 'item_count']
    list_filter = ['gender']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['item_count']
    
    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = "Items"

# Register your models
admin.site.register(ClothingItem, ClothingItemAdmin)
admin.site.register(ClothingCategory, ClothingCategoryAdmin)