import { Metadata } from 'next'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { AdminLayoutWrapper } from './AdminLayoutWrapper'

export const metadata: Metadata = {
  title: {
    template: '%s - ValoClass Admin',
    default: 'Admin Dashboard - ValoClass'
  },
  description: 'ValoClass admin dashboard for content and user management',
  robots: { index: false, follow: false }
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminRootLayout({ children }: AdminLayoutProps) {
  return (
    <NotificationProvider>
      <AdminLayoutWrapper>
        {children}
      </AdminLayoutWrapper>
    </NotificationProvider>
  )
}
