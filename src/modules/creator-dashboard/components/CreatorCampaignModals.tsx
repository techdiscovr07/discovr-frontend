import React from 'react';
import { Button, Modal, TextArea, Input, FileUpload } from '../../../components';
import { CheckCircle2, BadgeCheck } from 'lucide-react';
import { useCreatorCampaignContext } from '../CreatorCampaignContext';

export const CreatorCampaignModals: React.FC = () => {
    const {
        modalType,
        setModalType,
        isLinking,
        creatorToken,
        setCreatorToken,
        handleLinkCampaign,
        isNegotiating,
        negotiationAmount,
        setNegotiationAmount,
        brandOfferAmount,
        handleNegotiate,
        isSubmitting,
        isSuccess,
        handleAcceptDeal,
        handleRejectDeal,
        scriptContent,
        setScriptContent,
        briefData,
        campaignData,
        isContentChangesRequested,
        brandContentFeedback,
        contentFiles,
        setContentFiles,
        contentLink,
        setContentLink,
        handleAction,
        liveLink,
        setLiveLink,
        handleGoLive
    } = useCreatorCampaignContext();

    return (
        <>
            {/* Link Campaign Modal */}
            <Modal
                isOpen={modalType === 'link'}
                onClose={() => !isLinking && setModalType(null)}
                title="Link Campaign"
                subtitle="Link this campaign to your account"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label="Creator Token (Optional)"
                        placeholder="Token from email invitation"
                        value={creatorToken}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreatorToken(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                        <Button variant="ghost" onClick={() => setModalType(null)} disabled={isLinking}>Cancel</Button>
                        <Button onClick={handleLinkCampaign} isLoading={isLinking}>Link Campaign</Button>
                    </div>
                </div>
            </Modal>

            {/* Negotiate Modal */}
            <Modal
                isOpen={modalType === 'negotiate'}
                onClose={() => !isNegotiating && setModalType(null)}
                title="Negotiate Deal"
                subtitle={brandOfferAmount > 0 ? "Propose a counter-amount" : "Enter your proposed amount"}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {brandOfferAmount > 0 && (
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
                                ₹{brandOfferAmount.toLocaleString('en-IN')}
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
                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                        <Button variant="ghost" onClick={() => setModalType(null)} disabled={isNegotiating}>Cancel</Button>
                        <Button onClick={handleNegotiate} isLoading={isNegotiating} disabled={!negotiationAmount || parseFloat(negotiationAmount) <= 0}>
                            Submit Proposal
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Accept Deal Modal */}
            <Modal
                isOpen={modalType === 'accept-deal'}
                onClose={() => !isSubmitting && setModalType(null)}
                title="Accept Deal"
                subtitle="Confirm acceptance of the brand's proposal"
            >
                {!isSuccess ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
                            Are you sure you want to accept the brand's proposed deal?
                        </p>
                        {brandOfferAmount > 0 && (
                            <div style={{
                                padding: 'var(--space-6)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                                    Final Amount
                                </p>
                                <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>
                                    ₹{brandOfferAmount.toLocaleString('en-IN')}
                                </p>
                            </div>
                        )}
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                            By accepting, you agree to the terms and conditions of this campaign.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                            <Button variant="ghost" onClick={() => setModalType(null)} disabled={isSubmitting}>Cancel</Button>
                            <Button onClick={handleAcceptDeal} isLoading={isSubmitting} variant="primary">Confirm Acceptance</Button>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                            <BadgeCheck size={32} />
                        </div>
                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>Deal Accepted!</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>You can now proceed to script submission.</p>
                    </div>
                )}
            </Modal>

            {/* Reject Deal Modal */}
            <Modal
                isOpen={modalType === 'reject-deal'}
                onClose={() => !isSubmitting && setModalType(null)}
                title="Decline Deal"
                subtitle="Decline the brand's proposal"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
                        Are you sure you want to decline this deal? This action may end the negotiation for this campaign.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                        <Button variant="ghost" onClick={() => setModalType(null)} disabled={isSubmitting}>Cancel</Button>
                        <Button
                            onClick={handleRejectDeal}
                            isLoading={isSubmitting}
                            variant="outline"
                            style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                        >
                            Decline Deal
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Script / Content Flow */}
            <Modal
                isOpen={modalType === 'script' || modalType === 'content'}
                onClose={() => !isSubmitting && setModalType(null)}
                title={modalType === 'script' ? 'Finalize Script' : 'Upload Content'}
                size="md"
            >
                {!isSuccess ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        {modalType === 'script' ? (
                            <>
                                {(briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template) && (
                                    <div style={{
                                        padding: 'var(--space-3)',
                                        background: 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border-subtle)',
                                        marginBottom: 'var(--space-2)'
                                    }}>
                                        <p style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-text-tertiary)',
                                            marginBottom: 'var(--space-2)',
                                            fontWeight: 'var(--font-semibold)'
                                        }}>
                                            Brand Script Template:
                                        </p>
                                        <div style={{
                                            background: 'var(--color-bg-primary)',
                                            padding: 'var(--space-3)',
                                            borderRadius: 'var(--radius-sm)',
                                            whiteSpace: 'pre-wrap',
                                            fontFamily: 'monospace',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--color-text-primary)',
                                            border: '1px solid var(--color-border)',
                                            maxHeight: '200px',
                                            overflow: 'auto'
                                        }}>
                                            {briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template}
                                        </div>
                                    </div>
                                )}
                                <TextArea
                                    label={(briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template)
                                        ? "Review and Edit Script (if needed)"
                                        : "Script Content"}
                                    placeholder={(briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template)
                                        ? "Review the brand template above and make any edits if needed..."
                                        : "Write your campaign script here..."}
                                    rows={10}
                                    value={scriptContent}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScriptContent(e.target.value)}
                                    required
                                />
                                {(briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template) && (
                                    <p style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-tertiary)',
                                        fontStyle: 'italic'
                                    }}>
                                        The brand script template is pre-filled. Review it and click "Finalize Script" to confirm and submit.
                                    </p>
                                )}
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {isContentChangesRequested && (
                                    <div style={{
                                        padding: 'var(--space-3)',
                                        background: 'rgba(251, 191, 36, 0.1)',
                                        border: '1px solid rgba(251, 191, 36, 0.35)',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <p style={{
                                            margin: 0,
                                            marginBottom: 'var(--space-1)',
                                            fontSize: 'var(--text-xs)',
                                            letterSpacing: '0.04em',
                                            textTransform: 'uppercase',
                                            color: 'var(--color-text-tertiary)',
                                            fontWeight: 'var(--font-semibold)'
                                        }}>
                                            Required changes
                                        </p>
                                        <p style={{
                                            margin: 0,
                                            color: 'var(--color-text-primary)',
                                            whiteSpace: 'pre-wrap',
                                            lineHeight: 1.5,
                                            fontSize: 'var(--text-sm)'
                                        }}>
                                            {brandContentFeedback || 'Brand requested content changes. Update your video and upload again.'}
                                        </p>
                                    </div>
                                )}
                                <FileUpload
                                    accept="video/*"
                                    maxSize={100}
                                    onFileSelect={(files: File[]) => setContentFiles(files)}
                                    label="Upload Content Video"
                                    description="Upload the video file for this campaign"
                                />
                                <Input
                                    label="Content Link (Optional)"
                                    placeholder="https://instagram.com/p/..."
                                    value={contentLink}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContentLink(e.target.value)}
                                />
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
                            <Button variant="ghost" onClick={() => setModalType(null)} disabled={isSubmitting}>Cancel</Button>
                            <Button onClick={handleAction} isLoading={isSubmitting} disabled={modalType === 'content' && contentFiles.length === 0}>
                                {modalType === 'script' ? 'Finalize Script' : 'Submit'}
                            </Button>
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

            <Modal
                isOpen={modalType === 'go-live'}
                onClose={() => !isSubmitting && setModalType(null)}
                title="Go Live"
                subtitle="Submit your published reel/post link"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label="Live Post Link"
                        placeholder="https://instagram.com/reel/..."
                        value={liveLink}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLiveLink(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setModalType(null)} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleGoLive} isLoading={isSubmitting} disabled={!liveLink.trim()}>
                            Mark as Live
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
