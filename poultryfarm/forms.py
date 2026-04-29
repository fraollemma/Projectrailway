# poultryfarm/forms.py
from django import forms
from .models import Item, SubImage
from django.utils.translation import gettext_lazy as _
from .models import ConsultationBooking, Consultant, ConsultationService
from .models import EggSeller, EggOrder
from .models import ChickenSeller
from .models import TrainingEnrollment

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

class ItemForm(forms.ModelForm):
    sub_images = MultipleFileField(required=False, label='Additional Images')

    class Meta:
        model = Item
        fields = ['name', 'description', 'price', 'main_image']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['main_image'].required = True
        self.fields['main_image'].widget.attrs.update({'class': 'form-control'})
        self.fields['name'].widget.attrs.update({'class': 'form-control'})
        self.fields['description'].widget.attrs.update({'class': 'form-control'})
        self.fields['price'].widget.attrs.update({'class': 'form-control'})
        self.fields['sub_images'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Upload additional images',
        })

    def save(self, commit=True):
        item = super().save(commit=commit)

        if commit:
            files = self.files.getlist('sub_images')
            for f in files:
                sub = SubImage(item=item)
                sub.image = f
                sub.save() 

        return item


class ConsultationBookingForm(forms.ModelForm):
    consultant = forms.ModelChoiceField(
        queryset=Consultant.objects.filter(is_available=True),
        widget=forms.HiddenInput(),
        required=False
    )
    service = forms.ModelChoiceField(
        queryset=ConsultationService.objects.all(),
        widget=forms.HiddenInput(),
        required=False
    )

    class Meta:
        model = ConsultationBooking
        fields = [
            'consultant', 'service', 'user_name', 'user_email', 'user_phone',
            'preferred_date', 'preferred_time', 'message'
        ]
        widgets = {
            'preferred_date': forms.DateInput(attrs={'type': 'date'}),
            'preferred_time': forms.TimeInput(attrs={'type': 'time'}),
            'message': forms.Textarea(attrs={'rows': 4, 'placeholder': _('Briefly describe your issue or questions...')}),
        }
        labels = {
            'user_name': _('Your Name'),
            'user_email': _('Email'),
            'user_phone': _('Phone'),
            'preferred_date': _('Preferred Date'),
            'preferred_time': _('Preferred Time'),
            'message': _('Message'),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.update({'class': 'form-control'})

class EggSellerForm(forms.ModelForm):
    class Meta:
        model = EggSeller
        fields = [
            'quantity_available',
            'price_per_dozen',
            'min_order_quantity',
            'description',
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }
        labels = {
            'quantity_available': _('Available Eggs'),
            'price_per_dozen': _('Price per Dozen'),
            'min_order_quantity': _('Minimum Order (Dozen)'),
            'description': _('Description'),
        }
class EggOrderForm(forms.ModelForm):
    class Meta:
        model = EggOrder
        fields = [
            'customer_address',
            'quantity',
            'preferred_delivery_date',
            'special_instructions'
        ]
        widgets = {
            'customer_address': forms.Textarea(attrs={'rows': 3}),
            'special_instructions': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': _('Any special delivery instructions...')
            }),
            'preferred_delivery_date': forms.DateInput(attrs={'type': 'date'}),
        }
        labels = {
            'customer_address': _('Delivery Address'),
            'quantity': _('Quantity (dozens)'),
            'preferred_delivery_date': _('Preferred Delivery Date'),
            'special_instructions': _('Special Instructions'),
        }

class EggSellerFilterForm(forms.Form):
    
    city = forms.CharField(required=False, label=_('City'))
    min_price = forms.DecimalField(required=False, label=_('Min Price'), max_digits=6, decimal_places=2)
    max_price = forms.DecimalField(required=False, label=_('Max Price'), max_digits=6, decimal_places=2)

class ChickenSellerForm(forms.ModelForm):
    class Meta:
        model = ChickenSeller
        fields = [
            'available_quantity',
            'min_price',
            'max_price',
            'description',
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }
        labels = {
            'available_quantity': _('Available Chickens'),
            'min_price': _('Minimum Price'),
            'max_price': _('Maximum Price'),
            'description': _('Description'),
        }

    def clean(self):
        cleaned_data = super().clean()
        min_price = cleaned_data.get('min_price')
        max_price = cleaned_data.get('max_price')

        if min_price and max_price and min_price > max_price:
            raise forms.ValidationError(_("Minimum price cannot be greater than maximum price."))

        return cleaned_data 

class TrainingEnrollmentForm(forms.ModelForm):
    class Meta:
        model = TrainingEnrollment
        fields = ['name', 'email', 'phone', 'program']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your name'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your phone number'}),
            'program': forms.Select(attrs={'class': 'form-control'}),
        }
