import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { loginToBackend, getUserProfile, signupToBackend } from '../lib/api';

interface AuthContextType {
    user: User | null;
    profile: any | null;
    loading: boolean;
    signUp: (email: string, password: string, name: string, role: 'brand_owner' | 'brand_emp' | 'creator') => Promise<void>;
    signIn: (email: string, password: string, role?: 'brand_owner' | 'brand_emp' | 'creator') => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        try {
            if (!auth.currentUser) {
                setProfile(null);
                return;
            }
            const profileData = await getUserProfile();
            setProfile(profileData);
        } catch (error: any) {
            console.error('Failed to fetch profile:', error);
            // Don't set profile to null if it's just a 401 (user not logged in)
            // This prevents clearing profile on temporary network issues
            if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
                // User might not be fully authenticated yet, keep existing profile or set to null
                setProfile(null);
            } else {
                // For other errors, keep existing profile if available
                // This prevents clearing profile on temporary errors
            }
        }
    };

    useEffect(() => {
        // Safety timeout: ensure loading never sticks (e.g. backend down or getUserProfile hangs)
        const safetyTimeoutId = setTimeout(() => {
            setLoading((prev) => {
                if (prev) {
                    console.warn('Auth state check timed out. Proceeding without profile.');
                    return false;
                }
                return prev;
            });
        }, 8000);

        let unsubscribe: (() => void) | null = null;

        try {
            unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                setUser(firebaseUser);
                if (firebaseUser) {
                    try {
                        const profileData = await getUserProfile();
                        setProfile(profileData);
                    } catch (error) {
                        console.error('Failed to refresh profile on auth state change:', error);
                        setProfile(null);
                    }
                } else {
                    setProfile(null);
                }
                setLoading(false);
            });
        } catch (error) {
            console.error('Failed to set up auth state listener:', error);
            setLoading(false);
        }

        return () => {
            clearTimeout(safetyTimeoutId);
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const signUp = async (email: string, password: string, name: string, role: 'brand_owner' | 'brand_emp' | 'creator') => {
        // 1. Signup via backend (creates Firebase user and MongoDB record)
        await signupToBackend(email, password, name, role);

        // 2. Backend already created the Firebase user — sign in on the client to set auth state
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);

        // 3. Sync role with backend and load profile
        try {
            await loginToBackend(role, name);
        } catch (e) {
            console.warn('Login to backend after signup:', e);
        }
        await refreshProfile();
    };

    const signIn = async (email: string, password: string, role: 'brand_owner' | 'brand_emp' | 'creator' = 'creator') => {
        // 1. Sign in with Firebase
        let userCredential;
        try {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error('Firebase Auth Error:', error);
            throw error; // Let formatFirebaseError handle this
        }

        // 2. Sync with backend (required so profile/role are set)
        try {
            await loginToBackend(role);
            await refreshProfile();
        } catch (error: any) {
            console.error('Backend sync error:', error);
            const msg = error?.message || '';
            if (msg.includes('fetch') || msg.includes('Network') || msg.includes('Failed to fetch')) {
                throw new Error('Could not connect to Discovr server. Is the backend running?');
            }
            if (msg.toLowerCase().includes('token') || msg.toLowerCase().includes('unauthorized') || msg.includes('401')) {
                throw new Error(msg || 'Backend could not verify your account. Check that the backend is using the same Firebase project.');
            }
            throw error;
        }

        setUser(userCredential.user);
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
