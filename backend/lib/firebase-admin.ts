import { initializeApp, cert, getApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDK initialization
let app;

try {
  // Check if app already initialized
  if (getApps().length === 0) {
    // For development, we'll use a mock configuration
    // In production, you should use a proper service account key
    if (process.env.NODE_ENV === 'development') {
      app = initializeApp({
        projectId: 'playvalorantguides-665a1',
        // For dev, we'll use mock credentials
      }, 'admin');
    } else {
      // Production configuration with service account
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      app = initializeApp({
        credential: cert(serviceAccount as any),
        projectId: process.env.FIREBASE_PROJECT_ID,
      }, 'admin');
    }
  } else {
    app = getApp('admin');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  // Fallback initialization for development
  app = initializeApp({
    projectId: 'playvalorantguides-665a1',
  }, 'admin');
}

// Export Firebase Admin services
export const adminAuth = app ? getAuth(app) : null;
export const adminFirestore = app ? getFirestore(app) : null;

// Helper functions for user management
export class FirebaseAdminService {
  
  // Create or update user in Firebase Auth
  static async createOrUpdateUser(userData: {
    uid?: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    provider?: string;
  }) {
    if (!adminAuth) {
      console.warn('Firebase Admin Auth not initialized');
      return null;
    }

    try {
      const { uid, email, displayName, photoURL, provider } = userData;
      
      // Check if user exists
      let userRecord;
      try {
        if (uid) {
          userRecord = await adminAuth.getUser(uid);
        } else {
          userRecord = await adminAuth.getUserByEmail(email);
        }
        
        // Update existing user
        userRecord = await adminAuth.updateUser(userRecord.uid, {
          email,
          displayName,
          photoURL,
        });
        
        console.log('✅ Updated existing Firebase user:', userRecord.uid);
        
      } catch (userNotFoundError) {
        // Create new user
        const createUserData: any = {
          email,
          displayName,
          photoURL,
          emailVerified: true, // Auto-verify OAuth users
        };
        
        if (uid) {
          createUserData.uid = uid;
        }
        
        userRecord = await adminAuth.createUser(createUserData);
        console.log('✅ Created new Firebase user:', userRecord.uid);
      }
      
      // Set custom claims for admin users
      if (email.includes('admin') || provider === 'admin') {
        await adminAuth.setCustomUserClaims(userRecord.uid, { 
          admin: true, 
          role: 'admin'
        });
        console.log('👑 Admin claims set for user:', userRecord.uid);
      }
      
      return userRecord;
      
    } catch (error) {
      console.error('Firebase Admin user creation error:', error);
      return null;
    }
  }
  
  // Generate custom token for client-side auth
  static async createCustomToken(uid: string, claims?: object) {
    if (!adminAuth) {
      console.warn('Firebase Admin Auth not initialized');
      return null;
    }

    try {
      const customToken = await adminAuth.createCustomToken(uid, claims);
      console.log('🔑 Custom token created for user:', uid);
      return customToken;
    } catch (error) {
      console.error('Custom token creation error:', error);
      return null;
    }
  }
  
  // List all users (for debugging)
  static async listUsers(maxResults = 100) {
    if (!adminAuth) {
      console.warn('Firebase Admin Auth not initialized');
      return [];
    }

    try {
      const listUsersResult = await adminAuth.listUsers(maxResults);
      console.log(`📋 Listed ${listUsersResult.users.length} Firebase users`);
      return listUsersResult.users;
    } catch (error) {
      console.error('List users error:', error);
      return [];
    }
  }
  
  // Delete user
  static async deleteUser(uid: string) {
    if (!adminAuth) {
      console.warn('Firebase Admin Auth not initialized');
      return false;
    }

    try {
      await adminAuth.deleteUser(uid);
      console.log('🗑️ Deleted Firebase user:', uid);
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  }
}

export default app;
