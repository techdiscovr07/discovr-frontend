import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Modal, TextArea, Input } from '../../components';
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    Calendar,
    FileText,
    MessageSquare,
    Upload,
    Info,
    ChevronRight
} from 'lucide-react';
import campaignDetailsData from '../../data/campaignDetails.json';
import './AdminDashboard.css';
import './CreatorDashboard.css';

export const CreatorCampaignDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [modalType, setModalType] = useState<'script' | 'content' | null>(null);
    const [scriptContent, setScriptContent] = useState('');
    const [contentLink, setContentLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Get campaign data from JSON
    const campaignData = campaignDetailsData.campaigns.find(c => c.id === id) || campaignDetailsData.campaigns[0];

    const handleAction = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                setModalType(null);
                setIsSuccess(false);
            }, 2000);
        }, 1500);
    };

    return (
        <div className="dashboard" style={{ background: 'var(--color-bg-primary)' }}>
            <main className="dashboard-main" style={{ marginLeft: 0, width: '100%', padding: 'var(--space-8)' }}>
                {/* Header */}
                <header className="dashboard-header" style={{ marginBottom: 'var(--space-8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/creator/dashboard')}>
                            <ArrowLeft size={20} />
                        </Button>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <h1 className="dashboard-title">{campaignData.name}</h1>
                                <span className={`status-badge status-active`}>{campaignData.status}</span>
                            </div>
                            <p className="dashboard-subtitle">
                                {campaignData.brand} • Creator Campaign Details
                            </p>
                        </div>
                    </div>
                    <div className="tab-actions">
                        <Button variant="ghost">
                            <MessageSquare size={18} />
                            Contact Brand
                        </Button>
                        {campaignData.status === 'Active' && (
                            <Button onClick={() => setModalType('script')}>
                                <Upload size={18} />
                                Submit New Script
                            </Button>
                        )}
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
                    {/* Left Column: Brief & Tasks */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                        {/* Campaign Brief */}
                        <Card className="content-card">
                            <CardHeader>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <FileText size={20} style={{ color: 'var(--color-accent)' }} />
                                    <h3>Campaign Brief & Guidelines</h3>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: 'var(--space-6)' }}>
                                    {campaignData.description}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <h5 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Key Requirements
                                    </h5>
                                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                        {[
                                            'Maintain a bright, summer-themed aesthetic',
                                            'Mention the brand name @FashionHub within the first 3 seconds',
                                            'Use the provided background music for Reels',
                                            'Include a clear call-to-action to check the link in bio'
                                        ].map((req, i) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                                <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Deliverables Checklist */}
                        <Card className="content-card">
                            <CardHeader>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Clock size={20} style={{ color: 'var(--color-warning)' }} />
                                    <h3>My Deliverables</h3>
                                </div>
                            </CardHeader>
                            <CardBody className="no-padding">
                                <div className="table-responsive">
                                    <table className="creators-table">
                                        <thead>
                                            <tr>
                                                <th>Task</th>
                                                <th>Deadline</th>
                                                <th>Status</th>
                                                <th style={{ textAlign: 'right' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { name: 'Concept & Script Submission', date: 'Mar 15, 2026', status: 'Completed', type: 'script' },
                                                { name: 'Instagram Reel - Outdoor Shoot', date: 'Mar 18, 2026', status: 'Pending', type: 'content' },
                                                { name: 'Instagram Story - Behind the scenes', date: 'Mar 19, 2026', status: 'Upcoming', type: 'content' },
                                                { name: 'Final Post Submission', date: 'Mar 22, 2026', status: 'Upcoming', type: 'content' }
                                            ].map((task, i) => (
                                                <tr key={i}>
                                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{task.name}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                                            <Calendar size={14} />
                                                            {task.date}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${task.status === 'Completed' ? 'status-active' :
                                                            task.status === 'Pending' ? 'status-content-review' :
                                                                'status-planning'
                                                            }`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {task.status !== 'Completed' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setModalType(task.type as any)}
                                                            >
                                                                {task.type === 'script' ? 'Submit' : 'Upload'}
                                                                <ChevronRight size={14} />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Column: Mini Stats & Action Center */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        {/* Status Card */}
                        <Card style={{ background: 'linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.1) 0%, transparent 100%)' }}>
                            <CardBody>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                    <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Current Progress</h4>
                                    <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)' }}>25%</span>
                                </div>
                                <div className="progress-bar" style={{ height: '8px', marginBottom: 'var(--space-4)' }}>
                                    <div className="progress-fill" style={{ width: '25%' }}></div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-warning)', fontSize: 'var(--text-xs)' }}>
                                    <Clock size={14} />
                                    Next submission due in 2 days
                                </div>
                            </CardBody>
                        </Card>

                        {/* Payout Details */}
                        <Card>
                            <CardHeader>
                                <h3>Payment Schedule</h3>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Milestone 1 (Script)</span>
                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>₹150</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Milestone 2 (Content)</span>
                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>₹350</span>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: 'var(--space-2) 0' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-bold)' }}>Total Contract</span>
                                        <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-success)', fontSize: 'var(--text-xl)' }}>₹500</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Support Card */}
                        <Card className="notice-card" style={{ margin: 0 }}>
                            <CardBody>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                                    <Info size={20} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
                                    <div>
                                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>Need Help?</h4>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                            Read the full creator policy or contact support if you have questions about this campaign.
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Modals (Integrated for completeness) */}
                <Modal
                    isOpen={modalType !== null}
                    onClose={() => !isSubmitting && setModalType(null)}
                    title={modalType === 'script' ? 'Submit Script' : 'Upload Content'}
                    size="md"
                >
                    {!isSuccess ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                            {modalType === 'script' ? (
                                <TextArea
                                    label="Script Content"
                                    placeholder="Write your campaign script here..."
                                    rows={10}
                                    value={scriptContent}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScriptContent(e.target.value)}
                                    required
                                />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <Input
                                        label="Content Link"
                                        placeholder="https://instagram.com/p/..."
                                        value={contentLink}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContentLink(e.target.value)}
                                    />
                                    <div style={{ border: '2px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-10)', textAlign: 'center' }}>
                                        <Upload size={32} style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }} />
                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Click to upload file</p>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
                                <Button variant="ghost" onClick={() => setModalType(null)} disabled={isSubmitting}>Cancel</Button>
                                <Button onClick={handleAction} isLoading={isSubmitting}>Submit</Button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: 'var(--space-8) 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-4)' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
                                <CheckCircle2 size={40} />
                            </div>
                            <h3>Submission Successful!</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>Your submission has been sent to the brand for review.</p>
                        </div>
                    )}
                </Modal>
            </main>
        </div>
    );
};
