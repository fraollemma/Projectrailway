from django.db import models
from django.conf import settings
from django.utils.text import slugify
import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from cloudinary.models import CloudinaryField

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=110)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return self.name 
 
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            unique_slug = base_slug
            num = 1
            
            while Category.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1
            
            self.slug = unique_slug
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Categories"


class Item(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=110, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='items'
    )
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='items', 
        on_delete=models.CASCADE
    )
    main_image = CloudinaryField(
        'image',
        folder='products/main_images/',
        blank=True
    )
    like_count = models.PositiveIntegerField(default=0)
    share_count = models.PositiveIntegerField(default=0)
    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_items',
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
        """Return True if the user has liked this item."""
        if user.is_authenticated:
            return self.liked_by.filter(pk=user.pk).exists()
        return False


    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            unique_slug = base_slug
            num = 1
            
            while Item.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1
            
            self.slug = unique_slug
        super().save(*args, **kwargs)

    @property
    def display_price(self):
        return f"${self.price:.2f}"

class SubImage(models.Model):
    item = models.ForeignKey(
        Item, 
        related_name='sub_images', 
        on_delete=models.CASCADE
    )
    image = CloudinaryField(
        'image',
        folder='products/sub_images/',
        blank=True
    )
    alt_text = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"Image for {self.item.name}"

class Consultant(models.Model):
    class Specialty(models.TextChoices):
        DISEASE = 'disease', _('Disease Management')
        NUTRITION = 'nutrition', _('Nutrition & Feed')
        PREVENTION = 'prevention', _('Biosecurity & Prevention')
        BREEDING = 'breeding', _('Breeding & Genetics')
        GENERAL = 'general', _('General Practice')

    class Availability(models.TextChoices):
        WEEKDAYS = 'weekdays', _('Weekdays')
        WEEKENDS = 'weekends', _('Weekends')
        ALL_WEEK = 'all_week', _('All Week')
        EMERGENCY = 'emergency', _('24/7 Emergency')

    name = models.CharField(max_length=200)
    experience = models.PositiveIntegerField(help_text=_("Years of experience"))
    specialty = models.CharField(max_length=20, choices=Specialty.choices)
    languages = models.CharField(max_length=200, help_text=_("Comma-separated list of languages"))
    rating = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)],
        default=0.0
    )
    rating_count = models.PositiveIntegerField(default=0)
    description = models.TextField()
    availability = models.CharField(max_length=20, choices=Availability.choices)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    facebook = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    whatsapp = models.CharField(max_length=20, blank=True)

    is_available = models.BooleanField(default=True)
    consultation_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.name} - {self.get_specialty_display()}"

    class Meta:
        ordering = ['-rating']

class ConsultationService(models.Model):
    class ServiceType(models.TextChoices):
        VIDEO_CALL = 'video', _('Video Call')
        PHONE_CALL = 'phone', _('Phone Consultation')
        FARM_VISIT = 'visit', _('Farm Visit')
        FEED_ANALYSIS = 'analysis', _('Feed Analysis')
        FARM_ASSESSMENT = 'assessment', _('Farm Assessment')

    consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE, related_name='services')
    service_type = models.CharField(max_length=20, choices=ServiceType.choices)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    duration = models.CharField(max_length=50, blank=True, help_text=_("e.g., 1 hour, per visit"))

    def __str__(self):
        return f"{self.consultant.name} - {self.get_service_type_display()}"

class ConsultationBooking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        CONFIRMED = 'confirmed', _('Confirmed')
        COMPLETED = 'completed', _('Completed')
        CANCELLED = 'cancelled', _('Cancelled')

    consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE)
    service = models.ForeignKey(ConsultationService, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=200)
    user_email = models.EmailField()
    user_phone = models.CharField(max_length=20)
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking for {self.user_name} with {self.consultant.name}"

class EggSeller(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='egg_seller'
    )
    description = models.TextField()

    quantity_available = models.PositiveIntegerField(help_text=_("Number of eggs currently available"))
    price_per_dozen = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    min_order_quantity = models.PositiveIntegerField(default=1, help_text=_("Minimum dozen required for order"))
    
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    rating = models.FloatField(default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    review_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 🔥 PROPERTIES → Access Profile Data Easily
    @property
    def farm_name(self):
        return self.user.profile.farm_name

    @property
    def phone(self):
        return self.user.phone_number

    @property
    def email(self):
        return self.user.profile.email

    @property
    def city(self):
        return self.user.profile.city

    @property
    def profile_picture(self):
        return self.user.profile.profile_picture

    @property
    def website(self):
        return self.user.profile.website

    @property
    def facebook(self):
        return self.user.profile.facebook

    @property
    def telegram(self):
        return self.user.profile.telegram

    @property
    def instagram(self):
        return self.user.profile.instagram

    def __str__(self):
        return f"{self.farm_name} - {self.city}"

    class Meta:
        ordering = ['-is_verified', '-rating']
        verbose_name = _("Egg Seller")
        verbose_name_plural = _("Egg Sellers")

class EggOrder(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        CONFIRMED = 'confirmed', _('Confirmed')
        PROCESSING = 'processing', _('Processing')
        SHIPPED = 'shipped', _('Shipped')
        DELIVERED = 'delivered', _('Delivered')
        CANCELLED = 'cancelled', _('Cancelled')

    seller = models.ForeignKey(
        EggSeller,
        on_delete=models.CASCADE,
        related_name='orders'
    )

    # ✅ ADD THIS (VERY IMPORTANT)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='egg_orders'
    )

    customer_address = models.TextField()

    quantity = models.PositiveIntegerField(
        help_text=_("Number of dozens ordered")
    )

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    special_instructions = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    order_date = models.DateTimeField(auto_now_add=True)
    preferred_delivery_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

    def save(self, *args, **kwargs):
        # ✅ Enforce minimum order
        if self.quantity < self.seller.min_order_quantity:
            raise ValueError("Order below minimum quantity")

        # ✅ Always calculate price
        self.total_price = self.quantity * self.seller.price_per_dozen

        super().save(*args, **kwargs)

class ChickenSeller(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chicken_seller')
    available_quantity = models.PositiveIntegerField(verbose_name=_("Available Chickens"))
    min_price = models.DecimalField(max_digits=6, decimal_places=2, verbose_name=_("Minimum Price"))
    max_price = models.DecimalField(max_digits=6, decimal_places=2, verbose_name=_("Maximum Price"))
    description = models.TextField(verbose_name=_("Description"))
    is_active = models.BooleanField(default=True, verbose_name=_("Active"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} Chicken Seller"
    
    def price_range(self):
        return f"${self.min_price}-{self.max_price} {_('each')}"
    
    class Meta:
        verbose_name = _("Chicken Seller")
        verbose_name_plural = _("Chicken Sellers")
        ordering = ['-created_at']

class TrainingEnrollment(models.Model):
    PROGRAM_CHOICES = [
        ('meat_chickens', 'Meat Chickens'),
        ('layer_chickens', 'Layer Chickens'),
        ('dual_purpose_chickens', 'Dual Purpose Chickens'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    program = models.CharField(max_length=50, choices=PROGRAM_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.program}"
