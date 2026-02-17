import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import {
    Instagram,
    Youtube,
    MessageCircle,
    CheckCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import brandDashboardData from '../../../data/brandDashboard.json';

interface BrandCreatorsTabProps {
    searchQuery?: string;
}

type SortField = 'name' | 'followers' | 'engagement' | 'campaigns' | 'totalEarned';
type SortDirection = 'asc' | 'desc';

export const BrandCreatorsTab: React.FC<BrandCreatorsTabProps> = ({ searchQuery = '' }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const allCreators = Array.isArray(brandDashboardData.creators) ? brandDashboardData.creators : [];
    const performanceData = Array.isArray(brandDashboardData.creatorPerformance) ? brandDashboardData.creatorPerformance : [];

    // Filter creators (only Instagram for now)
    const filteredCreators = useMemo(() => {
        return allCreators.filter((creator: any) => {
            const matchesSearch =
                creator.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                creator.niche?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || creator.status === statusFilter;
            // Only show Instagram creators for now
            const isInstagram = creator.platform === 'Instagram';

            return matchesSearch && matchesStatus && isInstagram;
        });
    }, [allCreators, searchQuery, statusFilter]);

    // Sort creators
    const sortedCreators = useMemo(() => {
        return [...filteredCreators].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortField) {
                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'followers':
                    aValue = parseFloat(a.followers?.replace('K', '000').replace('M', '000000') || '0');
                    bValue = parseFloat(b.followers?.replace('K', '000').replace('M', '000000') || '0');
                    break;
                case 'engagement':
                    aValue = parseFloat(a.engagement?.replace('%', '') || '0');
                    bValue = parseFloat(b.engagement?.replace('%', '') || '0');
                    break;
                case 'campaigns':
                    aValue = a.campaigns || 0;
                    bValue = b.campaigns || 0;
                    break;
                case 'totalEarned':
                    aValue = parseFloat(a.totalEarned?.replace('₹', '').replace(',', '') || '0');
                    bValue = parseFloat(b.totalEarned?.replace('₹', '').replace(',', '') || '0');
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredCreators, sortField, sortDirection]);

    // Paginate creators
    const paginatedCreators = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedCreators.slice(startIndex, endIndex);
    }, [sortedCreators, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedCreators.length / itemsPerPage);

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

    return (
        <div className="creators-container animate-fade-in">
            {/* Creator Performance Section */}
            <div className="overview-bottom-grid">
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Pool Performance</h3>
                            <Button variant="ghost" size="sm">Instagram</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(17, 24, 39, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="engagement" fill="var(--color-accent)" radius={[4, 4, 0, 0]} name="Eng %" />
                                <Bar dataKey="campaigns" fill="var(--color-accent-alt)" radius={[4, 4, 0, 0]} name="Camps" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                <Card className="analytics-card" style={{ background: 'var(--gradient-glass)' }}>
                    <CardBody>
                        <div style={{ padding: 'var(--space-4)' }}>
                            <div className="welcome-badge" style={{ marginBottom: 'var(--space-6)' }}>Curation Strength</div>
                            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: 'var(--space-2)' }}>Top 1%.</h2>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                                Your creator pool is currently outperforming industry benchmarks by <strong>4.2%</strong> in organic reach.
                            </p>
                            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Recent matches</p>
                                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Premium Filter Bar */}
            <div className="premium-filter-bar">
                <div className="filter-group">
                    <div className="custom-select-wrapper">
                        <select
                            className="premium-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">ALL POOLS</option>
                            <option value="Active">ACTIVE</option>
                            <option value="Pending">PENDING</option>
                        </select>
                    </div>
                </div>

                <div className="filter-group">
                    <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-tertiary)', letterSpacing: '0.1em' }}>SORT BY</span>
                    <select
                        className="premium-select"
                        value={`${sortField}-${sortDirection}`}
                        onChange={(e) => {
                            const [field, direction] = e.target.value.split('-');
                            setSortField(field as SortField);
                            setSortDirection(direction as SortDirection);
                        }}
                    >
                        <option value="followers-desc">FOLLOWERS</option>
                        <option value="engagement-desc">ENGAGEMENT</option>
                        <option value="campaigns-desc">CAMPAIGNS</option>
                    </select>
                </div>
            </div>

            {/* Creators Grid */}
            <div className="brands-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {paginatedCreators.map((creator) => (
                    <div key={creator.id} className="premium-creator-card">
                        <div className="creator-card-header">
                            <div className="creator-avatar-wrapper">
                                <div className="creator-avatar-main">
                                    {creator.avatar}
                                </div>
                                <div className="platform-badge-float">
                                    {getPlatformIcon(creator.platform)}
                                </div>
                            </div>
                            <div className="creator-meta">
                                <h4>{creator.name} <CheckCircle size={14} style={{ color: 'var(--color-accent-alt)', marginLeft: 4 }} /></h4>
                                <p>{creator.niche}</p>
                            </div>
                        </div>

                        <div className="creator-stats-row">
                            <div className="creator-mini-stat">
                                <span className="mini-stat-label">REACH</span>
                                <span className="mini-stat-value">{creator.followers}</span>
                            </div>
                            <div className="creator-mini-stat">
                                <span className="mini-stat-label">ENG. RATE</span>
                                <span className="mini-stat-value">{creator.engagement}</span>
                            </div>
                        </div>

                        <div className="creator-tags">
                            {['FASHION', 'LIFESTYLE', 'PREMIUM'].map(tag => (
                                <span key={tag} className="creator-tag">{tag}</span>
                            ))}
                        </div>

                        <div className="campaign-card-footer" style={{ border: 'none', padding: 0 }}>
                            <Button variant="ghost" size="sm" onClick={() => { }}>ANALYSIS</Button>
                            <Button size="sm">MESSAGE</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination placeholder */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Prev</Button>
                        <span style={{ display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{currentPage} / {totalPages}</span>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>Next</Button>
                    </div>
                </div>
            )}
        </div>
    );
};
