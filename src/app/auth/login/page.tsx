import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MinimalistLoginForm from '@/components/auth/MinimalistLoginForm'
import BlurText from '@/components/ui/BlurText'

export const metadata = {
  title: 'Sign In - ValorantGuides',
  description: 'Sign in to your ValorantGuides account to access your lineups, crosshairs, and community features.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-500 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-orange-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-yellow-500 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-cyan-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-1/3 right-1/3 w-1 h-32 bg-gradient-to-b from-red-500/20 to-transparent transform rotate-45"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-24 bg-gradient-to-b from-orange-500/20 to-transparent transform -rotate-45"></div>
      </div>

      <Header />
      
      <main className="pt-20 pb-12">
        <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Hero Section - Sol taraf */}
              <div className="text-center lg:text-left animate-fade-in-up order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-red-500/10 border border-red-500/20 backdrop-blur-20">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-sm font-medium">VALOCLASS GAMING HUB</span>
                </div>
                
                <div className="mb-6">
                  <BlurText
                    text="Level Up Your Game"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-4xl lg:text-6xl font-bold"
                  />
                </div>
                
                <p className="text-xl text-gray-400 max-w-lg leading-relaxed mb-8">
                  Join the elite Valorant community and unlock your true potential
                </p>

                {/* Demo Notice */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 backdrop-blur-10">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 text-sm">
                    Demo: <strong className="text-white">admin@valoclass.com</strong> / <strong className="text-white">admin123</strong>
                  </span>
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
