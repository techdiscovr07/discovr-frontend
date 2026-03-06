import React, { useState, useEffect, Suspense } from 'react';
import {
    LogOut,
    LayoutDashboard,
    Megaphone,
    IndianRupee,
    Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NotificationCenter, Button, LoadingSpinner } from '../../components';
import { creatorApi } from '../../lib/api';

const CreatorOverviewTab = React.lazy(() => import('./creator-tabs').then(m => ({ default: m.CreatorOverviewTab })));
const CreatorCampaignsTab = React.lazy(() => import('./creator-tabs').then(m => ({ default: m.CreatorCampaignsTab })));
const CreatorEarningsTab = React.lazy(() => import('./creator-tabs').then(m => ({ default: m.CreatorEarningsTab })));
import '../../components/DashboardShared.css';
import './CreatorDashboard.css';

export const CreatorDashboard: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get('tab') as 'overview' | 'campaigns' | 'earnings') || 'overview';

    const setActiveTab = (tab: string) => {
        setSearchParams({ tab });
    };

    const { signOut, user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    // Pre-fetch campaigns
    useEffect(() => {
        if (!loading && profile?.role === 'creator' && profile?.approval_status === 'approved') {
            creatorApi.getCampaigns().catch(err => {
                console.error('Pre-fetch failed:', err);
            });
        }
    }, [loading, profile]);

    if (loading) {
        return <LoadingSpinner fullPage />;
    }

    if (profile?.role === 'creator' && profile?.approval_status !== 'approved') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg-secondary)' }}>
                <div style={{ maxWidth: '500px', width: '90%', padding: 'var(--space-8)', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                        <Megaphone size={32} />
                    </div>
                    <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-3)' }}>Profile Under Review</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
                        Your profile has been successfully created and is currently pending admin approval. You will receive an email once your profile is approved, after which you can access campaigns.
                    </p>
                    <Button onClick={signOut} variant="outline" fullWidth>
                        Log Out
                    </Button>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <CreatorOverviewTab searchQuery={searchQuery} />;
            case 'campaigns':
                return <CreatorCampaignsTab searchQuery={searchQuery} />;
            case 'earnings':
                return <CreatorEarningsTab searchQuery={searchQuery} />;
            default:
                return <CreatorOverviewTab searchQuery={searchQuery} />;
        }
    };

    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'overview':
                return 'Welcome Back! 👋';
            case 'campaigns':
                return 'My Campaigns';
            case 'earnings':
                return 'Earnings Overview';
            default:
                return 'Welcome Back! 👋';
        }
    };

    const getHeaderSubtitle = () => {
        switch (activeTab) {
            case 'overview':
                return 'Track your campaigns and earnings';
            case 'campaigns':
                return 'Manage your active campaigns';
            case 'earnings':
                return 'Track your income and payments';
            default:
                return 'Track your campaigns and earnings';
        }
    };

    return (
        <div className="dashboard">

            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <img src="/logo.png" alt="Discovr" className="sidebar-logo" />
                    <h2 className="sidebar-title">Discovr</h2>
                </div>

                <div className="sidebar-user" onClick={() => navigate('/profile')}>
                    <div className="sidebar-avatar">
                        {(profile?.name?.[0] || profile?.display_name?.[0] || user?.email?.[0] || 'C').toUpperCase()}
                    </div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{profile?.name || profile?.display_name || 'Creator Partner'}</span>
                        <span className="sidebar-user-role">Creator Dashboard</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <LayoutDashboard size={20} />
                        <span>Overview</span>
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'campaigns' ? 'active' : ''}`}
                        onClick={() => setActiveTab('campaigns')}
                    >
                        <Megaphone size={20} />
                        <span>My Campaigns</span>
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'earnings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('earnings')}
                    >
                        <IndianRupee size={20} />
                        <span>Earnings</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="sidebar-logout"
                        onClick={async () => {
                            await signOut();
                            navigate('/creator/login');
                        }}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">{getHeaderTitle()}</h1>
                        <p className="dashboard-subtitle">{getHeaderSubtitle()}</p>
                    </div>
                    <div className="dashboard-header-actions">
                        <NotificationCenter />
                        <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                            Profile
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
                            Settings
                        </Button>
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* Tab Content */}
                <div className="tab-content">
                    <Suspense fallback={<div style={{ padding: 'var(--space-20)', display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>}>
                        {renderTabContent()}
                    </Suspense>
                </div>
            </main>
        </div>
    );
};
