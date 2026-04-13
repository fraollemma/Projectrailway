# C:base\models.py
from django.db import models

class Message(models.Model):
    phone = models.CharField(max_length=15)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.phone}"