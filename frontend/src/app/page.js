"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      // Ab aapne aise badalna hai:
const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Backend Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search (Capital Name use kiya hai)
  const filteredProducts = products.filter(p =>
    p.Name && p.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050509] text-white font-sans">
      {/* --- Modern Glassmorphism Navbar --- */}
      <nav className="sticky top-0 z-50 bg-[#0a0a14]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent tracking-tighter">
            AYAN STORE
          </Link>
          
          <div className="flex gap-4 items-center">
            <input 
              type="text" 
              placeholder="Search items..." 
              className="hidden md:block bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm outline-none focus:border-blue-500 w-64 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link href="/login" className="text-sm font-semibold text-gray-400 hover:text-white px-4">Login</Link>
            <Link href="/add-product" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              Sell Product
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
            UPGRADE YOUR <span className="text-blue-500 underline decoration-blue-500/30">STYLE</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover the most exclusive products from top creators around the world. Secure, fast, and premium.
          </p>
        </div>
      </header>

      {/* --- Products Grid --- */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <h2 className="text-2xl font-bold tracking-tight">New Arrivals</h2>
          <span className="text-sm text-gray-500">{filteredProducts.length} items found</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-white/5 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((item) => (
              <div key={item.id} className="group relative bg-[#0f0f1a] border border-white/5 p-4 rounded-[2.5rem] hover:bg-[#151525] transition-all duration-500 shadow-2xl">
                {/* Image Area */}
                <div className="relative h-56 w-full bg-[#050509] rounded-[2rem] overflow-hidden mb-6 border border-white/5 flex items-center justify-center">
                   <span className="text-gray-800 font-black text-xl tracking-widest opacity-20 group-hover:scale-110 transition-transform duration-700">PREMIUM</span>
                </div>

                {/* Content Area - FIXED KEYS HERE */}
                <div className="px-2">
                  {/* FIX 1: item.Name (Capital N) */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                    {item.Name}
                  </h3>
                  
                  {/* FIX 2: item.Desciption (Model spelling) */}
                  <p className="text-gray-500 text-xs line-clamp-2 mb-6 h-8 font-medium">
                    {item.Desciption || "Exclusive premium quality product."}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Price</span>
                        {/* FIX 3: item.Price (Capital P) */}
                        <span className="text-2xl font-black text-white">${item.Price}</span>
                    </div>
                    <button className="bg-white text-black h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all active:scale-90 shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM216,200H40V56H216V200Zm-88-88a28,28,0,1,1,28,28A28,28,0,0,1,128,112Z"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-gray-500 text-xl font-medium italic">No products match your search.</p>
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
          <p className="text-gray-700 text-xs tracking-[0.3em] font-bold uppercase">Ayan Store &copy; 2026 - Excellence in Commerce</p>
      </footer>
    </div>
  );
}