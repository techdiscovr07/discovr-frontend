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
        if (!loading && profile?.role === 'creator') {
            creatorApi.getCampaigns().catch(err => {
                console.error('Pre-fetch failed:', err);
            });
        }
    }, [loading, profile]);

    if (loading) {
        return <LoadingSpinner fullPage />;
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
                        {profile?.display_name?.[0] || user?.email?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{profile?.display_name || 'Creator Partner'}</span>
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
