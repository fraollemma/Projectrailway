# clothings/forms.py
from django import forms
from .models import ClothingItem, ClothingImage, ClothingCategory
from django.utils.text import slugify

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
    
class ClothingItemForm(forms.ModelForm):
    class Meta:
        model = ClothingItem
        fields = [
            'category',
            'name',
            'description',
            'price',
            'discount_price',
            'stock_quantity',
            'is_featured'
        ]
        widgets = {
            'description': forms.Textarea(attrs={
                'rows': 4,
                'placeholder': 'Describe the item in detail...'
            }),
            'price': forms.NumberInput(attrs={
                'min': 0,
                'step': 0.01
            }),
            'discount_price': forms.NumberInput(attrs={
                'min': 0,
                'step': 0.01
            }),
            'stock_quantity': forms.NumberInput(attrs={
                'min': 0
            }),
        }

class ClothingCreateForm(forms.ModelForm):
    images = MultipleFileField(
        required=False,
        label='Additional Images'
    )

    class Meta(ClothingItemForm.Meta):
        pass

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        self.fields['category'].queryset = ClothingCategory.objects.all()
        self.fields['category'].empty_label = "Select a category"
        self.fields['category'].widget.attrs.update({
            'class': 'form-select',
            'data-live-search': 'true',
        })
        self.fields['category'].empty_label = "Select a category"
        self.fields['category'].help_text = "Choose the most appropriate category for your item"
        
    def save(self, commit=True):
        instance = super().save(commit=False)
        if self.user:
            instance.created_by = self.user
        if commit:
            instance.save()
            self.save_m2m()

        if self.cleaned_data.get('images'):
                for i, img in enumerate(self.cleaned_data['images']):
                    ClothingImage.objects.create(
                        clothing=instance,
                        image=img,
                        is_main=(i == 0)
                    )
        return instance

    def clean(self):
        cleaned_data = super().clean()
        price = cleaned_data.get('price')
        discount_price = cleaned_data.get('discount_price')
        
        if discount_price and price and discount_price >= price:
            raise forms.ValidationError(
                "Discount price must be lower than regular price"
            )
        return cleaned_data

class ClothingCategoryForm(forms.ModelForm):
    class Meta:
        model = ClothingCategory
        fields = ['name', 'gender', 'icon']
        widgets = {
            'icon': forms.TextInput(attrs={
                'placeholder': 'e.g. fas fa-tshirt (Font Awesome class)'
            })
        }