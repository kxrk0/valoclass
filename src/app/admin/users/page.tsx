import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import UserManagement from '@/components/admin/UserManagement'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'

export const metadata: Metadata = {
  title: 'User Management - Admin Dashboard',
  description: 'Manage users, roles, and permissions',
  robots: { index: false, follow: false }
}

export default function AdminUsersPage() {
  return (
    <NotificationProvider>
      <AdminSocketProvider>
        <AdminLayout>
          <UserManagement />
        </AdminLayout>
      </AdminSocketProvider>
    </NotificationProvider>
  )
}
