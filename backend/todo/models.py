from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Product(models.Model):
    Name = models.CharField(max_length=250)
    Desciption = models.TextField()
    Price = models.DecimalField(max_digits=10, decimal_places=2)
    Category = models.CharField(max_length=50, default = "General")
    Stock = models.IntegerField(default = 0)
    Created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.Name
    
# OTP Table
class OTPStorage(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateField(auto_now_add=True)