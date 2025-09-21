'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import EnhancedAdminDashboard from '@/components/admin/EnhancedAdminDashboard'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'

export default function AdminDashboardPage() {
  return (
    <NotificationProvider>
      <AdminAuthGuard>
        <AdminSocketProvider>
          <AdminLayout>
            <EnhancedAdminDashboard />
          </AdminLayout>
        </AdminSocketProvider>
      </AdminAuthGuard>
    </NotificationProvider>
  )
}
