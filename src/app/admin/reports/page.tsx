import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import ReportsManagement from '@/components/admin/ReportsManagement'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'

export const metadata: Metadata = {
  title: 'Reports - Admin Dashboard',
  description: 'View and manage user reports and violations',
  robots: { index: false, follow: false }
}
export default function AdminReportsPage() {
  return (
    <NotificationProvider>
      <AdminAuthGuard>
        <AdminSocketProvider>
          <AdminLayout>
            <ReportsManagement />
          </AdminLayout>
        </AdminSocketProvider>
      </AdminAuthGuard>
    </NotificationProvider>
  )
}
