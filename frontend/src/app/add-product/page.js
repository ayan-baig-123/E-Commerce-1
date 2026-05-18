"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // FIX 1: Initial state empty strings rakhi hain taake warning na aaye
  const [formData, setFormData] = useState({ 
    Name: "", 
    Price: "", 
    Description: "", // Form input ke liye ye theek hai
    Category: "", 
    Stock: ""  
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    } else {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("https://e-commerce-1-2-bv0w.onrender.com/api/add-product/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          // FIX 2: Aapke model mein spelling 'Desciption' hai (r missing hai)
          // Isliye yahan wahi key bhej rahe hain jo Django ko chahiye
          Name: formData.Name,
          Price: parseFloat(formData.Price),
          Desciption: formData.Description, // Yahan 'Desciption' likha hai
          Category: formData.Category,
          Stock: parseInt(formData.Stock)
        }),
      });

      if (res.ok) {
        alert("Product Added Successfully!");
        setFormData({ Name: "", Price: "", Description: "", Category: "", Stock: "" });
        fetchProducts();
      } else {
        const errorData = await res.json();
        console.log("Backend Error Details:", errorData);
        alert("Error: " + JSON.stringify(errorData));
      }
    } catch (err) {
      alert("Network Error! Backend connection check karein.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050509] text-white p-6 pt-24 font-sans">
      <div className="max-w-4xl mx-auto bg-[#0f0f1a] p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
        <h2 className="text-3xl font-black mb-8 text-blue-500 italic tracking-tighter">ADD NEW PRODUCT</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-widest">Product Name</label>
            <input 
              className="w-full p-4 bg-[#050509] border border-gray-800 rounded-2xl outline-none focus:border-blue-500 transition-all"
              value={formData.Name} 
              onChange={(e) => setFormData({...formData, Name: e.target.value})} 
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-widest">Category</label>
            <input 
              placeholder="Electronics, Fashion etc."
              className="w-full p-4 bg-[#050509] border border-gray-800 rounded-2xl outline-none focus:border-blue-500 transition-all"
              value={formData.Category} 
              onChange={(e) => setFormData({...formData, Category: e.target.value})} 
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-widest">Price ($)</label>
            <input 
              type="number"
              step="0.01"
              className="w-full p-4 bg-[#050509] border border-gray-800 rounded-2xl outline-none focus:border-blue-500 transition-all"
              value={formData.Price} 
              onChange={(e) => setFormData({...formData, Price: e.target.value})} 
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-widest">Stock Quantity</label>
            <input 
              type="number"
              placeholder="0"
              className="w-full p-4 bg-[#050509] border border-gray-800 rounded-2xl outline-none focus:border-blue-500 transition-all"
              value={formData.Stock} 
              onChange={(e) => setFormData({...formData, Stock: e.target.value})} 
              required
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-widest">Description</label>
            <textarea 
              rows="3"
              className="w-full p-4 bg-[#050509] border border-gray-800 rounded-2xl outline-none focus:border-blue-500 resize-none transition-all"
              value={formData.Description} 
              onChange={(e) => setFormData({...formData, Description: e.target.value})}
            />
          </div>

          <button className="md:col-span-2 bg-blue-600 p-4 rounded-2xl font-black hover:bg-blue-700 transition-all uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 active:scale-95">
            {loading ? "Adding..." : "List Product Now"}
          </button>
        </form>
      </div>
    </div>
  );
}