# project/electronics/forms.py
from .models import Product, ProductImage
from django import forms

class ProductForm(forms.ModelForm):
    images = forms.FileField(
        widget=forms.ClearableFileInput(attrs={'allow_multiple_selected': True}),
        required=False,
        help_text='Upload multiple product images'
    )

    class Meta:
        model = Product
        exclude = ['seller', 'created_at', 'updated_at']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['images'].widget.attrs.update({'multiple': True})

class ProductImageForm(forms.ModelForm):
    class Meta:
        model = ProductImage
        fields = ['image']
