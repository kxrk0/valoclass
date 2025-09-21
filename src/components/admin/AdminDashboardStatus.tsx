'use client';

/**
 * 🎛️ Admin Dashboard Durumu Bileşeni
 * 
 * Bu bileşen geliştirilmiş AdminSocketContext'in tüm özelliklerini
 * görsel olarak sergilemek için tasarlanmıştır.
 */

import React, { useEffect, useState } from 'react';
import { useAdminSocket } from '@/contexts/AdminSocketContext';
import { useAdminAnimations, useAnimationPreset } from '@/hooks/useAdminAnimations';

interface AdminDashboardStatusProps {
  className?: string;
}

const AdminDashboardStatus: React.FC<AdminDashboardStatusProps> = ({ 
  className = '' 
}) => {
  // Context hooks
  const {
    connected,
    connecting,
    stats,
    performance,
    connectionHistory,
    animations,
    visualEffects,
    soundEnabled,
    activityHeatmap,
    liveUsers,
    activeAdmins,
    warnings,
    criticalAlerts,
    toggleAnimations,
    toggleSounds,
    triggerPulse,
    requestPerformanceReport,
    exportActivityData,
    broadcastAdminMessage
  } = useAdminSocket();

  // Animation hooks
  const {
    getConnectionStatusClass,
    getPingQualityClass,
    getHealthStatusClass,
    triggerAnimation,
    animationRef,
    animationsEnabled
  } = useAdminAnimations();

  // Animation presets
  const triggerConnectionSuccess = useAnimationPreset('connectionSuccess');
  const triggerCriticalAlert = useAnimationPreset('criticalAlert');
  const triggerNewNotification = useAnimationPreset('newNotification');

  // Local state
  const [showDetails, setShowDetails] = useState(false);
  const [lastPing, setLastPing] = useState<number>(0);

  // Ping değişimini izle ve animasyon tetikle
  useEffect(() => {
    if (performance?.ping && performance.ping !== lastPing) {
      setLastPing(performance.ping);
      if (performance.ping > 200) {
        triggerAnimation('shake', { duration: 1000 });
      } else if (performance.ping < 50) {
        triggerAnimation('glow', { duration: 800 });
      }
    }
  }, [performance?.ping, lastPing, triggerAnimation]);

  // Kritik uyarılar için animasyon
  useEffect(() => {
    if (criticalAlerts > 0) {
      triggerCriticalAlert();
    }
  }, [criticalAlerts, triggerCriticalAlert]);

  // Yeni kullanıcı bildirimleri
  useEffect(() => {
    if (liveUsers > 0) {
      triggerNewNotification();
    }
  }, [liveUsers, triggerNewNotification]);

  return (
    <div 
      ref={animationRef}
      className={`admin-dashboard-status ${className}`}
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(78, 205, 196, 0.1))',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: '12px',
        fontFamily: 'monospace',
        color: '#fff'
      }}
    >
      {/* 📡 Ana durum başlığı */}
      <div style={{ marginBottom: '20px' }}>
        <h2 
          className={`admin-interactive ${getConnectionStatusClass()}`}
          style={{ 
            fontSize: '1.5em', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onClick={() => triggerPulse()}
        >
          🎛️ Admin Dashboard - Gelişmiş Durum Paneli
        </h2>
      </div>

      {/* 🔌 Bağlantı Durumu Kartı */}
      <div className="admin-dashboard-card" style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className={getConnectionStatusClass()}>
              {connected ? '🟢 Bağlı' : connecting ? '🟡 Bağlanıyor' : '🔴 Bağlı Değil'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="admin-interactive"
              onClick={toggleAnimations}
              style={{
                padding: '5px 10px',
                background: visualEffects ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.5)',
                borderRadius: '5px',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              {visualEffects ? '🎨 Animasyonlar Açık' : '🎨 Animasyonlar Kapalı'}
            </button>
            <button
              className="admin-interactive"
              onClick={toggleSounds}
              style={{
                padding: '5px 10px',
                background: soundEnabled ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.5)',
                borderRadius: '5px',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              {soundEnabled ? '🔊 Sesler Açık' : '🔇 Sesler Kapalı'}
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Performans Metrikleri */}
      {performance && (
        <div className="admin-dashboard-card" style={{ marginBottom: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>📊 Performans Metrikleri</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            <div>
              <div className={getPingQualityClass(performance.ping)}>
                📡 Ping: {performance.ping}ms
              </div>
              <div className="admin-loading-bar" style={{ marginTop: '5px' }}>
                <div 
                  className="admin-loading-bar-fill"
                  style={{ width: `${Math.min(100, (300 - performance.ping) / 3)}%` }}
                />
              </div>
            </div>
            <div>
              <div>⏱️ Uptime: {performance.uptime}s</div>
            </div>
            <div>
              <div>📦 Paketler: ↓{performance.packetsReceived} ↑{performance.packetsSent}</div>
            </div>
            <div>
              <div className={getPingQualityClass()}>
                🌐 Kalite: {performance.connectionQuality}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📈 İstatistikler */}
      {stats && (
        <div className="admin-dashboard-card" style={{ marginBottom: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>📈 Sistem İstatistikleri</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <div>👥 Toplam Kullanıcı: {stats.totalUsers}</div>
              <div>🎯 Toplam Crosshair: {stats.totalCrosshairs}</div>
              <div>🗺️ Toplam Lineup: {stats.totalLineups}</div>
            </div>
            <div>
              <div style={{ color: '#00ff88' }}>🟢 Aktif Kullanıcı: {stats.activeUsers}</div>
              <div>👨‍💼 Online Admin: {stats.onlineAdmins}</div>
              <div style={{ color: liveUsers > 10 ? '#00ff88' : '#ffe66d' }}>
                📍 Canlı Kullanıcı: {liveUsers}
              </div>
            </div>
            <div>
              <div style={{ color: criticalAlerts > 0 ? '#ff6b6b' : '#00ff88' }}>
                🚨 Bekleyen Rapor: {stats.pendingReports}
              </div>
              <div style={{ color: warnings.length > 0 ? '#ffe66d' : '#00ff88' }}>
                ⚠️ Uyarılar: {warnings.length}
              </div>
              <div style={{ color: criticalAlerts > 0 ? '#ff6b6b' : '#00ff88' }}>
                🔴 Kritik Uyarı: {criticalAlerts}
              </div>
            </div>
          </div>

          {/* Sistem Sağlığı */}
          {stats.systemHealth && (
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>🌡️ Sistem Sağlığı</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {Object.entries(stats.systemHealth).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>{key.toUpperCase()}</span>
                      <span className={getHealthStatusClass(value)}>{value}%</span>
                    </div>
                    <div className="admin-health-bar">
                      <div 
                        className={`admin-health-bar-fill ${getHealthStatusClass(value)}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🗺️ Aktivite Haritası */}
      {Object.keys(activityHeatmap).length > 0 && (
        <div className="admin-dashboard-card" style={{ marginBottom: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>🌍 Aktivite Haritası</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(activityHeatmap).map(([region, data]) => (
              <div 
                key={region}
                className="admin-map-point admin-interactive"
                style={{
                  padding: '8px 12px',
                  background: data.color,
                  borderRadius: '20px',
                  fontSize: '0.9em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>📍</span>
                <span>{region}</span>
                <span style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '2px 6px', 
                  borderRadius: '10px',
                  fontSize: '0.8em'
                }}>
                  {data.users}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 👨‍💼 Aktif Adminler */}
      {activeAdmins.length > 0 && (
        <div className="admin-dashboard-card" style={{ marginBottom: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>👨‍💼 Aktif Adminler</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {activeAdmins.map((admin, index) => (
              <div 
                key={admin}
                className="admin-interactive"
                style={{
                  padding: '5px 10px',
                  background: 'rgba(0, 255, 136, 0.2)',
                  border: '1px solid rgba(0, 255, 136, 0.5)',
                  borderRadius: '15px',
                  fontSize: '0.9em',
                  animation: `adminFade ${2 + index * 0.5}s infinite`
                }}
              >
                👤 {admin}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⚠️ Uyarılar */}
      {warnings.length > 0 && (
        <div className="admin-dashboard-card admin-critical-alert" style={{ marginBottom: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>⚠️ Sistem Uyarıları</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {warnings.map((warning, index) => (
              <div 
                key={index}
                style={{
                  padding: '8px',
                  background: 'rgba(255, 235, 59, 0.2)',
                  border: '1px solid rgba(255, 235, 59, 0.5)',
                  borderRadius: '5px',
                  fontSize: '0.9em'
                }}
              >
                ⚠️ {warning}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎛️ Kontrol Paneli */}
      <div className="admin-dashboard-card">
        <h3 style={{ margin: '0 0 15px 0' }}>🎛️ Gelişmiş Kontroller</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          <button
            className="admin-interactive"
            onClick={() => triggerAnimation('pulse', { duration: 1500 })}
            style={{
              padding: '10px',
              background: 'rgba(0, 255, 136, 0.2)',
              border: '1px solid rgba(0, 255, 136, 0.5)',
              borderRadius: '5px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            💓 Pulse Animasyonu
          </button>
          <button
            className="admin-interactive"
            onClick={() => triggerAnimation('glow', { duration: 2000 })}
            style={{
              padding: '10px',
              background: 'rgba(78, 205, 196, 0.2)',
              border: '1px solid rgba(78, 205, 196, 0.5)',
              borderRadius: '5px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            ✨ Glow Efekti
          </button>
          <button
            className="admin-interactive"
            onClick={requestPerformanceReport}
            style={{
              padding: '10px',
              background: 'rgba(116, 192, 252, 0.2)',
              border: '1px solid rgba(116, 192, 252, 0.5)',
              borderRadius: '5px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            📊 Performans Raporu
          </button>
          <button
            className="admin-interactive"
            onClick={exportActivityData}
            style={{
              padding: '10px',
              background: 'rgba(255, 235, 59, 0.2)',
              border: '1px solid rgba(255, 235, 59, 0.5)',
              borderRadius: '5px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            💾 Veri Export
          </button>
        </div>
      </div>

      {/* 🎨 Aktif Animasyonlar Göstergesi */}
      {Object.keys(animations).some(key => animations[key as keyof typeof animations]) && (
        <div style={{ 
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '10px',
          borderRadius: '10px',
          fontSize: '0.8em',
          zIndex: 1000
        }}>
          <div style={{ marginBottom: '5px', color: '#00ff88' }}>🎨 Aktif Animasyonlar:</div>
          {Object.entries(animations).map(([key, value]) => 
            value && (
              <div key={key} style={{ color: '#fff' }}>
                • {key}
              </div>
            )
          )}
        </div>
      )}

      {/* CSS Import */}
      <style jsx>{`
        .admin-dashboard-status {
          transition: all 0.3s ease;
        }
        
        .admin-interactive {
          transition: all 0.2s ease;
        }
        
        .admin-interactive:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .admin-loading-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .admin-loading-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff88, #4ecdc4);
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        
        .admin-health-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .admin-health-bar-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 4px;
        }
        
        @keyframes adminFade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardStatus;
