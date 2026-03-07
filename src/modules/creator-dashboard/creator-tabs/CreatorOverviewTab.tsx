import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button, LoadingSpinner } from '../../../components';
import {
    IndianRupee,
    AlertCircle,
    Users,
    Heart,
    MessageCircle,
    Search,
    Activity,
    ExternalLink
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { creatorApi } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';

interface CreatorOverviewTabProps {
    searchQuery?: string;
}

export const CreatorOverviewTab: React.FC<CreatorOverviewTabProps> = ({ searchQuery: _searchQuery = '' }) => {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [campaigns, setCampaigns] = useState<any[]>([]);

    const [instaData, setInstaData] = useState<any>(null);
    const [isInstaLoading, setIsInstaLoading] = useState(false);
    const [trackUrl, setTrackUrl] = useState('');
    const [isTrackLoading, setIsTrackLoading] = useState(false);
    const [trackedPost, setTrackedPost] = useState<any>(null);

    useEffect(() => {
        fetchCampaigns();
        fetchInstaInsights();
    }, []);

    const handleTrackPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackUrl.trim()) return;

        setIsTrackLoading(true);
        try {
            const data = await creatorApi.trackInstagramPost(trackUrl);
            setTrackedPost(data);
            showToast('Real-time data fetched successfully!', 'success');
        } catch (error: any) {
            console.error('Failed to track post:', error);
            showToast(error.message || 'Could not find this post. Please ensure it is a public post from your account.', 'error');
        } finally {
            setIsTrackLoading(false);
        }
    };

    const fetchInstaInsights = async () => {
        setIsInstaLoading(true);
        try {
            const data = await creatorApi.getInstagramInsights();
            setInstaData(data);
        } catch (error: any) {
            console.warn('Failed to fetch Instagram insights:', error);
            // Don't show toast for this yet, as it might just mean they haven't connected
        } finally {
            setIsInstaLoading(false);
        }
    };

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const data = await creatorApi.getCampaigns() as any;
            // Handle different response formats: array, object with campaigns/data property, or null/undefined
            let campaignsArray: any[] = [];
            if (Array.isArray(data)) {
                campaignsArray = data;
            } else if (data && typeof data === 'object') {
                campaignsArray = data.campaigns || data.data || [];
            }
            setCampaigns(campaignsArray);
        } catch (error: any) {
            console.error('Failed to fetch creator campaigns:', error);
            showToast(error.message || 'Failed to fetch campaigns. Please try again.', 'error');
            setCampaigns([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate total earnings (sum of all campaign amounts)
    const totalEarnings = campaigns.reduce((sum, campaign) => {
        const amount = parseFloat(
            (campaign.amount || campaign.total_budget || '0')
                .toString()
                .replace('₹', '')
                .replace(',', '')
        ) || 0;
        return sum + amount;
    }, 0);

    const pendingSubmissions = campaigns.filter(c =>
        c.status === 'Script Pending' || c.status === 'Content Review'
    ).length;

    // Use real Instagram data for stats if available
    const followers = instaData?.profile?.followers_count || 0;
    const engagementRate = instaData?.engagement?.engagement_rate || 0;
    const avgLikes = instaData?.engagement?.avg_likes_per_post || 0;

    const stats = [
        {
            label: 'Total Followers',
            value: followers.toLocaleString(),
            change: 'Instagram Profile',
            icon: Users
        },
        {
            label: 'Engagement Rate',
            value: `${engagementRate}%`,
            change: 'Last 10 posts',
            icon: Heart
        },
        {
            label: 'Avg. Likes',
            value: Math.round(avgLikes).toLocaleString(),
            change: 'Per post',
            icon: MessageCircle
        },
        {
            label: 'Total Earnings',
            value: `₹${totalEarnings.toLocaleString()}`,
            change: `${campaigns.length} campaigns`,
            icon: IndianRupee
        }
    ];

    // Populate charts with real data
    const earningsData = campaigns.slice().reverse().map((c, i) => ({
        month: new Date(c.created_at || Date.now()).toLocaleString('default', { month: 'short' }),
        earnings: parseFloat((c.amount || '0').toString().replace(/[^0-9.]/g, '')),
        campaigns: i + 1
    }));

    const platformData = [
        { name: 'Instagram', value: 100, color: '#E1306C' }
    ];

    const contentData = instaData?.recent_media?.slice(0, 5).map((m: any) => ({
        type: m.media_type === 'CAROUSEL_ALBUM' ? 'Carousel' : (m.media_product_type === 'REELS' ? 'Reel' : 'Image'),
        count: m.like_count,
        avgEngagement: m.comments_count
    })) || [];

    const engagementData = instaData?.recent_media?.slice(0, 5).map((m: any, i: number) => ({
        week: `Post ${5 - i}`,
        likes: m.like_count,
        comments: m.comments_count,
        shares: m.insights?.shares || 0
    })).reverse() || [];

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className="stat-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardBody>
                            <div className="stat-content">
                                <div className="stat-icon">
                                    <stat.icon size={24} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-label">{stat.label}</p>
                                    <h3 className="stat-value">{stat.value}</h3>
                                    <p className="stat-change">{stat.change}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Analytics Charts */}
            <div className="analytics-grid">
                {/* Earnings Trend */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Earnings & Campaign Trends</h3>
                            <Button variant="ghost" size="sm">6 Months</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={earningsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(17, 24, 39, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="earnings"
                                    stroke="#4ade80"
                                    strokeWidth={3}
                                    name="Earnings (₹)"
                                    dot={{ fill: '#4ade80', r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="campaigns"
                                    stroke="#60a5fa"
                                    strokeWidth={3}
                                    name="Campaigns"
                                    dot={{ fill: '#60a5fa', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                {/* Platform Distribution */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Content Distribution</h3>
                            <Button variant="ghost" size="sm">All Platforms</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={platformData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={(entry) => `${entry.name}: ${entry.value}%`}
                                    labelLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                                >
                                    {platformData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(17, 24, 39, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>

            {/* Secondary Analytics */}
            <div className="analytics-grid-secondary">
                {/* Content Performance */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Content Performance</h3>
                            <Button variant="ghost" size="sm">This Month</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={contentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="type" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(17, 24, 39, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#60a5fa" radius={[8, 8, 0, 0]} name="Posts" />
                                <Bar dataKey="avgEngagement" fill="#a855f7" radius={[8, 8, 0, 0]} name="Avg Engagement" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                {/* Engagement Growth */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Engagement Growth</h3>
                            <Button variant="ghost" size="sm">Last 4 Weeks</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(17, 24, 39, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="likes" fill="#4ade80" radius={[8, 8, 0, 0]} name="Likes" />
                                <Bar dataKey="comments" fill="#60a5fa" radius={[8, 8, 0, 0]} name="Comments" />
                                <Bar dataKey="shares" fill="#fbbf24" radius={[8, 8, 0, 0]} name="Shares" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>

            {/* Real-time Post Tracker */}
            <Card className="analytics-card mt-6" style={{ marginTop: '2rem' }}>
                <CardHeader>
                    <div className="card-header-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Activity className="text-accent" size={24} color="var(--color-accent)" />
                            <h3 style={{ margin: 0 }}>Real-time Post Tracker</h3>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="post-tracker-container">
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                            Paste any Instagram post or reel link from your connected account to see its live performance metrics.
                        </p>
                        <form onSubmit={handleTrackPost} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }}>
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="https://www.instagram.com/reels/DAGz-5LSaDk/"
                                    value={trackUrl}
                                    onChange={(e) => setTrackUrl(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                                        background: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--color-border-subtle)',
                                        borderRadius: '12px',
                                        color: 'var(--color-text-primary)',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s ease',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border-subtle)'}
                                />
                            </div>
                            <Button type="submit" isLoading={isTrackLoading} disabled={!trackUrl.trim()}>
                                Track Live
                            </Button>
                        </form>

                        {trackedPost && (
                            <div className="tracked-post-result animate-fade-in" style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                border: '1px solid var(--color-border-subtle)'
                            }}>
                                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ width: '120px', height: '160px', borderRadius: '12px', overflow: 'hidden', background: 'var(--color-bg-tertiary)' }}>
                                        {trackedPost.media?.thumbnail_url || trackedPost.media?.media_url ? (
                                            <img
                                                src={trackedPost.media?.thumbnail_url || trackedPost.media?.media_url}
                                                alt="Post thumbnail"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-tertiary)' }}>
                                                <Instagram size={32} color="var(--color-text-tertiary)" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: '250px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div>
                                                <span style={{
                                                    background: 'rgba(225, 48, 108, 0.15)',
                                                    color: '#E1306C',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.5rem',
                                                    display: 'inline-block'
                                                }}>
                                                    {trackedPost.media?.media_product_type || trackedPost.media?.media_type}
                                                </span>
                                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
                                                    {trackedPost.media?.caption?.slice(0, 60)}...
                                                </h4>
                                                <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.85rem' }}>
                                                    Published on {new Date(trackedPost.media?.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <a
                                                href={trackedPost.media?.permalink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                                            >
                                                View on Insta <ExternalLink size={14} />
                                            </a>
                                        </div>

                                        <div className="insights-grid-mini" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
                                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                                                <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Likes</div>
                                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>{trackedPost.media?.like_count?.toLocaleString()}</div>
                                            </div>
                                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                                                <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Comments</div>
                                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>{trackedPost.media?.comments_count?.toLocaleString()}</div>
                                            </div>
                                            {trackedPost.insights && Object.entries(trackedPost.insights).map(([key, val]: [string, any]) => (
                                                <div key={key} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                                                    <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{key.replace(/_/g, ' ')}</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>{val?.toLocaleString()}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Important Notice */}
            {pendingSubmissions > 0 && (
                <Card className="notice-card">
                    <CardBody>
                        <div className="notice-content">
                            <div className="notice-icon">
                                <AlertCircle size={24} />
                            </div>
                            <div className="notice-text">
                                <h4>Action Required</h4>
                                <p>You have {pendingSubmissions} pending submission{pendingSubmissions > 1 ? 's' : ''}. Complete them before the deadline to avoid penalties.</p>
                            </div>
                            <Button variant="secondary">View Details</Button>
                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    );
};
