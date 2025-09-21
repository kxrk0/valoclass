/**
 * 🚫 Global Notification Debouncing Hook
 * 
 * Tüm component'ler için duplicate notification'ları engelleyen hook.
 * AdminSocketContext'teki debouncing sisteminin global versiyonu.
 */

import { useCallback, useRef } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationOptions {
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Global debounce storage - tüm hook instance'ları arasında paylaşılır
const globalNotificationHistory = new Map<string, number>();
const globalTimeouts = new Map<string, NodeJS.Timeout>();

const DEBOUNCE_TIME = 3000; // 3 saniye

export const useNotificationSafe = () => {
  const { success, error: originalError, warning: originalWarning, info } = useNotifications();
  
  // 🚫 Safe Error function
  const errorSafe = useCallback((title: string, message: string) => {
    const errorKey = `error:${title}:${message}`;
    const now = Date.now();
    const lastShown = globalNotificationHistory.get(errorKey);
    
    // Eğer aynı hata son 3 saniye içinde gösterildiyse, engelle
    if (lastShown && (now - lastShown) < DEBOUNCE_TIME) {
      console.log(`🚫 Duplicate error blocked: "${title} - ${message}"`);
      return;
    }
    
    // Mevcut timeout'u temizle
    const existingTimeout = globalTimeouts.get(errorKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Hatayı göster ve kaydet
    globalNotificationHistory.set(errorKey, now);
    originalError(title, message);
    
    // Debounce timeout'u ayarla
    const timeout = setTimeout(() => {
      globalNotificationHistory.delete(errorKey);
      globalTimeouts.delete(errorKey);
    }, DEBOUNCE_TIME);
    
    globalTimeouts.set(errorKey, timeout);
  }, [originalError]);
  
  // 🚫 Safe Warning function
  const warningSafe = useCallback((title: string, message: string, options?: NotificationOptions) => {
    const warningKey = `warning:${title}:${message}`;
    const now = Date.now();
    const lastShown = globalNotificationHistory.get(warningKey);
    
    if (lastShown && (now - lastShown) < DEBOUNCE_TIME) {
      console.log(`🚫 Duplicate warning blocked: "${title} - ${message}"`);
      return;
    }
    
    const existingTimeout = globalTimeouts.get(warningKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    globalNotificationHistory.set(warningKey, now);
    originalWarning(title, message, options);
    
    const timeout = setTimeout(() => {
      globalNotificationHistory.delete(warningKey);
      globalTimeouts.delete(warningKey);
    }, DEBOUNCE_TIME);
    
    globalTimeouts.set(warningKey, timeout);
  }, [originalWarning]);
  
  // 🚫 Safe Success function (daha az önemli ama yine de)
  const successSafe = useCallback((title: string, message: string, options?: NotificationOptions) => {
    const successKey = `success:${title}:${message}`;
    const now = Date.now();
    const lastShown = globalNotificationHistory.get(successKey);
    
    if (lastShown && (now - lastShown) < DEBOUNCE_TIME) {
      console.log(`🚫 Duplicate success blocked: "${title} - ${message}"`);
      return;
    }
    
    const existingTimeout = globalTimeouts.get(successKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    globalNotificationHistory.set(successKey, now);
    success(title, message, options);
    
    const timeout = setTimeout(() => {
      globalNotificationHistory.delete(successKey);
      globalTimeouts.delete(successKey);
    }, DEBOUNCE_TIME);
    
    globalTimeouts.set(successKey, timeout);
  }, [success]);
  
  // 📝 Debug function - aktif notification'ları göster
  const getActiveNotifications = useCallback(() => {
    return Array.from(globalNotificationHistory.entries()).map(([key, timestamp]) => ({
      key,
      timestamp: new Date(timestamp).toISOString(),
      secondsAgo: Math.floor((Date.now() - timestamp) / 1000)
    }));
  }, []);
  
  // 🧹 Manual cleanup function
  const clearNotificationHistory = useCallback(() => {
    globalTimeouts.forEach(timeout => clearTimeout(timeout));
    globalTimeouts.clear();
    globalNotificationHistory.clear();
    console.log('🧹 Notification history cleared manually');
  }, []);
  
  return {
    // Safe notification functions
    success: successSafe,
    error: errorSafe, 
    warning: warningSafe,
    info, // Info genelde duplicate olmaz, doğrudan kullan
    
    // Original functions (emergency use)
    originalError,
    originalWarning,
    
    // Debug utilities
    getActiveNotifications,
    clearNotificationHistory,
    
    // Stats
    getTotalBlocked: () => {
      return Array.from(globalNotificationHistory.keys()).length;
    }
  };
};

// 🧹 Global cleanup function - emergency use
export const clearGlobalNotificationHistory = () => {
  globalTimeouts.forEach(timeout => clearTimeout(timeout));
  globalTimeouts.clear();
  globalNotificationHistory.clear();
  console.log('🧹 Global notification history force-cleared');
};

export default useNotificationSafe;
