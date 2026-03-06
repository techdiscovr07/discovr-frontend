import { auth } from './firebase';
import { DEMO_CAMPAIGNS, DEMO_CREATORS, DEMO_BIDS, DEMO_SCRIPTS, DEMO_CONTENT } from './demoData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://discovr-backend.onrender.com';

/**
 * Get current user's Firebase ID token
 */
async function getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }
    return await user.getIdToken();
}

/** Options for the request helper (e.g. skip global 401 sign-out so login can show errors) */
type RequestConfig = { skip401Redirect?: boolean };

/**
 * Base request function that acts as an interceptor
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {},
    config?: RequestConfig
): Promise<T> {
    const token = await getAuthToken();

    const headers: any = {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    // Only set application/json if not FormData and not already set
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    // If Content-Type is explicitly set to undefined, delete it (useful for FormData)
    if (headers['Content-Type'] === undefined) {
        delete headers['Content-Type'];
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Global Error Handling (skip redirect for login so user sees error on page)
        if (response.status === 401) {
            const errorBody = await response.text();
            let errMsg = 'Session expired. Please login again.';
            try {
                const parsed = JSON.parse(errorBody);
                errMsg = parsed.error || parsed.message || errMsg;
            } catch {
                if (errorBody) errMsg = errorBody;
            }
            if (!config?.skip401Redirect) {
                console.warn('Unauthorized request. Possible token expiry.');
                await auth.signOut();
                window.location.href = '/';
            }
            throw new Error(errMsg);
        }

        if (!response.ok) {
            const errorBody = await response.text();
            let errorMessage = `API Error: ${response.status}`;
            try {
                const parsedError = JSON.parse(errorBody);
                errorMessage = parsedError.error || parsedError.message || errorMessage;
            } catch {
                errorMessage = errorBody || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            return await response.json();
        }
        const text = await response.text();
        return (text as unknown as T);
    } catch (error: any) {
        console.error(`Request failed for ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Signup new user (creates Firebase user and MongoDB record)
 */
export async function signupToBackend(email: string, password: string, name: string, role: 'brand_owner' | 'brand_emp' | 'creator') {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Signup failed: ${response.status}`;
        try {
            const parsedError = JSON.parse(errorBody);
            errorMessage = parsedError.error || parsedError.message || errorMessage;
        } catch {
            errorMessage = errorBody || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return await response.json();
}

/**
 * Login to backend (creates user in MongoDB if new).
 * Uses skip401Redirect so login page can show backend errors instead of redirecting.
 */
export async function loginToBackend(role: 'brand_owner' | 'brand_emp' | 'creator', name?: string) {
    return request(
        '/auth/login',
        {
            method: 'POST',
            body: JSON.stringify({ role, name }),
        },
        { skip401Redirect: true }
    );
}

/**
 * Join waitlist (public - no authentication required)
 */
export async function joinWaitlist(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Waitlist signup failed: ${response.status}`;
        try {
            const parsedError = JSON.parse(errorBody);
            errorMessage = parsedError.error || parsedError.message || errorMessage;
        } catch {
            errorMessage = errorBody || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return await response.json();
}

/**
 * Get user profile from backend
 */
export async function getUserProfile() {
    return request('/api/profile');
}

/**
 * Update user profile
 */
export async function updateProfile(data: {
    name?: string;
    email?: string;
    bio?: string;
    location?: string;
    website?: string;
    instagram?: string;
    insta_connected?: boolean;
}) {
    return request('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return request('/api/profile/avatar', {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': undefined as any,
        }
    });
}

/**
 * Change password
 */
export async function changePassword(currentPassword: string, newPassword: string) {
    return request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(preferences: {
    emailCampaigns?: boolean;
    emailBids?: boolean;
    emailPayments?: boolean;
    emailUpdates?: boolean;
}) {
    return request('/api/profile/notifications', {
        method: 'PUT',
        body: JSON.stringify(preferences)
    });
}

/**
 * Delete account
 */
export async function deleteAccount() {
    return request('/api/profile', {
        method: 'DELETE'
    });
}

/**
 * Forgot password - send reset email
 */
export async function forgotPassword(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Password reset failed: ${response.status}`;
        try {
            const parsedError = JSON.parse(errorBody);
            errorMessage = parsedError.error || parsedError.message || errorMessage;
        } catch {
            errorMessage = errorBody || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return await response.json();
}

/**
 * Verify reset token
 */
export async function verifyResetToken(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-reset-token?token=${encodeURIComponent(token)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Token verification failed: ${response.status}`;
        try {
            const parsedError = JSON.parse(errorBody);
            errorMessage = parsedError.error || parsedError.message || errorMessage;
        } catch {
            errorMessage = errorBody || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return await response.json();
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, new_password: newPassword })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Password reset failed: ${response.status}`;
        try {
            const parsedError = JSON.parse(errorBody);
            errorMessage = parsedError.error || parsedError.message || errorMessage;
        } catch {
            errorMessage = errorBody || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return await response.json();
}

/**
 * Get notifications
 */
export async function getNotifications() {
    return request<Notification[]>('/api/notifications');
}

/**
 * Get unread notification count
 */
export async function getUnreadCount() {
    const response = await request<{ count: number }>('/api/notifications/unread-count');
    return response.count || 0;
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(id: string) {
    return request(`/api/notifications/${id}/read`, {
        method: 'PUT'
    });
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string) {
    return request(`/api/notifications/${id}`, {
        method: 'DELETE'
    });
}

interface Notification {
    id: string;
    type: 'campaign' | 'bid' | 'payment' | 'content' | 'system';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    link?: string;
    metadata?: any;
}

/**
 * Brand-specific API calls
 */
export const brandApi = {
    getProfile: async () => ({
        company_name: 'TechDiscovr',
        email: 'hello@techdiscovr.com',
        website: 'https://techdiscovr.com',
        industry: 'Technology',
        description: 'AI-Powered Influencer Marketing Platform',
    }),
    getCampaigns: async () => ({ campaigns: DEMO_CAMPAIGNS }),
    createCampaign: (data: any) => request<any>('/brand/campaigns', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateCampaign: (data: any) => request<any>('/brand/campaigns', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    uploadBrief: (data: FormData) => request<any>('/brand/campaigns/brief', {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': undefined as any,
        }
    }),
    getCampaignCreators: async (_id: string) => ({ creators: DEMO_CREATORS }),
    getCreatorBids: async (_campaignId: string) => ({ bids: DEMO_BIDS }),
    respondToCreatorBid: (campaignId: string, creatorId: string, action: 'accept' | 'reject', proposedAmount?: number) => {
        const isCounter = typeof proposedAmount === 'number' && Number.isFinite(proposedAmount) && proposedAmount > 0;
        const status = action === 'reject'
            ? 'rejected'
            : (isCounter ? 'amount_negotiated' : 'accepted');
        return request<any>('/brand/campaigns/creators/respond', {
            method: 'POST',
            body: JSON.stringify({
                campaign_id: campaignId,
                updates: [
                    {
                        creator_id: creatorId,
                        status,
                        ...(isCounter ? { proposed_amount: proposedAmount } : {})
                    }
                ]
            })
        });
    },
    finalizeCreatorAmounts: (campaignId: string, updates: any[]) => request<any>(`/brand/campaigns/finalize-amounts?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({ updates })
    }),
    getCreatorContent: async (_campaignId: string) => ({ content: DEMO_CONTENT }),
    reviewCreatorContent: (campaignId: string, updates: any[]) => request<any>(`/brand/campaigns/review-content?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({
            campaign_id: campaignId,
            updates: (updates || []).map((u: any) => ({
                creator_id: u.creator_id,
                action:
                    u.status === 'approved' ? 'approve' :
                        u.status === 'rejected' ? 'reject' :
                            u.status === 'revision_requested' ? 'request_revision' :
                                u.action,
                feedback: u.feedback
            }))
        })
    }),
    uploadCreatorsSheet: (campaignId: string, file: File) => {
        const formData = new FormData();
        formData.append('campaign_id', campaignId);
        formData.append('creators_sheet', file);
        return request<any>('/brand/campaigns/creators/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': undefined as any,
            }
        });
    },
    getCreatorScripts: async (_campaignId: string) => ({ scripts: DEMO_SCRIPTS }),
    reviewCreatorScript: (campaignId: string, creatorId: string, status: 'approved' | 'rejected' | 'revision_requested', feedback?: string) => {
        const action =
            status === 'approved' ? 'approve' :
                status === 'rejected' ? 'reject' :
                    'request_revision';
        return request<any>(`/brand/campaigns/review-script?campaign_id=${campaignId}`, {
            method: 'POST',
            body: JSON.stringify({
                // Keep legacy keys for backward compatibility.
                campaign_id: campaignId,
                creator_id: creatorId,
                status,
                feedback,
                // Backend currently expects batch updates + action.
                updates: [
                    {
                        creator_id: creatorId,
                        action,
                        feedback
                    }
                ]
            })
        });
    },
    updateCreatorStatuses: (campaignId: string, updates: { creator_id: string, status: string, comment?: string, proposed_amount?: number }[]) => request<any>('/brand/campaigns/creators/respond', {
        method: 'POST',
        body: JSON.stringify({
            campaign_id: campaignId,
            updates
        })
    }),
    submitCreatorSelection: (campaignId: string) => request<any>('/brand/campaigns/creators/submit', {
        method: 'POST',
        body: JSON.stringify({
            campaign_id: campaignId
        })
    }),
    analyzeCreator: (profileUrl: string) => request<any>('/brand/creators/analyze', {
        method: 'POST',
        body: JSON.stringify({ profile_url: profileUrl })
    }),
};

/**
 * Creator-specific API calls with simple caching to improve performance
 */
let campaignsCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

export const creatorApi = {
    getCampaigns: async (forceRefresh = false) => {
        const now = Date.now();
        if (!forceRefresh && campaignsCache && (now - lastFetchTime < CACHE_DURATION)) {
            return campaignsCache;
        }
        const data = await request<any>('/creator/campaigns');
        campaignsCache = data;
        lastFetchTime = now;
        return data;
    },
    invalidateCache: () => {
        campaignsCache = null;
        lastFetchTime = 0;
    },
    linkCampaign: async (campaignId: string, creatorToken?: string) => {
        const res = await request<any>('/creator/campaigns/link', {
            method: 'POST',
            body: JSON.stringify({ campaign_id: campaignId, creator_token: creatorToken || '' })
        });
        creatorApi.invalidateCache();
        return res;
    },
    getCampaignBrief: (campaignId: string) => request<any>(`/creator/campaigns/brief?campaign_id=${campaignId}`),
    submitBid: async (campaignId: string, amount: number) => {
        const res = await request<any>(`/creator/campaigns/bid?campaign_id=${campaignId}`, {
            method: 'POST',
            body: JSON.stringify({ bid_amount: amount })
        });
        creatorApi.invalidateCache();
        return res;
    },
    respondToBid: async (campaignId: string, action: 'accept' | 'reject', counterAmount?: number) => {
        const res = await request<any>(`/creator/campaigns/bid/respond`, {
            method: 'POST',
            body: JSON.stringify({ campaign_id: campaignId, action, counter_amount: counterAmount })
        });
        creatorApi.invalidateCache();
        return res;
    },
    getBidStatus: (campaignId: string) => request<any>(`/creator/campaigns/bid-status?campaign_id=${campaignId}`),
    uploadScript: async (campaignId: string, scriptData: string | File) => {
        let options: RequestInit;

        if (scriptData instanceof File) {
            const formData = new FormData();
            formData.append('script_file', scriptData);
            options = {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': undefined as any,
                }
            };
        } else {
            options = {
                method: 'POST',
                body: JSON.stringify({ script_content: scriptData })
            };
        }

        const res = await request<any>(`/creator/campaigns/script?campaign_id=${campaignId}`, options);
        creatorApi.invalidateCache();
        return res;
    },
    uploadContent: async (campaignId: string, file?: File, liveUrl?: string) => {
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
            // Also append as 'video' just in case the backend expects that
            formData.append('video', file);
        }
        formData.append('campaign_id', campaignId);
        if (liveUrl) formData.append('live_url', liveUrl);

        const res = await request<any>(`/creator/campaigns/content?campaign_id=${campaignId}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': undefined as any,
            }
        });
        creatorApi.invalidateCache();
        return res;
    },
    goLive: async (campaignId: string, liveUrl: string) => {
        const res = await request<any>(`/creator/campaigns/go-live?campaign_id=${campaignId}`, {
            method: 'POST',
            body: JSON.stringify({ live_url: liveUrl })
        });
        creatorApi.invalidateCache();
        return res;
    },
};
