import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import { Users, TrendingUp, Instagram, Youtube, MessageCircle, MoreVertical } from 'lucide-react';
import adminDashboardData from '../../../data/adminDashboard.json';

interface CreatorsTabProps {
    searchQuery?: string;
}

export const CreatorsTab: React.FC<CreatorsTabProps> = ({ searchQuery: headerSearchQuery = '' }) => {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [platformFilter, setPlatformFilter] = useState<string>('all');

    const creators = adminDashboardData.creators || [];

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'Instagram':
                return <Instagram size={16} />;
            case 'YouTube':
                return <Youtube size={16} />;
            default:
                return <MessageCircle size={16} />;
        }
    };

    const filteredCreators = creators.filter(creator => {
        const matchesSearch = 
            creator.name?.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
            creator.handle?.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
            creator.email?.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
            creator.niche?.toLowerCase().includes(headerSearchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || creator.status === statusFilter;
        const matchesPlatform = platformFilter === 'all' || creator.platform === platformFilter;

        return matchesSearch && matchesStatus && matchesPlatform;
    });

    const stats = {
        total: creators.length,
        active: creators.filter(c => c.status === 'Active').length,
        pending: creators.filter(c => c.status === 'Pending').length,
        totalCampaigns: creators.reduce((sum, c) => sum + (c.campaigns || 0), 0),
        totalEarnings: creators.reduce((sum, c) => {
            const earnings = parseFloat(c.totalEarned?.replace('₹', '').replace(',', '') || '0');
            return sum + earnings;
        }, 0)
    };

    return (
        <>
            {/* Stats Summary */}
            <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <CardBody>
                        <div className="stat-content">
                            <div className="stat-icon">
                                <Users size={24} />
                            </div>
                            <div className="stat-details">
                                <p className="stat-label">Total Creators</p>
                                <h3 className="stat-value">{stats.total}</h3>
                                <p className="stat-change">{stats.active} active</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="stat-card">
                    <CardBody>
                        <div className="stat-content">
                            <div className="stat-icon">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-details">
                                <p className="stat-label">Total Campaigns</p>
                                <h3 className="stat-value">{stats.totalCampaigns}</h3>
                                <p className="stat-change">Across all creators</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="stat-card">
                    <CardBody>
                        <div className="stat-content">
                            <div className="stat-icon">
                                <Users size={24} />
                            </div>
                            <div className="stat-details">
                                <p className="stat-label">Active Creators</p>
                                <h3 className="stat-value">{stats.active}</h3>
                                <p className="stat-change">{stats.pending} pending</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="stat-card">
                    <CardBody>
                        <div className="stat-content">
                            <div className="stat-icon">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-details">
                                <p className="stat-label">Total Earnings</p>
                                <h3 className="stat-value">₹{stats.totalEarnings.toLocaleString()}</h3>
                                <p className="stat-change">All time</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Button
                        variant={statusFilter === 'all' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setStatusFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={statusFilter === 'Active' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setStatusFilter('Active')}
                    >
                        Active
                    </Button>
                    <Button
                        variant={statusFilter === 'Pending' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setStatusFilter('Pending')}
                    >
                        Pending
                    </Button>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Button
                        variant={platformFilter === 'all' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setPlatformFilter('all')}
                    >
                        All Platforms
                    </Button>
                    <Button
                        variant={platformFilter === 'Instagram' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setPlatformFilter('Instagram')}
                    >
                        Instagram
                    </Button>
                    <Button
                        variant={platformFilter === 'YouTube' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setPlatformFilter('YouTube')}
                    >
                        YouTube
                    </Button>
                    <Button
                        variant={platformFilter === 'TikTok' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setPlatformFilter('TikTok')}
                    >
                        TikTok
                    </Button>
                </div>
            </div>

            {/* Creators Table */}
            <Card className="content-card">
                <CardHeader>
                    <div className="card-header-content">
                        <h3>All Creators ({filteredCreators.length})</h3>
                    </div>
                </CardHeader>
                <CardBody className="no-padding">
                    {filteredCreators.length === 0 ? (
                        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                            <Users size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
                            <p>No creators found</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Creator</th>
                                        <th>Platform</th>
                                        <th>Followers</th>
                                        <th>Engagement</th>
                                        <th>Campaigns</th>
                                        <th>Total Earned</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCreators.map((creator) => (
                                        <tr key={creator.id}>
                                            <td>
                                                <div className="creator-cell">
                                                    <div className="creator-avatar" style={{ width: 40, height: 40, fontSize: 18 }}>
                                                        {creator.avatar || creator.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="creator-name">{creator.name}</div>
                                                        <div className="creator-handle">{creator.handle || creator.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    {getPlatformIcon(creator.platform || '')}
                                                    <span style={{ fontSize: 'var(--text-sm)' }}>{creator.platform || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                                    {creator.followers || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-semibold)' }}>
                                                    {creator.engagement || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                                    {creator.campaigns || 0}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-success)' }}>
                                                    {creator.totalEarned || '₹0'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${
                                                    creator.status === 'Active' ? 'status-active' : 
                                                    creator.status === 'Pending' ? 'status-planning' : 
                                                    'status-planning'
                                                }`}>
                                                    {creator.status || 'Active'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="action-button">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardBody>
            </Card>
        </>
    );
};
