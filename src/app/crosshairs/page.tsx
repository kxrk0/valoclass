import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CrosshairBuilder from '@/components/crosshair/CrosshairBuilder'
import CrosshairGallery from '@/components/crosshair/CrosshairGallery'

export const metadata = {
  title: 'Crosshair Builder - ValoClass',
  description: 'Create, customize, and share your perfect Valorant crosshair. Build from scratch or browse thousands of community crosshairs.',
}

export default function CrosshairsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="container py-6">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">
              Crosshair 
              <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent"> Builder</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Create, customize, and share your perfect Valorant crosshair
            </p>
          </div>

          {/* Optimized Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Builder - Takes more space */}
            <div className="xl:col-span-3">
              <CrosshairBuilder />
            </div>

            {/* Compact Gallery Sidebar */}
            <div className="xl:col-span-1">
              <CrosshairGallery />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
