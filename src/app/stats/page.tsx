import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PlayerSearch from '@/components/stats/PlayerSearch'
import FeaturedPlayers from '@/components/stats/FeaturedPlayers'

export const metadata = {
  title: 'Player Statistics - ValorantGuides',
  description: 'Track your Valorant performance with detailed statistics, match history, and rank progression. Search any player by Riot ID.',
}

export default function StatsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Player 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Statistics</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Track your Valorant performance with detailed statistics, match history, and rank progression. 
              Search any player by their Riot ID to view their stats.
            </p>
          </div>

          {/* Player Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <PlayerSearch />
          </div>

          {/* Featured Players */}
          <FeaturedPlayers />

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-time Data</h3>
              <p className="text-gray-400 text-sm">
                Get the latest stats directly from Riot&apos;s official API with real-time updates.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Detailed Analytics</h3>
              <p className="text-gray-400 text-sm">
                View comprehensive match history, agent performance, and improvement trends.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Compare & Share</h3>
              <p className="text-gray-400 text-sm">
                Compare your stats with friends and share your achievements with the community.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
