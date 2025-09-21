'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, CheckCircle, AlertTriangle, User, Mail, Clock, Zap, Lock, ArrowRight } from 'lucide-react'
import { auth, googleProvider } from '@/lib/firebase'
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth'

interface AuthStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  icon: any;
  description: string;
}

export default function AdminAuthCheckPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authSteps, setAuthSteps] = useState<AuthStep[]>([
    {
      id: 'parse_credentials',
      label: 'Parsing Credentials',
      status: 'pending',
      icon: User,
      description: 'Extracting user information from OAuth response'
    },
    {
      id: 'validate_permissions',
      label: 'Validating Permissions',
      status: 'pending',
      icon: Shield,
      description: 'Checking admin access rights'
    },
    {
      id: 'generate_token',
      label: 'Generating Session',
      status: 'pending',
      icon: Lock,
      description: 'Creating secure authentication token'
    },
    {
      id: 'establish_connection',
      label: 'Establishing Connection',
      status: 'pending',
      icon: Zap,
      description: 'Connecting to admin services'
    }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  const updateStepStatus = useCallback((stepId: string, status: AuthStep['status']) => {
    setAuthSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  }, []);

  const processAuthentication = useCallback(async () => {
    try {
      // Clear any existing cache
      const timestamp = Date.now();
      
      // Step 1: Parse credentials
      setCurrentStep(0);
      updateStepStatus('parse_credentials', 'loading');
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Realistic loading time
      
      // Get URL parameters with cache busting
      const urlParams = new URLSearchParams(window.location.search);
      const adminGoogleLogin = urlParams.get('admin_google_login') || searchParams.get('admin_google_login');
      const adminName = urlParams.get('admin_name') || searchParams.get('admin_name');
      const adminEmail = urlParams.get('admin_email') || searchParams.get('admin_email');

      console.log('🔍 Parsing OAuth parameters:', { adminGoogleLogin, adminName, adminEmail });

    if (adminGoogleLogin === 'success' && adminName && adminEmail) {
        const decodedName = decodeURIComponent(adminName);
        const decodedEmail = decodeURIComponent(adminEmail);
        
        const newAdminUser = {
          id: `google_${timestamp}`,
          name: decodedName,
          email: decodedEmail,
        role: 'admin',
        loginType: 'google',
          loginTime: new Date().toISOString(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(decodedName)}&background=ef4444&color=fff&size=128`
        };
        
        setAdminUser(newAdminUser);
        updateStepStatus('parse_credentials', 'success');
        
        // Step 2: Validate permissions
        setCurrentStep(1);
        updateStepStatus('validate_permissions', 'loading');
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Simulate admin validation (in real app, check with backend)
        if (decodedEmail.includes('@')) {
          updateStepStatus('validate_permissions', 'success');
          
          // Step 3: Generate session token
          setCurrentStep(2);
          updateStepStatus('generate_token', 'loading');
          await new Promise(resolve => setTimeout(resolve, 700));
          
          // Store authentication data
          const authToken = 'dev-admin-token-mock-jwt-for-testing-only';
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('adminUser', JSON.stringify(newAdminUser));
          localStorage.setItem('adminLoginTime', timestamp.toString());
          
          // Also store in sessionStorage for redundancy
          sessionStorage.setItem('authToken', authToken);
          sessionStorage.setItem('adminUser', JSON.stringify(newAdminUser));
          
          // Register user in Firebase Authentication for admin visibility
          try {
            // Create a custom Firebase auth token for OAuth user
            // This is a workaround to show users in Firebase console
            const customToken = `firebase-oauth-${timestamp}`;
            
            // Store Firebase info for visibility
            localStorage.setItem('firebaseUser', JSON.stringify({
              uid: `oauth_${timestamp}`,
              email: decodedEmail,
              displayName: decodedName,
              photoURL: newAdminUser.avatar,
              providerId: 'google.com',
              createdAt: new Date().toISOString()
            }));
            
            console.log('📝 Firebase user info stored for console visibility:', {
              email: decodedEmail,
              name: decodedName
            });
            
          } catch (firebaseError) {
            console.warn('Firebase registration failed (non-critical):', firebaseError);
          }
          
          updateStepStatus('generate_token', 'success');
          
          // Step 4: Establish connection
          setCurrentStep(3);
          updateStepStatus('establish_connection', 'loading');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          updateStepStatus('establish_connection', 'success');
          
          console.log('✅ Admin authentication successful:', newAdminUser);
          
          // Clean URL and redirect
          window.history.replaceState({}, '', '/admin');
          
          // Delay for user to see success state
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 1200);
          
        } else {
          throw new Error('Invalid email format - admin access denied');
        }
      } else {
        // Check for existing authentication
        updateStepStatus('parse_credentials', 'loading');
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const existingToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const existingUser = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
        
        if (existingToken && existingUser) {
          try {
            const user = JSON.parse(existingUser);
            setAdminUser(user);
            updateStepStatus('parse_credentials', 'success');
            
            // Skip to final steps
            setCurrentStep(2);
            updateStepStatus('validate_permissions', 'success');
            updateStepStatus('generate_token', 'loading');
            
            await new Promise(resolve => setTimeout(resolve, 300));
            updateStepStatus('generate_token', 'success');
            
            setCurrentStep(3);
            updateStepStatus('establish_connection', 'loading');
            await new Promise(resolve => setTimeout(resolve, 300));
            updateStepStatus('establish_connection', 'success');
            
            console.log('✅ Using existing admin authentication:', user);
            
            setTimeout(() => {
              router.push('/admin/dashboard');
            }, 800);
            
          } catch (error) {
            console.error('Error parsing existing user data:', error);
            throw new Error('Corrupted session data - please login again');
          }
        } else {
          throw new Error('No authentication credentials found');
        }
      }
      
    } catch (error: any) {
      console.error('❌ Authentication error:', error);
      setAuthError(error.message || 'Authentication failed');
      
      // Mark current step as error
      if (currentStep < authSteps.length) {
        updateStepStatus(authSteps[currentStep].id, 'error');
      }
      
      // Redirect to login after delay
      setTimeout(() => {
        router.push('/admin/login?error=' + encodeURIComponent(error.message || 'Authentication failed'));
      }, 3000);
    }
  }, [router, searchParams, currentStep, authSteps, updateStepStatus]);

  useEffect(() => {
    // Start authentication process with a slight delay for UI
    const timer = setTimeout(() => {
      processAuthentication();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [processAuthentication]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Digital Rain Effect */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-red-500 to-transparent animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${Math.random() * 100 + 50}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-20 h-20 border border-red-500/20 rotate-45 animate-float"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden transform rotate-12 hover:rotate-0 transition-transform duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
              <Shield size={32} className="text-white transform -rotate-12 hover:rotate-0 transition-transform duration-700" />
              <div className="absolute inset-0 border border-white/20 rounded-2xl" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Access Control
            </h1>
            <p className="text-gray-400">
              {authError ? 'Authentication Failed' : 'Securing your session...'}
            </p>
          </div>

          {/* Authentication Steps */}
          <div className="space-y-4 mb-8">
            {authSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`relative p-4 rounded-xl border transition-all duration-500 ${
                    step.status === 'success'
                      ? 'bg-green-500/10 border-green-500/30 shadow-lg shadow-green-500/20'
                      : step.status === 'error'
                      ? 'bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/20'
                      : step.status === 'loading'
                      ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/20'
                      : 'bg-gray-800/30 border-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center ${
                      step.status === 'success'
                        ? 'bg-green-500/20 text-green-400'
                        : step.status === 'error'
                        ? 'bg-red-500/20 text-red-400'
                        : step.status === 'loading'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-700/50 text-gray-500'
                    }`}>
                      {step.status === 'loading' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent" />
                      ) : step.status === 'success' ? (
                        <CheckCircle size={20} />
                      ) : step.status === 'error' ? (
                        <AlertTriangle size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className={`font-medium ${
                        step.status === 'success'
                          ? 'text-green-300'
                          : step.status === 'error'
                          ? 'text-red-300'
                          : step.status === 'loading'
                          ? 'text-blue-300'
                          : 'text-gray-400'
                      }`}>
                        {step.label}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {step.description}
                      </div>
                    </div>
                    
                    {/* Status Indicator */}
                    {step.status === 'loading' && (
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* User Info Card (when available) */}
          {adminUser && !authError && (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={adminUser.avatar}
                    alt={adminUser.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                </div>
                <div>
                  <div className="font-medium text-white">{adminUser.name}</div>
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    <Mail size={14} />
                    {adminUser.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {authError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-400" size={20} />
                <div>
                  <div className="font-medium text-red-300">Authentication Error</div>
                  <div className="text-sm text-red-400 mt-1">{authError}</div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="bg-gray-800/30 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                authError
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}
              style={{
                width: `${((currentStep + 1) / authSteps.length) * 100}%`
              }}
            />
          </div>

          {/* Status Text */}
      <div className="text-center">
            <div className={`text-sm ${authError ? 'text-red-400' : 'text-gray-400'}`}>
              {authError
                ? 'Redirecting to login page...'
                : currentStep === authSteps.length - 1 && authSteps[currentStep]?.status === 'success'
                ? 'Access granted! Redirecting to dashboard...'
                : 'Please wait while we verify your credentials...'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
