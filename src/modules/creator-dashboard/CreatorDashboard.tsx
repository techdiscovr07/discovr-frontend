import React, { useState, useEffect, Suspense } from 'react';
import {
    LogOut,
    LayoutDashboard,
    Megaphone,
    IndianRupee,
    Search,
    Instagram
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
        const isInstaConnected = profile?.insta_connected || !!profile?.instagram;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
                {/* Header Navbar */}
                <header style={{ padding: 'var(--space-6) var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px', color: 'var(--color-text-primary)' }}>
                        Discovr
                    </div>
                    <Button onClick={signOut} variant="ghost" size="sm">
                        <LogOut size={16} style={{ marginRight: '6px' }} />
                        Log Out
                    </Button>
                </header>

                {/* Main Content */}
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
                    <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
                            You're on the waitlist!
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 1.6, fontSize: '14px' }}>
                            You're on the waitlist for Instagram. Connect other channels to be added to the waitlist for brand partnerships on those platforms.
                        </p>

                        {/* Connected Account Box */}
                        <div style={{
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--color-bg-primary)',
                            marginBottom: 'var(--space-6)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <Instagram size={18} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-primary)' }}>Instagram</div>
                                    <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                        {isInstaConnected ? (
                                            <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>
                                                ✓ Connected: {profile?.instagram ? `@${profile.instagram.replace('https://instagram.com/', '').replace('https://www.instagram.com/', '').replace('/', '')}` : 'Yes'}
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--color-text-tertiary)' }}>
                                                Not connected
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!isInstaConnected && (
                                <Button variant="primary" size="sm" style={{ background: '#5850ec' }} onClick={() => navigate('/profile')}>
                                    Connect
                                </Button>
                            )}
                        </div>

                        <div style={{ fontSize: '12px' }}>
                            <a href="#" style={{ color: '#5850ec', textDecoration: 'none', marginBottom: 'var(--space-4)', display: 'inline-block' }}>
                                Show data usage info
                            </a>
                            <p style={{ color: 'var(--color-text-tertiary)', lineHeight: 1.5, marginTop: 'var(--space-2)' }}>
                                If you have any questions about connecting your channels, please email creators@discovr.com.
                            </p>
                        </div>
                    </div>
                </main>
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
