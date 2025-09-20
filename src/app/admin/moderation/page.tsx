import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import ModerationQueue from '@/components/admin/ModerationQueue'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'

export const metadata: Metadata = {
  title: 'Content Moderation - Admin Dashboard',
  description: 'Review reported content and manage community standards',
  robots: { index: false, follow: false }
}

export default function AdminModerationPage() {
  return (
    <NotificationProvider>
      <AdminSocketProvider>
        <AdminLayout>
          <ModerationQueue />
        </AdminLayout>
      </AdminSocketProvider>
    </NotificationProvider>
  )
}
