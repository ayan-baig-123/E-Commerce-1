# **🟢 Phase 1: Django Backend (The Core)**
1. models.py (App folder)
Hum Product model mein search ke liye fields aur User ke liye OTP ka logic handle karenge.

Python
from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    Name = models.CharField(max_length=255)
    Description = models.TextField()
    Price = models.DecimalField(max_digits=10, decimal_places=2)
    Category = models.CharField(max_length=100, default="General")
    Stock = models.IntegerField(default=0)
    Created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.Name

# OTP Table
class OTPStorage(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
2. serializers.py (App folder)
Python
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
Python
# Django Views.py
import random
from django.shortcuts import render
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings

# Rest Framework ke imports (API ke liye)
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny

# Apne banaye huye models aur serializers
from .models import Product, OTPStorage
from .serializers import ProductSerializer
@api_view(['POST'])
def verify_otp_and_register(request):
    email = request.data.get('email')
    otp_received = request.data.get('otp')
    username = request.data.get('username')
    password = request.data.get('password')

    # 1. OTP dhoondein database se
    otp_obj = OTPStorage.objects.filter(email=email, code=otp_received).last()

    if otp_obj:
        # 2. User create karein
        User.objects.create_user(username=username, email=email, password=password)
        otp_obj.delete() # OTP khatam kar dein verify hone ke baad
        return Response({"message": "User Created"}, status=201)
    
    return Response({"error": "Invalid OTP"}, status=400)


3. views.py (Search, Filter & OTP Logic)
Python
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .models import Product, OTPStorage
from .serializers import ProductSerializer
import random
from django.core.mail import send_mail

# **--- Product Search & Filter ---**
@api_view(['GET'])
def get_products(request):
    query = request.query_params.get('search')
    min_price = request.query_params.get('min')
    max_price = request.query_params.get('max')

    products = Product.objects.all()

    if query:
        products = products.filter(Name__icontains=query)
    if min_price:
        products = products.filter(Price__gte=min_price)
    if max_price:
        products = products.filter(Price__lte=max_price)

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# --- OTP System ---
@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')
    otp_code = str(random.randint(100000, 999999))
    OTPStorage.objects.create(email=email, code=otp_code)
    
    # Console par dikhane ke liye
    print(f"OTP for {email}: {otp_code}")
    return Response({"message": "OTP sent successfully"}, status=200)

@api_view(['POST'])
def verify_otp_and_register(request):
    email = request.data.get('email')
    otp_received = request.data.get('otp')
    # Yahan registration logic aayega
    return Response({"message": "Verified!"})
4. urls.py (App Folder)
Python
from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.get_products),
    path('send-otp/', views.send_otp),
    path('verify-register/', views.verify_otp_and_register),
]
🔵 Phase 2: Next.js Frontend (The Sexy UI)
1. layout.js (App folder)
Nav aur background ko modern look dein.

JavaScript
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">
        <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
           <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AYAN STORE
              </h1>
           </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
2. page.js (Home Page with Search & Filters)
JavaScript
"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const fetchProducts = async () => {
        let url = `http://127.0.0.1:8000/api/products/?search=${search}&min=${minPrice}&max=${maxPrice}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => { fetchProducts(); }, [search, minPrice, maxPrice]);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <input 
                    className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                    placeholder="Search Products..." 
                    onChange={(e) => setSearch(e.target.value)}
                />
                <input 
                    type="number" className="p-3 border rounded-xl" 
                    placeholder="Min Price" onChange={(e) => setMinPrice(e.target.value)}
                />
                <input 
                    type="number" className="p-3 border rounded-xl" 
                    placeholder="Max Price" onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all border border-slate-100 group">
                        <div className="h-40 bg-slate-100 rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"></div>
                        <h3 className="font-bold text-lg">{p.Name}</h3>
                        <p className="text-blue-600 font-bold text-xl mt-2">${p.Price}</p>
                        <button className="w-full mt-4 bg-slate-900 text-white py-2 rounded-lg hover:bg-blue-600 transition">Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
🚀 Setup Summary (Step-by-Step):
Backend Settings: settings.py mein CORS_ALLOW_ALL_ORIGINS = True aur ALLOWED_HOSTS = ['*'] rakhein.

App URLs: Project ki urls.py mein path('api/', include('yourapp.urls')) lazmi likhein.

Frontend State: useEffect ke andar fetch call rakhi hai taake jaise hi user search box mein likhe, result foran update ho jaye.

🎨 Signup & OTP Verification (Modern UI)
Yeh ek hi file mein handle hoga app/signup/page.js, jo Step-by-Step UI dikhayega.

JavaScript
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP & Details
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        username: "",
        password: ""
    });
    const [message, setMessage] = useState({ text: "", type: "" });

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/api/send-otp/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            if (res.ok) {
                setStep(2);
                setMessage({ text: "OTP sent to your email!", type: "success" });
            } else {
                setMessage({ text: "Failed to send OTP. Try again.", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Server error. Check connection.", type: "error" });
        }
        setLoading(false);
    };

    // Step 2: Final Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/api/verify-register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setMessage({ text: "Registration Successful! Redirecting...", type: "success" });
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setMessage({ text: "Invalid OTP or details.", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Error during registration.", type: "error" });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            {/* Glassmorphic Card */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl transition-all duration-500">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
                    <p className="text-blue-200 mt-2">Join Ayan Store today</p>
                </div>

                {message.text && (
                    <div className={`mb-6 p-3 rounded-xl text-center text-sm font-medium ${
                        message.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                    }`}>
                        {message.text}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-5">
                        <div>
                            <label className="text-white text-sm ml-1">Email Address</label>
                            <input 
                                type="email" required
                                className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <button 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                        >
                            {loading ? "Sending..." : "Send Verification Code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="animate-fade-in">
                            <label className="text-white text-sm">Enter 6-Digit OTP</label>
                            <input 
                                type="text" maxLength="6" required
                                className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-white text-center tracking-widest text-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="000000"
                                onChange={(e) => setFormData({...formData, otp: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-white text-sm">Username</label>
                            <input 
                                type="text" required
                                className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-white text-sm">Create Password</label>
                            <input 
                                type="password" required
                                className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <button 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl mt-4 hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? "Processing..." : "Complete Registration"}
                        </button>
                        <button 
                            type="button" onClick={() => setStep(1)}
                            className="w-full text-blue-300 text-sm hover:underline mt-2"
                        >
                            Change Email?
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}


1. Login Page (src/app/login/page.js)
Is page mein hum JWT Authentication (SimpleJWT) ka use karenge jo aapne settings.py mein pehle hi configure kiya hua hai.

JavaScript
"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({ username: "", password: "" });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/token/", { // JWT endpoint
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.access); // Token save karna
                alert("Login Successful!");
                router.push("/"); // Home page par bhejna
            } else {
                alert("Invalid Username or Password");
            }
        } catch (err) {
            alert("Server connection failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-black">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-black text-center mb-8 uppercase italic tracking-tighter">Welcome Back</h2>
                
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase ml-2 text-gray-400">Username</label>
                        <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black"
                            placeholder="ayan_baig" required
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase ml-2 text-gray-400">Password</label>
                        <input type="password" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black"
                            placeholder="••••••••" required
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
                    </div>
                    
                    <button disabled={loading} className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:opacity-90 transition active:scale-95">
                        {loading ? "AUTHENTICATING..." : "LOG IN"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    New here? <Link href="/signup" className="font-bold text-black underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
}
2. Add Product Page (src/app/add-product/page.js)
Ye page admin ya user ko products upload karne ki ijazat dega.

JavaScript
"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({
        Name: "",
        Price: "",
        Description: "",
        Category: "Electronics" // Default
    });

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token"); // Token auth ke liye

        try {
            const res = await fetch("http://localhost:8000/api/products/", { 
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(product),
            });

            if (res.ok) {
                alert("Product Added Successfully!");
                router.push("/"); 
            } else {
                alert("Failed to add product. Check if you are logged in.");
            }
        } catch (err) {
            alert("Error connecting to server");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white text-black p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-black mb-10 uppercase italic">Add New Product</h1>
                
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Product Name</label>
                        <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="iPhone 15 Pro Max..." required
                            onChange={(e) => setProduct({...product, Name: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Price ($)</label>
                        <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="999" required
                            onChange={(e) => setProduct({...product, Price: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Category</label>
                        <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            onChange={(e) => setProduct({...product, Category: e.target.value})}>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Home Decor</option>
                            <option>Accessories</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-400">Description</label>
                        <textarea rows="4" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tell us about the product..." required
                            onChange={(e) => setProduct({...product, Description: e.target.value})}></textarea>
                    </div>

                    <button disabled={loading} className="md:col-span-2 py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-100">
                        {loading ? "UPLOADING..." : "PUBLISH PRODUCT"}
                    </button>
                </form>
            </div>
        </div>
    );
}
⚠️ Zaroori Tips:
Django URLs: Apne backend/urls.py mein check karein ke JWT token ke liye ye lines hain:

Python
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
Add Product POST: Django mein views.py mein get_products ko update karke POST method bhi handle karna hoga taake product save ho sake.

UI Design: Maine dono pages mein rounded-2xl, bg-gray-50, aur modern spacing use ki hai jo aaj kal ke premium apps (jaise Apple ya Stripe) mein hoti hai.
🔑 Is Code ki Khoobiyaan:
State-Driven UI: Jab OTP chali jayegi, page refresh hue bina inputs change ho jayenge (Smooth UX).

Visual Feedback: Button par click karte hi wo Processing... dikhayega aur hover par animation hogi.

Modern Palette: Dark slate aur blue ka combo jo aaj kal ki SaaS websites mein use hota hai.

💡 Backend pe aik choti tabdeeli (Step 2):
Ayan, Step 2 mein jo 400 error aa raha tha, usse bachne ke liye backend view (verify_otp_and_register) mein check karein ke data aise receive ho:

