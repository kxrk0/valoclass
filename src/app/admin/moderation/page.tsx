import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import ContentModeration from '@/components/admin/ContentModeration'

export const metadata: Metadata = {
  title: 'Content Moderation - Admin Dashboard',
  description: 'Review reported content and manage community standards',
  robots: { index: false, follow: false }
}

export default function AdminModerationPage() {
  return (
    <AdminLayout>
      <ContentModeration />
    </AdminLayout>
  )
}
