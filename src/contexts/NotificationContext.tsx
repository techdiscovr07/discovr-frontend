import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getNotifications, markNotificationRead, deleteNotification, getUnreadCount } from '../lib/api';

export interface Notification {
    id: string;
    type: 'campaign' | 'bid' | 'payment' | 'content' | 'system';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    link?: string;
    metadata?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    refreshNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    deleteNotif: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const refreshNotifications = useCallback(async () => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        try {
            const [notifsResponse, countResponse] = await Promise.all([
                getNotifications(),
                getUnreadCount()
            ]);

            // Handle different potential response formats
            const notifs = Array.isArray(notifsResponse)
                ? notifsResponse
                : (notifsResponse as any)?.notifications || [];

            const count = typeof countResponse === 'number'
                ? countResponse
                : (countResponse as any)?.count || 0;

            setNotifications(notifs);
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            if (user) {
                refreshNotifications();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [user, refreshNotifications]);

    const markAsRead = useCallback(async (id: string) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    const deleteNotif = useCallback(async (id: string) => {
        try {
            await deleteNotification(id);
            const notification = notifications.find(n => n.id === id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (notification && !notification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    }, [notifications]);

    const markAllAsRead = useCallback(async () => {
        try {
            const unreadIds = (notifications || []).filter(n => !n?.read).map(n => n?.id).filter(Boolean);
            if (unreadIds.length > 0) {
                await Promise.all(unreadIds.map(id => markNotificationRead(id)));
            }
            setNotifications(prev => (prev || []).map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }, [notifications]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            refreshNotifications,
            markAsRead,
            deleteNotif,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
