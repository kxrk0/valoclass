'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import EnhancedAdminDashboard from '@/components/admin/EnhancedAdminDashboard'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle Google OAuth success
    const adminGoogleLogin = searchParams.get('admin_google_login');
    const adminName = searchParams.get('admin_name');
    const adminEmail = searchParams.get('admin_email');

    if (adminGoogleLogin === 'success' && adminName && adminEmail) {
      // Create a mock admin token for successful Google OAuth
      const adminUser = {
        id: `google_${Date.now()}`,
        name: decodeURIComponent(adminName),
        email: decodeURIComponent(adminEmail),
        role: 'admin',
        loginType: 'google',
        loginTime: new Date().toISOString()
      };

      // Store admin token and user info
      localStorage.setItem('authToken', `admin_${Date.now()}_${adminUser.id}`);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));

      // Clean URL parameters
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('admin_google_login');
      cleanUrl.searchParams.delete('admin_name');
      cleanUrl.searchParams.delete('admin_email');
      window.history.replaceState({}, '', cleanUrl.toString());

      console.log('✅ Admin Google OAuth login successful:', adminUser);
      return; // Don't redirect to login, stay on admin dashboard
    }

    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
  }, [router, searchParams]);

  return (
    <NotificationProvider>
      <AdminSocketProvider>
        <AdminLayout>
          <EnhancedAdminDashboard />
        </AdminLayout>
      </AdminSocketProvider>
    </NotificationProvider>
  )
}
