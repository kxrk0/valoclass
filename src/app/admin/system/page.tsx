import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import SystemMonitoring from '@/components/admin/SystemMonitoring'

export const metadata: Metadata = {
  title: 'System Status - Admin Dashboard',
  description: 'Monitor system health and performance metrics',
  robots: { index: false, follow: false }
}

export default function AdminSystemPage() {
  return (
    <AdminLayout>
      <SystemMonitoring />
    </AdminLayout>
  )
}