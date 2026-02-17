import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button } from '../../components';
import {
    ArrowLeft,
    FileText,
    IndianRupee,
    MessageSquare,
    CheckCircle2,
    Clock,
    TrendingUp,
    Eye,
    Download
} from 'lucide-react';
import creatorDetailsData from '../../data/creatorDetails.json';
import './AdminDashboard.css';
import './BrandDashboard.css';

export const CreatorDetails: React.FC = () => {
    const { id: campaignId, creatorId } = useParams<{ id: string; creatorId: string }>();
    const navigate = useNavigate();

    // Get creator data from JSON
    const creatorData = creatorDetailsData.creators.find(c => c.id === creatorId) || creatorDetailsData.creators[0];

    return (
        <div className="dashboard" style={{ background: 'var(--color-bg-primary)' }}>
            <main className="dashboard-main" style={{ marginLeft: 0, width: '100%', padding: 'var(--space-8)' }}>
                {/* Header */}
                <header className="dashboard-header" style={{ marginBottom: 'var(--space-8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/brand/campaign/${campaignId}`)}>
                            <ArrowLeft size={20} />
                        </Button>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <h1 className="dashboard-title">{creatorData.name}</h1>
                                <span className={`status-badge ${creatorData.status === 'Published' ? 'status-active' : 'status-planning'}`}>
                                    {creatorData.status}
                                </span>
                            </div>
                            <p className="dashboard-subtitle">
                                {creatorData.handle} • {creatorData.campaignName} • Campaign ID: #{campaignId}
                            </p>
                        </div>
                    </div>
                    <div className="tab-actions">
                        <Button variant="ghost">
                            <Download size={18} />
                            Export Details
                        </Button>
                        <Button>
                            <MessageSquare size={18} />
                            Contact Creator
                        </Button>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                    {/* Script Section */}
                    <Card className="content-card">
                        <CardHeader>
                            <div className="card-header-content">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <FileText size={20} style={{ color: 'var(--color-accent)' }} />
                                    <h3>Shared Script</h3>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                        {creatorData.script.version}
                                    </span>
                                    {creatorData.script.approvedDate && (
                                        <span className="status-badge status-active" style={{ fontSize: 'var(--text-xs)' }}>
                                            Approved
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                                        Shared Date:
                                    </span>
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                                        {new Date(creatorData.script.sharedDate).toLocaleDateString()}
                                    </span>
                                </div>
                                {creatorData.script.approvedDate && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                                            Approved Date:
                                        </span>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                                            {new Date(creatorData.script.approvedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div style={{
                                padding: 'var(--space-4)',
                                background: 'var(--color-surface-glass)',
                                border: '1px solid var(--color-border-subtle)',
                                borderRadius: 'var(--radius-lg)',
                                whiteSpace: 'pre-wrap',
                                fontSize: 'var(--text-sm)',
                                lineHeight: 'var(--leading-relaxed)',
                                color: 'var(--color-text-secondary)',
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}>
                                {creatorData.script.content}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Deal Section */}
                    <Card className="content-card">
                        <CardHeader>
                            <div className="card-header-content">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <IndianRupee size={20} style={{ color: 'var(--color-success)' }} />
                                    <h3>Deal Information</h3>
                                </div>
                                <span className={`status-badge ${creatorData.deal.status === 'Closed' ? 'status-active' : 'status-planning'}`}>
                                    {creatorData.deal.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                                        Total Amount:
                                    </span>
                                    <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>
                                        {creatorData.deal.totalAmount}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                                        Closed Date:
                                    </span>
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                                        {new Date(creatorData.deal.closedDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' }}>
                                    Payment Breakdown
                                </h4>
                                {creatorData.deal.paymentBreakdown.map((payment, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 'var(--space-3)',
                                        marginBottom: 'var(--space-2)',
                                        background: 'var(--color-surface-glass)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border-subtle)'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                                                {payment.item}
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                                {payment.status === 'Paid' && payment.paidDate &&
                                                    `Paid on ${new Date(payment.paidDate).toLocaleDateString()}`
                                                }
                                                {payment.status === 'Pending' && 'Payment pending'}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
                                                {payment.amount}
                                            </span>
                                            {payment.status === 'Paid' ? (
                                                <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                                            ) : (
                                                <Clock size={16} style={{ color: 'var(--color-warning)' }} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' }}>
                                    Deliverables
                                </h4>
                                {creatorData.deal.deliverables.map((deliverable, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 'var(--space-3)',
                                        marginBottom: 'var(--space-2)',
                                        background: 'var(--color-surface-glass)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border-subtle)'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                                                {deliverable.count}x {deliverable.type}
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                                Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <span className={`status-badge ${deliverable.status === 'Completed' ? 'status-active' :
                                            deliverable.status === 'In Progress' ? 'status-bidding' :
                                                'status-planning'
                                            }`}>
                                            {deliverable.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Negotiation History */}
                <Card className="content-card" style={{ marginBottom: 'var(--space-6)' }}>
                    <CardHeader>
                        <h3>Negotiation History</h3>
                    </CardHeader>
                    <CardBody className="no-padding">
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Event</th>
                                        <th style={{ textAlign: 'right' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {creatorData.deal.negotiationHistory.map((negotiation, index) => (
                                        <tr key={index}>
                                            <td>{new Date(negotiation.date).toLocaleDateString()}</td>
                                            <td>{negotiation.event}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'var(--font-semibold)' }}>
                                                {negotiation.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                {/* Communication Log */}
                <Card className="content-card" style={{ marginBottom: 'var(--space-6)' }}>
                    <CardHeader>
                        <h3>Communication Log</h3>
                    </CardHeader>
                    <CardBody>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {creatorData.communications.map((comm, index) => (
                                <div key={index} style={{
                                    padding: 'var(--space-4)',
                                    background: 'var(--color-surface-glass)',
                                    border: '1px solid var(--color-border-subtle)',
                                    borderRadius: 'var(--radius-lg)',
                                    borderLeft: '3px solid var(--color-accent)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                                {comm.type}
                                            </span>
                                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                                {comm.from} → {comm.to}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                            {new Date(comm.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)' }}>
                                        {comm.subject}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                        {comm.preview}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Content Performance */}
                <Card className="content-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Content Performance</h3>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                    Avg Engagement: {creatorData.engagement}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="no-padding">
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Content</th>
                                        <th>Published Date</th>
                                        <th>Views</th>
                                        <th>Engagement</th>
                                        <th>Engagement Rate</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {creatorData.contentPerformance.map((content, index) => (
                                        <tr key={index}>
                                            <td style={{ fontWeight: 'var(--font-semibold)' }}>{content.content}</td>
                                            <td>{new Date(content.publishedDate).toLocaleDateString()}</td>
                                            <td>{(content.views / 1000).toFixed(1)}K</td>
                                            <td>{(content.engagement / 1000).toFixed(1)}K</td>
                                            <td>
                                                <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-semibold)' }}>
                                                    {content.engagementRate}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
};
