import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, LoadingSpinner } from '../../components';
import {
    ArrowLeft,
    FileText,
    IndianRupee,
    MessageSquare,
    TrendingUp,
    Eye,
    Download
} from 'lucide-react';
import { brandApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import './AdminDashboard.css';
import './BrandDashboard.css';

export const CreatorDetails: React.FC = () => {
    const { id: campaignId, creatorId } = useParams<{ id: string; creatorId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [creator, setCreator] = useState<any>(null);
    const [campaign, setCampaign] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!campaignId || !creatorId) return;
            setIsLoading(true);
            try {
                // Fetch creator list for this campaign
                const creatorsResponse: any = await brandApi.getCampaignCreators(campaignId);
                const creators = Array.isArray(creatorsResponse) ? creatorsResponse : (creatorsResponse?.creators || []);
                const foundCreator = creators.find((c: any) => (c.id || c.creator_id) === creatorId);

                if (foundCreator) {
                    setCreator(foundCreator);
                }

                // Fetch campaign details for context (name)
                const campaignsResponse = await brandApi.getCampaigns() as any;
                const campaigns = Array.isArray(campaignsResponse) ? campaignsResponse : (campaignsResponse?.campaigns || []);
                const foundCampaign = campaigns.find((c: any) => c.id === campaignId);
                if (foundCampaign) {
                    setCampaign(foundCampaign);
                }
            } catch (error: any) {
                console.error('Failed to fetch creator details:', error);
                showToast(error.message || 'Failed to load creator details', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [campaignId, creatorId, showToast]);

    if (isLoading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
    }

    if (!creator) {
        return (
            <div className="dashboard" style={{ background: 'var(--color-bg-primary)', padding: 'var(--space-8)' }}>
                <Button variant="ghost" onClick={() => navigate(`/brand/campaign/${campaignId}`)}>
                    <ArrowLeft size={20} /> Back to Campaign
                </Button>
                <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
                    <h2>Creator not found</h2>
                    <p>We couldn't find the details for this creator in this campaign.</p>
                </div>
            </div>
        );
    }

    const creatorName = creator.name || creator.creator_name || 'Unknown Creator';
    const creatorStatus = creator.status || 'pending';
    const creatorHandle = creator.instagram || creator.handle || creator.email || 'No handle';
    const campaignName = campaign?.name || 'Campaign Details';

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
                                <h1 className="dashboard-title">{creatorName}</h1>
                                <span className={`status-badge ${creatorStatus === 'accepted' || creatorStatus === 'Published' || creatorStatus === 'script_approved' || creatorStatus === 'content_approved'
                                    ? 'status-active'
                                    : creatorStatus === 'rejected' || creatorStatus === 'script_rejected' || creatorStatus === 'content_rejected'
                                        ? 'status-error'
                                        : 'status-planning'
                                    }`}>
                                    {creatorStatus.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <p className="dashboard-subtitle">
                                {creator.instagram ? (
                                    <a
                                        href={creator.instagram.startsWith('http') ? creator.instagram : `https://instagram.com/${creator.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'var(--color-accent)', textDecoration: 'none', marginRight: 'var(--space-2)' }}
                                    >
                                        @{creator.instagram.replace('@', '')}
                                    </a>
                                ) : (
                                    <span>{creatorHandle}</span>
                                )}
                                • {campaignName} • Campaign ID: #{campaignId}
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
                                    <h3>Campaign Script</h3>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                    {creator.script_submitted_at && (
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                            Submitted {new Date(creator.script_submitted_at).toLocaleDateString()}
                                        </span>
                                    )}
                                    <span className={`status-badge ${creatorStatus === 'script_approved' ? 'status-active' :
                                        creatorStatus === 'script_rejected' ? 'status-error' :
                                            creatorStatus === 'script_revision_requested' ? 'status-warning' :
                                                'status-planning'
                                        }`} style={{ fontSize: 'var(--text-xs)' }}>
                                        {creatorStatus.includes('script') ? creatorStatus.split('_').pop() : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {creator.script_content ? (
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
                                    {creator.script_content}
                                </div>
                            ) : (
                                <div style={{ padding: 'var(--space-8)', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                                    <p style={{ color: 'var(--color-text-tertiary)' }}>No script submitted yet.</p>
                                </div>
                            )}
                            {creator.script_feedback && (
                                <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid var(--color-warning)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-warning)', marginBottom: '4px' }}>Feedback</p>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{creator.script_feedback}</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    <Card className="content-card">
                        <CardHeader>
                            <div className="card-header-content">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <IndianRupee size={20} style={{ color: 'var(--color-success)' }} />
                                    <h3>Deal Information</h3>
                                </div>
                                <span className={`status-badge ${creator.status === 'accepted' || creator.status === 'amount_finalized' || creator.status === 'payment_completed' ? 'status-active' : 'status-planning'}`}>
                                    {creator.status === 'payment_completed' ? 'Completed' : 'Active'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                                        Negotiated Amount:
                                    </span>
                                    <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>
                                        ₹{(creator.final_amount || creator.proposed_amount || 0).toLocaleString()}
                                    </span>
                                </div>
                                {creator.bid_amount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                                            Original Bid:
                                        </span>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                                            ₹{creator.bid_amount.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' }}>
                                    Timeline
                                </h4>
                                <div style={{ background: 'var(--color-surface-glass)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', border: '1px solid var(--color-border-subtle)' }}>
                                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '2px' }}>Joined Campaign</p>
                                            <p style={{ fontSize: 'var(--text-sm)' }}>{new Date(creator.created_at).toLocaleDateString()}</p>
                                        </div>
                                        {creator.content_submitted_at && (
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '2px' }}>Video Submitted</p>
                                                <p style={{ fontSize: 'var(--text-sm)' }}>{new Date(creator.content_submitted_at).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                        {creator.went_live_at && (
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '2px' }}>Went Live</p>
                                                <p style={{ fontSize: 'var(--text-sm)' }}>{new Date(creator.went_live_at).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' }}>
                                    Content Progress
                                </h4>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 'var(--space-4)',
                                    background: 'var(--color-surface-glass)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border-subtle)'
                                }}>
                                    <div>
                                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                                            Primary Deliverable
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                            {creator.live_url ? 'Content is live' : 'In review process'}
                                        </div>
                                    </div>
                                    <span className={`status-badge ${creator.live_url ? 'status-active' :
                                        creator.content_url ? 'status-negotiate' :
                                            'status-planning'
                                        }`}>
                                        {creator.live_url ? 'Live' : creator.content_url ? 'Review' : 'Pending'}
                                    </span>
                                </div>
                                {creator.live_url && (
                                    <div style={{ marginTop: 'var(--space-3)' }}>
                                        <Button variant="ghost" size="sm" onClick={() => window.open(creator.live_url, '_blank')}>
                                            <Eye size={14} /> View Live Content
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Performance Stats */}
                <Card className="content-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Analytics Summary</h3>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                    Est. Reach: {(creator.followers || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                            <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface-glass)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>Avg Views</p>
                                <p style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>{(creator.avg_views || 0).toLocaleString()}</p>
                            </div>
                            <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface-glass)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>Engagement</p>
                                <p style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>{creator.commercial || 'N/A'}</p>
                            </div>
                            <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface-glass)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>Followers</p>
                                <p style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>{creator.followers ? (creator.followers >= 1000000 ? (creator.followers / 1000000).toFixed(1) + 'M' : (creator.followers / 1000).toFixed(0) + 'K') : '0'}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

            </main>
        </div>
    );
};
