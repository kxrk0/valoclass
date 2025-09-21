import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import ContentModeration from '@/components/admin/ContentModeration'
import { NotificationProvider } from '@/contexts/NotificationContext'

export const metadata: Metadata = {
  title: 'Content Moderation - Admin Dashboard',
  description: 'Review reported content and manage community standards',
  robots: { index: false, follow: false }
}

export default function AdminModerationPage() {
  return (
    <NotificationProvider>
      <AdminAuthGuard>
        <AdminLayout>
          <ContentModeration />
        </AdminLayout>
      </AdminAuthGuard>
    </NotificationProvider>
  )
}
