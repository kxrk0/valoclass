import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import ReportsManagement from '@/components/admin/ReportsManagement'

export const metadata: Metadata = {
  title: 'Reports - Admin Dashboard',
  description: 'View and manage user reports and violations',
  robots: { index: false, follow: false }
}

export default function AdminReportsPage() {
  return (
    <AdminLayout>
      <ReportsManagement />
    </AdminLayout>
  )
}
