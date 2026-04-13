# project/house/forms.py
from django import forms
from .models import House, HouseImage

class HouseForm(forms.ModelForm):
    images = forms.FileField(
        widget=forms.ClearableFileInput(attrs={'allow_multiple_selected': True}),
        required=False,
        help_text="Upload multiple images for this house"
    )
    class Meta:
        model = House
        exclude = ('created_by', 'slug', 'date_added')
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }
        help_texts = {
            'is_featured': 'Check this to feature this house on the homepage',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['images'].widget.attrs.update({'multiple': True})

class HouseImageForm(forms.ModelForm):
    class Meta:
        model = HouseImage
        fields = ['image', 'alt_text', 'is_featured']