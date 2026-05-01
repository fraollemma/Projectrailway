# project/dairyfarm/forms.py
from django import forms
from .models import DairyProduct, DairyProductImage
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

class DairyProductForm(forms.ModelForm):
    class Meta:
        model = DairyProduct
        fields = [
            'name', 'description', 'price',
            'category', 'quantity_available', 'unit'
        ]

    def save(self, commit=True):
        dairy_product = super().save(commit=False)
        if self.user:
            dairy_product.created_by = self.user
        if commit:
            dairy_product.save()
            if self.cleaned_data.get('images'):
                for img in self.cleaned_data['images']:
                    DairyProductImage.objects.create(product=dairy_product, image=img)
        return dairy_product