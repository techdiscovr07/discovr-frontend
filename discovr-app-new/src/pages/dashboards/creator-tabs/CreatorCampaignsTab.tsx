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
    const [modalType, setModalType] = useState<'script' | 'content' | 'participate' | 'bid' | null>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [scriptContent, setScriptContent] = useState('');
    const [contentLink, setContentLink] = useState('');
    const [contentFiles, setContentFiles] = useState<File[]>([]);
    const [bidAmount, setBidAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const data = await creatorApi.getCampaigns() as any[];
            setCampaigns(data || []);
        } catch (error) {
            console.error('Failed to fetch creator campaigns:', error);
            // Fallback for demo
            setCampaigns([
                {
                    id: 1,
                    name: 'Summer Collection Launch',
                    brand: 'FashionHub',
                    status: 'Script Pending',
                    amount: '₹500',
                    deadline: '2026-03-18',
                    progress: 25,
                    stage: 'script',
                    description: 'Create engaging content showcasing the new summer collection',
                    requirements: ['3 Instagram Reels', '2 Stories', '1 Post']
                }
            ]);
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
            case 'Bidding': return 'status-bidding';
            case 'Content Approved': return 'status-active';
            case 'Script Pending': return 'status-content-review';
            default: return 'status-planning';
        }
    };

    const handleOpenModal = (campaign: any, type: 'script' | 'content' | 'participate' | 'bid') => {
        setSelectedCampaign(campaign);
        setModalType(type);
        setIsSuccess(false);
        setScriptContent('');
        setContentLink('');
        setContentFiles([]);
        setBidAmount('');
    };

    const handleBidSubmit = async () => {
        if (!selectedCampaign || !bidAmount) return;

        setIsSubmitting(true);
        try {
            await creatorApi.submitBid(selectedCampaign.id, parseFloat(bidAmount));
            setIsSuccess(true);
            setTimeout(() => {
                setModalType(null);
                fetchCampaigns(); // Refresh to show updated status
            }, 2000);
        } catch (error: any) {
            console.error('Failed to submit bid:', error);
            showToast(error.message || 'Failed to submit bid. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAction = async () => {
        if (!selectedCampaign) return;

        if (modalType === 'bid') {
            await handleBidSubmit();
            return;
        }

        setIsSubmitting(true);
        try {
            if (modalType === 'script') {
                await creatorApi.uploadScript(selectedCampaign.id, scriptContent);
            } else if (modalType === 'content') {
                if (contentFiles.length > 0) {
                    await creatorApi.uploadContent(selectedCampaign.id, contentFiles[0], contentLink);
                } else {
                    // If no file, maybe just go live or update link
                    await creatorApi.goLive(selectedCampaign.id, contentLink);
                }
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

    const filteredCampaigns = campaigns.filter(campaign =>
        (campaign.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (campaign.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
                            {(campaign.stage === 'bidding' || campaign.status === 'Bidding' || !campaign.bid_status) && (
                                <Button
                                    size="sm"
                                    fullWidth
                                    onClick={() => handleOpenModal(campaign, 'bid')}
                                >
                                    Submit Bid
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
                            {campaign.stage === 'content' && (
                                <Button
                                    size="sm"
                                    fullWidth
                                    onClick={() => handleOpenModal(campaign, 'content')}
                                >
                                    <Video size={16} />
                                    Upload Content
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                fullWidth
                                onClick={() => navigate(`/creator/campaign/${campaign.id}`)}
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
                            modalType === 'bid' ? 'Submit Bid' :
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
                                    onFileSelect={(files) => setContentFiles(files)}
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
                        {modalType === 'bid' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
                                    Enter your bid amount for this campaign. The brand will review your bid and may accept, negotiate, or reject it.
                                </p>
                                <Input
                                    label="Bid Amount (INR)"
                                    type="number"
                                    placeholder="5000"
                                    value={bidAmount}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBidAmount(e.target.value)}
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
                                    (modalType === 'content' && !contentLink.trim() && contentFiles.length === 0) ||
                                    (modalType === 'bid' && (!bidAmount || parseFloat(bidAmount) <= 0))
                                }
                            >
                                {modalType === 'participate' ? 'Join Campaign' :
                                    modalType === 'bid' ? 'Submit Bid' : 'Submit'}
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
                                    modalType === 'bid' ? 'Bid Submitted!' :
                                        'Joined Campaign!'}
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            {modalType === 'script' ? 'Your script has been sent for review.' :
                                modalType === 'content' ? 'Your content has been shared with the brand.' :
                                    modalType === 'bid' ? `Your bid of ₹${parseFloat(bidAmount).toLocaleString()} has been submitted. The brand will review it shortly.` :
                                        'You have successfully joined the campaign.'}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};
