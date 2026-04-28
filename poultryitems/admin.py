from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import (
    Category, Item, SubImage,
    Consultant, ConsultationService, ConsultationBooking,
    EggSeller, EggOrder,
    ChickenSeller
)

# -------------------------
# ITEM ADMIN
# -------------------------

class SubImageInline(admin.TabularInline):
    model = SubImage
    extra = 1


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'get_category', 'is_featured')
    list_filter = ('category', 'is_featured')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [SubImageInline]

    def get_category(self, obj):
        return obj.category.name if obj.category else '-'
    get_category.short_description = 'Category'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'slug')


# -------------------------
# CONSULTANCY ADMIN
# -------------------------

@admin.register(Consultant)
class ConsultantAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialty', 'experience', 'rating', 'is_available']
    list_filter = ['specialty', 'availability', 'is_available']
    search_fields = ['name']


@admin.register(ConsultationService)
class ConsultationServiceAdmin(admin.ModelAdmin):
    list_display = ['consultant', 'service_type', 'price', 'duration']
    list_filter = ['service_type']
    search_fields = ['consultant__name']


@admin.register(ConsultationBooking)
class ConsultationBookingAdmin(admin.ModelAdmin):
    list_display = ['user_name', 'consultant', 'service', 'status', 'preferred_date']
    list_filter = ['status', 'preferred_date']
    readonly_fields = ['created_at']


# -------------------------
# EGG SELLER ADMIN
# -------------------------

@admin.register(EggSeller)
class EggSellerAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'quantity_available',
        'price_per_dozen',
        'min_order_quantity',
        'is_verified',
        'is_active',
        'created_at',
    ]
    list_filter = [
        'is_verified',
        'is_active',
        'created_at',
    ]
    search_fields = [
        'user__username',
    ]
    list_editable = ['is_verified', 'is_active']


# -------------------------
# EGG ORDER ADMIN (FIXED)
# -------------------------

@admin.register(EggOrder)
class EggOrderAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'seller',
        'user',                  # ✅ replaced 'customer_name' with 'user'
        'quantity',
        'total_price',
        'status',
        'order_date',
    ]
    list_filter = ['status', 'order_date']
    search_fields = [
        'user__username',        # ✅ search by customer username
        'user__email',           # optionally by email
        'seller__user__username', # search by seller name
        'customer_address',      # still searchable if needed
    ]
    readonly_fields = ['order_date']


# -------------------------
# CHICKEN SELLER ADMIN
# -------------------------

@admin.register(ChickenSeller)
class ChickenSellerAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'available_quantity',
        'min_price',
        'max_price',
        'is_active',
        'created_at',
    )
    list_filter = (
        'is_active',
        'created_at',
    )
    search_fields = (
        'user__username',
    )
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('user', 'is_active')
        }),
        (_('Inventory & Pricing'), {
            'fields': ('available_quantity', 'min_price', 'max_price')
        }),
        (_('Description'), {
            'fields': ('description',)
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )