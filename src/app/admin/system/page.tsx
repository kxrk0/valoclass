import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import SystemMonitoring from '@/components/admin/SystemMonitoring'
import { NotificationProvider } from '@/contexts/NotificationContext'

export const metadata: Metadata = {
  title: 'System Status - Admin Dashboard',
  description: 'Monitor system health and performance metrics',
  robots: { index: false, follow: false }
}

export default function AdminSystemPage() {
  return (
    <NotificationProvider>
      <AdminAuthGuard>
        <AdminLayout>
          <SystemMonitoring />
        </AdminLayout>
      </AdminAuthGuard>
    </NotificationProvider>
  )
}