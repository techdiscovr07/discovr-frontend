import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import {
    Instagram,
    Youtube,
    MessageCircle
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
    const navigate = useNavigate();
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
            <div className="creators-header-grid">
                <Card className="performance-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Creator Performance</h3>
                            <Button variant="ghost" size="sm">Last 30 Days</Button>
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
                                        background: '#1f2937',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="engagement" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Engagement %" />
                                <Bar dataKey="campaigns" fill="#10b981" radius={[4, 4, 0, 0]} name="Campaigns" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar-clean">
                <div className="filter-left">
                    <select
                        className="clean-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>

                <div className="filter-right">
                    <select
                        className="clean-select"
                        value={`${sortField}-${sortDirection}`}
                        onChange={(e) => {
                            const [field, direction] = e.target.value.split('-');
                            setSortField(field as SortField);
                            setSortDirection(direction as SortDirection);
                        }}
                    >
                        <option value="name-asc">Sort by Name</option>
                        <option value="followers-desc">Most Followers</option>
                        <option value="engagement-desc">Highest Engagement</option>
                        <option value="campaigns-desc">Most Campaigns</option>
                    </select>
                </div>
            </div>

            {/* Creators Grid */}
            <div className="creators-grid-clean">
                {paginatedCreators.map((creator) => (
                    <Card key={creator.id} className="creator-item-card">
                        <CardBody>
                            <div className="creator-main-info">
                                <div className="creator-avatar-circle">
                                    {creator.avatar}
                                </div>
                                <div className="creator-text-info">
                                    <h4>{creator.name}</h4>
                                    <p>{creator.niche}</p>
                                </div>
                                <div className="platform-icon-clean">
                                    {getPlatformIcon(creator.platform)}
                                </div>
                            </div>

                            <div className="creator-metrics-grid">
                                <div className="metric-item">
                                    <span className="metric-label">Followers</span>
                                    <span className="metric-value">{creator.followers}</span>
                                </div>
                                <div className="metric-item">
                                    <span className="metric-label">Engagement</span>
                                    <span className="metric-value">{creator.engagement}</span>
                                </div>
                                <div className="metric-item">
                                    <span className="metric-label">Earnings</span>
                                    <span className="metric-value">{creator.totalEarned}</span>
                                </div>
                            </div>

                            <div className="creator-card-actions">
                                <Button variant="ghost" size="sm" fullWidth onClick={() => navigate(`/brand/creator/${creator.id}`)}>
                                    View Full Profile
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="pagination-info">Page {currentPage} of {totalPages}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};
