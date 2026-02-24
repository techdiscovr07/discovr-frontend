import React from 'react';
import { Button, Modal, TextArea, Input, FileUpload } from '../../../components';
import { CheckCircle2 } from 'lucide-react';

interface CreatorActionModalProps {
    modalType: 'script' | 'content' | 'go-live' | 'participate' | 'negotiate' | 'accept-deal' | null;
    isSubmitting: boolean;
    isSuccess: boolean;
    selectedCampaign: any;
    scriptContent: string;
    setScriptContent: (val: string) => void;
    contentLink: string;
    setContentLink: (val: string) => void;
    contentFiles: File[];
    setContentFiles: (files: File[]) => void;
    liveLink: string;
    setLiveLink: (val: string) => void;
    negotiationAmount: string;
    setNegotiationAmount: (val: string) => void;
    onClose: () => void;
    onAction: () => void;
}

export const CreatorActionModal: React.FC<CreatorActionModalProps> = ({
    modalType,
    isSubmitting,
    isSuccess,
    selectedCampaign,
    scriptContent,
    setScriptContent,
    contentLink,
    setContentLink,
    contentFiles,
    setContentFiles,
    liveLink,
    setLiveLink,
    negotiationAmount,
    setNegotiationAmount,
    onClose,
    onAction
}) => {
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

    return (
        <Modal
            isOpen={modalType !== null}
            onClose={onClose}
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
                                {getBrandOfferAmount(selectedCampaign) > 0
                                    ? `The brand has proposed ₹${getBrandOfferAmount(selectedCampaign).toLocaleString('en-IN')}. Enter your counter-proposal amount.`
                                    : 'Enter your proposed amount for this campaign. The brand will review your proposal and may accept, negotiate, or reject it.'}
                            </p>
                            {getBrandOfferAmount(selectedCampaign) > 0 && (
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
                                        ₹{getBrandOfferAmount(selectedCampaign).toLocaleString('en-IN')}
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
                            {getBrandOfferAmount(selectedCampaign) > 0 && (
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
                                        ₹{getBrandOfferAmount(selectedCampaign).toLocaleString('en-IN')}
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
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onAction}
                            isLoading={isSubmitting}
                            disabled={
                                (modalType === 'script' && (!scriptContent || !scriptContent.trim())) ||
                                (modalType === 'content' && contentFiles.length === 0) ||
                                (modalType === 'go-live' && (!liveLink || !liveLink.trim())) ||
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
    );
};
