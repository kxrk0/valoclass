'use client'

import { usePathname } from 'next/navigation'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname()
  
  // Login sayfasında AdminAuthGuard ve AdminSocketProvider'ı bypass et
  if (pathname === '/admin/login') {
    return <>{children}</>
  }
  
  // Diğer admin sayfalarında normal flow
  return (
    <AdminSocketProvider>
      <AdminAuthGuard>
        {children}
      </AdminAuthGuard>
    </AdminSocketProvider>
  )
}
