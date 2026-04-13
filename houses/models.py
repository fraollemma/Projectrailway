# project\houses\models.py
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse

class HouseCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=30, help_text="Font Awesome icon class")

    class Meta:
        verbose_name_plural = "House Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('houses:category_houses', args=[self.slug])

class House(models.Model):
    CATEGORY_CHOICES = [
        ('apartment', 'Apartment'),
        ('detached', 'Detached House'),
        ('semi-detached', 'Semi-Detached House'),
        ('terraced', 'Terraced House'),
        ('bungalow', 'Bungalow'),
        ('duplex', 'Duplex'),
        ('villa', 'Villa'),
        ('studio', 'Studio'),
        ('other', 'Other'),
    ]
    
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='apartment'
    )
    title = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    bedrooms = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()
    area = models.PositiveIntegerField(help_text="Area in square meters")
    description = models.TextField()
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='houses'
    )
    like_count = models.PositiveIntegerField(default=0)
    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_houses',
        blank=True
    )
    share_count = models.PositiveIntegerField(default=0)
    def toggle_like(self, user):
        if user in self.liked_by.all():
            self.liked_by.remove(user)
        else:
            self.liked_by.add(user)
        self.like_count = self.liked_by.count()
        self.save()
        return self.like_count

    def increment_likes(self):
        self.like_count += 1
        self.save()
        return self.like_count

    def increment_shares(self):
        self.share_count += 1
        self.save()
        return self.share_count
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Houses"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.title}-{self.city}-{self.state}")
            unique_slug = base_slug
            num = 1
            while House.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} in {self.city}, {self.state}"

    def get_absolute_url(self):
        return reverse('houses:house_detail', args=[str(self.id)])

    def featured_image(self):
        featured = self.images.filter(is_featured=True).first()
        return featured if featured else self.images.first()

class HouseImage(models.Model):
    house = models.ForeignKey(
        House, 
        related_name='images', 
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='house_images/%Y/%m/%d/')
    is_featured = models.BooleanField(default=True)
    alt_text = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Image for {self.house.title}"

    class Meta:
        verbose_name = "House Image"
        verbose_name_plural = "House Images"