import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard - ValorantGuides',
  description: 'Admin panel for managing ValorantGuides content and users.',
  robots: { index: false, follow: false }
}

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="container py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Manage content, users, and monitor platform activity</p>
            </div>
            <AdminDashboard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
