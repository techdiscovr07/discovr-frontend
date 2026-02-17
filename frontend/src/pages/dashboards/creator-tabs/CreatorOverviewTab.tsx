import React from 'react';
import { Card, CardHeader, CardBody, Button } from '../../../components';
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
import creatorDashboardData from '../../../data/creatorDashboard.json';

interface CreatorOverviewTabProps {
    searchQuery?: string;
}

export const CreatorOverviewTab: React.FC<CreatorOverviewTabProps> = ({ searchQuery: _searchQuery = '' }) => {
    const overview = creatorDashboardData.overview;
    
    // Map icon names to actual icons
    const iconMap: Record<string, any> = {
        Megaphone,
        Clock,
        CheckCircle,
        IndianRupee
    };
    
    const stats = overview.stats.map(stat => ({
        ...stat,
        icon: iconMap[stat.label === 'Active Campaigns' ? 'Megaphone' : 
                     stat.label === 'Pending Submissions' ? 'Clock' :
                     stat.label === 'Completed' ? 'CheckCircle' : 'IndianRupee']
    }));

    const earningsData = overview.earningsData;
    const platformData = overview.platformData;
    const contentData = overview.contentData;
    const engagementData = overview.engagementData;

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
            <Card className="notice-card">
                <CardBody>
                    <div className="notice-content">
                        <div className="notice-icon">
                            <AlertCircle size={24} />
                        </div>
                        <div className="notice-text">
                            <h4>Action Required</h4>
                            <p>You have 2 pending submissions. Complete them before the deadline to avoid penalties.</p>
                        </div>
                        <Button variant="secondary">View Details</Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
};
