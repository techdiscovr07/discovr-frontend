import React, { useState } from 'react';
import {
    LogOut,
    LayoutDashboard,
    Megaphone,
    IndianRupee,
    Sun,
    Moon,
    Search
} from 'lucide-react';
import { CreatorOverviewTab, CreatorCampaignsTab, CreatorEarningsTab } from './creator-tabs';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NotificationCenter, Button } from '../../components';
import './AdminDashboard.css';
import './CreatorDashboard.css';

export const CreatorDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'earnings'>('overview');
    const { theme, toggleTheme } = useTheme();
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

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
                    <h2 className="sidebar-title">Creator Portal</h2>
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
                        <button
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
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
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
};
