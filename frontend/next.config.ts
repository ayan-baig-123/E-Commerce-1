import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Move it out of 'experimental' and put it here */
  allowedDevOrigins: ['10.0.11.9'], 
  
  // Your other config options...
  experimental: {
    // Keep other experimental flags here if you have any
  },
};

export default nextConfig;