import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Button, LoadingSpinner } from '../../../components';
import {
    Megaphone,
    Users,
    FileText,
    IndianRupee,
    TrendingUp,
    Activity,
    ArrowUpRight
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { brandApi } from '../../../lib/api';
import brandDashboardData from '../../../data/brandDashboard.json';

interface BrandOverviewTabProps {
    searchQuery?: string;
}

export const BrandOverviewTab: React.FC<BrandOverviewTabProps> = ({ searchQuery: _searchQuery = '' }) => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                const camps = await brandApi.getCampaigns() as any[];
                setCampaigns(camps || []);
            } catch (error) {
                console.error('Failed to fetch brand overview data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOverviewData();
    }, []);

    const overview = brandDashboardData.overview;

    const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
    const activeCampaigns = safeCampaigns.filter((c: any) => c.status !== 'Completed').length;
    const totalSpent = safeCampaigns.reduce((acc: number, c: any) => {
        const spentVal = typeof c.spent === 'string' ?
            parseFloat(c.spent.replace(/[^0-9.]/g, '')) || 0 :
            (typeof c.spent === 'number' ? c.spent : 0);
        return acc + spentVal;
    }, 0);

    const stats = [
        {
            label: 'Active Campaigns',
            value: activeCampaigns.toString(),
            change: '+2',
            icon: Megaphone
        },
        {
            label: 'Total Creators',
            value: '24', // Needs creators API
            change: '+4',
            icon: Users
        },
        {
            label: 'Content Pending',
            value: '12',
            change: '-3',
            icon: FileText
        },
        {
            label: 'Total Spent',
            value: `₹${totalSpent.toLocaleString()}`,
            change: '+15%',
            icon: IndianRupee
        }
    ];

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const roiData = overview.roiData;
    const engagementData = overview.engagementData;
    const budgetData = overview.budgetData;

    return (
        <div className="overview-container">
            {/* Humanized Welcome Section */}
            <div className="welcome-section animate-fade-in">
                <div className="welcome-text">
                    <span className="welcome-badge">Efficiency: 94%</span>
                    <h1>Growth Mode: Active.</h1>
                    <p>You're pacing 12% ahead of last month's reach targets. Elite creators are responding to your latest brief.</p>
                </div>
                <div className="welcome-signature">
                    <span className="signature-text">"Scale fast, scale right."</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className="stat-card premium-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardBody>
                            <div className="stat-content">
                                <div className="stat-icon-wrapper">
                                    <stat.icon size={20} />
                                </div>
                                <div className="stat-details">
                                    <div className="stat-header">
                                        <p className="stat-label">{stat.label}</p>
                                        <span className="stat-trend">
                                            <ArrowUpRight size={12} /> {stat.change}
                                        </span>
                                    </div>
                                    <h3 className="stat-value">{stat.value}</h3>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Analytics Charts */}
            <div className="analytics-grid">
                {/* Campaign ROI */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Campaign ROI Trends</h3>
                            <Button variant="ghost" size="sm">6 Months</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={roiData}>
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
                                    dataKey="spent"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    name="Spent (₹)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4ade80"
                                    strokeWidth={3}
                                    name="Revenue (₹)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                {/* Creator Engagement */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Creator Engagement</h3>
                            <Button variant="ghost" size="sm">Last 4 Weeks</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={engagementData}>
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
                                <Area
                                    type="monotone"
                                    dataKey="engagement"
                                    stackId="1"
                                    stroke="#a855f7"
                                    fill="rgba(168, 85, 247, 0.3)"
                                    name="Engagement"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="reach"
                                    stackId="2"
                                    stroke="#60a5fa"
                                    fill="rgba(96, 165, 250, 0.3)"
                                    name="Reach"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>

            {/* Budget Allocation */}
            <div className="overview-bottom-grid">
                <Card className="analytics-card budget-chart-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Budget allocation</h3>
                            <Button variant="ghost" size="sm">Active</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={budgetData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="campaign" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(17, 24, 39, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="spent" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="remaining" fill="var(--color-accent-alt)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                {/* Live Creator Activity Feed */}
                <Card className="analytics-card activity-feed-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3><Activity size={18} style={{ marginRight: 8, color: 'var(--color-accent-alt)' }} /> Pulse</h3>
                            <span className="status-live">LIVE</span>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="activity-list">
                            {[
                                { user: 'Aisha V.', action: 'uploaded 2 new drafts', time: '2m ago', icon: FileText },
                                { user: 'Rohit S.', action: 'accepted campaign brief', time: '15m ago', icon: Activity },
                                { user: 'Deepika P.', action: 'hit viral milestone (50k)', time: '1h ago', icon: TrendingUp },
                                { user: 'System', action: 'Matched 4 new creators', time: '3h ago', icon: Megaphone }
                            ].map((item, i) => (
                                <div className="activity-item" key={i}>
                                    <div className="activity-icon-sm">
                                        <item.icon size={14} />
                                    </div>
                                    <div className="activity-info">
                                        <p><strong>{item.user}</strong> {item.action}</p>
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
