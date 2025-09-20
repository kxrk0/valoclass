import { Metadata } from 'next'
import AdminLogin from '@/components/admin/AdminLogin'
import { NotificationProvider } from '@/contexts/NotificationContext'

export const metadata: Metadata = {
  title: 'Admin Login - ValorantGuides',
  description: 'Secure admin access to ValorantGuides management panel',
  robots: { index: false, follow: false }
}

export default function AdminLoginPage() {
  return (
    <NotificationProvider>
      <AdminLogin />
    </NotificationProvider>
  )
}
