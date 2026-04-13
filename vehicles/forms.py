# project/vehicles/forms.py
from django import forms
from .models import Vehicle, VehicleImage
from django.core.validators import MinValueValidator


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True

class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result

class VehicleForm(forms.ModelForm):
    images = MultipleFileField(required=False, label='Additional Images')
    
    class Meta:
        model = Vehicle
        fields = [
            'category', 'vehicle_type', 'make', 'model', 'year', 
            'price', 'mileage', 'fuel_type', 'engine_size',
            'color', 'description', 'is_featured'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 5}),
            'year': forms.NumberInput(attrs={'min': 1900, 'max': 2026}),
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        self.fields['price'].validators.append(MinValueValidator(0))
        self.fields['mileage'].validators.append(MinValueValidator(0))

    def save(self, commit=True):
        vehicle = super().save(commit=False)
        if self.user:
            vehicle.created_by = self.user
        if commit:
            vehicle.save()
            if self.cleaned_data.get('images'):
                for img in self.cleaned_data['images']:
                    VehicleImage.objects.create(vehicle=vehicle, image=img)
        return vehicle