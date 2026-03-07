import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase config
const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
);

if (missingVars.length > 0 && import.meta.env.DEV) {
    console.error('Missing Firebase environment variables:', missingVars);
    console.error('Please create a .env file with the required Firebase configuration.');
}

// Initialize Firebase (singleton pattern)
let app!: FirebaseApp;
let auth!: Auth;
let analytics: Analytics | null = null;

try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    // Analytics only in browser and when supported (e.g. not in SSR)
    if (typeof window !== 'undefined') {
        isSupported().then((yes) => {
            if (yes) analytics = getAnalytics(app);
        });
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
    // In development, show a helpful error message
    if (import.meta.env.DEV) {
        console.error('Firebase failed to initialize. Check your .env file and Firebase configuration.');
    }
    // throw error; // Don't throw to prevent crashing the whole app load
}

export { app, auth, analytics };
