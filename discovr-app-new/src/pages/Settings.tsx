import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Input } from '../components';
import { ArrowLeft, Lock, Bell, Trash2, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { changePassword, updateNotificationPreferences, deleteAccount } from '../lib/api';
import './Settings.css';

export const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'security' | 'danger'>('account');
    const [isLoading, setIsLoading] = useState(false);

    // Password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailCampaigns: true,
        emailBids: true,
        emailPayments: true,
        emailUpdates: true
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            showToast('Password changed successfully', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            console.error('Failed to change password:', error);
            showToast(error.message || 'Failed to change password', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationSave = async () => {
        setIsLoading(true);
        try {
            await updateNotificationPreferences(notifications);
            showToast('Notification preferences saved!', 'success');
        } catch (error: any) {
            console.error('Failed to save preferences:', error);
            showToast(error.message || 'Failed to save preferences', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        if (!window.confirm('This will permanently delete all your data. Type DELETE to confirm.')) {
            return;
        }

        setIsLoading(true);
        try {
            await deleteAccount();
            showToast('Account deleted successfully', 'success');
            await signOut();
            navigate('/');
        } catch (error: any) {
            console.error('Failed to delete account:', error);
            showToast(error.message || 'Failed to delete account', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard" style={{ background: 'var(--color-bg-primary)' }}>
            <main className="dashboard-main" style={{ marginLeft: 0, width: '100%', margin: '0 auto' }}>
                <header className="dashboard-header" style={{ marginBottom: 'var(--space-8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} />
                        </Button>
                        <h1 className="dashboard-title">Settings</h1>
                    </div>
                </header>

                <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                    {/* Sidebar */}
                    <div style={{ minWidth: 200 }}>
                        <Card>
                            <CardBody className="no-padding">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <button
                                        onClick={() => setActiveTab('account')}
                                        style={{
                                            padding: 'var(--space-4)',
                                            textAlign: 'left',
                                            background: activeTab === 'account' ? 'var(--color-bg-secondary)' : 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--color-text-primary)',
                                            fontWeight: activeTab === 'account' ? 'var(--font-semibold)' : 'var(--font-normal)'
                                        }}
                                    >
                                        Account
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('notifications')}
                                        style={{
                                            padding: 'var(--space-4)',
                                            textAlign: 'left',
                                            background: activeTab === 'notifications' ? 'var(--color-bg-secondary)' : 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--color-text-primary)',
                                            fontWeight: activeTab === 'notifications' ? 'var(--font-semibold)' : 'var(--font-normal)'
                                        }}
                                    >
                                        <Bell size={16} style={{ marginRight: 'var(--space-2)', display: 'inline' }} />
                                        Notifications
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('security')}
                                        style={{
                                            padding: 'var(--space-4)',
                                            textAlign: 'left',
                                            background: activeTab === 'security' ? 'var(--color-bg-secondary)' : 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--color-text-primary)',
                                            fontWeight: activeTab === 'security' ? 'var(--font-semibold)' : 'var(--font-normal)'
                                        }}
                                    >
                                        <Lock size={16} style={{ marginRight: 'var(--space-2)', display: 'inline' }} />
                                        Security
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('danger')}
                                        style={{
                                            padding: 'var(--space-4)',
                                            textAlign: 'left',
                                            background: activeTab === 'danger' ? 'var(--color-bg-secondary)' : 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--color-error)',
                                            fontWeight: activeTab === 'danger' ? 'var(--font-semibold)' : 'var(--font-normal)'
                                        }}
                                    >
                                        <Trash2 size={16} style={{ marginRight: 'var(--space-2)', display: 'inline' }} />
                                        Danger Zone
                                    </button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                        {activeTab === 'account' && (
                        <Card>
                            <CardHeader>
                                <h3>Account Settings</h3>
                            </CardHeader>
                            <CardBody>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                                    Manage your account preferences and information.
                                </p>
                                <Button onClick={() => navigate('/profile')}>
                                    Edit Profile
                                </Button>
                            </CardBody>
                        </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card>
                                <CardHeader>
                                    <h3>Notification Preferences</h3>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={notifications.emailCampaigns}
                                                onChange={(e) => setNotifications({ ...notifications, emailCampaigns: e.target.checked })}
                                            />
                                            <span>Email notifications for campaign updates</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={notifications.emailBids}
                                                onChange={(e) => setNotifications({ ...notifications, emailBids: e.target.checked })}
                                            />
                                            <span>Email notifications for bid status changes</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={notifications.emailPayments}
                                                onChange={(e) => setNotifications({ ...notifications, emailPayments: e.target.checked })}
                                            />
                                            <span>Email notifications for payments</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={notifications.emailUpdates}
                                                onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                                            />
                                            <span>Email notifications for platform updates</span>
                                        </label>
                                        <div style={{ marginTop: 'var(--space-4)' }}>
                                            <Button onClick={handleNotificationSave} isLoading={isLoading} leftIcon={<Save size={18} />}>
                                                Save Preferences
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <Card>
                                <CardHeader>
                                    <h3>Change Password</h3>
                                </CardHeader>
                                <CardBody>
                                    <form onSubmit={handlePasswordChange}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                            <Input
                                                label="Current Password"
                                                type="password"
                                                placeholder="Enter current password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                leftIcon={<Lock size={18} />}
                                                required
                                            />
                                            <Input
                                                label="New Password"
                                                type="password"
                                                placeholder="Enter new password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                leftIcon={<Lock size={18} />}
                                                required
                                            />
                                            <Input
                                                label="Confirm New Password"
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                leftIcon={<Lock size={18} />}
                                                required
                                            />
                                            <div style={{ marginTop: 'var(--space-4)' }}>
                                                <Button type="submit" isLoading={isLoading} leftIcon={<Save size={18} />}>
                                                    Change Password
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        )}

                        {activeTab === 'danger' && (
                            <Card>
                                <CardHeader>
                                    <h3 style={{ color: 'var(--color-error)' }}>Danger Zone</h3>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                        <div style={{
                                            padding: 'var(--space-4)',
                                            background: 'var(--color-error)',
                                            opacity: 0.1,
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--color-error)'
                                        }}>
                                            <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--color-error)' }}>Delete Account</h4>
                                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                                                Once you delete your account, there is no going back. Please be certain.
                                            </p>
                                            <Button
                                                variant="ghost"
                                                onClick={handleDeleteAccount}
                                                isLoading={isLoading}
                                                style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                                                leftIcon={<Trash2 size={18} />}
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
