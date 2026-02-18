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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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

        return unsubscribe;
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // 2. Sync with backend
        // Backend will use existing user's role if they exist, or create new user with provided role
        await loginToBackend(role);

        // 3. Update profile state
        await refreshProfile();

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
