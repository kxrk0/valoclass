/**
 * 🎨 Admin Animasyonları Hook'u
 * 
 * Bu hook, admin panelindeki animasyonları kolayca yönetmek için kullanılır.
 * AdminSocketContext ile entegre çalışarak animasyon durumlarını senkronize eder.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAdminSocket } from '@/contexts/AdminSocketContext';

// Animasyon türleri
export type AnimationType = 
  | 'pulse' 
  | 'glow' 
  | 'bounce' 
  | 'rotate' 
  | 'shake' 
  | 'fade' 
  | 'wave' 
  | 'sparkle' 
  | 'zoomIn' 
  | 'zoomOut'
  | 'loadingBar';

// Animasyon konfigürasyonu
interface AnimationConfig {
  duration?: number;
  delay?: number;
  repeat?: boolean | number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

// Hook'un döndüreceği değerler
interface UseAdminAnimationsReturn {
  // Animasyon durumları
  activeAnimations: Set<AnimationType>;
  isAnimating: boolean;
  animationsEnabled: boolean;
  
  // Animasyon kontrol fonksiyonları
  triggerAnimation: (type: AnimationType, config?: AnimationConfig) => void;
  stopAnimation: (type: AnimationType) => void;
  stopAllAnimations: () => void;
  
  // CSS sınıfı yardımcıları
  getAnimationClass: (type: AnimationType) => string;
  getAnimationClasses: (types: AnimationType[]) => string;
  
  // Durumsal animasyon sınıfları
  getConnectionStatusClass: () => string;
  getPingQualityClass: (ping?: number) => string;
  getHealthStatusClass: (percentage: number) => string;
  
  // Ref yardımcısı
  animationRef: React.RefObject<HTMLElement>;
  
  // Animasyon event listeners
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
}

export const useAdminAnimations = (): UseAdminAnimationsReturn => {
  // AdminSocket context'inden animasyon ayarlarını al
  const { 
    animations, 
    visualEffects, 
    connected, 
    connecting, 
    performance,
    triggerPulse 
  } = useAdminSocket();
  
  // Local state
  const [activeAnimations, setActiveAnimations] = useState<Set<AnimationType>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs
  const animationRef = useRef<HTMLElement>(null);
  const timeoutsRef = useRef<Map<AnimationType, NodeJS.Timeout>>(new Map());
  const animationCountRef = useRef(0);
  
  // Animasyon tetikleme fonksiyonu
  const triggerAnimation = useCallback((
    type: AnimationType, 
    config: AnimationConfig = {}
  ) => {
    if (!visualEffects) return;
    
    const {
      duration = 2000,
      delay = 0,
      repeat = false,
      easing = 'ease-in-out'
    } = config;
    
    // Mevcut animasyonu durdur
    const existingTimeout = timeoutsRef.current.get(type);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Animasyonu başlat
    setTimeout(() => {
      setActiveAnimations(prev => {
        const newSet = new Set(prev);
        newSet.add(type);
        return newSet;
      });
      
      setIsAnimating(true);
      animationCountRef.current += 1;
      
      // Element'e CSS sınıfı ekle
      if (animationRef.current) {
        const className = `admin-${type}`;
        animationRef.current.classList.add(className);
        
        // CSS değişkenlerini ayarla
        animationRef.current.style.setProperty('--animation-duration', `${duration}ms`);
        animationRef.current.style.setProperty('--animation-timing', easing);
      }
      
      // Animasyonu sonlandır
      const timeout = setTimeout(() => {
        setActiveAnimations(prev => {
          const newSet = new Set(prev);
          newSet.delete(type);
          return newSet;
        });
        
        animationCountRef.current -= 1;
        if (animationCountRef.current === 0) {
          setIsAnimating(false);
        }
        
        // CSS sınıfını kaldır
        if (animationRef.current) {
          const className = `admin-${type}`;
          animationRef.current.classList.remove(className);
        }
        
        // Tekrar et (eğer belirtilmişse)
        if (repeat === true) {
          triggerAnimation(type, config);
        } else if (typeof repeat === 'number' && repeat > 1) {
          triggerAnimation(type, { ...config, repeat: repeat - 1 });
        }
        
        timeoutsRef.current.delete(type);
      }, duration);
      
      timeoutsRef.current.set(type, timeout);
    }, delay);
  }, [visualEffects]);
  
  // Animasyonu durdurma
  const stopAnimation = useCallback((type: AnimationType) => {
    const timeout = timeoutsRef.current.get(type);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(type);
    }
    
    setActiveAnimations(prev => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
    
    if (animationRef.current) {
      const className = `admin-${type}`;
      animationRef.current.classList.remove(className);
    }
  }, []);
  
  // Tüm animasyonları durdur
  const stopAllAnimations = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => {
      clearTimeout(timeout);
    });
    timeoutsRef.current.clear();
    
    setActiveAnimations(new Set());
    setIsAnimating(false);
    animationCountRef.current = 0;
    
    if (animationRef.current) {
      const element = animationRef.current;
      const classes = Array.from(element.classList);
      classes.forEach(className => {
        if (className.startsWith('admin-')) {
          element.classList.remove(className);
        }
      });
    }
  }, []);
  
  // CSS sınıfı yardımcıları
  const getAnimationClass = useCallback((type: AnimationType): string => {
    return `admin-${type}`;
  }, []);
  
  const getAnimationClasses = useCallback((types: AnimationType[]): string => {
    return types.map(type => `admin-${type}`).join(' ');
  }, []);
  
  // Bağlantı durumu sınıfı
  const getConnectionStatusClass = useCallback((): string => {
    if (connected) return 'admin-status-connected';
    if (connecting) return 'admin-status-connecting';
    return 'admin-status-disconnected';
  }, [connected, connecting]);
  
  // Ping kalitesi sınıfı
  const getPingQualityClass = useCallback((ping?: number): string => {
    const actualPing = ping || performance?.ping || 0;
    
    if (actualPing < 50) return 'admin-ping-excellent';
    if (actualPing < 100) return 'admin-ping-good';
    if (actualPing < 200) return 'admin-ping-poor';
    return 'admin-ping-critical';
  }, [performance?.ping]);
  
  // Sistem sağlığı sınıfı
  const getHealthStatusClass = useCallback((percentage: number): string => {
    if (percentage <= 70) return 'admin-health-good';
    if (percentage <= 85) return 'admin-health-warning';
    return 'admin-health-critical';
  }, []);
  
  // Event handlers
  const onAnimationStart = useCallback(() => {
    console.log('🎨 Animation started');
  }, []);
  
  const onAnimationEnd = useCallback(() => {
    console.log('🎨 Animation ended');
  }, []);
  
  // AdminSocket animasyon durumlarını dinle
  useEffect(() => {
    if (!animations) return;
    
    Object.entries(animations).forEach(([animationType, isActive]) => {
      if (isActive && !activeAnimations.has(animationType as AnimationType)) {
        triggerAnimation(animationType as AnimationType);
      }
    });
  }, [animations, activeAnimations, triggerAnimation]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      stopAllAnimations();
    };
  }, [stopAllAnimations]);
  
  // CSS dosyasını import et
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles/admin-animations.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  return {
    // Animasyon durumları
    activeAnimations,
    isAnimating,
    animationsEnabled: visualEffects,
    
    // Kontrol fonksiyonları
    triggerAnimation,
    stopAnimation,
    stopAllAnimations,
    
    // CSS yardımcıları
    getAnimationClass,
    getAnimationClasses,
    
    // Durumsal sınıflar
    getConnectionStatusClass,
    getPingQualityClass,
    getHealthStatusClass,
    
    // Ref
    animationRef,
    
    // Event handlers
    onAnimationStart,
    onAnimationEnd
  };
};

// Hazır animasyon presetleri
export const AdminAnimationPresets = {
  // Bağlantı başarılı
  connectionSuccess: {
    sequence: ['bounce', 'glow'] as AnimationType[],
    duration: 1500
  },
  
  // Bağlantı hatası
  connectionError: {
    sequence: ['shake', 'fade'] as AnimationType[],
    duration: 2000
  },
  
  // Yeni bildirim
  newNotification: {
    sequence: ['pulse', 'sparkle'] as AnimationType[],
    duration: 1000
  },
  
  // Kritik uyarı
  criticalAlert: {
    sequence: ['shake', 'glow'] as AnimationType[],
    duration: 3000,
    repeat: 2
  },
  
  // Yükleniyor
  loading: {
    sequence: ['rotate'] as AnimationType[],
    duration: Infinity,
    repeat: true
  },
  
  // Başarı
  success: {
    sequence: ['bounce', 'sparkle'] as AnimationType[],
    duration: 2000
  },
  
  // Hata
  error: {
    sequence: ['shake', 'fade'] as AnimationType[],
    duration: 2500
  }
};

// Preset kullanım yardımcı fonksiyonu
export const useAnimationPreset = (presetName: keyof typeof AdminAnimationPresets) => {
  const { triggerAnimation } = useAdminAnimations();
  
  return useCallback(() => {
    const preset = AdminAnimationPresets[presetName];
    
    preset.sequence.forEach((animationType, index) => {
      setTimeout(() => {
        triggerAnimation(animationType, {
          duration: typeof preset.duration === 'number' ? preset.duration / preset.sequence.length : 1000,
          repeat: preset.repeat
        });
      }, index * 200); // 200ms delay between animations
    });
  }, [triggerAnimation, presetName]);
};

export default useAdminAnimations;
