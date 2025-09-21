'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import EnhancedAdminDashboard from '@/components/admin/EnhancedAdminDashboard'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import { NotificationProvider } from '@/contexts/NotificationContext'

export default function AdminDashboardPage() {
  return (
    <NotificationProvider>
      <AdminAuthGuard>
        <AdminLayout>
          <EnhancedAdminDashboard />
        </AdminLayout>
      </AdminAuthGuard>
    </NotificationProvider>
  )
}
