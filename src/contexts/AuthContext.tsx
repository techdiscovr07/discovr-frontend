import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
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
    signUp: (email: string, password: string, name: string, role: 'admin' | 'brand_owner' | 'brand_emp' | 'creator') => Promise<void>;
    signIn: (email: string, password: string, role?: 'admin' | 'brand_owner' | 'brand_emp' | 'creator') => Promise<void>;
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
        // Set a timeout to ensure loading doesn't hang forever
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn('Auth state check timed out. Setting loading to false.');
                setLoading(false);
            }
        }, 5000); // 5 second timeout

        let unsubscribe: (() => void) | null = null;

        try {
            unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                clearTimeout(timeoutId);
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
            clearTimeout(timeoutId);
            setLoading(false);
        }

        return () => {
            clearTimeout(timeoutId);
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const signUp = async (email: string, password: string, name: string, role: 'admin' | 'brand_owner' | 'brand_emp' | 'creator') => {
        // 1. Signup via backend (creates Firebase user and MongoDB record)
        const response = await signupToBackend(email, password, name, role);

        // 2. If backend returned ID token, sign in with it
        if (response.id_token) {
            // Backend already created the user, we need to sign in
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } else {
            // Fallback: create Firebase user directly if backend didn't return token
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await loginToBackend(role);
            setUser(userCredential.user);
        }

        // 3. Update profile state
        await refreshProfile();
    };

    const signIn = async (email: string, password: string, role: 'admin' | 'brand_owner' | 'brand_emp' | 'creator' = 'creator') => {
        // 1. Sign in with Firebase
        let userCredential;
        try {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error('Firebase Auth Error:', error);
            throw error; // Let formatFirebaseError handle this
        }

        // 2. Sync with backend
        try {
            await loginToBackend(role);
            await refreshProfile();
        } catch (error: any) {
            console.error('Backend Sync Error:', error);
            // We don't throw here to avoid blocking login if it's just a profile fetch issue
            // But we should at least have logged in once.
            // If loginToBackend failed, we might want to know.
            if (error.message && (error.message.includes('fetch') || error.message.includes('Network'))) {
                throw new Error('Could not connect to Discovr server. Please try again.');
            }
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
