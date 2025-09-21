import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import UserManagement from '@/components/admin/UserManagement'
import { NotificationProvider } from '@/contexts/NotificationContext'

export const metadata: Metadata = {
  title: 'User Management - Admin Dashboard',
  description: 'Manage users, roles, and permissions',
  robots: { index: false, follow: false }
}

export default function AdminUsersPage() {
  return (
    <NotificationProvider>
      <AdminAuthGuard>
        <AdminLayout>
          <UserManagement />
        </AdminLayout>
      </AdminAuthGuard>
    </NotificationProvider>
  )
}
