/**
 * Formats Firebase authentication errors into user-friendly messages
 */
export function formatFirebaseError(error: any): string {
    if (!error) {
        return 'An unexpected error occurred. Please try again.';
    }

    const errorMessage = error.message || error.toString() || '';
    const errorCode = error.code || '';

    // Handle Firebase error codes
    if (errorCode.includes('auth/invalid-credential') || errorMessage.includes('auth/invalid-credential')) {
        return 'Invalid email or password. Please check your credentials and try again.';
    }

    if (errorCode.includes('auth/user-not-found') || errorMessage.includes('auth/user-not-found')) {
        return 'No account found with this email address. Please sign up first.';
    }

    if (errorCode.includes('auth/wrong-password') || errorMessage.includes('auth/wrong-password')) {
        return 'Incorrect password. Please try again or reset your password.';
    }

    if (errorCode.includes('auth/email-already-in-use') || errorMessage.includes('auth/email-already-in-use')) {
        return 'An account with this email already exists. Please sign in instead.';
    }

    if (errorCode.includes('auth/weak-password') || errorMessage.includes('auth/weak-password')) {
        return 'Password is too weak. Please use at least 6 characters.';
    }

    if (errorCode.includes('auth/invalid-email') || errorMessage.includes('auth/invalid-email')) {
        return 'Invalid email address. Please check and try again.';
    }

    if (errorCode.includes('auth/too-many-requests') || errorMessage.includes('auth/too-many-requests')) {
        return 'Too many failed attempts. Please try again later.';
    }

    if (errorCode.includes('auth/network-request-failed') || errorMessage.includes('network')) {
        return 'Network error. Please check your connection and try again.';
    }

    // Remove "Firebase: Error" prefix if present
    let formattedMessage = errorMessage;
    if (formattedMessage.includes('Firebase: Error')) {
        formattedMessage = formattedMessage.replace(/Firebase:\s*Error\s*\([^)]+\)/g, '').trim();
    }

    // If message is still empty or just contains error code, use generic message
    if (!formattedMessage || formattedMessage.length < 10) {
        return 'Login failed. Please check your credentials and try again.';
    }

    return formattedMessage;
}
