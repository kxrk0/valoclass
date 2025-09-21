import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import SystemSettings from '@/components/admin/SystemSettings'
import { NotificationProvider } from '@/contexts/NotificationContext'

export const metadata: Metadata = {
  title: 'Settings - Admin Dashboard',
  description: 'Configure platform settings and preferences',
  robots: { index: false, follow: false }
}

export default function AdminSettingsPage() {
  return (
    <NotificationProvider>
      <AdminAuthGuard>
        <AdminLayout>
          <SystemSettings />
        </AdminLayout>
      </AdminAuthGuard>
    </NotificationProvider>
  )
}