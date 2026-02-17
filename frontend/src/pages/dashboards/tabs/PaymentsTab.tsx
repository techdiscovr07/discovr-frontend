import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Button, LoadingSpinner } from '../../../components';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';
import adminDashboardData from '../../../data/adminDashboard.json';

interface PaymentsTabProps {
    searchQuery?: string;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ searchQuery = '' }) => {
    const { showToast } = useToast();
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPayments = async () => {
        try {
            const data = await adminApi.getPayments();
            setPayments(data.payments || []);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            // Fallback for demo
            setPayments(adminDashboardData.payments.map((p: any) => ({
                ...p,
                creator_id: p.id,
                name: p.creator,
                campaign_name: p.campaign,
                brand_name: p.brand,
                final_amount: parseFloat(p.amount.replace('₹', '').replace(',', '')),
                status: p.status === 'Paid' ? 'payment_completed' :
                    p.status === 'Approved' ? 'payment_approved' : 'content_live',
                due_date: new Date(p.dueDate).toISOString()
            })));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleProcessPayment = async (payment: any) => {
        try {
            await adminApi.processPayment(payment.campaign_id, {
                creator_id: payment.creator_id,
                payment_amount: payment.final_amount,
                payment_method: 'bank_transfer',
                transaction_id: 'TRX-' + Math.random().toString(36).substr(2, 9).toUpperCase()
            });
            fetchPayments(); // Refresh
            showToast('Payment processed successfully!', 'success');
        } catch (error: any) {
            console.error('Failed to process payment:', error);
            showToast(error.message || 'Failed to process payment', 'error');
        }
    };

    const getStatusIcon = (status: string) => {
        if (status === 'payment_completed') return <CheckCircle size={16} />;
        if (status === 'payment_approved') return <Clock size={16} />;
        return <AlertCircle size={16} />;
    };

    const displayStatus = (status: string) => {
        if (status === 'payment_completed') return 'Paid';
        if (status === 'payment_approved') return 'Approved';
        return 'Pending';
    };

    if (isLoading) return <LoadingSpinner />;

    const filteredPayments = payments.filter(payment =>
        payment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPending = filteredPayments.filter(p => p.status !== 'payment_completed' && p.status !== 'payment_approved').reduce((sum, p) => sum + p.final_amount, 0);
    const totalApproved = filteredPayments.filter(p => p.status === 'payment_approved').reduce((sum, p) => sum + p.final_amount, 0);
    const totalPaid = filteredPayments.filter(p => p.status === 'payment_completed').reduce((sum, p) => sum + p.final_amount, 0);

    return (
        <>
            {/* Payment Summary */}
            <div className="payment-summary">
                <Card className="payment-summary-card">
                    <CardBody>
                        <div className="payment-summary-item">
                            <div className="payment-summary-icon pending">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <p className="payment-summary-label">Pending</p>
                                <h3 className="payment-summary-value">₹{totalPending.toLocaleString()}</h3>
                                <p className="payment-summary-count">{filteredPayments.filter(p => p.status !== 'payment_completed' && p.status !== 'payment_approved').length} payments</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="payment-summary-card">
                    <CardBody>
                        <div className="payment-summary-item">
                            <div className="payment-summary-icon approved">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="payment-summary-label">Approved</p>
                                <h3 className="payment-summary-value">₹{totalApproved.toLocaleString()}</h3>
                                <p className="payment-summary-count">{filteredPayments.filter(p => p.status === 'payment_approved').length} payments</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="payment-summary-card">
                    <CardBody>
                        <div className="payment-summary-item">
                            <div className="payment-summary-icon paid">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="payment-summary-label">Paid</p>
                                <h3 className="payment-summary-value">₹{totalPaid.toLocaleString()}</h3>
                                <p className="payment-summary-count">{filteredPayments.filter(p => p.status === 'payment_completed').length} payments</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Payments Table */}
            <Card className="content-card">
                <CardHeader>
                    <div className="card-header-content">
                        <h3>All Payments</h3>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Creator</th>
                                    <th>Campaign</th>
                                    <th>Brand</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.creator_id}>
                                        <td>
                                            <div className="creator-cell">
                                                <span className="creator-avatar">{payment.name?.charAt(0)}</span>
                                                <span>{payment.name}</span>
                                            </div>
                                        </td>
                                        <td>{payment.campaign_name}</td>
                                        <td>{payment.brand_name}</td>
                                        <td className="payment-amount">₹{payment.final_amount?.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge payment-status-${displayStatus(payment.status).toLowerCase()}`}>
                                                {getStatusIcon(payment.status)}
                                                {displayStatus(payment.status)}
                                            </span>
                                        </td>
                                        <td>{new Date(payment.due_date).toLocaleDateString()}</td>
                                        <td>
                                            {payment.status !== 'payment_completed' && payment.status !== 'payment_approved' && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleProcessPayment(payment)}
                                                >
                                                    Process Payment
                                                </Button>
                                            )}
                                            {payment.status === 'payment_approved' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleProcessPayment(payment)}
                                                >
                                                    Finalize
                                                </Button>
                                            )}
                                            {payment.status === 'payment_completed' && (
                                                <Button variant="ghost" size="sm">View Receipt</Button>
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
