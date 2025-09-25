'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MinimalistLoginForm from '@/components/auth/MinimalistLoginForm'
import { useTranslation } from '@/contexts/LanguageContext'

export default function LoginPage() {
  const t = useTranslation()
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
        
        {/* Dynamic Floating Particles */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-red-500 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-orange-500 rounded-full opacity-50 animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-yellow-500 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-cyan-500 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-purple-500 rounded-full opacity-50 animate-ping" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-green-500 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Enhanced Gradient Orbs with Movement */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/15 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '8s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '5s', animationDuration: '7s' }}></div>
        
        {/* Valorant-Inspired Geometric Patterns */}
        <div className="absolute top-1/3 right-1/3 w-2 h-40 bg-gradient-to-b from-red-500/30 to-transparent transform rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-32 bg-gradient-to-b from-orange-500/25 to-transparent transform -rotate-45 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-1/4 w-1 h-20 bg-gradient-to-b from-cyan-500/20 to-transparent transform rotate-12 animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Hexagon Shapes for Gaming Aesthetic */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8 border border-red-500/20 transform rotate-45 animate-spin" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-6 h-6 border border-cyan-500/15 transform rotate-45 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        
        {/* Floating Agent Icons */}
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-r from-red-500/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/2 right-20 w-10 h-10 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />
      
      <main className="pt-24 pb-12">
        <div className="min-h-[calc(100vh-144px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Enhanced Hero Section - Sol taraf */}
              <div className="text-center lg:text-left animate-fade-in-up order-2 lg:order-1 relative">
                {/* Floating background elements */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-r from-red-500/5 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                
                {/* Enhanced Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl mb-8 bg-gradient-to-r from-red-500/15 via-red-500/10 to-transparent border border-red-500/30 backdrop-blur-20 hover:from-red-500/20 hover:border-red-500/40 transition-all duration-500 group">
                  <div className="relative">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <span className="text-red-400 text-sm font-semibold tracking-wide group-hover:text-red-300 transition-colors">
                    {t.auth.loginHeroBadge || 'VALORANT ELITE ACCESS'}
                  </span>
                  <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                {/* Clean Modern Title */}
                <div className="mb-10 relative">
                  {/* Clean gradient title */}
                  <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight mb-4">
                    <span 
                      className="bg-gradient-to-r from-white via-red-400 to-cyan-400 bg-clip-text text-transparent animate-fade-in-up"
                      style={{ animationDelay: '0.2s' }}
                    >
                      Welcome Back
                    </span>
                  </h1>
                  
                  <h2 
                    className="text-3xl lg:text-5xl font-bold text-gray-300 animate-fade-in-up"
                    style={{ animationDelay: '0.4s' }}
                  >
                    Agent
                  </h2>

                  {/* Clean decorative elements */}
                  <div className="absolute -top-2 left-0 w-16 h-1 bg-gradient-to-r from-red-500 to-transparent rounded-full"></div>
                  <div className="absolute -bottom-2 right-0 w-12 h-1 bg-gradient-to-l from-cyan-500 to-transparent rounded-full"></div>
                </div>
                
                {/* Enhanced Subtitle */}
                <p className="text-xl lg:text-2xl text-gray-400 max-w-2xl leading-relaxed mb-10 font-light">
                  {t.auth.loginSubtitle || 'Enter the battlefield. Access your tactical dashboard and dominate the competition.'}
                </p>

                {/* Gaming Statistics */}
                <div className="grid grid-cols-3 gap-4 max-w-md mb-8">
                  <div className="text-center p-4 rounded-xl bg-gray-800/20 border border-gray-700/30 backdrop-blur-10 hover:bg-gray-800/30 transition-all duration-300">
                    <div className="text-2xl font-bold text-red-400 mb-1">500K+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Active Players</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gray-800/20 border border-gray-700/30 backdrop-blur-10 hover:bg-gray-800/30 transition-all duration-300">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">10M+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Lineups Shared</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gray-800/20 border border-gray-700/30 backdrop-blur-10 hover:bg-gray-800/30 transition-all duration-300">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">99.9%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Uptime</div>
                  </div>
                </div>

                {/* Enhanced Demo Notice */}
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent border border-green-500/25 backdrop-blur-20 hover:from-green-500/15 hover:border-green-500/35 transition-all duration-500 group">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <span className="text-gray-300 text-sm">
                    <span className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">{t.auth.demo || 'Demo'}</span>: 
                    <strong className="text-white mx-1">admin@valoclass.com</strong>
                    <span className="text-gray-500">/</span>
                    <strong className="text-white mx-1">admin123</strong>
                  </span>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                </div>
              </div>

              {/* Login Form - Sağ taraf */}
              <div className="animate-fade-in-up order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
                <MinimalistLoginForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
