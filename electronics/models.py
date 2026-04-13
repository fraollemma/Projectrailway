# project/electronics/models.py
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from users.consumers import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
 
class Product(models.Model):
    CONDITION_CHOICES = [
        ('new', 'Brand New'),
        ('used', 'Used'),
        ('refurbished', 'Refurbished'),
    ]
    
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    stock = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveIntegerField(default=0)
    share_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=True)
    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_electronics',
        blank=True
    )
    
    def increment_likes(self):
        self.like_count += 1
        self.save()
        return self.like_count
    
    def toggle_like(self, user):
        if user in self.liked_by.all():
            self.liked_by.remove(user)
        else:
            self.liked_by.add(user)
        self.like_count = self.liked_by.count()
        self.save()
        return self.like_count
    
    def has_liked(self, user):
        """Return True if the user has liked this product."""
        if user.is_authenticated:
            return self.liked_by.filter(pk=user.pk).exists()
        return False
    
    def increment_shares(self):
        self.share_count += 1
        self.save(update_fields=['share_count'])
        return self.share_count
    
    def __str__(self):
        return f"{self.name} - ${self.price}"

class Order(models.Model):
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField()
    payment_method = models.CharField(max_length=50)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')
    
    def save(self, *args, **kwargs):
        self.total_price = self.product.price * self.quantity
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Order #{self.id} - {self.product.name}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='electronics/products/%Y/%m/%d/')
    alt_text = models.CharField(max_length=100, blank=True)
    is_featured = models.BooleanField(default=True)

    def __str__(self):
        return f"Image for {self.product.name}"
