'use client'

import React from 'react';
import { Shield, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  overlay?: boolean;
  type?: 'default' | 'valorant' | 'admin';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  overlay = false,
  type = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const getSpinnerContent = () => {
    switch (type) {
      case 'valorant':
        return (
          <div className="relative">
            {/* Outer ring */}
            <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-700 border-t-[#FF4654] border-r-[#FF6B7A] animate-spin`}></div>
            {/* Inner glow ring */}
            <div className={`absolute inset-2 rounded-full border-2 border-gray-600 border-b-[#FF8A9B] animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={iconSizes[size] / 2} className="text-[#FF6B7A] animate-pulse" />
            </div>
          </div>
        );
      
      case 'admin':
        return (
          <div className="relative">
            {/* Main spinning ring */}
            <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-700/30 border-t-gradient-to-r border-t-blue-500 border-r-purple-500 animate-spin`}></div>
            {/* Second ring */}
            <div className={`absolute inset-1 rounded-full border-2 border-gray-600/20 border-b-green-400 animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
            {/* Third inner ring */}
            <div className={`absolute inset-3 rounded-full border border-gray-500/20 border-l-[#FF6B7A] animate-spin`} style={{ animationDuration: '3s' }}></div>
            {/* Center shield icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-2">
                <Shield size={iconSizes[size] / 3} className="text-white animate-pulse" />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin`}></div>
            <div className={`absolute inset-2 rounded-full border-2 border-gray-200 border-b-blue-400 animate-spin`} style={{ animationDirection: 'reverse' }}></div>
          </div>
        );
    }
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-4 ${overlay ? 'text-white' : 'text-gray-700'}`}>
      {getSpinnerContent()}
      
      {message && (
        <div className="text-center space-y-2">
          <div className={`font-medium ${textSizes[size]} ${overlay ? 'text-white' : 'text-gray-800'}`}>
            {message}
          </div>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div 
          className="bg-gradient-to-br from-[#1A1D2E]/95 via-[#242738]/95 to-[#2A2D47]/95 p-8 rounded-2xl border border-gray-600/50 shadow-2xl backdrop-blur-xl"
          style={{
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 100px rgba(59,130,246,0.1)'
          }}
        >
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// Specialized loading components
export const ValorantLoader: React.FC<Omit<LoadingSpinnerProps, 'type'>> = (props) => (
  <LoadingSpinner {...props} type="valorant" />
);

export const AdminLoader: React.FC<Omit<LoadingSpinnerProps, 'type'>> = (props) => (
  <LoadingSpinner {...props} type="admin" />
);

// Full-screen loading overlay
export const LoadingOverlay: React.FC<{
  message?: string;
  type?: 'default' | 'valorant' | 'admin';
}> = ({ message = 'Loading...', type = 'admin' }) => (
  <LoadingSpinner size="lg" message={message} overlay type={type} />
);

export default LoadingSpinner;
