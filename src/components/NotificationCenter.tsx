import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import './NotificationCenter.css';

export const NotificationCenter: React.FC = () => {
    const { notifications, unreadCount, loading, markAsRead, deleteNotif, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleNotificationClick = (notification: any) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            window.location.href = notification.link;
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'campaign':
                return '📢';
            case 'bid':
                return '💰';
            case 'payment':
                return '💳';
            case 'content':
                return '📹';
            default:
                return '🔔';
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="notification-center" ref={dropdownRef}>
            <button
                className="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <div className="notification-actions">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    leftIcon={<CheckCheck size={14} />}
                                >
                                    Mark all read
                                </Button>
                            )}
                            <button
                                className="notification-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <div className="notification-loading">
                                <LoadingSpinner />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty">
                                <Bell size={32} style={{ opacity: 0.3, marginBottom: 'var(--space-4)' }} />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-icon">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">{notification.title}</div>
                                        <div className="notification-message">{notification.message}</div>
                                        <div className="notification-time">{formatTime(notification.createdAt)}</div>
                                    </div>
                                    <div className="notification-actions-item">
                                        {!notification.read && (
                                            <button
                                                className="notification-action-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification.id);
                                                }}
                                                aria-label="Mark as read"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                        <button
                                            className="notification-action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotif(notification.id);
                                            }}
                                            aria-label="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        {notification.link && (
                                            <button
                                                className="notification-action-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = notification.link!;
                                                }}
                                                aria-label="Open"
                                            >
                                                <ExternalLink size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
