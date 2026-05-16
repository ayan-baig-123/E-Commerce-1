from rest_framework import serializers
from .models import Product

# serializers.py
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        # read_only_fields = ['user'] # Yeh line add karein