import React from 'react';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import { Activity, Target, Edit } from 'lucide-react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from 'recharts';

interface CampaignOverviewTabProps {
    stats: any[];
    advancedMetrics: any[];
    growthData: any[];
    campaignData: any;
    handleOpenEditFollowerRanges: () => void;
}

export const CampaignOverviewTab: React.FC<CampaignOverviewTabProps> = ({
    stats,
    advancedMetrics,
    growthData,
    campaignData,
    handleOpenEditFollowerRanges
}) => {
    return (
        <>
            {/* Campaign Info */}
            <div className="stats-grid">
                {stats.map((stat: any, index: number) => (
                    <Card key={index} className="stat-card">
                        <CardBody>
                            <div className="stat-content">
                                <div className="stat-icon-wrapper"><stat.icon size={20} /></div>
                                <div className="stat-details">
                                    <p className="stat-label">{stat.label}</p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                                        <h3 className="stat-value">{stat.value}</h3>
                                        <span style={{ fontSize: 'var(--text-xs)', color: stat.trendType === 'positive' ? 'var(--color-success)' : 'var(--color-text-tertiary)', fontWeight: 'var(--font-medium)' }}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Efficiency Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                {advancedMetrics.map((m, i) => (
                    <div key={i} className="premium-card" style={{ padding: 'var(--space-4)' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 'var(--font-bold)', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                            {m.label}
                        </div>
                        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)', lineHeight: 1 }}>
                            {m.value}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                            {m.sub}
                        </div>
                    </div>
                ))}
            </div>


            {/* Campaign Growth Graph */}
            <Card className="analytics-card" style={{ marginTop: 'var(--space-6)' }}>
                <CardHeader>
                    <div className="card-header-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Activity size={20} color="var(--color-accent)" />
                            <h3 style={{ margin: 0 }}>Campaign Growth Pulse</h3>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <div style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                <div style={{ width: 8, height: 8, background: 'var(--color-accent)', borderRadius: '50%' }}></div>
                                Reach
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                <div style={{ width: 8, height: 8, background: 'var(--color-success)', borderRadius: '50%' }}></div>
                                Views
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--color-text-tertiary)"
                                    fontSize={12}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="var(--color-text-tertiary)"
                                    fontSize={12}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--color-border-subtle)',
                                        borderRadius: 'var(--radius-md)',
                                        boxShadow: 'var(--shadow-lg)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="reach"
                                    stroke="var(--color-accent)"
                                    fillOpacity={1}
                                    fill="url(#colorReach)"
                                    strokeWidth={3}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="var(--color-success)"
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>


            {/* Campaign Details Card */}
            <Card className="content-card" style={{ marginTop: 'var(--space-6)' }}>
                <CardHeader>
                    <h3>Campaign Details</h3>
                </CardHeader>
                <CardBody>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Description</p>
                            <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.description || 'No description'}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Go Live Date</p>
                            <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.go_live_date ? new Date(campaignData.go_live_date).toLocaleDateString() : 'Not set'}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Categories</p>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                {(campaignData.creator_categories || []).map((cat: string) => (
                                    <span key={cat} style={{ background: 'var(--color-bg-tertiary)', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{cat}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', margin: 0 }}>Follower Ranges</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleOpenEditFollowerRanges}
                                    style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}
                                >
                                    <Edit size={14} style={{ marginRight: '4px' }} />
                                    Edit
                                </Button>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                {(() => {
                                    const ranges = campaignData.follower_ranges || [];
                                    if (ranges.length === 0) {
                                        // Fallback: try to construct from min/max followers if follower_ranges is not available
                                        const minFollowers = campaignData.min_followers;
                                        const maxFollowers = campaignData.max_followers;
                                        if (minFollowers && maxFollowers) {
                                            const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
                                            return (
                                                <span style={{ background: 'var(--color-bg-tertiary)', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                                    {fmt(minFollowers)} – {fmt(maxFollowers)}
                                                </span>
                                            );
                                        }
                                        return <span style={{ color: 'var(--color-text-tertiary)' }}>Not specified</span>;
                                    }
                                    return ranges.map((range: string) => {
                                        const parts = range.split('-');
                                        if (parts.length !== 2) return null;
                                        const [min, max] = parts.map(Number);
                                        if (isNaN(min) || isNaN(max)) return null;
                                        const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
                                        return (
                                            <span key={range} style={{ background: 'var(--color-bg-tertiary)', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                                {fmt(min)} – {fmt(max)}
                                            </span>
                                        );
                                    }).filter(Boolean);
                                })()}
                            </div>
                        </div>

                        {/* Campaign Goal Progress */}
                        <div style={{ gridColumn: 'span 2', marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <Target size={18} color="var(--color-accent)" />
                                    Reach Goal Progress
                                </h4>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)' }}>75% of Target</span>
                            </div>
                            <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden', marginBottom: 'var(--space-2)' }}>
                                <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, var(--color-accent), #a855f7)', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '2px', background: 'white', opacity: 0.5 }}></div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                <span>Current: 450,000 Reach</span>
                                <span>Goal: 600,000 Reach</span>
                            </div>
                        </div>

                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Brief Status</p>
                            <span className={`status-badge ${campaignData.brief_completed ? 'status-active' : 'status-planning'}`}>
                                {campaignData.brief_completed ? 'Completed' : 'Pending'}
                            </span>
                        </div>
                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Review Status</p>
                            <span className={`status-badge ${campaignData.review_status === 'creators_are_final' ? 'status-active' : 'status-planning'}`}>
                                {campaignData.review_status || 'N/A'}
                            </span>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    );
};
