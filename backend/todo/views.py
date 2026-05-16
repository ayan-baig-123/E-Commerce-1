from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .models import Product, OTPStorage 
from .serializers import ProductSerializer
import random
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.models import User

@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    otp_code = str(random.randint(100000, 999999))
    
    # Pehle purane OTPs delete kar dein taake database saaf rahe
    OTPStorage.objects.filter(email=email).delete()
    OTPStorage.objects.create(email=email, code=otp_code)
    
    try:
        send_mail(
            subject='Ayan Store Verification',
            message=f'Your OTP code is: {otp_code}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )
        print(f"✅ OTP sent: {otp_code}")
        return Response({"message": "OTP sent successfully"}, status=200)
    except Exception as e:
        print(f"❌ Email Error: {e}")
        return Response({"error": "Email service error"}, status=500)

@api_view(['POST'])
def verify_otp_and_register(request):
    data = request.data
    email = data.get('email')
    otp_received = data.get('otp')
    username = data.get('username')
    password = data.get('password')

    if not all([email, otp_received, username, password]):
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Latest OTP uthana
    otp_obj = OTPStorage.objects.filter(email=email, code=otp_received).last()
    if not otp_obj:
        return Response({"error": "Invalid or Expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
 
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username taken"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        User.objects.create_user(username=username, email=email, password=password)
        otp_obj.delete()
        return Response({"message": "User created!"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# views.py
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product(request):
    serializer = ProductSerializer(data=request.data)
    
    if serializer.is_valid():
        # User hata diya kyunke aapke Model mein user field nahi hai
        serializer.save() 
        return Response(serializer.data, status=201)
    
    return Response(serializer.errors, status=400)

