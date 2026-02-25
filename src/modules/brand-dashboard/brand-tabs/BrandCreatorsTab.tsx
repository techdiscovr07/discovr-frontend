import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, LoadingSpinner } from '../../../components';
import {
    Instagram,
    Youtube,
    MessageCircle,
    Filter,
    Users,
    LayoutGrid,
    List
} from 'lucide-react';
import { brandApi } from '../../../lib/api';

interface BrandCreatorsTabProps {
    searchQuery?: string;
}

interface Campaign {
    id: string;
    name: string;
    status: string;
    data?: Record<string, unknown>;
}

interface AssociatedCampaignItem {
    id: string;
    name: string;
    status: string;
    platform?: string;
}

interface Creator {
    id: string;
    creator_id?: string;
    uid?: string;
    display_name?: string;
    name?: string;
    category?: string;
    niche?: string;
    platform?: string;
    followers_count?: number;
    engagement_rate?: string;
    status?: string;
    campaignId?: string;
    campaignName?: string;
    campaign_count?: number;
    campaigns?: AssociatedCampaignItem[];
    total_earned?: number;
}

type SortField = 'name' | 'followers' | 'engagement' | 'campaigns' | 'totalEarned';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

interface CreatorCardProps {
    creator: Creator;
    onNavigate: (path: string) => void;
    getPlatformIcon: (platform?: string) => React.ReactNode;
}

// Memoized Creator Row Component (Compact List Item)
const CreatorRow = React.memo(({ creator, onNavigate, getPlatformIcon }: CreatorCardProps) => {
    const handleMouseEnter = () => brandApi.getCampaigns().catch(() => { });

    return (
        <div
            className="creator-list-row animate-fade-in"
            onMouseEnter={handleMouseEnter}
            onClick={() => onNavigate(`/brand/creator/${creator.creator_id || creator.id}`)}
        >
            <div className="creator-profile-mini">
                <div className="creator-avatar-sm">
                    {(creator.display_name || creator.name || '?')[0].toUpperCase()}
                </div>
                <div className="creator-meta-mini">
                    <h4>{creator.display_name || creator.name}</h4>
                    <span className="niche-tag">{creator.category || creator.niche || 'Digital Creator'}</span>
                </div>
            </div>

            <div className="creator-metrics-compact-row">
                <div className="mini-metric">
                    <span className="val">{(creator.followers_count || 0).toLocaleString()}</span>
                    <span className="lbl">Followers</span>
                </div>
                <div className="mini-metric">
                    <span className="val">{creator.engagement_rate || 'N/A'}</span>
                    <span className="lbl">Engagement</span>
                </div>
            </div>

            <div className="creator-campaigns-compact-list">
                <div className="camp-list-label">Campaigns:</div>
                <div className="camp-chips-container">
                    {creator.campaigns && creator.campaigns.length > 0 ? (
                        creator.campaigns.map((camp) => (
                            <div
                                key={camp.id}
                                className={`camp-compact-chip status-${camp.status.toLowerCase().replace(/_/g, '-')}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate(`/brand/campaign/${camp.id}/creator/${creator.creator_id || creator.id}`);
                                }}
                            >
                                {getPlatformIcon(camp.platform)}
                                <span className="camp-chip-name">{camp.name}</span>
                            </div>
                        ))
                    ) : (
                        <span className="no-camps">No campaigns found</span>
                    )}
                </div>
            </div>

            <div className="row-action">
                <Button variant="ghost" size="sm">
                    Profile
                </Button>
            </div>
        </div>
    );
});

// Memoized Creator Card Component (Grid Card)
const CreatorCard = React.memo(({ creator, onNavigate, getPlatformIcon }: CreatorCardProps) => {
    const handleMouseEnter = () => brandApi.getCampaigns().catch(() => { });

    return (
        <div
            className="creator-compact-card animate-fade-in"
            onMouseEnter={handleMouseEnter}
            onClick={() => onNavigate(`/brand/creator/${creator.creator_id || creator.id}`)}
        >
            <div className="card-platform-indicator">
                {getPlatformIcon(creator.platform)}
            </div>

            <div className="card-avatar-wrapper">
                <div className="creator-avatar-md">
                    {(creator.display_name || creator.name || '?')[0].toUpperCase()}
                </div>
                {creator.status === 'completed' && (
                    <div className="status-verify-badge">✓</div>
                )}
            </div>

            <div className="card-main-info">
                <h4>{creator.display_name || creator.name}</h4>
                <p>{creator.category || creator.niche || 'Digital Creator'}</p>
            </div>

            <div className="card-metrics-grid">
                <div className="metric">
                    <span className="v">{((creator.followers_count || 0) / 1000).toFixed(1)}K</span>
                    <span className="l">Followers</span>
                </div>
                <div className="metric">
                    <span className="v">{creator.engagement_rate || 'N/A'}</span>
                    <span className="l">Engagement</span>
                </div>
                <div className="metric">
                    <span className="v">{creator.campaign_count || 0}</span>
                    <span className="l">Campaigns</span>
                </div>
            </div>

            <div className="card-campaigns-preview">
                {creator.campaigns && creator.campaigns.length > 0 ? (
                    <div className="mini-camp-stack">
                        {creator.campaigns.slice(0, 2).map(c => (
                            <div key={c.id} className="mini-camp-tag">{c.name}</div>
                        ))}
                        {creator.campaigns.length > 2 && (
                            <div className="mini-camp-more">+{creator.campaigns.length - 2} more</div>
                        )}
                    </div>
                ) : (
                    <div className="no-history-tag">New Partner</div>
                )}
            </div>
        </div>
    );
});

export const BrandCreatorsTab: React.FC<BrandCreatorsTabProps> = ({ searchQuery = '' }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [creators, setCreators] = useState<Creator[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [viewMode, setViewMode] = useState<ViewMode>('list'); // Default to list because user asked for it look compact
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const fetchAllCreators = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch all campaigns for this brand
            const response = await brandApi.getCampaigns() as { data?: Campaign[], campaigns?: Campaign[] } | Campaign[];
            const campaigns = Array.isArray(response) ? response : (response?.campaigns || response?.data || []) as Campaign[];

            // 2. For each campaign, fetch its creators
            const creatorsPromises = campaigns.map((campaign: Campaign) =>
                brandApi.getCampaignCreators(campaign.id).then(data => {
                    const campaignCreators = (Array.isArray(data) ? data : ((data as { creators?: Creator[] })?.creators || [])) as Creator[];
                    return campaignCreators.map((c: Creator) => ({
                        ...c,
                        campaignId: campaign.id,
                        campaignName: campaign.name
                    })) as Creator[];
                })
            );

            const allCreatorsNested = await Promise.all(creatorsPromises);
            const allFlattened = allCreatorsNested.flat();

            // 3. Filter for creators who have "amount finalized" or above
            // We exclude 'accepted' (preliminary) and 'rejected'
            const workedWithCreators = allFlattened.filter((c: Creator) => {
                const status = String(c.status || '').toLowerCase();
                return (
                    status === 'amount_finalized' ||
                    status === 'active' ||
                    status.includes('script') ||
                    status.includes('content') ||
                    status === 'completed'
                );
            });

            // 4. Deduplicate creators by creator_id strictly
            const uniqueCreatorsMap = new Map<string, Creator>();
            workedWithCreators.forEach((c: Creator) => {
                const key = c.creator_id || c.uid || (c.name ? `${c.name}-${c.platform}` : c.id) || '';

                if (key) {
                    const campaignInfo: AssociatedCampaignItem = {
                        id: c.campaignId || '',
                        name: c.campaignName || 'Unnamed Campaign',
                        status: c.status || '',
                        platform: c.platform
                    };

                    if (uniqueCreatorsMap.has(key)) {
                        const existing = uniqueCreatorsMap.get(key)!;
                        existing.campaign_count = (existing.campaign_count || 1) + 1;
                        if (existing.campaigns) {
                            if (!existing.campaigns.some(camp => camp.id === campaignInfo.id)) {
                                existing.campaigns.push(campaignInfo);
                            }
                        }

                        // Optionally update status to the most 'advanced' one
                        const currentStatus = String(c.status || '').toLowerCase();
                        const existingStatus = String(existing.status || '').toLowerCase();
                        if (currentStatus.includes('live') || currentStatus.includes('completed')) {
                            existing.status = c.status;
                        } else if (currentStatus.includes('content') && !existingStatus.includes('live')) {
                            existing.status = c.status;
                        }
                    } else {
                        uniqueCreatorsMap.set(key, {
                            ...c,
                            campaign_count: 1,
                            campaigns: [campaignInfo]
                        });
                    }
                }
            });

            setCreators(Array.from(uniqueCreatorsMap.values()));
        } catch (error) {
            console.error('Failed to fetch creators across campaigns:', error);
            setCreators([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllCreators();
    }, []);

    const filteredCreators = useMemo(() => {
        return creators.filter((creator: Creator) => {
            const name = (creator.display_name || creator.name || '').toLowerCase();
            const niche = (creator.niche || creator.category || '').toLowerCase();
            const query = searchQuery.toLowerCase();

            const matchesSearch = name.includes(query) || niche.includes(query);

            const status = String(creator.status || '').toLowerCase();
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'Active' && (status === 'active' || status.includes('script') || status.includes('content'))) ||
                (statusFilter === 'Completed' && status === 'completed') ||
                (statusFilter === 'Finalized' && status === 'amount_finalized');

            return matchesSearch && matchesStatus;
        });
    }, [creators, searchQuery, statusFilter]);

    const sortedCreators = useMemo(() => {
        return [...filteredCreators].sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortField) {
                case 'name':
                    aValue = (a.display_name || a.name || '').toLowerCase();
                    bValue = (b.display_name || b.name || '').toLowerCase();
                    break;
                case 'followers':
                    aValue = a.followers_count || 0;
                    bValue = b.followers_count || 0;
                    break;
                case 'engagement':
                    aValue = parseFloat(a.engagement_rate || '0');
                    bValue = parseFloat(b.engagement_rate || '0');
                    break;
                case 'campaigns':
                    aValue = a.campaign_count || 0;
                    bValue = b.campaign_count || 0;
                    break;
                case 'totalEarned':
                    aValue = a.total_earned || 0;
                    bValue = b.total_earned || 0;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredCreators, sortField, sortDirection]);

    const paginatedCreators = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedCreators.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedCreators, currentPage]);

    const totalPages = Math.ceil(sortedCreators.length / itemsPerPage);

    const getPlatformIcon = React.useCallback((platform?: string) => {
        const p = String(platform || 'Instagram').toLowerCase();
        if (p.includes('youtube')) return <Youtube size={16} />;
        if (p.includes('instagram')) return <Instagram size={16} />;
        return <MessageCircle size={16} />;
    }, []);

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}><LoadingSpinner /></div>;
    }

    return (
        <div className="creators-container animate-fade-in">
            {/* Filter Bar */}
            <div className="filter-bar-clean">
                <div className="filter-left">
                    <div className="filter-label">
                        <Filter size={16} />
                        <span>Filter:</span>
                    </div>
                    <select
                        className="clean-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Collaborators</option>
                        <option value="Active">Currently Working</option>
                        <option value="Finalized">Deals Finalized</option>
                        <option value="Completed">Previous Partners</option>
                    </select>
                </div>

                <div className="filter-right" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                    <div className="view-toggle-clean">
                        <button
                            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                    </div>

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
                    </select>
                </div>
            </div>

            {/* Creators Content */}
            {sortedCreators.length > 0 ? (
                <div className={viewMode === 'grid' ? 'creators-grid-clean' : 'creators-list-view'}>
                    {paginatedCreators.map((creator) => (
                        viewMode === 'grid' ? (
                            <CreatorCard
                                key={creator.id || creator.creator_id}
                                creator={creator}
                                onNavigate={navigate}
                                getPlatformIcon={getPlatformIcon}
                            />
                        ) : (
                            <CreatorRow
                                key={creator.id || creator.creator_id}
                                creator={creator}
                                onNavigate={navigate}
                                getPlatformIcon={getPlatformIcon}
                            />
                        )
                    ))}
                </div>
            ) : (
                <div className="empty-state-clean">
                    <Users size={48} />
                    <h3>No Creators Found</h3>
                    <p>Once you accept details and start working with creators, they will appear here.</p>
                </div>
            )}

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
