import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, TextArea, Input, LoadingSpinner, FileUpload } from '../../../components';
import { useToast } from '../../../contexts/ToastContext';
import {
    Upload,
    Video,
    Clock,
    Instagram,
    ArrowRight,
    CheckCircle2
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
            setCampaigns(campaignsArray);
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
                            <div className="creator-campaign-amount">{campaign.amount}</div>
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
                                <span className={`status-badge ${getStatusClass(campaign.status)}`}>
                                    {campaign.status}
                                </span>
                                <span className="creator-campaign-deadline">
                                    <Clock size={14} />
                                    Due {new Date(campaign.deadline).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="progress-bar" style={{ height: '4px' }}>
                                <div
                                    className="progress-fill"
                                    style={{ width: `${campaign.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="creator-campaign-actions">
                            {/* Show Accept/Negotiate if brand has proposed an amount (final_amount > 0) and status is in negotiation */}
                            {campaign.final_amount && campaign.final_amount > 0 && 
                             (campaign.status === 'In Negotiation' || campaign.status === 'Negotiate' || campaign.stage === 'negotiate') && (
                                <>
                                    <Button
                                        size="sm"
                                        fullWidth
                                        variant="primary"
                                        onClick={() => handleOpenModal(campaign, 'accept-deal')}
                                    >
                                        Accept Deal
                                    </Button>
                                    <Button
                                        size="sm"
                                        fullWidth
                                        variant="secondary"
                                        onClick={() => handleOpenModal(campaign, 'negotiate')}
                                    >
                                        Negotiate
                                    </Button>
                                </>
                            )}
                            {/* Show Negotiate button if in negotiate/negotiation stage but no brand proposal yet, or if no bid submitted yet */}
                            {(campaign.stage === 'negotiate' || campaign.status === 'Negotiate' || campaign.status === 'In Negotiation' || campaign.status === 'Negotiation') && 
                             (!campaign.final_amount || campaign.final_amount <= 0) && (
                                <Button
                                    size="sm"
                                    fullWidth
                                    onClick={() => handleOpenModal(campaign, 'negotiate')}
                                >
                                    {campaign.bid_amount && campaign.bid_amount > 0 ? 'Update Proposal' : 'Start Negotiation'}
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

            {/* Action Modal */}
            <Modal
                isOpen={modalType !== null}
                onClose={() => !isSubmitting && setModalType(null)}
                title={
                    modalType === 'script' ? 'Submit Script' :
                        modalType === 'content' ? 'Upload Content' :
                            modalType === 'go-live' ? 'Go Live' :
                            modalType === 'negotiate' ? 'Negotiate Deal' :
                                modalType === 'accept-deal' ? 'Accept Deal' :
                                    'Join Campaign'
                }
                subtitle={selectedCampaign?.name}
                size="md"
            >
                {!isSuccess ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        {modalType === 'script' && (
                            <TextArea
                                label="Script Content"
                                placeholder="Write your campaign script here..."
                                rows={10}
                                value={scriptContent}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScriptContent(e.target.value)}
                                required
                            />
                        )}
                        {modalType === 'content' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                    Upload your content video or provide a link to your published content.
                                </p>
                                <FileUpload
                                    accept="video/*"
                                    maxSize={100}
                                    onFileSelect={(files: File[]) => setContentFiles(files)}
                                    label="Upload Content Video"
                                    description="Upload the video file for this campaign"
                                />
                                <div style={{ marginTop: 'var(--space-2)' }}>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                                        OR provide a link to your published content:
                                    </p>
                                    <Input
                                        label="Content Link (Optional)"
                                        placeholder="https://instagram.com/p/..."
                                        value={contentLink}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContentLink(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        {modalType === 'go-live' && (
                            <Input
                                label="Live Post Link"
                                placeholder="https://instagram.com/reel/..."
                                value={liveLink}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLiveLink(e.target.value)}
                                required
                            />
                        )}
                        {modalType === 'negotiate' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
                                    {selectedCampaign?.final_amount 
                                        ? `The brand has proposed ₹${selectedCampaign.final_amount.toLocaleString()}. Enter your counter-proposal amount.`
                                        : 'Enter your proposed amount for this campaign. The brand will review your proposal and may accept, negotiate, or reject it.'}
                                </p>
                                {selectedCampaign?.final_amount && (
                                    <div style={{ 
                                        padding: 'var(--space-4)', 
                                        background: 'var(--color-bg-secondary)', 
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: 'var(--space-2)'
                                    }}>
                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>
                                            Brand's Proposal
                                        </p>
                                        <p style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
                                            ₹{selectedCampaign.final_amount.toLocaleString()}
                                        </p>
                                    </div>
                                )}
                                <Input
                                    label="Your Proposed Amount (INR)"
                                    type="number"
                                    placeholder="5000"
                                    value={negotiationAmount}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNegotiationAmount(e.target.value)}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                                {selectedCampaign?.total_budget && (
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                                        Campaign budget: ₹{selectedCampaign.total_budget.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        )}
                        {modalType === 'accept-deal' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
                                    Are you sure you want to accept the brand's proposed deal?
                                </p>
                                {selectedCampaign?.final_amount && (
                                    <div style={{ 
                                        padding: 'var(--space-6)', 
                                        background: 'var(--color-bg-secondary)', 
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                                            Deal Amount
                                        </p>
                                        <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>
                                            ₹{selectedCampaign.final_amount.toLocaleString()}
                                        </p>
                                    </div>
                                )}
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                                    By accepting, you agree to the terms and conditions of this campaign.
                                </p>
                            </div>
                        )}
                        {modalType === 'participate' && (
                            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
                                Are you sure you want to participate in this campaign? By clicking join, you agree to the brand's requirements and deadlines.
                            </p>
                        )}

                        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
                            <Button
                                variant="ghost"
                                onClick={() => setModalType(null)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAction}
                                isLoading={isSubmitting}
                                disabled={
                                    (modalType === 'script' && !scriptContent.trim()) ||
                                    (modalType === 'content' && contentFiles.length === 0) ||
                                    (modalType === 'go-live' && !liveLink.trim()) ||
                                    (modalType === 'negotiate' && (!negotiationAmount || parseFloat(negotiationAmount) <= 0))
                                }
                            >
                                {modalType === 'participate' ? 'Join Campaign' :
                                    modalType === 'negotiate' ? 'Submit Proposal' :
                                        modalType === 'accept-deal' ? 'Accept Deal' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        padding: 'var(--space-8) 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 'var(--space-4)'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(34, 197, 94, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-success)',
                            marginBottom: 'var(--space-2)'
                        }}>
                            <CheckCircle2 size={40} />
                        </div>
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>
                                {modalType === 'script' ? 'Script Submitted!' :
                                    modalType === 'content' ? 'Content Uploaded!' :
                                        modalType === 'negotiate' ? 'Proposal Submitted!' :
                                            modalType === 'accept-deal' ? 'Deal Accepted!' :
                                                'Joined Campaign!'}
                            </h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                {modalType === 'script' ? 'Your script has been sent for review.' :
                                    modalType === 'content' ? 'Your content has been shared with the brand.' :
                                        modalType === 'negotiate' ? `Your proposal of ₹${parseFloat(negotiationAmount).toLocaleString()} has been submitted. The brand will review it shortly.` :
                                            modalType === 'accept-deal' ? 'You have accepted the deal. The brand will be notified.' :
                                                'You have successfully joined the campaign.'}
                            </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};
