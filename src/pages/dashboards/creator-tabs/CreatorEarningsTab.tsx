import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button, LoadingSpinner } from '../../../components';
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
    const [isLoading, setIsLoading] = useState(true);
    const [earningsStats] = useState([
        { label: 'Total Earnings', value: '₹0', icon: IndianRupee, change: 'No data' },
        { label: 'Pending Payments', value: '₹0', icon: Clock, change: 'No data' },
        { label: 'Paid This Month', value: '₹0', icon: CheckCircle, change: 'No data' },
        { label: 'Average per Campaign', value: '₹0', icon: TrendingUp, change: 'No data' }
    ]);
    const [monthlyEarnings] = useState<any[]>([]);
    const [platformEarnings] = useState<any[]>([]);
    const [paymentHistory] = useState<any[]>([]);

    useEffect(() => {
        // TODO: Fetch earnings data from API when endpoint is available
        // const fetchEarningsData = async () => {
        //     setIsLoading(true);
        //     try {
        //         const data = await creatorApi.getEarnings();
        //         // Process and set the data
        //     } catch (error) {
        //         console.error('Failed to fetch earnings data:', error);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };
        // fetchEarningsData();
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

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
                        {monthlyEarnings.length > 0 ? (
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
                        ) : (
                            <div style={{ 
                                height: 300, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: 'var(--color-text-secondary)'
                            }}>
                                No earnings data available
                            </div>
                        )}
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
                        {platformEarnings.length > 0 ? (
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
                        ) : (
                            <div style={{ 
                                height: 300, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: 'var(--color-text-secondary)'
                            }}>
                                No platform earnings data available
                            </div>
                        )}
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
                                {paymentHistory.length > 0 ? (
                                    paymentHistory.map((payment) => (
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-secondary)' }}>
                                            No payment history available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </>
    );
};
