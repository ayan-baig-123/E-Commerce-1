from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('send-otp/', views.send_otp),
    path('products/', views.get_products),
    path('add-product/', views.add_product),
    path('verify-otp/', views.verify_otp_and_register),
    # Ye do lines add karein:
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]