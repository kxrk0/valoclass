import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import SystemSettings from '@/components/admin/SystemSettings'

export const metadata: Metadata = {
  title: 'Settings - Admin Dashboard',
  description: 'Configure platform settings and preferences',
  robots: { index: false, follow: false }
}

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <SystemSettings />
    </AdminLayout>
  )
}