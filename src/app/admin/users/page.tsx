import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import UserManagement from '@/components/admin/UserManagement'

export const metadata: Metadata = {
  title: 'User Management - Admin Dashboard',
  description: 'Manage users, roles, and permissions',
  robots: { index: false, follow: false }
}

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  )
}
