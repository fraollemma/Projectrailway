from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.validators import RegexValidator
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
import os

class CustomUserManager(BaseUserManager):
    def create_user(self, username, phone_number, **extra_fields):
        if not username:
            raise ValueError('Username must be set')
        if not phone_number:
            raise ValueError('Phone number must be set')
            
        user = self.model(
            username=username,
            phone_number=phone_number,
            **extra_fields
        )
        user.set_unusable_password() 
        user.save(using=self._db)
        return user

    def create_superuser(self, username, phone_number, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, phone_number, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True)
    phone_number = models.CharField(
        max_length=17,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be in format: '+999999999'"
            )
        ]
    )
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['username'] 

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} ({self.phone_number})"

    def get_unread_message_count(self):
        """
        Returns the number of unread messages for this user
        """
        if not self.is_authenticated:
            return 0
            
        try:
            from conversation.models import ConversationMessage
            return ConversationMessage.objects.filter(
                conversation__members=self,
                is_read=False,
            ).exclude(created_by=self).count()  
        except:
            return 0
        
class Profile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        default='profile_pics/default.jpg',
        blank=True
    )
    
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    telegram = models.CharField(max_length=100, blank=True, null=True)
    facebook = models.CharField(max_length=100, blank=True, null=True)
    instagram = models.CharField(max_length=100, blank=True, null=True)
    linkedin = models.CharField(max_length=100, blank=True, null=True)
    imo = models.CharField(max_length=100, blank=True, null=True)
    tiktok = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
