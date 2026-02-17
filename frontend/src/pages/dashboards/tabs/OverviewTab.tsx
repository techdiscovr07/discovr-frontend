import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Button, LoadingSpinner } from '../../../components';
import {
    Building2,
    Users,
    TrendingUp,
    IndianRupee,
    MoreVertical
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
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
import { adminApi } from '../../../lib/api';
import adminDashboardData from '../../../data/adminDashboard.json';

interface OverviewTabProps {
    searchQuery?: string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ searchQuery: _searchQuery = '' }) => {
    const [statsData, setStatsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminApi.getStats();
                setStatsData(data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const overview = adminDashboardData.overview;

    const stats = [
        {
            label: 'Total Brands',
            value: statsData?.total_brands || '0',
            change: '+12%', // Mock change for now
            icon: Building2
        },
        {
            label: 'Active Campaigns',
            value: statsData?.active_campaigns || '0',
            change: '+5%',
            icon: TrendingUp
        },
        {
            label: 'Total Creators',
            value: statsData?.total_creators || '0',
            change: '+18%',
            icon: Users
        },
        {
            label: 'Total Revenue',
            value: '₹12.4L',
            change: '+24%',
            icon: IndianRupee
        }
    ];

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const revenueData = overview.revenueData;
    const campaignPerformanceData = overview.campaignPerformanceData;
    const activityData = overview.activityData;
    const creatorDistribution = overview.creatorDistribution;
    const recentBrands = overview.recentBrands;
    const recentCampaigns = overview.recentCampaigns;

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
                {/* Revenue Trend */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Revenue & Campaign Trends</h3>
                            <Button variant="ghost" size="sm">6 Months</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
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
                                    dataKey="revenue"
                                    stroke="#60a5fa"
                                    strokeWidth={3}
                                    dot={{ fill: '#60a5fa', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="campaigns"
                                    stroke="#4ade80"
                                    strokeWidth={3}
                                    dot={{ fill: '#4ade80', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                {/* Platform Activity */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Platform Activity (7 Days)</h3>
                            <Button variant="ghost" size="sm">This Week</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
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
                                    dataKey="creators"
                                    stackId="1"
                                    stroke="#a855f7"
                                    fill="rgba(168, 85, 247, 0.3)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="campaigns"
                                    stackId="1"
                                    stroke="#60a5fa"
                                    fill="rgba(96, 165, 250, 0.3)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="brands"
                                    stackId="1"
                                    stroke="#4ade80"
                                    fill="rgba(74, 222, 128, 0.3)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>

            {/* Secondary Analytics */}
            <div className="analytics-grid-secondary">
                {/* Campaign Performance */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Campaign Performance by Brand</h3>
                            <Button variant="ghost" size="sm">All Time</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={campaignPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(17, 24, 39, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="completed" fill="#4ade80" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="active" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="pending" fill="#fbbf24" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                {/* Creator Distribution */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Creator Distribution by Platform</h3>
                            <Button variant="ghost" size="sm">Total: 342</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={creatorDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={(entry) => `${entry.name}: ${entry.value}`}
                                    labelLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                                >
                                    {creatorDistribution.map((entry, index) => (
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

            {/* Content Sections */}
            <div className="dashboard-content">
                {/* Recent Brands */}
                <Card className="content-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Recent Brands</h3>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Brand</th>
                                        <th>Campaigns</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBrands.map((brand) => (
                                        <tr key={brand.id}>
                                            <td>
                                                <div className="brand-cell">
                                                    <span className="brand-logo">{brand.logo}</span>
                                                    <span>{brand.name}</span>
                                                </div>
                                            </td>
                                            <td>{brand.campaigns}</td>
                                            <td>
                                                <span className="status-badge status-active">{brand.status}</span>
                                            </td>
                                            <td>
                                                <button className="action-button">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                {/* Recent Campaigns */}
                <Card className="content-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Recent Campaigns</h3>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Campaign</th>
                                        <th>Brand</th>
                                        <th>Creators</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentCampaigns.map((campaign) => (
                                        <tr key={campaign.id}>
                                            <td>{campaign.name}</td>
                                            <td>{campaign.brand}</td>
                                            <td>{campaign.creators}</td>
                                            <td>
                                                <span className={`status-badge status-${campaign.status.toLowerCase().replace(' ', '-')}`}>
                                                    {campaign.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="action-button">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
};
