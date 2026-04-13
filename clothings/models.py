# project/Clothings/models.py
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from django.urls import reverse
from django.contrib.contenttypes.fields import GenericRelation
from cart.models import CartItem

class ClothingCategory(models.Model):
    GENDER_CHOICES = [
        ('M', 'Men'),
        ('W', 'Women'),
        ('K', 'Kids'),
        ('U', 'Unisex'),
    ]
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    icon = models.CharField(max_length=30, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_gender_display()} - {self.name}"

class ClothingItem(models.Model): 
    category = models.ForeignKey(ClothingCategory, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=1)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveIntegerField(default=0)
    share_count = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='clothes'
    )
    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_clothings',
        blank=True
    )

    def increment_likes(self):
        self.like_count += 1
        self.save(update_fields=['like_count'])
        return self.like_count

    def toggle_like(self, user):
        if user in self.liked_by.all():
            self.liked_by.remove(user)
        else:
            self.liked_by.add(user)
        self.like_count = self.liked_by.count()
        self.save()
        return self.like_count

    def increment_shares(self):
        self.share_count += 1
        self.save(update_fields=['share_count'])
        return self.share_count
    
    def has_liked(self, user):
        """Return True if the user has liked this vehicle."""
        if user.is_authenticated:
            return self.liked_by.filter(pk=user.pk).exists()
        return False

    def __str__(self):
        return f"{self.name} ({self.category})"

    def get_absolute_url(self):
        return reverse("clothings:clothing_detail", kwargs={"slug": self.slug})

    @property
    def current_price(self):
        return self.discount_price if self.discount_price else self.price
    
    @property
    def is_on_sale(self):
        return self.discount_price is not None
    cart_items = GenericRelation(CartItem, content_type_field='content_type', object_id_field='object_id')

class ClothingImage(models.Model):
    clothing = models.ForeignKey(ClothingItem, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='clothing_images/')
    is_main = models.BooleanField(default=False)
    alt_text = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"Image for {self.clothing.name}"