import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CrosshairBuilder from '@/components/crosshair/CrosshairBuilder'

export const metadata = {
  title: 'Valorant Crosshair Builder - ValoClass',
  description: 'Create, customize, and share your perfect Valorant crosshair with accurate in-game codes. Professional crosshair builder with all Valorant features.',
  keywords: 'valorant crosshair, crosshair builder, valorant settings, crosshair codes, valorant crosshair generator'
}

export default function CrosshairsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container py-8">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400/10 to-red-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-sm font-medium mb-4">
              🎯 Professional Crosshair Builder
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Valorant Crosshair 
              <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent"> Builder</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              Create your perfect Valorant crosshair with accurate in-game codes. Professional tools, pro player presets, and community sharing.
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Accurate Valorant Codes
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Pro Player Presets
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Community Gallery
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="max-w-7xl mx-auto">
            <CrosshairBuilder />
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="p-6 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-lg mb-2 text-green-400">Accurate Codes</h3>
              <p className="text-sm text-gray-400">
                Generate perfect Valorant crosshair codes that work exactly as in-game. Copy and paste directly into Valorant settings.
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <div className="text-3xl mb-3">👑</div>
              <h3 className="font-semibold text-lg mb-2 text-blue-400">Pro Presets</h3>
              <p className="text-sm text-gray-400">
                Use crosshairs from professional players like TenZ, ScreaM, shroud, and aspas. Perfect for competitive play.
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.2)'
              }}
            >
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-semibold text-lg mb-2 text-purple-400">Community</h3>
              <p className="text-sm text-gray-400">
                Browse thousands of community crosshairs, share your creations, and discover new styles from players worldwide.
              </p>
            </div>
          </div>

          {/* How to Use Section */}
          <div className="mt-12">
            <div 
              className="p-8 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h2 className="font-heading font-bold text-2xl mb-6 text-center">
                How to Use Your Crosshair in Valorant
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full flex items-center justify-center text-black font-bold text-lg mb-3 mx-auto">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Create</h4>
                  <p className="text-sm text-gray-400">Design your crosshair using our builder with real-time preview</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full flex items-center justify-center text-black font-bold text-lg mb-3 mx-auto">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">Copy Code</h4>
                  <p className="text-sm text-gray-400">Click "Share & Codes" and copy the Valorant crosshair code</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full flex items-center justify-center text-black font-bold text-lg mb-3 mx-auto">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Open Valorant</h4>
                  <p className="text-sm text-gray-400">Go to Settings → Crosshair → Import Profile Code</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full flex items-center justify-center text-black font-bold text-lg mb-3 mx-auto">
                    4
                  </div>
                  <h4 className="font-semibold mb-2">Paste & Play</h4>
                  <p className="text-sm text-gray-400">Paste the code and enjoy your new crosshair in-game!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
