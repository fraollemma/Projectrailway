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

    def total_price(self):
        try:
            if self.product and hasattr(self.product, "price"):
                return self.product.price * self.quantity
        except Exception:
            pass
        return 0

    def __str__(self):
        try:
            product = self.product
            if product and hasattr(product, "name"):
                return f"{product.name} x {self.quantity}"
        except Exception:
            pass

        return f"Unknown Product x {self.quantity}"