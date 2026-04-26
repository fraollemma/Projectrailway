# users/forms.py
from django import forms
from .models import CustomUser, Profile
from django.core.validators import FileExtensionValidator

class UserRegisterForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'phone_number']
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Choose a username'}),
            'phone_number': forms.TextInput(attrs={'placeholder': '+1234567890'}),
        } 
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if CustomUser.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError("This username is already taken.")
        return username
    
    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        if CustomUser.objects.filter(phone_number=phone_number).exists():
            raise forms.ValidationError("This phone number is already registered.")
        return phone_number

class ProfileCreateForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['profile_picture', 'bio', 'location']
        widgets = {
            'bio': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': 'Tell others about yourself...'
            }),
            'location': forms.TextInput(attrs={
                'placeholder': 'Your location'
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['profile_picture'].required = False
        self.fields['profile_picture'].validators = [
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])
        ]

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = [
            'profile_picture',
            'bio',
            'location',
            'telegram',
            'facebook',
            'instagram',
            'linkedin',
            'imo',
            'tiktok',
            'email',
        ]
        widgets = {
            'profile_picture': forms.FileInput(attrs={
                'accept': 'image/*',
                'class': 'form-control-file'
            }),
            'bio': forms.Textarea(attrs={'rows': 3}),
            'location': forms.TextInput(attrs={'placeholder': 'Your location'}),
            'telegram': forms.TextInput(attrs={'placeholder': 'Telegram username'}),
            'facebook': forms.TextInput(attrs={'placeholder': 'Facebook username'}),
            'instagram': forms.TextInput(attrs={'placeholder': 'Instagram username'}),
            'linkedin': forms.TextInput(attrs={'placeholder': 'LinkedIn username'}),
            'imo': forms.TextInput(attrs={'placeholder': 'Imo username'}),
            'tiktok': forms.TextInput(attrs={'placeholder': 'TikTok username'}),
            'email': forms.EmailInput(attrs={'placeholder': 'your@email.com'}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['profile_picture'].validators = [
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])
        ]