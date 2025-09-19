import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut as firebaseSignOut,
  User,
  UserCredential 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export interface GoogleUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export class GoogleAuthService {
  /**
   * Sign in with Google using popup
   */
  static async signInWithPopup(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google popup login successful:', {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName
      });
      return result;
    } catch (error: any) {
      console.error('❌ Google popup login failed:', error);
      throw new Error(`Google login failed: ${error.message}`);
    }
  }

  /**
   * Sign in with Google using redirect (better for mobile)
   */
  static async signInWithRedirect(): Promise<void> {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error('❌ Google redirect login failed:', error);
      throw new Error(`Google redirect login failed: ${error.message}`);
    }
  }

  /**
   * Get redirect result after page loads
   */
  static async getRedirectResult(): Promise<UserCredential | null> {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('✅ Google redirect login successful:', {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName
        });
      }
      return result;
    } catch (error: any) {
      console.error('❌ Google redirect result failed:', error);
      throw new Error(`Google redirect result failed: ${error.message}`);
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      console.log('✅ User signed out successfully');
    } catch (error: any) {
      console.error('❌ Sign out failed:', error);
      throw new Error(`Sign out failed: ${error.message}`);
    }
  }

  /**
   * Convert Firebase User to our GoogleUser format
   */
  static formatUser(user: User): GoogleUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
  }

  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
}
