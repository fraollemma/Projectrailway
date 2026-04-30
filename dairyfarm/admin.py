from django.contrib import admin
from .models import VehicleCategory, DairyFarm, VehicleImage

class VehicleImageInline(admin.TabularInline):
    model = VehicleImage
    extra = 1

@admin.register(DairyFarm)
class DairyFarmAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'price', 'vehicle_type', 'is_featured')
    list_filter = ('vehicle_type', 'fuel_type', 'year', 'is_featured')
    search_fields = ('make', 'model', 'description')
    inlines = [VehicleImageInline]
    prepopulated_fields = {'slug': ('make', 'model', 'year')}

admin.site.register(VehicleCategory)