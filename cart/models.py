# cart\models.py
from django.conf import settings
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    session_key = models.CharField(max_length=40, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.pk} - User: {self.user or 'Guest'}"

    def total_price(self):
        return sum(item.total_price() for item in self.items.all() if item.product is not None)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey("content_type", "object_id")
    quantity = models.PositiveIntegerField(default=1)

    def get_product(self):
        try:
            ct = self.content_type
            if not ct or ct.model_class() is None:
                return None
            return self.product
        except:
            return None

    def total_price(self):
        product = self.get_product()
        if product and hasattr(product, "price"):
            return product.price * self.quantity
        return 0

    def __str__(self):
        product = self.get_product()
        if product and hasattr(product, "name"):
            return f"{product.name} x {self.quantity}"
        return f"Unknown Product x {self.quantity}"