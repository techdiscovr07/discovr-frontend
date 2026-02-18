import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Button, LoadingSpinner } from '../../../components';
import {
    Megaphone,
    Users,
    FileText,
    IndianRupee
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { brandApi } from '../../../lib/api';

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

    const parseAmount = (value: unknown): number => {
        if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
        if (typeof value === 'string') return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
        return 0;
    };

    const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
    const activeCampaigns = safeCampaigns.filter((c: any) => String(c.status || '').toLowerCase() !== 'completed').length;
    const totalCreators = safeCampaigns.reduce((acc: number, c: any) => acc + parseAmount(c.creator_count ?? c.targetCreators), 0);
    const contentPending = safeCampaigns.reduce((acc: number, c: any) => acc + parseAmount(c.content_pending ?? c.pending_content), 0);
    const totalSpent = safeCampaigns.reduce((acc: number, c: any) => acc + parseAmount(c.spent ?? c.amount_spent), 0);
    const totalBudget = safeCampaigns.reduce((acc: number, c: any) => acc + parseAmount(c.total_budget ?? c.budget), 0);

    const stats = [
        {
            label: 'Active Campaigns',
            value: activeCampaigns.toString(),
            icon: Megaphone
        },
        {
            label: 'Total Creators',
            value: totalCreators.toString(),
            icon: Users
        },
        {
            label: 'Content Pending',
            value: contentPending.toString(),
            icon: FileText
        },
        {
            label: 'Total Spent',
            value: `₹${totalSpent.toLocaleString()}`,
            icon: IndianRupee
        }
    ];

    const monthMap = new Map<string, { month: string; sortKey: number; budget: number; spent: number }>();
    safeCampaigns.forEach((campaign: any) => {
        const rawDate = campaign.go_live_date || campaign.created_at || campaign.startDate;
        if (!rawDate) return;
        const date = new Date(rawDate);
        if (Number.isNaN(date.getTime())) return;

        const month = date.toLocaleDateString(undefined, { month: 'short' });
        const sortKey = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
        const existing = monthMap.get(month) || { month, sortKey, budget: 0, spent: 0 };
        existing.budget += parseAmount(campaign.total_budget ?? campaign.budget);
        existing.spent += parseAmount(campaign.spent ?? campaign.amount_spent);
        monthMap.set(month, existing);
    });
    const roiData = Array.from(monthMap.values())
        .sort((a, b) => a.sortKey - b.sortKey)
        .slice(-6)
        .map(({ month, budget, spent }) => ({ month, budget, spent }));

    const statusMap = new Map<string, number>();
    safeCampaigns.forEach((campaign: any) => {
        const rawStatus = String(campaign.status || 'Unknown').trim();
        statusMap.set(rawStatus, (statusMap.get(rawStatus) || 0) + 1);
    });
    const statusData = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));

    const budgetData = safeCampaigns
        .slice(0, 8)
        .map((campaign: any) => {
            const spent = parseAmount(campaign.spent ?? campaign.amount_spent);
            const budget = parseAmount(campaign.total_budget ?? campaign.budget);
            return {
                campaign: String(campaign.name || 'Campaign'),
                spent,
                remaining: Math.max(0, budget - spent)
            };
        });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="overview-container">
            <div className="dashboard-page-header animate-fade-in">
                <div className="header-text">
                    <h1>Dashboard Overview</h1>
                    <p>Track your campaign performance, engagement metrics, and budget allocation in real-time.</p>
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
                            <h3>Campaign Budget Trends</h3>
                            <Button variant="ghost" size="sm">6 Months</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {roiData.length > 0 ? (
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
                                        dataKey="budget"
                                        stroke="#4ade80"
                                        strokeWidth={3}
                                        name="Budget (₹)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ margin: 0 }}>No budget trend data available yet.</p>
                        )}
                    </CardBody>
                </Card>

                {/* Campaign Status */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Campaign Status</h3>
                            <Button variant="ghost" size="sm">Current</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={statusData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="status" stroke="rgba(255,255,255,0.5)" />
                                    <YAxis stroke="rgba(255,255,255,0.5)" allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(17, 24, 39, 0.95)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="count" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Campaigns" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ margin: 0 }}>No campaign status data available yet.</p>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Budget Allocation */}
            <div className="overview-bottom-grid full-width">
                <Card className="analytics-card budget-chart-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Budget Allocation</h3>
                            <div className="card-actions">
                                <Button variant="ghost" size="sm">Download Report</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {budgetData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={budgetData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="campaign" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        contentStyle={{
                                            background: '#1f2937',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="spent" name="Spent" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                    <Bar dataKey="remaining" name="Remaining" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ margin: 0 }}>
                                No budget allocation data available yet. Total budget: ₹{totalBudget.toLocaleString()}
                            </p>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
