import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, LoadingSpinner } from '../../components';
import {
    ArrowLeft,
    Calendar,
    Users,
    Instagram,
    Youtube,
    MessageCircle,
    TrendingUp,
    DollarSign,
    Award,
    ExternalLink,
    MapPin,
    Briefcase
} from 'lucide-react';
import { brandApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import '../../components/DashboardShared.css';
import './BrandDashboard.css';

interface CreatorInfo {
    display_name?: string;
    name?: string;
    category?: string;
    niche?: string;
    platform?: string;
    followers_count?: number;
    engagement_rate?: string;
    instagram?: string;
    id: string;
    creator_id?: string;
    uid?: string;
    status?: string;
}

interface AssociatedCampaign {
    campaignId: string;
    campaignName: string;
    campaignBudget?: number | string;
    campaignStatus: string;
    status: string;
    final_amount?: number;
    proposed_amount?: number;
    platform?: string;
    created_at?: string;
}

export const BrandCreatorInfo: React.FC = () => {
    const { creatorId } = useParams<{ creatorId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [creatorInfo, setCreatorInfo] = useState<CreatorInfo | null>(null);
    const [associatedCampaigns, setAssociatedCampaigns] = useState<AssociatedCampaign[]>([]);

    useEffect(() => {
        const fetchCreatorGlobalInfo = async () => {
            if (!creatorId) return;
            setIsLoading(true);
            try {
                // 1. Fetch all campaigns for this brand
                const campaignsData = await brandApi.getCampaigns() as { data?: any[], campaigns?: any[] } | any[];
                const campaigns = Array.isArray(campaignsData) ? campaignsData : (campaignsData?.campaigns || campaignsData?.data || []);

                // 2. For each campaign, fetch its creators and look for this specific creator
                const creatorsPromises = campaigns.map((campaign: { id: string; name: string; total_budget?: number; budget?: number; status: string }) =>
                    brandApi.getCampaignCreators(campaign.id).then(data => {
                        const campaignCreators = (Array.isArray(data) ? data : ((data as { creators?: any[] })?.creators || []));
                        const found = campaignCreators.find((c: any) => (c.creator_id || c.id || c.uid) === creatorId);

                        // We only care about campaigns where they reached "amount_finalized" or above
                        if (found) {
                            const status = String(found.status || '').toLowerCase();
                            const isQualified = [
                                'amount_finalized', 'active', 'script_review',
                                'script_approved', 'content_review', 'content_approved',
                                'completed'
                            ].some(s => status.includes(s));

                            if (isQualified) {
                                return {
                                    ...found,
                                    campaignId: campaign.id,
                                    campaignName: campaign.name,
                                    campaignBudget: campaign.total_budget || campaign.budget,
                                    campaignStatus: campaign.status
                                };
                            }
                        }
                        return null;
                    })
                );

                const results = await Promise.all(creatorsPromises);
                const filteredResults = results.filter((r): r is AssociatedCampaign => r !== null);

                if (filteredResults.length > 0) {
                    // Use the most "complete" record for basic info
                    const bestInfo = (filteredResults.find(r => (r as any).followers_count) || filteredResults[0]) as unknown as CreatorInfo;
                    setCreatorInfo({
                        ...bestInfo,
                        id: bestInfo.id || bestInfo.creator_id || creatorId
                    });
                    setAssociatedCampaigns(filteredResults);
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to load creator information';
                console.error('Failed to fetch creator info:', error);
                showToast(message, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCreatorGlobalInfo();
    }, [creatorId, showToast]);

    const totalEarnings = useMemo(() =>
        associatedCampaigns.reduce((sum, c) => sum + (c.final_amount || c.proposed_amount || 0), 0)
        , [associatedCampaigns]);

    const getPlatformIcon = (platform?: string) => {
        const p = String(platform || 'Instagram').toLowerCase();
        if (p.includes('youtube')) return <Youtube size={16} />;
        if (p.includes('instagram')) return <Instagram size={16} />;
        return <MessageCircle size={16} />;
    };

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('completed')) return 'status-completed';
        if (s.includes('active') || s.includes('live')) return 'status-active';
        if (s.includes('script') || s.includes('content')) return 'status-content';
        return 'status-negotiation';
    };

    if (isLoading) {
        return (
            <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
                <LoadingSpinner />
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Loading creator profile...</p>
            </div>
        );
    }

    if (!creatorInfo) {
        return (
            <div className="dashboard" style={{ background: 'var(--color-bg-primary)', padding: 'var(--space-8)' }}>
                <Button variant="ghost" onClick={() => navigate('/brand/dashboard?tab=creators')}>
                    <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to Collaborators
                </Button>
                <div className="empty-state-clean" style={{ marginTop: 'var(--space-20)', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-bg-secondary)', display: 'grid', placeItems: 'center', margin: '0 auto var(--space-6)' }}>
                        <Users size={40} style={{ color: 'var(--color-text-tertiary)' }} />
                    </div>
                    <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>Creator profile not found</h3>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                        We couldn't find any historical collaboration data for this creator in your account.
                    </p>
                    <Button
                        variant="primary"
                        style={{ marginTop: 'var(--space-8)' }}
                        onClick={() => navigate('/brand/dashboard?tab=creators')}
                    >
                        Return to List
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="overview-container" style={{ padding: '0 0 var(--space-12)' }}>
            {/* Top Banner / Hero Section */}
            <div style={{
                height: '240px',
                background: 'linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%)',
                position: 'relative',
                marginBottom: 'var(--space-16)',
                borderBottom: '1px solid var(--color-border-subtle)'
            }}>
                <div style={{ position: 'absolute', top: 'var(--space-8)', left: 'var(--space-8)' }}>
                    <Button
                        variant="ghost"
                        style={{ background: 'var(--color-bg-primary)', padding: '8px 16px', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-md)' }}
                        onClick={() => navigate('/brand/dashboard?tab=creators')}
                    >
                        <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back
                    </Button>
                </div>

                {/* Profile Floating Header */}
                <div style={{
                    position: 'absolute',
                    bottom: '-60px',
                    left: 'var(--space-12)',
                    right: 'var(--space-12)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 'var(--space-8)'
                }}>
                    <div className="creator-avatar-circle" style={{
                        width: '140px',
                        height: '140px',
                        fontSize: '60px',
                        border: '6px solid var(--color-bg-primary)',
                        background: 'var(--color-bg-secondary)',
                        boxShadow: 'var(--shadow-xl)',
                        borderRadius: '40px'
                    }}>
                        {(creatorInfo.display_name || creatorInfo.name || '?')[0].toUpperCase()}
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: '4px' }}>
                            <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.03em', margin: 0 }}>
                                {creatorInfo.display_name || creatorInfo.name}
                            </h1>
                            <span style={{
                                padding: '4px 12px',
                                background: 'var(--color-surface-glass)',
                                border: '1px solid var(--color-border-subtle)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: '700',
                                color: 'var(--color-text-secondary)',
                                textTransform: 'uppercase'
                            }}>
                                {creatorInfo.category || creatorInfo.niche || 'Creator'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', color: 'var(--color-text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {getPlatformIcon(creatorInfo.platform)}
                                <span style={{ fontSize: 'var(--text-sm)' }}>{creatorInfo.platform || 'Instagram'}</span>
                            </div>
                            {creatorInfo.instagram && (
                                <a
                                    href={`https://instagram.com/${creatorInfo.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--color-accent)', textDecoration: 'none' }}
                                >
                                    <ExternalLink size={14} />
                                    @{creatorInfo.instagram.replace('@', '')}
                                </a>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}>
                                <MapPin size={14} />
                                <span>India</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
                        <Button variant="primary">Download Media Kit</Button>
                        <Button variant="secondary" onClick={() => showToast('Feature coming soon', 'info')}>Message</Button>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 var(--space-12)', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-10)' }}>
                {/* Main Content Area */}
                <div>
                    {/* Performance Metrics Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-12)' }}>
                        <div className="premium-card" style={{ padding: 'var(--space-5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', display: 'grid', placeItems: 'center' }}>
                                    <Briefcase size={20} />
                                </div>
                                <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
                            </div>
                            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Campaigns</p>
                            <h3 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>{associatedCampaigns.length}</h3>
                        </div>

                        <div className="premium-card" style={{ padding: 'var(--space-5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', display: 'grid', placeItems: 'center' }}>
                                    <DollarSign size={20} />
                                </div>
                                <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
                            </div>
                            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Brand Value</p>
                            <h3 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: 'var(--color-success)' }}>
                                ₹{totalEarnings >= 100000
                                    ? (totalEarnings / 100000).toFixed(1) + 'L'
                                    : totalEarnings.toLocaleString()}
                            </h3>
                        </div>

                        <div className="premium-card" style={{ padding: 'var(--space-5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', display: 'grid', placeItems: 'center' }}>
                                    <Award size={20} />
                                </div>
                            </div>
                            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Engagement</p>
                            <h3 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>{creatorInfo.engagement_rate || '4.2%'}</h3>
                        </div>

                        <div className="premium-card" style={{ padding: 'var(--space-5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', display: 'grid', placeItems: 'center' }}>
                                    <Users size={20} />
                                </div>
                            </div>
                            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Followers</p>
                            <h3 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>
                                {creatorInfo.followers_count
                                    ? (creatorInfo.followers_count / 1000).toFixed(1) + 'K'
                                    : '0'}
                            </h3>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Collaboration History
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: '500', padding: '2px 8px', background: 'var(--color-bg-tertiary)', borderRadius: '6px', color: 'var(--color-text-tertiary)' }}>
                            {associatedCampaigns.length}
                        </span>
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {associatedCampaigns.map((collaboration) => (
                            <div
                                key={collaboration.campaignId}
                                className="premium-card"
                                style={{
                                    padding: 'var(--space-6)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                onClick={() => navigate(`/brand/campaign/${collaboration.campaignId}/creator/${creatorId}`)}
                            >
                                <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--color-bg-primary)',
                                        display: 'grid',
                                        placeItems: 'center',
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        border: '1px solid var(--color-border-subtle)'
                                    }}>
                                        {collaboration.campaignName[0]}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>{collaboration.campaignName}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Calendar size={12} />
                                                <span>Worked on {new Date(collaboration.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <DollarSign size={12} />
                                                <span>₹{(collaboration.final_amount || collaboration.proposed_amount || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                                    <span className={`status-pill ${getStatusStyle(collaboration.status)}`} style={{ minWidth: '100px', textAlign: 'center' }}>
                                        {collaboration.status.replace(/_/g, ' ')}
                                    </span>
                                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
                                        <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <Card style={{ border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-secondary)' }}>
                        <CardBody style={{ padding: 'var(--space-6)' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>Profile Details</h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                                <div>
                                    <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Audience Niche</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        <span style={{ padding: '4px 10px', background: 'var(--color-bg-primary)', borderRadius: '6px', fontSize: '12px', border: '1px solid var(--color-border-subtle)' }}>
                                            {creatorInfo.niche || creatorInfo.category || 'Digital Creator'}
                                        </span>
                                        <span style={{ padding: '4px 10px', background: 'var(--color-bg-primary)', borderRadius: '6px', fontSize: '12px', border: '1px solid var(--color-border-subtle)' }}>
                                            Lifestyle
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Primary Platform</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e1306c', color: 'white', display: 'grid', placeItems: 'center' }}>
                                            <Instagram size={18} />
                                        </div>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>Instagram</span>
                                    </div>
                                </div>

                                <div>
                                    <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Account Status</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>Highly Recommended</span>
                                    </div>
                                </div>
                            </div>

                            <hr style={{ margin: 'var(--space-8) 0', border: 0, borderTop: '1px solid var(--color-border-subtle)' }} />

                            <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: 'var(--space-4)' }}>Social Links</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start', background: 'var(--color-bg-primary)' }}>
                                    <Instagram size={16} style={{ marginRight: '10px' }} /> Instagram Profile
                                </Button>
                                <Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start', background: 'var(--color-bg-primary)' }}>
                                    <Youtube size={16} style={{ marginRight: '10px' }} /> YouTube Channel
                                </Button>
                                <Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start', background: 'var(--color-bg-primary)' }}>
                                    <MessageCircle size={16} style={{ marginRight: '10px' }} /> Telegram
                                </Button>
                            </div>
                        </CardBody>
                    </Card>

                    <Card style={{ border: '1px dashed var(--color-border-medium)', background: 'rgba(96, 165, 250, 0.05)' }}>
                        <CardBody style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                            <TrendingUp size={32} style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }} />
                            <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: 'var(--space-2)' }}>Brand Affinity</h4>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                This creator has shown high convertion rates for Finance & Tech categories in past campaigns.
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};
