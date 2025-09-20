'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MinimalistRegisterForm from '@/components/auth/MinimalistRegisterForm'
import BlurText from '@/components/ui/BlurText'
import { useTranslation } from '@/contexts/LanguageContext'

export default function RegisterPage() {
  const t = useTranslation()
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-500 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-emerald-500 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-teal-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-1/3 right-1/3 w-1 h-32 bg-gradient-to-b from-green-500/20 to-transparent transform rotate-45"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-24 bg-gradient-to-b from-purple-500/20 to-transparent transform -rotate-45"></div>
      </div>

      <Header />
      
      <main className="pt-20 pb-12">
        <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Hero Section - Sol taraf */}
              <div className="text-center lg:text-left animate-fade-in-up order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-green-500/10 border border-green-500/20 backdrop-blur-20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">JOIN PLAYVALORANTGUIDES</span>
                </div>
                
                <div className="mb-6">
                  <BlurText
                    text="Start Your Journey"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-4xl lg:text-6xl font-bold"
                  />
                </div>
                
                <p className="text-xl text-gray-400 max-w-lg leading-relaxed mb-8">
                  {t.auth.registerSubtitle || 'Create your account and join thousands of Valorant players. Access exclusive features, share your lineups, and elevate your gameplay.'}
                </p>

                {/* Feature Highlights */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm">Access to exclusive lineups and crosshairs</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    </div>
                    <span className="text-sm">Connect with the Valorant community</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-5 h-5 bg-teal-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    </div>
                    <span className="text-sm">Track your progress and stats</span>
                  </div>
                </div>

                {/* Already have account notice */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 backdrop-blur-10">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 text-sm">
                    Already have an account? <a href="/auth/login" className="text-white font-medium hover:text-green-400 transition-colors">Sign in here</a>
                  </span>
                </div>
              </div>

              {/* Register Form - Sağ taraf */}
              <div className="animate-fade-in-up order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
                <MinimalistRegisterForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
