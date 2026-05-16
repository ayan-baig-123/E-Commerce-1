"use client"
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({username: "", password: ""});

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/`, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(credentials),
            });
            const data = await res.json();

            if (res.ok) {
                // --- FIX 1: Name wahi rakhein jo baaki pages use kar rahe hain ---
                localStorage.setItem("access_token", data.access); 
                localStorage.setItem("refresh_token", data.refresh);
                
                alert("Login Successful!");

                // --- FIX 2: Login ke baad foran redirect karein ---
                // window.location use karne se state fresh ho jati hai
                window.location.href = "/add-product"; 
            } else {
                alert(data.detail || "Invalid username or password");
            }
        } catch(err) {
            alert("Server connection failed. Django check karein!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050509] p-4 text-white">
            <div className="w-full max-w-md bg-[#0f0f1a] border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl">
                <h2 className="text-3xl font-black text-center mb-8 uppercase italic tracking-tighter text-blue-500">Welcome Back</h2>
                
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase ml-2 text-gray-500 tracking-widest">Username</label>
                        <input 
                            className="w-full p-4 bg-[#050509] border border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-white transition-all"
                            placeholder="ayan_baig" 
                            required
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase ml-2 text-gray-500 tracking-widest">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-4 bg-[#050509] border border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-white transition-all"
                            placeholder="••••••••" 
                            required
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                        />
                    </div>
                    
                    <button 
                        disabled={loading} 
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-900/20"
                    >
                        {loading ? "AUTHENTICATING..." : "LOG IN"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    New here? <Link href="/signup" className="font-bold text-blue-500 underline ml-1">Create Account</Link>
                </p>
            </div>
        </div>
    );        
}