from django.db import models
from django.conf import settings
from django.utils.text import slugify


# =========================
# CATEGORY (Milk, Cheese, etc.)
# =========================
class DairyCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            unique_slug = base_slug
            num = 1

            while DairyCategory.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1

            self.slug = unique_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# =========================
# MAIN PRODUCT (Milk, Cheese, Yogurt...)
# =========================
class DairyProduct(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True)

    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    category = models.ForeignKey(
        DairyCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name="products"
    )

    quantity_available = models.PositiveIntegerField()
    unit = models.CharField(max_length=50, default="liters")  # liters, kg, etc.

    is_featured = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="dairy_products"
    )

    like_count = models.PositiveIntegerField(default=0)
    share_count = models.PositiveIntegerField(default=0)

    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="liked_dairy_products",
        blank=True
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            unique_slug = base_slug
            num = 1

            while DairyProduct.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1

            self.slug = unique_slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# =========================
# PRODUCT IMAGES
# =========================
class DairyProductImage(models.Model):
    product = models.ForeignKey(
        DairyProduct,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="dairy/products/")
    is_featured = models.BooleanField(default=False)
    alt_text = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Image for {self.product.name}"


# =========================
# FARMER PROFILE
# =========================
class DairyFarmer(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="dairy_farmer"
    )

    farm_name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    total_cows = models.PositiveIntegerField(default=0)
    daily_milk_production = models.FloatField(help_text="Liters per day")

    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.farm_name


# =========================
# ORDER SYSTEM
# =========================
class DairyOrder(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("processing", "Processing"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    product = models.ForeignKey(
        DairyProduct,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="dairy_orders"
    )

    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    address = models.TextField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.product.price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.id} - {self.product.name}"