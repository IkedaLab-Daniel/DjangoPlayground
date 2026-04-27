'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        setIsSuccess(true);
      } else {
        setError('Invalid credentials. Access denied.');
        setIsLoading(false);
      }
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#051C42] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0B3D91] mb-2">Access Granted</h2>
          <p className="text-gray-600 mb-6 font-medium">Securing connection to the portal...</p>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-[#D4AF37]"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans"
      style={{ 
        backgroundColor: '#f1f5f9', 
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundImage: 'radial-gradient(#cbd5e1 0.5px, transparent 0.5px)',
        backgroundSize: '24px 24px'
      }}
    >
      <div className="absolute top-0 w-full h-1.5 bg-[#D4AF37]" />

      {/* Secure Banner */}
      {/* <div className="mb-6 flex items-center justify-center space-x-2 z-10">
        <Lock className="w-5 h-5 text-gray-500" />
        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Encrypted Secure Session</span>
      </div> */}

      {/* Main Authentication Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] px-4 z-10 relative"
      >
        <div className="bg-white rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border-t-[4px] border-t-[#0B3D91] overflow-hidden flex flex-col">
          
          {/* Header Section */}
          <div className="p-8 pb-4 text-center">
            <div className="mx-auto rounded-full flex items-center justify-center mb-4">
              <Image
                src="/logo.jpeg"
                alt="Government Technology Services logo"
                width={70}
                height={70}
                className="h-18 w-18 rounded-full object-cover"
                priority
              />
            </div>
            <h1 className="text-[#0B3D91] text-xl font-bold tracking-tight uppercase">
              Mabalacat City<br />Access Portal
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Authorized Personnel Only
            </p>
          </div>

          {/* Form Section */}
          <div className="px-10 pb-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-md flex items-start overflow-hidden"
                >
                  <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800">Authentication Failed</h3>
                    <p className="text-xs text-red-700 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="username">
                  Government ID / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent outline-none transition-all text-sm"
                    placeholder="Enter your credential ID"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block" htmlFor="password">
                    Password
                  </label>
                  <button type="button" className="text-[11px] font-bold text-[#0B3D91] hover:underline uppercase focus:outline-none">
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent outline-none transition-all text-sm tracking-widest"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-[#0B3D91] border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="text-xs text-gray-600 font-medium cursor-pointer">
                  Remember this device for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B3D91] text-white py-3 rounded font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <>
                    <span>Secure Sign In</span>
                    <Lock className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Security Banner Bottom */}
          <div className="bg-red-50 border-t border-red-100 p-4">
             <p className="text-[10px] text-red-800 leading-tight text-center font-medium">
               WARNING: This is a secure government system. Unauthorized access is prohibited and subject to criminal prosecution. All activities are monitored and recorded.
             </p>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-6 sm:bottom-8 w-full px-6 sm:px-12 z-10 hidden sm:block">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500 font-bold uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#0B3D91]">Privacy Policy</a>
            <a href="#" className="hover:text-[#0B3D91]">Terms of Use</a>
            <a href="#" className="hover:text-[#0B3D91]">Security Notice</a>
          </div>
          <div className="mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Mabalacat City Highly Sophisticated WEb System 1000 Bamba
          </div>
        </div>
      </footer>
    </div>
  );
}
