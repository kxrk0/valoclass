import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LineupFilters from '@/components/lineup/LineupFilters'
import LineupGrid from '@/components/lineup/LineupGrid'
import FeaturedLineups from '@/components/lineup/FeaturedLineups'

export const metadata = {
  title: 'Agent Lineups - ValoClass',
  description: 'Master Valorant with precise lineups for all agents and maps. Learn smoke, flash, and utility lineups from the best players.',
}

export default function LineupsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="container py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Agent 
              <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent"> Lineups</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master every throwable ability with precise lineups for all agents and maps. 
              From smoke setups to flash lineups, discover the strategies that win rounds.
            </p>
          </div>

          {/* Featured Lineups */}
          <FeaturedLineups />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
            {/* Filters */}
            <div className="lg:col-span-1">
              <LineupFilters />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <LineupGrid />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
