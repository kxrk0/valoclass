import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LineupFilters from '@/components/lineup/LineupFilters'
import LineupGrid from '@/components/lineup/LineupGrid'
import FeaturedLineups from '@/components/lineup/FeaturedLineups'
import LineupsHero from '@/components/lineup/LineupsHero'
import { useTranslation } from '@/contexts/LanguageContext'

export const metadata = {
  title: 'Valorant Lineups - PLAYVALORANTGUIDES.COM',
  description: 'Master Valorant with precise lineups for all agents and maps. Learn professional smoke, flash, and utility lineups from pro players.',
  keywords: 'valorant lineups, valorant smoke lineups, valorant utility, agent lineups, valorant strategy'
}

export default function LineupsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/patterns/valorant-grid.svg')] opacity-5" />
      </div>

      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <LineupsHero />

        {/* Main Content */}
        <div className="relative">
          <div className="container py-12">
            {/* Featured Section */}
            <section className="mb-16">
              <FeaturedLineups />
            </section>

            {/* Browse Section */}
            <section className="relative">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  Browse All Lineups
                </div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">
                  Find Your Perfect Setup
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl">
                  Explore thousands of professional lineups for every agent, map, and situation.
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* Advanced Filters */}
                <div className="xl:col-span-1">
                  <div className="sticky top-24">
                    <LineupFilters />
                  </div>
                </div>

                {/* Results Grid */}
                <div className="xl:col-span-4">
                  <LineupGrid />
                </div>
              </div>
            </section>

            {/* Pro Tips Section */}
            <section className="mt-20 py-16 px-8 rounded-3xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 70, 84, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%)',
                border: '1px solid rgba(255, 70, 84, 0.2)'
              }}
            >
              <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-5" />
              <div className="relative text-center max-w-4xl mx-auto">
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
                  💡 Pro Tips for Mastering Lineups
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl mb-3">🎯</div>
                    <h4 className="font-semibold text-lg text-white mb-2">Practice Makes Perfect</h4>
                    <p className="text-gray-400 text-sm">
                      Spend 10 minutes in practice range daily. Muscle memory is key for consistent execution.
                    </p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl mb-3">📍</div>
                    <h4 className="font-semibold text-lg text-white mb-2">Learn Reference Points</h4>
                    <p className="text-gray-400 text-sm">
                      Master 3-5 lineups per map. Quality over quantity leads to better game impact.
                    </p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl mb-3">🗣️</div>
                    <h4 className="font-semibold text-lg text-white mb-2">Communicate Early</h4>
                    <p className="text-gray-400 text-sm">
                      Always tell your team the lineup plan. Coordination multiplies effectiveness.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
