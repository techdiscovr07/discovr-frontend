import React, { useState } from 'react';
import { Button, Modal, NotificationCenter } from '../../components';
import {
    Building2,
    Users,
    TrendingUp,
    IndianRupee,
    Plus,
    Search,
    LogOut,
    Sun,
    Moon,
    Clock,
    UserCircle
} from 'lucide-react';
import { OverviewTab, BrandsTab, CampaignsTab, PaymentsTab, WaitingListsTab, CreatorsTab } from './tabs';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { adminApi } from '../../lib/api';
import adminDashboardData from '../../data/adminDashboard.json';
import './AdminDashboard.css';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'brands' | 'campaigns' | 'payments' | 'waiting-lists' | 'creators'>('overview');
    const { theme, toggleTheme } = useTheme();
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isNewBrandModalOpen, setIsNewBrandModalOpen] = useState(false);
    const [isSubmittingBrand, setIsSubmittingBrand] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newBrandData, setNewBrandData] = useState({
        name: '',
        companyName: '',
        email: '',
        industry: '',
        website: ''
    });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab searchQuery={searchQuery} />;
            case 'brands':
                return <BrandsTab searchQuery={searchQuery} />;
            case 'campaigns':
                return <CampaignsTab searchQuery={searchQuery} />;
            case 'creators':
                return <CreatorsTab searchQuery={searchQuery} />;
            case 'payments':
                return <PaymentsTab searchQuery={searchQuery} />;
            case 'waiting-lists':
                return <WaitingListsTab searchQuery={searchQuery} />;
            default:
                return <OverviewTab searchQuery={searchQuery} />;
        }
    };

    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'overview':
                return 'Dashboard Overview';
            case 'brands':
                return 'Brand Management';
            case 'campaigns':
                return 'Campaign Management';
            case 'creators':
                return 'Creator Management';
            case 'payments':
                return 'Payment Management';
            case 'waiting-lists':
                return 'Waiting Lists';
            default:
                return 'Dashboard Overview';
        }
    };

    const getHeaderSubtitle = () => {
        switch (activeTab) {
            case 'overview':
                return 'Manage your platform operations';
            case 'brands':
                return 'View and manage all brands';
            case 'campaigns':
                return 'Monitor and manage all campaigns';
            case 'creators':
                return 'View and manage all creators';
            case 'payments':
                return 'Process and track creator payments';
            case 'waiting-lists':
                return 'Review and approve pending creators and brands';
            default:
                return 'Manage your platform operations';
        }
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <img src="/logo.png" alt="Discovr" className="sidebar-logo" />
                    <h2 className="sidebar-title">Admin Portal</h2>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <TrendingUp size={20} />
                        <span>Overview</span>
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'brands' ? 'active' : ''}`}
                        onClick={() => setActiveTab('brands')}
                    >
                        <Building2 size={20} />
                        <span>Brands</span>
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'campaigns' ? 'active' : ''}`}
                        onClick={() => setActiveTab('campaigns')}
                    >
                        <Users size={20} />
                        <span>Campaigns</span>
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'creators' ? 'active' : ''}`}
                        onClick={() => setActiveTab('creators')}
                    >
                        <UserCircle size={20} />
                        <span>Creators</span>
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'payments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('payments')}
                    >
                        <IndianRupee size={20} />
                        <span>Payments</span>
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'waiting-lists' ? 'active' : ''}`}
                        onClick={() => setActiveTab('waiting-lists')}
                        style={{ position: 'relative' }}
                    >
                        <Clock size={20} />
                        <span>Waiting Lists</span>
                        {(adminDashboardData.waitingLists?.creators?.length || 0) + (adminDashboardData.waitingLists?.brands?.length || 0) > 0 && (
                            <span style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'var(--color-error)',
                                color: 'white',
                                borderRadius: 'var(--radius-full)',
                                minWidth: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-bold)',
                                padding: '0 6px'
                            }}>
                                {(adminDashboardData.waitingLists?.creators?.length || 0) + (adminDashboardData.waitingLists?.brands?.length || 0)}
                            </span>
                        )}
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="sidebar-logout"
                        onClick={async () => {
                            await signOut();
                            navigate('/admin/login');
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
                        {activeTab === 'overview' && (
                            <Button variant="secondary" onClick={() => setIsNewBrandModalOpen(true)}>
                                <Plus size={18} />
                                New Brand
                            </Button>
                        )}
                        {activeTab === 'brands' && (
                            <Button variant="secondary" onClick={() => setIsNewBrandModalOpen(true)}>
                                <Plus size={18} />
                                Add New Brand
                            </Button>
                        )}
                        {activeTab === 'campaigns' && (
                            <Button variant="secondary">
                                <Plus size={18} />
                                New Campaign
                            </Button>
                        )}
                    </div>
                </header>

                {/* Tab Content */}
                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </main>

            {/* New Brand Modal */}
            <Modal
                isOpen={isNewBrandModalOpen}
                onClose={() => {
                    setIsNewBrandModalOpen(false);
                    setNewBrandData({ name: '', companyName: '', email: '', industry: '', website: '' });
                }}
                title="Add New Brand"
                subtitle="Register a new brand on the platform"
                size="md"
            >
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmittingBrand(true);
                    try {
                        const categories = newBrandData.industry 
                            ? newBrandData.industry.split(',').map(c => c.trim()).filter(c => c)
                            : [];
                        
                        await adminApi.createBrand({
                            name: newBrandData.name,
                            categories: categories,
                            logo_url: newBrandData.website || undefined
                        });
                        
                        showToast('Brand created successfully!', 'success');
                        setIsNewBrandModalOpen(false);
                        setNewBrandData({ name: '', companyName: '', email: '', industry: '', website: '' });
                        // Refresh brands list if on brands tab
                        if (activeTab === 'brands') {
                            window.location.reload(); // Simple refresh, could be improved with state management
                        }
                    } catch (error: any) {
                        console.error('Failed to create brand:', error);
                        showToast(error.message || 'Failed to create brand. Please try again.', 'error');
                    } finally {
                        setIsSubmittingBrand(false);
                    }
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                Brand Name *
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={newBrandData.name}
                                onChange={(e) => setNewBrandData({ ...newBrandData, name: e.target.value })}
                                placeholder="Enter brand name"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                Company Name *
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={newBrandData.companyName}
                                onChange={(e) => setNewBrandData({ ...newBrandData, companyName: e.target.value })}
                                placeholder="Enter company name"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                Email *
                            </label>
                            <input
                                type="email"
                                className="form-input"
                                value={newBrandData.email}
                                onChange={(e) => setNewBrandData({ ...newBrandData, email: e.target.value })}
                                placeholder="brand@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                Industry
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={newBrandData.industry}
                                onChange={(e) => setNewBrandData({ ...newBrandData, industry: e.target.value })}
                                placeholder="e.g., Fashion, Tech, Food"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                Website
                            </label>
                            <input
                                type="url"
                                className="form-input"
                                value={newBrandData.website}
                                onChange={(e) => setNewBrandData({ ...newBrandData, website: e.target.value })}
                                placeholder="https://www.example.com"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setIsNewBrandModalOpen(false);
                                    setNewBrandData({ name: '', companyName: '', email: '', industry: '', website: '' });
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isSubmittingBrand}>
                                Add Brand
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
