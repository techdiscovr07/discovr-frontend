import { CreatorActionModal } from '../components/CreatorActionModal';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, LoadingSpinner } from '../../../components';
import { useToast } from '../../../contexts/ToastContext';
import {
    Upload,
    Video,
    Clock,
    Instagram,
    ArrowRight
} from 'lucide-react';
import { creatorApi } from '../../../lib/api';
import '../CreatorDashboard.css';

interface CreatorCampaignsTabProps {
    searchQuery?: string;
}

export const CreatorCampaignsTab: React.FC<CreatorCampaignsTabProps> = ({ searchQuery = '' }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [modalType, setModalType] = useState<'script' | 'content' | 'go-live' | 'participate' | 'negotiate' | 'accept-deal' | null>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [scriptContent, setScriptContent] = useState('');
    const [contentLink, setContentLink] = useState('');
    const [contentFiles, setContentFiles] = useState<File[]>([]);
    const [negotiationAmount, setNegotiationAmount] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const data = await creatorApi.getCampaigns() as any;
            // Handle different response formats: array, object with campaigns/data property, or null/undefined
            let campaignsArray: any[] = [];
            if (Array.isArray(data)) {
                campaignsArray = data;
            } else if (data && typeof data === 'object') {
                campaignsArray = data.campaigns || data.data || [];
            }
            // Enrich each campaign with latest bid/negotiation status so brand acceptance reflects on creator tab
            const campaignIds = campaignsArray.map((c: any) => c.id || c._id || c.campaign_id).filter(Boolean);
            const bidStatuses = await Promise.allSettled(
                campaignIds.map((id: string) => creatorApi.getBidStatus(id))
            );
            const enriched = campaignsArray.map((campaign: any, index: number) => {
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
            setCampaigns([]); // Set to empty array instead of demo data
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active': return 'status-active';
            case 'Deal Accepted': return 'status-active';
            case 'Negotiate': return 'status-negotiate';
            case 'Negotiation': return 'status-negotiate';
            case 'Content Approved': return 'status-active';
            case 'Script Pending': return 'status-content-review';
            default: return 'status-planning';
        }
    };

    const handleOpenModal = (campaign: any, type: 'script' | 'content' | 'go-live' | 'participate' | 'negotiate' | 'accept-deal') => {
        setSelectedCampaign(campaign);
        setModalType(type);
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
    };

    const getWorkflowStatus = (campaign: any) =>
        String(campaign?.status || '')
            .toLowerCase()
            .replace(/\s+/g, '_');
    const canUploadContentForCampaign = (campaign: any) => {
        const status = getWorkflowStatus(campaign);
        const stage = String(campaign?.stage || '').toLowerCase();
        if (status === 'content_pending' || status === 'content_approved' || status === 'content_live') return false;
        if (status === 'script_approved' || status === 'content_rejected' || status === 'content_revision_requested') return true;
        return stage === 'content';
    };
    const canGoLiveForCampaign = (campaign: any) => getWorkflowStatus(campaign) === 'content_approved';
    const isNegotiationStatus = (campaign: any) => {
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
    };
    const hasCreatorProposal = (campaign: any) => parseAmount(campaign?.bid_amount) > 0;
    const isBrandAcceptedCreatorOffer = (campaign: any) => {
        const status = getWorkflowStatus(campaign);
        return status === 'accepted' && hasCreatorProposal(campaign);
    };
    const isDealAcceptedOrFinalized = (campaign: any) => {
        const status = getWorkflowStatus(campaign);
        return status === 'amount_finalized' || isBrandAcceptedCreatorOffer(campaign);
    };
    const parseAmount = (value: any): number => {
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
        const cleaned = String(value).replace(/[^0-9.]/g, '');
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    };
    const getBrandOfferAmount = (campaign: any): number => {
        return parseAmount(campaign?.final_amount) || parseAmount(campaign?.proposed_amount) || parseAmount(campaign?.amount);
    };
    const formatINR = (value?: number | string) => {
        const num = Number(value);
        if (!Number.isFinite(num) || num <= 0) return null;
        return `₹${num.toLocaleString('en-IN')}`;
    };
    const getDisplayAmount = (campaign: any) => {
        if (campaign?.final_amount && Number(campaign.final_amount) > 0) {
            return formatINR(campaign.final_amount);
        }
        const raw = campaign?.amount ?? campaign?.budget ?? campaign?.total_budget;
        if (typeof raw === 'string' && raw.trim()) {
            return raw.includes('₹') ? raw : formatINR(raw);
        }
        return formatINR(raw) || '—';
    };
    const getStatusLabel = (campaign: any) => {
        const status = getWorkflowStatus(campaign);
        if (status === 'amount_finalized') return 'Deal Accepted';
        if (status === 'accepted') return hasCreatorProposal(campaign) ? 'Deal Accepted' : 'Open to Negotiate';
        if (status === 'bid_pending') return 'Bid Submitted';
        if (status === 'amount_negotiated' || status === 'in_negotiation' || status === 'negotiation') return 'In Negotiation';
        return campaign?.status || 'Pending';
    };
    const getNegotiationMessage = (campaign: any) => {
        if (isDealAcceptedOrFinalized(campaign)) return 'Brand accepted your offer.';
        if (parseAmount(campaign?.bid_amount) > 0) return 'Brand is reviewing your amount.';
        if (getBrandOfferAmount(campaign) > 0) return 'Brand sent an offer. You can update your proposal.';
        return '';
    };
    const getProgressValue = (campaign: any) => {
        const progress = Number(campaign?.progress);
        if (Number.isFinite(progress) && progress >= 0 && progress <= 100) return progress;
        const status = getWorkflowStatus(campaign);
        if (status === 'bid_pending' || status === 'amount_negotiated' || status === 'in_negotiation') return 20;
        if (status === 'script_pending' || status === 'script_submitted') return 45;
        if (status === 'script_approved') return 65;
        if (status === 'content_pending') return 80;
        if (status === 'content_approved' || status === 'content_live') return 100;
        return 10;
    };

    const handleNegotiationSubmit = async () => {
        if (!selectedCampaign || !negotiationAmount) return;

        setIsSubmitting(true);
        try {
            await creatorApi.submitBid(selectedCampaign.id, parseFloat(negotiationAmount));
            setIsSuccess(true);
            setTimeout(() => {
                setModalType(null);
                fetchCampaigns(); // Refresh to show updated status
            }, 2000);
        } catch (error: any) {
            console.error('Failed to submit negotiation:', error);
            showToast(error.message || 'Failed to submit negotiation. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAcceptDeal = async () => {
        if (!selectedCampaign) return;

        setIsSubmitting(true);
        try {
            await creatorApi.respondToBid(selectedCampaign.id, 'accept');
            setIsSuccess(true);
            setTimeout(() => {
                setModalType(null);
                fetchCampaigns(); // Refresh to show updated status
            }, 2000);
        } catch (error: any) {
            console.error('Failed to accept deal:', error);
            showToast(error.message || 'Failed to accept deal. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAction = async () => {
        if (!selectedCampaign) return;

        if (modalType === 'negotiate') {
            await handleNegotiationSubmit();
            return;
        }

        if (modalType === 'accept-deal') {
            await handleAcceptDeal();
            return;
        }

        setIsSubmitting(true);
        try {
            if (modalType === 'script') {
                await creatorApi.uploadScript(selectedCampaign.id, scriptContent);
            } else if (modalType === 'content') {
                if (contentFiles.length === 0) {
                    showToast('Please upload a video file before submitting content.', 'error');
                    setIsSubmitting(false);
                    return;
                }
                await creatorApi.uploadContent(selectedCampaign.id, contentFiles[0], contentLink);
            } else if (modalType === 'go-live') {
                await creatorApi.goLive(selectedCampaign.id, liveLink);
            }

            setIsSuccess(true);
            setTimeout(() => {
                setModalType(null);
                fetchCampaigns();
            }, 2000);
        } catch (error: any) {
            console.error('Failed to perform action:', error);
            showToast(error.message || 'Failed to submit. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCampaigns = Array.isArray(campaigns) ? campaigns.filter(campaign =>
        (campaign.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (campaign.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : [];

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="creator-tab-content">

            {/* Campaigns Grid */}
            <div className="creator-campaigns-list">
                {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="creator-campaign-card-detailed">
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
                                    Due {new Date(campaign.deadline).toLocaleDateString()}
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
                            {/* Keep only negotiation/update on creator end (no accept/decline buttons). */}
                            {isNegotiationStatus(campaign) && !isDealAcceptedOrFinalized(campaign) && (
                                <Button
                                    size="sm"
                                    fullWidth
                                    onClick={() => handleOpenModal(campaign, 'negotiate')}
                                >
                                    {parseAmount(campaign?.bid_amount) > 0 ? 'Update Proposal' : 'Start Negotiation'}
                                </Button>
                            )}
                            {campaign.stage === 'script' && (
                                <Button
                                    size="sm"
                                    fullWidth
                                    onClick={() => handleOpenModal(campaign, 'script')}
                                >
                                    <Upload size={16} />
                                    Submit Script
                                </Button>
                            )}
                            {(campaign.stage === 'content' || canUploadContentForCampaign(campaign)) && (
                                <Button
                                    size="sm"
                                    fullWidth
                                    onClick={() => handleOpenModal(campaign, 'content')}
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
                                    onClick={() => handleOpenModal(campaign, 'go-live')}
                                >
                                    Go Live
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                fullWidth
                                onClick={() => {
                                    const campaignId = campaign.id || campaign._id || campaign.campaign_id;
                                    if (campaignId) {
                                        navigate(`/creator/campaign/${campaignId}`);
                                    } else {
                                        showToast('Campaign ID not available', 'error');
                                    }
                                }}
                            >
                                Details
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
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
