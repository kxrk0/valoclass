import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTabs from '@/components/profile/ProfileTabs'

export const metadata = {
  title: 'Profile - ValoClass',
  description: 'Manage your ValoClass profile, view your lineups, crosshairs, and community activity.',
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="container py-8">
          <ProfileHeader />
          <ProfileTabs />
        </div>
      </main>
      <Footer />
    </div>
  )
}