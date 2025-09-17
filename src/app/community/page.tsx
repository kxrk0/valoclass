import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CommunityHero from '@/components/community/CommunityHero'
import TopContributors from '@/components/community/TopContributors'
import RecentActivity from '@/components/community/RecentActivity'
import CommunityStats from '@/components/community/CommunityStats'

export const metadata = {
  title: 'Community - ValoClass',
  description: 'Join the ValoClass community. Connect with players, share your creations, and learn from the best Valorant players.',
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <CommunityHero />
        
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <RecentActivity />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <CommunityStats />
              <TopContributors />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
