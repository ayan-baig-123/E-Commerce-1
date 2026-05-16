"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    
    // In variables ka hona zaroori hai
    const [step, setStep] = useState(1); 
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        otp: ""
    });

    // Step 1: Email par OTP bhejna
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send-otp/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            if (res.ok) {
                alert("OTP Sent! Please check your Gmail.");
                setStep(2); // Agle step par bhejna
            } else {
                const data = await res.json();
                alert(data.error || "Failed to send OTP");
            }
        } catch (err) {
            alert("Django Server is not running!");
        }
        setLoading(false);
    };

    // Step 2: OTP Verify karke User create karna
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-otp/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp,
                    username: formData.username,
                    password: formData.password
                }),
            });

            if (res.ok) {
                alert("Mubarak ho! Registration Success.");
                router.push("/login");
            } else {
                const data = await res.json();
                alert(data.error || "Verification failed");
            }
        } catch (err) {
            alert("Connection error during verification.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-black text-center mb-8 uppercase tracking-tighter italic text-blue-600">
                    {step === 1 ? "Create Account" : "Confirm OTP"}
                </h2>

                <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP} className="space-y-4">
                    {step === 1 ? (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase ml-2 text-gray-500">Username</label>
                                <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    placeholder="ayan_baig" required value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase ml-2 text-gray-500">Email Address</label>
                                <input type="email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    placeholder="example@gmail.com" required value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase ml-2 text-gray-500">Password</label>
                                <input type="password" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    placeholder="••••••••" required value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-center text-sm text-gray-500">
                                Enter the 6-digit code sent to <br/><span className="font-bold text-black">{formData.email}</span>
                            </p>
                            <input className="w-full p-4 bg-gray-50 border-2 border-blue-100 rounded-2xl text-center text-3xl font-mono tracking-[10px] outline-none focus:border-blue-500 text-black"
                                placeholder="000000" maxLength={6} required value={formData.otp}
                                onChange={(e) => setFormData({...formData, otp: e.target.value})} />
                            
                            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-400 hover:text-black transition underline">
                                ← Edit details
                            </button>
                        </div>
                    )}
                    
                    <button disabled={loading} className={`w-full py-4 rounded-2xl font-black text-white transition active:scale-95 uppercase tracking-widest ${step === 1 ? 'bg-black hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {loading ? "Processing..." : step === 1 ? "Get Code" : "Verify & Sign Up"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account? <Link href="/login" className="font-bold text-black underline">Login</Link>
                </p>
            </div>
        </div>
    );
}