import React from 'react';
import { Card, CardHeader, CardBody, Button, TextArea } from '../../../components';
import { FileText, Info, CheckCircle2, Upload, MessageSquare, Clock, Calendar, ChevronRight } from 'lucide-react';
import { useCreatorCampaignContext } from '../CreatorCampaignContext';

export const CreatorCampaignLeftColumn: React.FC = () => {
    const {
        hasAnyBriefDetails, briefVideoTitle, briefPrimaryFocus, briefSecondaryFocus, briefCta,
        briefDos, briefDonts, firstBriefValue, briefData, campaignData, setScriptContent,
        setModalType, canSubmitScript, scriptDeliverableStatus, brandScriptFeedback,
        inlineScriptContent, setInlineScriptContent, handleInlineScriptSubmit,
        isSubmittingInlineScript, canUploadContent, isContentChangesRequested,
        brandContentFeedback, isContentUnderBrandReview, canGoLive, scriptIsNextStep,
        currentWorkflowStatus, negotiationStatus, isBrandAcceptedCreatorOffer,
        negotiationStatusKey, brandOfferAmount, formatINR
    } = useCreatorCampaignContext();

    return (
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
                                {!hasAnyBriefDetails ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'rgba(var(--color-warning-rgb), 0.1)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-warning)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <Info size={20} style={{ color: 'var(--color-warning)' }} />
                                            <h5 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-bold)', color: 'var(--color-warning)', margin: 0 }}>
                                                Brief Not Yet Available
                                            </h5>
                                        </div>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                                            The brand will share the campaign brief once it is ready.
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Video Title</p>
                                            <p style={{ color: 'var(--color-text-primary)' }}>{briefVideoTitle || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Primary Focus</p>
                                            <p style={{ color: 'var(--color-text-primary)' }}>{briefPrimaryFocus || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Secondary Focus</p>
                                            <p style={{ color: 'var(--color-text-primary)' }}>{briefSecondaryFocus || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Call to Action</p>
                                            <p style={{ color: 'var(--color-text-primary)' }}>{briefCta || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Dos</p>
                                            <p style={{ color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{briefDos || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Don'ts</p>
                                            <p style={{ color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{briefDonts || '-'}</p>
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Sample Video</p>
                                            {(firstBriefValue('sample_video_url', 'sampleVideoUrl', 'sample_video')) ? (
                                                <a
                                                    href={firstBriefValue('sample_video_url', 'sampleVideoUrl', 'sample_video')}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                                                >
                                                    View sample video
                                                </a>
                                            ) : (
                                                <p style={{ color: 'var(--color-text-primary)' }}>No sample video</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Brand Script Template Section */}
                                {(briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template) && (
                                    <div style={{
                                        marginTop: 'var(--space-6)',
                                        padding: 'var(--space-4)',
                                        background: 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border-subtle)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                            <h5 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                                                Brand Script Template
                                            </h5>
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => {
                                                    const submittedScript = briefData?.script_content || campaignData?.script_content || '';
                                                    const template = briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template;
                                                    setScriptContent(submittedScript || template || '');
                                                    setModalType('script');
                                                }}
                                            >
                                                <CheckCircle2 size={16} style={{ marginRight: 'var(--space-2)' }} />
                                                Finalize Script
                                            </Button>
                                        </div>
                                        <div style={{
                                            background: 'var(--color-bg-primary)',
                                            padding: 'var(--space-4)',
                                            borderRadius: 'var(--radius-sm)',
                                            whiteSpace: 'pre-wrap',
                                            fontFamily: 'monospace',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--color-text-primary)',
                                            border: '1px solid var(--color-border)',
                                            maxHeight: '300px',
                                            overflow: 'auto'
                                        }}>
                                            {briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template}
                                        </div>
                                        <p style={{
                                            marginTop: 'var(--space-2)',
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-text-tertiary)',
                                            fontStyle: 'italic'
                                        }}>
                                            Review the script template above and click "Finalize Script" to confirm and submit it.
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* Inline Script Submission */}
                        {canSubmitScript && (
                            <Card className="content-card">
                                <CardHeader>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <Upload size={20} style={{ color: 'var(--color-accent)' }} />
                                        <h3>Submit Script</h3>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                        {(scriptDeliverableStatus === 'Changes Requested' && brandScriptFeedback) && (
                                            <div style={{
                                                padding: 'var(--space-4)',
                                                background: 'rgba(var(--color-warning-rgb), 0.1)',
                                                border: '1px solid rgba(var(--color-warning-rgb), 0.35)',
                                                borderRadius: 'var(--radius-md)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                                    <MessageSquare size={16} style={{ color: 'var(--color-warning)' }} />
                                                    <span style={{ fontWeight: 'var(--font-semibold)' }}>Brand requested changes</span>
                                                </div>
                                                <p style={{ margin: 0, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                                                    {brandScriptFeedback}
                                                </p>
                                            </div>
                                        )}
                                        <TextArea
                                            label="Script Content"
                                            placeholder="Write your campaign script here..."
                                            rows={8}
                                            value={inlineScriptContent}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInlineScriptContent(e.target.value)}
                                            required
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button onClick={handleInlineScriptSubmit} isLoading={isSubmittingInlineScript}>
                                                Submit Script
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        <Card className="content-card">
                            <CardHeader>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Upload size={20} style={{ color: 'var(--color-accent)' }} />
                                    <h3>Upload Content</h3>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {canUploadContent && (
                                        <>
                                            {isContentChangesRequested && (
                                                <div style={{
                                                    padding: 'var(--space-4)',
                                                    background: 'rgba(251, 191, 36, 0.1)',
                                                    border: '1px solid rgba(251, 191, 36, 0.35)',
                                                    borderRadius: 'var(--radius-md)'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                                        <MessageSquare size={16} style={{ color: 'var(--color-warning)' }} />
                                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>Changes required by brand</span>
                                                    </div>
                                                    <p style={{ margin: 0, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 'var(--text-sm)' }}>
                                                        {brandContentFeedback || 'Your uploaded content needs revision. Please update it and re-upload for review.'}
                                                    </p>
                                                </div>
                                            )}
                                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                                {isContentChangesRequested
                                                    ? 'Please make the requested updates and re-upload your video.'
                                                    : 'Your script is approved. Upload your video for brand review.'}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button onClick={() => setModalType('content')}>
                                                    {isContentChangesRequested ? 'Re-upload Content' : 'Upload Content'}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {isContentUnderBrandReview && (
                                        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                            Your video is uploaded and pending brand review. You can go live only after approval.
                                        </p>
                                    )}
                                    {canGoLive && (
                                        <>
                                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                                Brand approved your content. You can now add your live post link.
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button onClick={() => setModalType('go-live')}>
                                                    Go Live
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {(!canUploadContent && !isContentUnderBrandReview && !canGoLive) && (
                                        <>
                                            {scriptIsNextStep ? (
                                                <>
                                                    <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                                                        Submit your script for brand review first. Upload content unlocks after script approval.
                                                    </p>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => {
                                                                const template = briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template || '';
                                                                const submitted = briefData?.script_content || campaignData?.script_content || '';
                                                                setScriptContent(submitted || template);
                                                                setModalType('script');
                                                            }}
                                                        >
                                                            Submit Script
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : currentWorkflowStatus === 'script_pending' ? (
                                                <p style={{ margin: 0, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                                    Your script is under review. Upload content unlocks after script approval.
                                                </p>
                                            ) : (
                                                <p style={{ margin: 0, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                                    Upload content unlocks after script approval.
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Negotiation Status Card */}
                        {negotiationStatus && (
                            <Card className="content-card" style={{ maxWidth: '440px', alignSelf: 'flex-start' }}>
                                <CardHeader>
                                    <h3>Negotiation Status</h3>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
                                            <span className={`status-badge ${(negotiationStatus.status === 'amount_finalized' || isBrandAcceptedCreatorOffer) ? 'status-active' : negotiationStatus.status === 'rejected' ? 'status-error' : 'status-planning'}`}>
                                                {negotiationStatus.status === 'accepted' ? (isBrandAcceptedCreatorOffer ? 'Deal Accepted' : 'Brand Reviewing') :
                                                    negotiationStatus.status === 'bid_pending' ? 'Bid Submitted' :
                                                        negotiationStatus.status === 'amount_negotiated' ? 'Negotiating' :
                                                            negotiationStatus.status === 'amount_finalized' ? 'Deal Agreed' :
                                                                negotiationStatus.status === 'rejected' ? 'Declined' :
                                                                    'Pending'}
                                            </span>
                                        </div>
                                        {Number(negotiationStatus?.bid_amount) > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: 'var(--color-text-secondary)' }}>Your Proposal</span>
                                                <span style={{ fontWeight: 'var(--font-bold)' }}>{formatINR(negotiationStatus.bid_amount)}</span>
                                            </div>
                                        )}
                                        {brandOfferAmount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: 'var(--color-text-secondary)' }}>Brand's Proposal</span>
                                                <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>{formatINR(brandOfferAmount)}</span>
                                            </div>
                                        )}
                                        {/* Show Accept Deal / Decline / Update Bid only when not yet accepted by brand (not accepted and not amount_finalized) */}
                                        {!isBrandAcceptedCreatorOffer && (negotiationStatusKey === 'accepted' || negotiationStatus.status === 'amount_negotiated' || negotiationStatus.status === 'bid_pending') && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                                {Number(negotiationStatus?.bid_amount) > 0 && (
                                                    <div style={{
                                                        padding: 'var(--space-3)',
                                                        background: 'rgba(59, 130, 246, 0.08)',
                                                        borderRadius: 'var(--radius-md)',
                                                        textAlign: 'center',
                                                        fontSize: 'var(--text-sm)',
                                                        color: 'var(--color-text-secondary)'
                                                    }}>
                                                        Brand is reviewing your amount.
                                                    </div>
                                                )}
                                                <Button onClick={() => setModalType('negotiate')} fullWidth variant={brandOfferAmount > 0 ? "secondary" : "primary"}>
                                                    {negotiationStatus.bid_amount ? 'Update Bid' : 'Make an Offer'}
                                                </Button>
                                            </div>
                                        )}
                                        {/* Show start/update negotiation button if no brand proposal yet */}
                                        {(brandOfferAmount <= 0) &&
                                            !isBrandAcceptedCreatorOffer &&
                                            (negotiationStatusKey === 'accepted' || negotiationStatus.status === 'bid_pending' || negotiationStatus.status === 'amount_negotiated' || !negotiationStatus.status) && (
                                                <Button onClick={() => setModalType('negotiate')} fullWidth variant="secondary">
                                                    {negotiationStatus.bid_amount && negotiationStatus.bid_amount > 0 ? 'Update Proposal' : 'Start Negotiation'}
                                                </Button>
                                            )}
                                        {/* Show deal accepted/finalized message when brand has accepted (accepted or amount_finalized) */}
                                        {(negotiationStatus.status === 'amount_finalized' || isBrandAcceptedCreatorOffer) && (
                                            <div style={{
                                                padding: 'var(--space-3)',
                                                background: 'rgba(34, 197, 94, 0.1)',
                                                borderRadius: 'var(--radius-md)',
                                                textAlign: 'center'
                                            }}>
                                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                                                    {negotiationStatus.status === 'amount_finalized' ? 'Deal Finalized' : 'Brand Accepted Your Offer'}
                                                </p>
                                                {brandOfferAmount > 0 && (
                                                    <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>
                                                        {formatINR(brandOfferAmount)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        )}

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
                                                { name: 'Concept & Script Submission', date: 'Mar 15, 2026', status: scriptDeliverableStatus, type: 'script' },
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
                                                        <span className={`status-badge ${task.status === 'Completed' || task.status === 'Accepted' ? 'status-active' :
                                                            task.status === 'Pending' || task.status === 'Changes Requested' ? 'status-content-review' :
                                                                task.status === 'In Review' ? 'status-planning' :
                                                                    'status-planning'
                                                            }`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {(task.type !== 'script' || (task.status !== 'Accepted' && task.status !== 'In Review')) &&
                                                            (task.type !== 'content' || canUploadContent) && (
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
    );
};
