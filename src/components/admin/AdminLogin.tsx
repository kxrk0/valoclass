'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  LogIn,
  Chrome,
  Key,
  Lock,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Circle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const AdminLogin: React.FC = () => {
  const [loginType, setLoginType] = useState<'google' | 'id'>('google');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/oauth/google?redirect=admin`;
    } catch (err) {
      setError('Failed to initialize Google login');
      setLoading(false);
    }
  };

  const handleIdLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store admin token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));

      // Redirect to admin dashboard
      router.push('/admin');
      
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* Minimal Animated Background - Ana site ile tutarlı */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
        
        {/* Subtle Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-500 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-orange-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-cyan-500 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Gentle Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Minimal Geometric Patterns */}
        <div className="absolute top-1/3 right-1/3 w-1 h-32 bg-gradient-to-b from-red-500/20 to-transparent transform rotate-45"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-24 bg-gradient-to-b from-orange-500/20 to-transparent transform -rotate-45"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-lg mx-auto"
      >
        {/* Subtle Background Elements - Ana site ile tutarlı */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-2 h-2 bg-red-500/40 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-10 left-10 w-2 h-2 bg-cyan-500/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Main Glassmorphism Container */}
        <motion.div 
          variants={itemVariants}
          className="relative p-6 lg:p-8 rounded-2xl backdrop-blur-30 border transition-all duration-300"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.02) 100%
              ),
              radial-gradient(circle at 30% 40%, rgba(255, 70, 84, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)
            `,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: `
              0 25px 45px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              0 0 50px rgba(255, 255, 255, 0.05)
            `
          }}
        >
          {/* Minimal Header */}
          <div className="text-center mb-6">
            {/* Geometric logo - Ana site tarzı */}
            <div className="relative inline-flex items-center justify-center w-12 h-12 mb-4">
              {/* Overlapping shapes */}
              <div className="absolute w-12 h-12 border border-red-400/60 rounded-lg rotate-45 animate-pulse"></div>
              <div className="absolute w-8 h-8 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute w-4 h-4 bg-white/80 rounded-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
              <Shield size={16} className="relative z-10 text-white" />
            </div>

            <h1 className="text-2xl font-light mb-2 text-white tracking-wide">
              Admin Panel
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Secure access to <span className="text-red-400 font-medium">ValoClass</span> management
            </p>
            
            {/* Status indicators - Minimal */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Online</span>
              </div>
              <div className="w-px h-3 bg-gray-600/50"></div>
              <div className="flex items-center gap-2 text-xs">
                <Lock size={10} className="text-blue-400" />
                <span className="text-blue-400 font-medium">Secure</span>
              </div>
            </div>
          </div>

          {/* Clean Login Type Selector - Ana site tarzı */}
          <div className="space-y-3 mb-5">
            {/* Google OAuth */}
            <motion.button
              onClick={() => setLoginType('google')}
              variants={itemVariants}
              className={`group w-full p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                loginType === 'google'
                  ? 'border-red-500/50 bg-red-500/10'
                  : 'border-gray-600/50 hover:border-gray-500 bg-gray-800/20 hover:bg-gray-800/40'
              } backdrop-blur-20`}
            >
              <div className="flex items-center justify-center gap-3 text-gray-300 group-hover:text-white">
                <Chrome size={20} />
                <span className="font-medium text-sm">Google OAuth</span>
                {loginType === 'google' && (
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-auto"></div>
                )}
              </div>
            </motion.button>

            {/* Admin ID */}
            <motion.button
              onClick={() => setLoginType('id')}
              variants={itemVariants}
              className={`group w-full p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                loginType === 'id'
                  ? 'border-red-500/50 bg-red-500/10'
                  : 'border-gray-600/50 hover:border-gray-500 bg-gray-800/20 hover:bg-gray-800/40'
              } backdrop-blur-20`}
            >
              <div className="flex items-center justify-center gap-3 text-gray-300 group-hover:text-white">
                <Key size={20} />
                <span className="font-medium text-sm">Admin ID</span>
                {loginType === 'id' && (
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-auto"></div>
                )}
              </div>
            </motion.button>
          </div>

          {/* Error Message - Minimal */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-3 mb-5 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-20"
            >
              <AlertTriangle size={16} className="text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Elegant Divider - Ana site tarzı */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-1 bg-gray-900/80 text-gray-400 backdrop-blur-20 rounded-full text-xs">
                Choose Authentication Method
              </span>
            </div>
          </div>

          {/* Google Login - Minimal Design */}
          {loginType === 'google' && (
            <motion.div
              key="google"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full mx-auto mb-3">
                  <Chrome size={24} className="text-white" />
                </div>
                <h3 className="text-white font-medium text-base mb-1">Google Authentication</h3>
                <p className="text-gray-400 text-sm">Sign in with your authorized Google account</p>
              </div>
              
              <motion.button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group w-full py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(59, 130, 246, 0.8) 0%, 
                      rgba(37, 99, 235, 0.9) 100%
                    )
                  `,
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                }}
              >
                <div className="flex items-center justify-center gap-3 text-white">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Chrome size={20} />
                      <span>Sign in with Google</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </motion.button>
            </motion.div>
          )}

          {/* ID Login - Clean Form Design */}
          {loginType === 'id' && (
            <motion.div
              key="id"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="text-center mb-5">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mx-auto mb-3">
                  <UserCheck size={24} className="text-white" />
                </div>
                <h3 className="text-white font-medium text-base mb-1">Admin ID Login</h3>
                <p className="text-gray-400 text-sm">Enter your admin credentials</p>
              </div>

              <form onSubmit={handleIdLogin} className="space-y-4">
                {/* Admin ID Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Admin ID</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      placeholder="Enter your admin ID"
                      className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Key className="h-4 w-4 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || !adminId || !password}
                  className="group w-full py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden mt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(34, 197, 94, 0.8) 0%, 
                        rgba(16, 185, 129, 0.9) 100%
                      )
                    `,
                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <div className="flex items-center justify-center gap-3 text-white">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={20} />
                        <span>Login to Admin Panel</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Minimal Footer */}
          <div className="text-center mt-6 pt-4 border-t border-gray-700/30">
            <p className="text-gray-400 text-xs mb-3">
              Need assistance? Contact your system administrator
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-600/30 hover:border-gray-500 text-red-400 hover:text-white text-sm font-medium transition-all duration-300 backdrop-blur-20"
              >
                <span>←</span>
                <span>Back to ValoClass</span>
              </Link>
            </motion.div>
          </div>

          {/* Minimal decorative elements - Ana site tarzı */}
          <div className="absolute top-2.5 right-4 w-1 h-1 bg-red-400/60 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </motion.div>

        {/* Minimal Security Notice */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 relative overflow-hidden rounded-lg p-4 backdrop-blur-20"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(251, 191, 36, 0.05) 0%, 
                rgba(245, 158, 11, 0.03) 100%
              )
            `,
            border: '1px solid rgba(251, 191, 36, 0.1)'
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
              <Shield size={14} className="text-yellow-400" />
            </div>
            
            <div className="flex-1">
              <h4 className="text-yellow-400 font-medium text-sm mb-1">Secure Admin Access</h4>
              <p className="text-yellow-200/80 text-xs leading-relaxed mb-2">
                This area is restricted to authorized administrators. All access attempts are logged.
              </p>
              
              {/* Security features - Minimal */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-medium">Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-400 font-medium">Monitored</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  <span className="text-purple-400 font-medium">Logged</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
