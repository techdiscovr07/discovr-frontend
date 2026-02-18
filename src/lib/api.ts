import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

/**
 * Base request function that acts as an interceptor
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

        // Global Error Handling
        if (response.status === 401) {
            // Handle unauthorized - maybe redirect to login or sign out
            console.warn('Unauthorized request. Possible token expiry.');
            // We can't use navigate() here as it's not a component, 
            // but we can trigger a sign out which will be caught by ProtectedRoute
            await auth.signOut();
            window.location.href = '/'; // Fallback to landing
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const errorBody = await response.text();
            let errorMessage = `API Error: ${response.status}`;
            try {
                const parsedError = JSON.parse(errorBody);
                errorMessage = parsedError.message || errorMessage;
            } catch {
                errorMessage = errorBody || errorMessage;
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error: any) {
        console.error(`Request failed for ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Signup new user (creates Firebase user and MongoDB record)
 */
export async function signupToBackend(email: string, password: string, name: string, role: 'admin' | 'brand_owner' | 'brand_emp' | 'creator') {
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
 * Login to backend (creates user in MongoDB if new)
 */
export async function loginToBackend(role: 'admin' | 'brand_owner' | 'brand_emp' | 'creator') {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ role })
    });
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
    getProfile: () => request<any>('/brand/profile'),
    getCampaigns: () => request('/brand/campaigns'),
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
            // Fetch will set correct boundary if content-type is NOT manually set for FormData
            'Content-Type': undefined as any,
        }
    }),
    getCampaignCreators: (id: string) => request(`/brand/campaigns/creators?campaign_id=${id}`),
    getCreatorBids: (campaignId: string) => request<any>(`/brand/campaigns/bids?campaign_id=${campaignId}`),
    respondToCreatorBid: (campaignId: string, creatorId: string, action: 'accept' | 'reject', proposedAmount?: number) => request<any>(`/brand/campaigns/bids/respond?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({ 
            creator_id: creatorId, 
            action, 
            proposed_amount: proposedAmount 
        })
    }),
    finalizeCreatorAmounts: (campaignId: string, updates: any[]) => request<any>(`/brand/campaigns/finalize-amounts?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({ updates })
    }),
    getCreatorContent: (campaignId: string) => request<any>(`/brand/campaigns/content?campaign_id=${campaignId}`),
    reviewCreatorContent: (campaignId: string, updates: any[]) => request<any>(`/brand/campaigns/review-content?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({ updates })
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
    getCreatorScripts: (campaignId: string) => request<any>(`/brand/campaigns/scripts?campaign_id=${campaignId}`),
    reviewCreatorScript: (campaignId: string, creatorId: string, status: 'approved' | 'rejected' | 'revision_requested', feedback?: string) => request<any>(`/brand/campaigns/review-script?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({
            campaign_id: campaignId,
            creator_id: creatorId,
            status,
            feedback
        })
    }),
    updateCreatorStatuses: (campaignId: string, updates: { creator_id: string, status: string, comment?: string }[]) => request<any>('/brand/campaigns/creators/respond', {
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
};

/**
 * Admin-specific API calls
 */
export const adminApi = {
    getWaitlist: () => request<any>('/admin/waitlist/list'),
    getBrands: () => request<any[]>('/admin/brands/list'),
    createBrand: (data: any) => request<any>('/admin/brands', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    createBrandOwner: (data: { brand_id: string; email: string; password: string; name?: string }) => request<any>('/admin/brands/owners', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    assignBrandEmployee: (data: { brand_id: string; email?: string; uid?: string }) => request<any>('/admin/brands/employees/assign', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateBrand: (data: any) => request<any>('/admin/brands/update', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    deleteBrand: (brandId: string) => request<any>('/admin/brands/delete', {
        method: 'POST',
        body: JSON.stringify({ brand_id: brandId })
    }),
    getCampaigns: (filters?: { brand_id?: string; campaign_id?: string }) => {
        const params = new URLSearchParams();
        if (filters?.brand_id) params.append('brand_id', filters.brand_id);
        if (filters?.campaign_id) params.append('campaign_id', filters.campaign_id);
        const query = params.toString();
        return request<any>(`/admin/campaigns${query ? `?${query}` : ''}`);
    },
    getCampaignCreators: (campaignId: string) => request<any>(`/admin/campaigns/creators?campaign_id=${campaignId}`),
    uploadCreatorsSheet: (campaignId: string, file: File) => {
        const formData = new FormData();
        formData.append('campaign_id', campaignId);
        formData.append('creators_sheet', file);
        return request<any>('/admin/campaigns/creators/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': undefined as any,
            }
        });
    },
    finalizeCreators: (campaignId: string) => request<any>(`/admin/campaigns/finalize-creators?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({ campaign_id: campaignId })
    }),
    notifyCreatorsBrief: (campaignId: string) => request<any>(`/admin/campaigns/creators/notify-brief?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({ campaign_id: campaignId })
    }),
    notifyCreatorsRegistration: (campaignId: string) => request<any>(`/admin/campaigns/creators/notify-registration?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({ campaign_id: campaignId })
    }),
    updateBrandOwner: (data: { brand_id: string; email: string; name?: string }) => request<any>('/admin/brands/owners/update', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    listBrandUsers: (brandId: string) => request<any>(`/admin/brands/users/list?brand_id=${brandId}`),
    getStats: () => request<any>('/api/stats'),
    getPayments: (campaignId?: string) => {
        const query = campaignId ? `?campaign_id=${campaignId}` : '';
        return campaignId
            ? request<any>(`/admin/campaigns/payments${query}`)
            : request<any>('/admin/campaigns/all-payments');
    },
    processPayment: (campaignId: string, data: any) => request<any>(`/admin/campaigns/process-payment?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
};

/**
 * Creator-specific API calls
 */
export const creatorApi = {
    getCampaigns: () => request('/creator/campaigns'),
    linkCampaign: (campaignId: string, creatorToken?: string) => request<any>('/creator/campaigns/link', {
        method: 'POST',
        body: JSON.stringify({ campaign_id: campaignId, creator_token: creatorToken || '' })
    }),
    getCampaignBrief: (campaignId: string) => request<any>(`/creator/campaigns/brief?campaign_id=${campaignId}`),
    submitBid: (campaignId: string, amount: number) => request(`/creator/campaigns/bid?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({ bid_amount: amount })
    }),
    respondToBid: (campaignId: string, action: 'accept' | 'reject', counterAmount?: number) => request<any>(`/creator/campaigns/bid/respond`, {
        method: 'POST',
        body: JSON.stringify({ campaign_id: campaignId, action, counter_amount: counterAmount })
    }),
    getBidStatus: (campaignId: string) => request<any>(`/creator/campaigns/bid-status?campaign_id=${campaignId}`),
    uploadScript: (campaignId: string, scriptContent: string) => request<any>(`/creator/campaigns/script?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({ script_content: scriptContent })
    }),
    uploadContent: (campaignId: string, file: File, liveUrl?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        if (liveUrl) formData.append('live_url', liveUrl);
        return request<any>(`/creator/campaigns/content?campaign_id=${campaignId}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': undefined as any,
            }
        });
    },
    goLive: (campaignId: string, liveUrl: string) => request<any>(`/creator/campaigns/go-live?campaign_id=${campaignId}`, {
        method: 'POST',
        body: JSON.stringify({ live_url: liveUrl })
    }),
};
