import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button, LoadingSpinner } from '../../../components';
import {
    Megaphone,
    Clock,
    CheckCircle,
    IndianRupee,
    AlertCircle
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
    
    useEffect(() => {
        fetchCampaigns();
    }, []);

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

    // Calculate stats from campaigns
    const activeCampaigns = campaigns.filter(c => 
        c.status === 'Active' || c.status === 'Negotiate' || c.status === 'Script Pending' || c.status === 'Content Review'
    ).length;
    const pendingSubmissions = campaigns.filter(c => 
        c.status === 'Script Pending' || c.status === 'Content Review'
    ).length;
    const completedCampaigns = campaigns.filter(c => 
        c.status === 'Completed' || c.status === 'Content Approved'
    ).length;
    
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

    const stats = [
        {
            label: 'Active Campaigns',
            value: activeCampaigns.toString(),
            change: `${campaigns.length} total`,
            icon: Megaphone
        },
        {
            label: 'Pending Submissions',
            value: pendingSubmissions.toString(),
            change: 'Requires action',
            icon: Clock
        },
        {
            label: 'Completed',
            value: completedCampaigns.toString(),
            change: `${campaigns.length > 0 ? Math.round((completedCampaigns / campaigns.length) * 100) : 0}% completion rate`,
            icon: CheckCircle
        },
        {
            label: 'Total Earnings',
            value: `₹${totalEarnings.toLocaleString()}`,
            change: `${campaigns.length} campaigns`,
            icon: IndianRupee
        }
    ];

    const earningsData: any[] = [];
    const platformData: any[] = [];
    const contentData: any[] = [];
    const engagementData: any[] = [];

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
