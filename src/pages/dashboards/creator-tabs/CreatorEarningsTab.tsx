import React from 'react';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import {
    IndianRupee,
    TrendingUp,
    Clock,
    CheckCircle,
    Download
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

interface CreatorEarningsTabProps {
    searchQuery?: string;
}

export const CreatorEarningsTab: React.FC<CreatorEarningsTabProps> = ({ searchQuery: _searchQuery = '' }) => {
    const earningsStats = [
        { label: 'Total Earnings', value: '₹8,450', icon: IndianRupee, change: '+₹1,200 this month' },
        { label: 'Pending Payments', value: '₹1,850', icon: Clock, change: '3 campaigns' },
        { label: 'Paid This Month', value: '₹2,200', icon: CheckCircle, change: '5 campaigns' },
        { label: 'Average per Campaign', value: '₹704', icon: TrendingUp, change: '+12% vs last month' }
    ];

    // Monthly earnings data
    const monthlyEarnings = [
        { month: 'Jan', earnings: 850, campaigns: 2 },
        { month: 'Feb', earnings: 1200, campaigns: 3 },
        { month: 'Mar', earnings: 950, campaigns: 2 },
        { month: 'Apr', earnings: 1500, campaigns: 4 },
        { month: 'May', earnings: 1750, campaigns: 3 },
        { month: 'Jun', earnings: 2200, campaigns: 5 },
    ];

    // Earnings by platform
    const platformEarnings = [
        { platform: 'Instagram', earnings: 3200 },
        { platform: 'YouTube', earnings: 2800 },
        { platform: 'TikTok', earnings: 1850 },
        { platform: 'Twitter', earnings: 600 },
    ];

    // Payment history
    const paymentHistory = [
        {
            id: 1,
            campaign: 'Summer Collection Launch',
            brand: 'FashionHub',
            amount: '₹500',
            status: 'Paid',
            date: '2026-02-15',
            method: 'Bank Transfer'
        },
        {
            id: 2,
            campaign: 'Product Review Series',
            brand: 'TechCorp',
            amount: '₹750',
            status: 'Pending',
            date: '2026-03-01',
            method: 'PayPal'
        },
        {
            id: 3,
            campaign: 'Recipe Challenge',
            brand: 'FoodieBox',
            amount: '₹600',
            status: 'Processing',
            date: '2026-02-28',
            method: 'Bank Transfer'
        },
        {
            id: 4,
            campaign: 'Fitness Transformation',
            brand: 'FitLife',
            amount: '₹850',
            status: 'Paid',
            date: '2026-02-10',
            method: 'PayPal'
        },
        {
            id: 5,
            campaign: 'Makeup Tutorial Series',
            brand: 'BeautyBox',
            amount: '₹950',
            status: 'Pending',
            date: '2026-03-05',
            method: 'Bank Transfer'
        }
    ];

    return (
        <>

            {/* Earnings Stats */}
            <div className="stats-grid">
                {earningsStats.map((stat, index) => (
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
                {/* Monthly Earnings Trend */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Monthly Earnings Trend</h3>
                            <Button variant="ghost" size="sm">6 Months</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyEarnings}>
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
                            </LineChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                {/* Earnings by Platform */}
                <Card className="analytics-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Earnings by Platform</h3>
                            <Button variant="ghost" size="sm">All Time</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={platformEarnings}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="platform" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(17, 24, 39, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="earnings" fill="#60a5fa" radius={[8, 8, 0, 0]} name="Earnings (₹)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>

            {/* Payment History */}
            <Card className="content-card">
                <CardHeader>
                    <div className="card-header-content">
                        <h3>Payment History</h3>
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
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>{payment.campaign}</td>
                                        <td>{payment.brand}</td>
                                        <td className="amount-cell">{payment.amount}</td>
                                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                                        <td>{payment.method}</td>
                                        <td>
                                            <span className={`status-badge status-${payment.status.toLowerCase()}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td>
                                            {payment.status === 'Paid' && (
                                                <Button variant="ghost" size="sm">
                                                    <Download size={14} />
                                                    Receipt
                                                </Button>
                                            )}
                                            {payment.status === 'Pending' && (
                                                <Button variant="ghost" size="sm">View Details</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </>
    );
};
