import React, { useState, useEffect, Suspense } from 'react';
import { LoadingSpinner, Button, NotificationCenter } from '../../components';
import {
    LogOut,
    LayoutDashboard,
    Megaphone,
    Users,
    Search,
    Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BrandOverviewTab = React.lazy(() => import('./brand-tabs').then(m => ({ default: m.BrandOverviewTab })));
const BrandCampaignsTab = React.lazy(() => import('./brand-tabs').then(m => ({ default: m.BrandCampaignsTab })));
const BrandCreatorsTab = React.lazy(() => import('./brand-tabs').then(m => ({ default: m.BrandCreatorsTab })));
import '../../components/DashboardShared.css';
import './BrandDashboard.css';

export const BrandDashboard: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get('tab') as 'overview' | 'campaigns' | 'creators') || 'overview';

    const setActiveTab = (tab: string) => {
        setSearchParams({ tab });
    };

    const { signOut, user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);

    if (loading) {
        return <LoadingSpinner fullPage />;
    }

    // Debug logging
    useEffect(() => {
        console.log('BrandDashboard mounted', { user: !!user, profile, activeTab });
    }, [user, profile, activeTab]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <BrandOverviewTab searchQuery={searchQuery} />;
            case 'campaigns':
                return <BrandCampaignsTab searchQuery={searchQuery} isModalOpen={isNewCampaignModalOpen} onModalClose={() => setIsNewCampaignModalOpen(false)} />;
            case 'creators':
                return <BrandCreatorsTab searchQuery={searchQuery} />;
            default:
                return <BrandOverviewTab searchQuery={searchQuery} />;
        }
    };

    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'overview':
                return 'Brand Dashboard';
            case 'campaigns':
                return 'Campaign Management';
            case 'creators':
                return 'Creator Management';
            default:
                return 'Brand Dashboard';
        }
    };

    const getHeaderSubtitle = () => {
        switch (activeTab) {
            case 'overview':
                return 'Manage your influencer campaigns';
            case 'campaigns':
                return 'Track and manage all your campaigns';
            case 'creators':
                return 'Discover and manage your creators';
            default:
                return 'Manage your influencer campaigns';
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
                        {profile?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'B'}
                    </div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{profile?.name || 'Brand Partner'}</span>
                        <span className="sidebar-user-role">Brand Dashboard</span>
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
                        <span>Campaigns</span>
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'creators' ? 'active' : ''}`}
                        onClick={() => setActiveTab('creators')}
                    >
                        <Users size={20} />
                        <span>Creators</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="sidebar-logout"
                        onClick={async () => {
                            await signOut();
                            navigate('/brand/login');
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
                        {activeTab === 'campaigns' && (
                            <Button variant="secondary" onClick={() => setIsNewCampaignModalOpen(true)}>
                                <Plus size={18} />
                                New Campaign
                            </Button>
                        )}
                        {activeTab === 'creators' && (
                            <Button variant="secondary">
                                <Plus size={18} />
                                Find Creators
                            </Button>
                        )}
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
