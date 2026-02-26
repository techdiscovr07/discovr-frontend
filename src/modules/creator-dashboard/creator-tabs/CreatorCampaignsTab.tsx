import { CreatorActionModal } from '../components/CreatorActionModal';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, LoadingSpinner } from '../../../components';
import { useToast } from '../../../contexts/ToastContext';
import {
    Upload,
    Video,
    Clock,
    Instagram,
    ArrowRight,
    Filter,
    ArrowUpDown,
    Megaphone
} from 'lucide-react';
import { creatorApi } from '../../../lib/api';
import '../CreatorDashboard.css';

interface CreatorCampaignsTabProps {
    searchQuery?: string;
}

interface Campaign {
    id: string;
    _id?: string;
    campaign_id?: string;
    name: string;
    brand: string;
    description: string;
    requirements?: string[];
    deadline: string;
    status?: string;
    stage?: string;
    bid_amount?: number | string;
    final_amount?: number | string;
    proposed_amount?: number | string;
    amount?: number | string;
    budget?: number | string;
    total_budget?: number | string;
    progress?: number | string;
    script_content?: string;
    script?: string;
    submitted_script?: string;
    script_template?: string;
}

interface CreatorCampaignCardProps {
    campaign: Campaign;
    onNavigate: (path: string) => void;
    onOpenModal: (campaign: Campaign, type: string) => void;
    getStatusClass: (status: string) => string;
    getStatusLabel: (campaign: Campaign) => string;
    getDisplayAmount: (campaign: Campaign) => string;
    getProgressValue: (campaign: Campaign) => number;
    isNegotiationStatus: (campaign: Campaign) => boolean;
    getBrandOfferAmount: (campaign: Campaign) => number;
    isDealAcceptedOrFinalized: (campaign: Campaign) => boolean;
    getNegotiationMessage: (campaign: Campaign) => string;
    parseAmount: (value: any) => number;
    formatINR: (value?: number | string) => string | null;
    canUploadContentForCampaign: (campaign: Campaign) => boolean;
    canGoLiveForCampaign: (campaign: Campaign) => boolean;
}

// Memoized Campaign Card Component
const CreatorCampaignCard = React.memo(({
    campaign,
    onNavigate,
    onOpenModal,
    getStatusClass,
    getStatusLabel,
    getDisplayAmount,
    getProgressValue,
    isNegotiationStatus,
    getBrandOfferAmount,
    isDealAcceptedOrFinalized,
    getNegotiationMessage,
    parseAmount,
    formatINR,
    canUploadContentForCampaign,
    canGoLiveForCampaign
}: CreatorCampaignCardProps) => {
    const campaignId = campaign.id || campaign._id || campaign.campaign_id;

    // Pre-fetch on hover
    const handleMouseEnter = () => {
        if (campaignId) {
            creatorApi.getCampaignBrief(campaignId).catch(() => { });
            creatorApi.getBidStatus(campaignId).catch(() => { });
        }
    };

    return (
        <div
            className="creator-campaign-card-detailed"
            onMouseEnter={handleMouseEnter}
            onClick={() => {
                if (campaignId) {
                    onNavigate(`/creator/campaign/${campaignId}`);
                }
            }}
        >
            <div className="creator-campaign-header">
                <div>
                    <h4 className="creator-campaign-name">{campaign.name}</h4>
                    <div className="creator-campaign-brand">
                        <Instagram size={14} />
                        {campaign.brand}
                    </div>
                </div>
                <div className="creator-campaign-amount">{getDisplayAmount(campaign)}</div>
            </div>

            <p className="campaign-description">{campaign.description}</p>

            <div className="campaign-requirements">
                <h5>Deliverables</h5>
                <div className="requirements-list">
                    {campaign.requirements?.map((req: string, idx: number) => (
                        <span key={idx} className="requirement-tag">{req}</span>
                    ))}
                </div>
            </div>

            <div className="creator-campaign-status-bar">
                <div className="status-info">
                    <span className={`status-badge ${getStatusClass(getStatusLabel(campaign))}`}>
                        {getStatusLabel(campaign)}
                    </span>
                    <span className="creator-campaign-deadline">
                        <Clock size={14} />
                        Due {new Date(campaign.deadline || Date.now()).toLocaleDateString()}
                    </span>
                </div>
                <div className="progress-bar" style={{ height: '4px' }}>
                    <div
                        className="progress-fill"
                        style={{ width: `${getProgressValue(campaign)}%` }}
                    ></div>
                </div>
            </div>

            <div className="creator-campaign-actions">
                {isNegotiationStatus(campaign) && (
                    <div className="creator-negotiation-note">
                        {parseAmount(campaign?.bid_amount) > 0
                            ? `Your Proposal: ${formatINR(parseAmount(campaign.bid_amount))}`
                            : getBrandOfferAmount(campaign) > 0
                                ? `Brand Offer: ${formatINR(getBrandOfferAmount(campaign))}`
                                : 'No offer yet'}
                    </div>
                )}
                {isNegotiationStatus(campaign) && (
                    getNegotiationMessage(campaign) ? (
                        <div className="creator-negotiation-note">
                            {getNegotiationMessage(campaign)}
                        </div>
                    ) : null
                )}
                {isNegotiationStatus(campaign) && !isDealAcceptedOrFinalized(campaign) && getBrandOfferAmount(campaign) > 0 && (
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', width: '100%' }}>
                        <Button
                            size="sm"
                            fullWidth
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onOpenModal(campaign, 'accept-deal');
                            }}
                            style={{ background: 'var(--color-success)', color: 'white', border: 'none' }}
                        >
                            Accept Deal
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            fullWidth
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onOpenModal(campaign, 'reject-deal');
                            }}
                            style={{ color: 'var(--color-error)', border: '1px solid var(--color-error)' }}
                        >
                            Decline
                        </Button>
                    </div>
                )}
                {isNegotiationStatus(campaign) && !isDealAcceptedOrFinalized(campaign) && (
                    <Button
                        size="sm"
                        fullWidth
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onOpenModal(campaign, 'negotiate');
                        }}
                    >
                        {parseAmount(campaign?.bid_amount) > 0 ? 'Update Proposal' : 'Start Negotiation'}
                    </Button>
                )}
                {campaign.stage === 'script' && (
                    <Button
                        size="sm"
                        fullWidth
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onOpenModal(campaign, 'script');
                        }}
                    >
                        <Upload size={16} />
                        Submit Script
                    </Button>
                )}
                {(campaign.stage === 'content' || canUploadContentForCampaign(campaign)) && (
                    <Button
                        size="sm"
                        fullWidth
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onOpenModal(campaign, 'content');
                        }}
                        disabled={!canUploadContentForCampaign(campaign)}
                    >
                        <Video size={16} />
                        Upload Content
                    </Button>
                )}
                {canGoLiveForCampaign(campaign) && (
                    <Button
                        size="sm"
                        fullWidth
                        variant="secondary"
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onOpenModal(campaign, 'go-live');
                        }}
                    >
                        Go Live
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (campaignId) {
                            onNavigate(`/creator/campaign/${campaignId}`);
                        }
                    }}
                >
                    Details
                    <ArrowRight size={16} />
                </Button>
            </div>
        </div>
    );
});

type ModalType = 'script' | 'content' | 'go-live' | 'participate' | 'negotiate' | 'accept-deal' | 'reject-deal' | null;

export const CreatorCampaignsTab: React.FC<CreatorCampaignsTabProps> = ({ searchQuery = '' }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [scriptContent, setScriptContent] = useState('');
    const [contentLink, setContentLink] = useState('');
    const [contentFiles, setContentFiles] = useState<File[]>([]);
    const [negotiationAmount, setNegotiationAmount] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('latest');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const data = await creatorApi.getCampaigns() as any;
            let campaignsArray: Campaign[] = [];
            if (Array.isArray(data)) {
                campaignsArray = data;
            } else if (data && typeof data === 'object') {
                campaignsArray = data.campaigns || data.data || [];
            }
            const enrichLimit = 10;
            const campaignIds = campaignsArray.slice(0, enrichLimit).map((c: Campaign) => c.id || c._id || c.campaign_id).filter(Boolean) as string[];

            const bidStatuses = await Promise.allSettled(
                campaignIds.map((id: string) => creatorApi.getBidStatus(id))
            );

            const enriched = campaignsArray.map((campaign: Campaign, index: number) => {
                if (index >= enrichLimit) return campaign;

                const result = bidStatuses[index];
                if (result.status !== 'fulfilled' || !result.value) return campaign;
                const bid = result.value as any;
                const status = bid?.status ?? campaign?.status;
                const final_amount = bid?.final_amount ?? campaign?.final_amount;
                const proposed_amount = bid?.proposed_amount ?? campaign?.proposed_amount;
                const bid_amount = bid?.bid_amount ?? campaign?.bid_amount;
                return {
                    ...campaign,
                    status,
                    final_amount,
                    proposed_amount,
                    bid_amount: bid_amount ?? campaign?.bid_amount,
                };
            });
            setCampaigns(enriched);
        } catch (error: any) {
            console.error('Failed to fetch creator campaigns:', error);
            showToast(error.message || 'Failed to fetch campaigns. Please try again.', 'error');
            setCampaigns([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const getStatusClass = React.useCallback((status: string) => {
        const normalized = String(status || '').toLowerCase().replace(/\s+/g, '_');
        switch (normalized) {
            case 'active':
            case 'deal_accepted':
            case 'content_approved':
            case 'content_live':
                return 'status-active';
            case 'negotiate':
            case 'negotiation':
            case 'in_negotiation':
                return 'status-negotiation';
            case 'script_pending':
            case 'script_submitted':
                return 'status-script';
            case 'script_approved':
                return 'status-active';
            case 'content_pending':
                return 'status-content';
            case 'pending_for_approval':
            case 'pending':
                return 'status-pending';
            case 'bid_submitted':
            case 'bid_pending':
                return 'status-review';
            default: return 'status-planning';
        }
    }, []);

    const handleOpenModal = React.useCallback((campaign: Campaign, type: string) => {
        setSelectedCampaign(campaign);
        setModalType(type as ModalType);
        setIsSuccess(false);
        if (type === 'script') {
            const existingScript =
                campaign?.script_content ||
                campaign?.script ||
                campaign?.submitted_script ||
                campaign?.script_template ||
                '';
            setScriptContent(existingScript);
        } else {
            setScriptContent('');
        }
        setContentLink('');
        setContentFiles([]);
        setNegotiationAmount('');
        setLiveLink('');
    }, []);

    const getWorkflowStatus = React.useCallback((campaign: Campaign) =>
        String(campaign?.status || '')
            .toLowerCase()
            .replace(/\s+/g, '_'), []);

    const canUploadContentForCampaign = React.useCallback((campaign: Campaign) => {
        const status = getWorkflowStatus(campaign);
        const stage = String(campaign?.stage || '').toLowerCase();
        if (status === 'content_pending' || status === 'content_approved' || status === 'content_live') return false;
        if (status === 'script_approved' || status === 'content_rejected' || status === 'content_revision_requested') return true;
        return stage === 'content';
    }, [getWorkflowStatus]);

    const canGoLiveForCampaign = React.useCallback((campaign: Campaign) => getWorkflowStatus(campaign) === 'content_approved', [getWorkflowStatus]);

    const isNegotiationStatus = React.useCallback((campaign: Campaign) => {
        const status = getWorkflowStatus(campaign);
        const stage = String(campaign?.stage || '').toLowerCase();
        return (
            stage === 'negotiate' ||
            status === 'negotiate' ||
            status === 'negotiation' ||
            status === 'in_negotiation' ||
            status === 'bid_pending' ||
            status === 'amount_negotiated' ||
            status === 'accepted'
        );
    }, [getWorkflowStatus]);

    const parseAmount = React.useCallback((value: number | string | null | undefined): number => {
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
        const cleaned = String(value).replace(/[^0-9.]/g, '');
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    }, []);

    const hasCreatorProposal = React.useCallback((campaign: Campaign) => parseAmount(campaign?.bid_amount) > 0, [parseAmount]);

    const isBrandAcceptedCreatorOffer = React.useCallback((campaign: Campaign) => {
        const status = getWorkflowStatus(campaign);
        return status === 'accepted' && hasCreatorProposal(campaign);
    }, [getWorkflowStatus, hasCreatorProposal]);

    const isDealAcceptedOrFinalized = React.useCallback((campaign: Campaign) => {
        const status = getWorkflowStatus(campaign);
        return status === 'amount_finalized' || isBrandAcceptedCreatorOffer(campaign);
    }, [getWorkflowStatus, isBrandAcceptedCreatorOffer]);

    const getBrandOfferAmount = React.useCallback((campaign: Campaign): number => {
        return parseAmount(campaign?.final_amount) || parseAmount(campaign?.proposed_amount) || parseAmount(campaign?.amount);
    }, [parseAmount]);

    const formatINR = React.useCallback((value?: number | string) => {
        const num = Number(value);
        if (!Number.isFinite(num) || num <= 0) return null;
        return `₹${num.toLocaleString('en-IN')}`;
    }, []);

    const getDisplayAmount = React.useCallback((campaign: Campaign) => {
        if (campaign?.final_amount && Number(campaign.final_amount) > 0) {
            return formatINR(campaign.final_amount) || '—';
        }
        const raw = campaign?.amount ?? campaign?.budget ?? campaign?.total_budget;
        if (typeof raw === 'string' && raw.trim()) {
            return (raw.includes('₹') ? raw : formatINR(raw)) || '—';
        }
        return formatINR(raw) || '—';
    }, [formatINR]);

    const getStatusLabel = React.useCallback((campaign: Campaign) => {
        const status = getWorkflowStatus(campaign);
        if (status === 'pending') return 'Pending for Approval';
        if (status === 'amount_finalized') return 'Deal Accepted';
        if (status === 'accepted') return hasCreatorProposal(campaign) ? 'Deal Accepted' : 'Open to Negotiate';
        if (status === 'bid_pending') return 'Bid Submitted';
        if (status === 'amount_negotiated' || status === 'in_negotiation' || status === 'negotiation') return 'In Negotiation';
        return campaign?.status || 'Pending';
    }, [getWorkflowStatus, hasCreatorProposal]);

    const getNegotiationMessage = React.useCallback((campaign: Campaign) => {
        if (isDealAcceptedOrFinalized(campaign)) return 'Brand accepted your offer.';
        if (parseAmount(campaign?.bid_amount) > 0) return 'Brand is reviewing your amount.';
        if (getBrandOfferAmount(campaign) > 0) return 'Brand sent an offer. You can update your proposal.';
        return '';
    }, [isDealAcceptedOrFinalized, parseAmount, getBrandOfferAmount]);

    const getProgressValue = React.useCallback((campaign: Campaign) => {
        const progress = Number(campaign?.progress);
        if (Number.isFinite(progress) && progress >= 0 && progress <= 100) return progress;
        const status = getWorkflowStatus(campaign);
        if (status === 'bid_pending' || status === 'amount_negotiated' || status === 'in_negotiation') return 20;
        if (status === 'script_pending' || status === 'script_submitted') return 45;
        if (status === 'script_approved') return 65;
        if (status === 'content_pending') return 80;
        if (status === 'content_approved' || status === 'content_live') return 100;
        return 10;
    }, [getWorkflowStatus]);

    const handleAction = async () => {
        if (!selectedCampaign) return;

        const campaignId = selectedCampaign.id || selectedCampaign._id || selectedCampaign.campaign_id;
        if (!campaignId) return;

        if (modalType === 'negotiate') {
            if (!negotiationAmount) return;
            setIsSubmitting(true);
            try {
                await creatorApi.submitBid(campaignId, parseFloat(negotiationAmount));
                setIsSuccess(true);
                setTimeout(() => { setModalType(null); fetchCampaigns(); }, 2000);
            } catch (error: any) {
                console.error('Failed to submit negotiation:', error);
                showToast(error.message || 'Failed to submit negotiation. Please try again.', 'error');
            } finally { setIsSubmitting(false); }
            return;
        }

        if (modalType === 'accept-deal') {
            setIsSubmitting(true);
            try {
                await creatorApi.respondToBid(campaignId, 'accept');
                setIsSuccess(true);
                setTimeout(() => { setModalType(null); fetchCampaigns(); }, 2000);
            } catch (error: any) {
                console.error('Failed to accept deal:', error);
                showToast(error.message || 'Failed to accept deal. Please try again.', 'error');
            } finally { setIsSubmitting(false); }
            return;
        }

        if (modalType === 'reject-deal') {
            setIsSubmitting(true);
            try {
                await creatorApi.respondToBid(campaignId, 'reject');
                setIsSuccess(true);
                setTimeout(() => { setModalType(null); fetchCampaigns(); }, 2000);
            } catch (error: any) {
                console.error('Failed to reject deal:', error);
                showToast(error.message || 'Failed to reject deal. Please try again.', 'error');
            } finally { setIsSubmitting(false); }
            return;
        }

        setIsSubmitting(true);
        try {
            if (modalType === 'script') {
                await creatorApi.uploadScript(campaignId, scriptContent);
            } else if (modalType === 'content') {
                if (contentFiles.length === 0 && !contentLink.trim()) {
                    showToast('Please upload a video file or provide a content link before submitting content.', 'error');
                    setIsSubmitting(false);
                    return;
                }
                await creatorApi.uploadContent(campaignId, contentFiles[0], contentLink);
            } else if (modalType === 'go-live') {
                await creatorApi.goLive(campaignId, liveLink);
            }

            setIsSuccess(true);
            setTimeout(() => { setModalType(null); fetchCampaigns(); }, 2000);
        } catch (error: any) {
            console.error('Failed to perform action:', error);
            showToast(error.message || 'Failed to submit. Please try again.', 'error');
        } finally { setIsSubmitting(false); }
    };

    const filteredCampaigns = useMemo(() => {
        let list = Array.isArray(campaigns) ? [...campaigns] : [];

        // 1. Text Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            list = list.filter(c =>
                (c.name?.toLowerCase().includes(query)) ||
                (c.brand?.toLowerCase().includes(query)) ||
                (c.description?.toLowerCase().includes(query))
            );
        }

        // 2. Status Filter
        if (statusFilter !== 'all') {
            list = list.filter(c => getWorkflowStatus(c) === statusFilter);
        }

        // 3. Sorting
        list.sort((a, b) => {
            switch (sortBy) {
                case 'amount_high':
                    return parseAmount(b.final_amount || b.amount || b.budget) - parseAmount(a.final_amount || a.amount || a.budget);
                case 'amount_low':
                    return parseAmount(a.final_amount || a.amount || a.budget) - parseAmount(b.final_amount || b.amount || b.budget);
                case 'deadline':
                    return new Date(a.deadline || 0).getTime() - new Date(b.deadline || 0).getTime();
                case 'brand':
                    return (a.brand || '').localeCompare(b.brand || '');
                case 'latest':
                default:
                    // Higher ID = newer
                    return String(b.id || b._id || b.campaign_id).localeCompare(String(a.id || a._id || a.campaign_id));
            }
        });

        return list;
    }, [campaigns, searchQuery, statusFilter, sortBy, getWorkflowStatus, parseAmount]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="creator-tab-content">
            <div className="filter-bar-clean animate-fade-in">
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Filter size={16} color="var(--color-text-tertiary)" />
                        <select
                            className="clean-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending Approval</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="deal_accepted">Deal Accepted</option>
                            <option value="script_pending">Script Phase</option>
                            <option value="content_pending">Content Phase</option>
                            <option value="content_live">Live / Completed</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <ArrowUpDown size={16} color="var(--color-text-tertiary)" />
                        <select
                            className="clean-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="latest">Latest First</option>
                            <option value="amount_high">Amount: High to Low</option>
                            <option value="amount_low">Amount: Low to High</option>
                            <option value="deadline">Deadline: Soonest First</option>
                            <option value="brand">Brand (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                    Showing <strong>{filteredCampaigns.length}</strong> campaigns
                </div>
            </div>

            <div className="creator-campaigns-list">
                {filteredCampaigns.length === 0 ? (
                    <div className="empty-state-container" style={{ gridColumn: '1 / -1', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-subtle)', animation: 'fadeIn 0.5s ease-out' }}>
                        <div className="empty-state-icon" style={{ width: '80px', height: '80px', background: 'var(--color-bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-6)', color: 'var(--color-accent)' }}>
                            <Megaphone size={40} />
                        </div>
                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)', color: 'var(--color-text-primary)' }}>No campaigns found</h3>
                        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto', fontSize: 'var(--text-base)' }}>
                            {searchQuery
                                ? "We couldn't find any campaigns matching your search. Try different keywords or clear the search."
                                : "You haven't been invited to any campaigns yet. We'll notify you as soon as a brand matches with your profile!"}
                        </p>
                    </div>
                ) : (
                    filteredCampaigns.map((campaign) => (
                        <CreatorCampaignCard
                            key={campaign.id}
                            campaign={campaign}
                            onNavigate={navigate}
                            onOpenModal={handleOpenModal}
                            getStatusClass={getStatusClass}
                            getStatusLabel={getStatusLabel}
                            getDisplayAmount={getDisplayAmount}
                            getProgressValue={getProgressValue}
                            isNegotiationStatus={isNegotiationStatus}
                            getBrandOfferAmount={getBrandOfferAmount}
                            isDealAcceptedOrFinalized={isDealAcceptedOrFinalized}
                            getNegotiationMessage={getNegotiationMessage}
                            parseAmount={parseAmount}
                            formatINR={formatINR}
                            canUploadContentForCampaign={canUploadContentForCampaign}
                            canGoLiveForCampaign={canGoLiveForCampaign}
                        />
                    ))
                )}
            </div>

            <CreatorActionModal
                modalType={modalType}
                isSubmitting={isSubmitting}
                isSuccess={isSuccess}
                selectedCampaign={selectedCampaign}
                scriptContent={scriptContent}
                setScriptContent={setScriptContent}
                contentLink={contentLink}
                setContentLink={setContentLink}
                contentFiles={contentFiles}
                setContentFiles={setContentFiles}
                liveLink={liveLink}
                setLiveLink={setLiveLink}
                negotiationAmount={negotiationAmount}
                setNegotiationAmount={setNegotiationAmount}
                onClose={() => !isSubmitting && setModalType(null)}
                onAction={handleAction}
            />
        </div>
    );
};
