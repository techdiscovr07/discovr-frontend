import React from 'react';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import { FileText, CheckCircle2, Upload, MessageSquare, Clock, Calendar, ChevronRight } from 'lucide-react';
import { useCreatorCampaignContext } from '../CreatorCampaignContext';

export const CreatorCampaignLeftColumn: React.FC = () => {
    const {
        hasAnyBriefDetails, briefVideoTitle, briefPrimaryFocus, briefSecondaryFocus, briefCta,
        briefDos, briefDonts, firstBriefValue, briefData, campaignData, setScriptContent,
        setModalType, scriptDeliverableStatus,
        canUploadContent, canGoLive, negotiationStatus, isBrandAcceptedCreatorOffer,
        brandScriptFeedback, brandContentFeedback, contentDeliverableStatus
    } = useCreatorCampaignContext();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Campaign Brief */}
            <Card className="content-card">
                <CardHeader className="compact-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <FileText size={16} style={{ color: 'var(--color-accent)' }} />
                        <h3>Campaign Brief</h3>
                    </div>
                </CardHeader>
                <CardBody className="compact-card-body">
                    {!hasAnyBriefDetails ? (
                        <div style={{ padding: 'var(--space-3)', background: 'rgba(var(--color-warning-rgb), 0.05)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-warning)' }}>
                            <p style={{ color: 'var(--color-warning)', fontSize: 'var(--text-xs)', fontWeight: 600, margin: 0 }}>
                                Brief Not Yet Available
                            </p>
                        </div>
                    ) : (
                        <div className="compact-grid-2">
                            <div className="compact-info-item">
                                <p className="compact-label">Video Title</p>
                                <p className="compact-value">{briefVideoTitle || '-'}</p>
                            </div>
                            <div className="compact-info-item">
                                <p className="compact-label">Primary Focus</p>
                                <p className="compact-value">{briefPrimaryFocus || '-'}</p>
                            </div>
                            <div className="compact-info-item">
                                <p className="compact-label">Secondary Focus</p>
                                <p className="compact-value">{briefSecondaryFocus || '-'}</p>
                            </div>
                            <div className="compact-info-item">
                                <p className="compact-label">Call to Action</p>
                                <p className="compact-value">{briefCta || '-'}</p>
                            </div>
                            <div className="compact-info-item">
                                <p className="compact-label">Dos</p>
                                <p className="compact-value" style={{ whiteSpace: 'pre-wrap' }}>{briefDos || '-'}</p>
                            </div>
                            <div className="compact-info-item">
                                <p className="compact-label">Don'ts</p>
                                <p className="compact-value" style={{ whiteSpace: 'pre-wrap' }}>{briefDonts || '-'}</p>
                            </div>
                            <div className="compact-info-item" style={{ gridColumn: '1 / -1' }}>
                                <p className="compact-label">Sample Video</p>
                                {(firstBriefValue('sample_video_url', 'sampleVideoUrl', 'sample_video')) ? (
                                    <a
                                        href={firstBriefValue('sample_video_url', 'sampleVideoUrl', 'sample_video')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="compact-value"
                                        style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}
                                    >
                                        View sample video
                                    </a>
                                ) : (
                                    <p className="compact-value">No sample video</p>
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
            {/* Deliverables Timeline */}
            <Card className="content-card">
                <CardHeader className="compact-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Clock size={16} style={{ color: 'var(--color-accent)' }} />
                        <h3>Project Roadmap & Deliverables</h3>
                    </div>
                </CardHeader>
                <CardBody className="no-padding">
                    <div className="deliverables-roadmap-premium">
                        {[
                            {
                                name: 'Campaign Negotiation',
                                date: 'In Progress',
                                status: (negotiationStatus?.status === 'amount_finalized' || isBrandAcceptedCreatorOffer) ? 'Accepted' :
                                    negotiationStatus?.status === 'accepted' ? 'In Review' :
                                        negotiationStatus?.status === 'bid_pending' ? 'Pending' :
                                            negotiationStatus?.status === 'amount_negotiated' ? 'Negotiating' :
                                                negotiationStatus?.status === 'rejected' ? 'Declined' : 'Pending',
                                type: 'negotiate',
                                icon: MessageSquare
                            },
                            { name: 'Concept & Script Submission', date: 'Mar 15, 2026', status: scriptDeliverableStatus, type: 'script', icon: FileText },
                            { name: 'Instagram Reel Content', date: 'Mar 18, 2026', status: contentDeliverableStatus, type: 'content', icon: Upload },
                            {
                                name: 'Final Post Submission (Go Live)',
                                date: 'Mar 22, 2026',
                                status: canGoLive ? 'Ready' : 'Upcoming',
                                type: 'go-live',
                                icon: CheckCircle2
                            }
                        ].map((task, i) => (
                            <div key={i} className="deliverable-step-premium">
                                <div className={`deliverable-icon-wrapper-premium ${task.status === 'Completed' || task.status === 'Accepted' || (task.type === 'go-live' && campaignData.status === 'live') ? 'completed' : ''}`}>
                                    <task.icon size={20} />
                                </div>

                                <div className="deliverable-info-premium">
                                    <span className="deliverable-name-premium">{task.name}</span>
                                    <div className="deliverable-deadline-premium">
                                        <Calendar size={12} />
                                        {task.date === 'In Progress' ? 'Current Phase' : `Due ${task.date}`}
                                    </div>
                                </div>

                                <div className="deliverable-actions-premium">
                                    <span className={`status-badge ${task.status === 'Completed' || task.status === 'Accepted' || task.status === 'Ready' ? 'status-active' :
                                        task.status === 'Pending' || task.status === 'Changes Requested' || task.status === 'Negotiating' ? 'status-content-review' :
                                            task.status === 'In Review' ? 'status-planning' :
                                                task.status === 'Declined' ? 'status-error' :
                                                    'status-planning'
                                        }`}>
                                        {task.status}
                                    </span>

                                    {task.type === 'negotiate' && task.status !== 'Accepted' && !hasAnyBriefDetails && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setModalType('negotiate')}
                                            style={{ padding: '0 var(--space-2)' }}
                                        >
                                            View
                                            <ChevronRight size={16} />
                                        </Button>
                                    )}

                                    {task.type === 'script' && task.status !== 'Accepted' && task.status !== 'In Review' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const template = briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template || '';
                                                const submitted = briefData?.script_content || campaignData?.script_content || '';
                                                setScriptContent(submitted || template);
                                                setModalType('script');
                                            }}
                                            style={{ padding: '0 var(--space-2)' }}
                                        >
                                            Submit
                                            <ChevronRight size={16} />
                                        </Button>
                                    )}

                                    {task.type === 'content' && canUploadContent && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setModalType('content')}
                                            style={{ padding: '0 var(--space-2)' }}
                                        >
                                            Upload
                                            <ChevronRight size={16} />
                                        </Button>
                                    )}

                                    {task.type === 'go-live' && canGoLive && campaignData.status !== 'live' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setModalType('go-live')}
                                            style={{ padding: '0 var(--space-2)' }}
                                        >
                                            Go Live
                                            <ChevronRight size={16} />
                                        </Button>
                                    )}
                                </div>

                                {task.type === 'script' && brandScriptFeedback && (
                                    <div className="deliverable-feedback-inline">
                                        <MessageSquare size={12} />
                                        <span>Brand: {brandScriptFeedback}</span>
                                    </div>
                                )}

                                {task.type === 'content' && brandContentFeedback && (
                                    <div className="deliverable-feedback-inline" style={{ borderColor: 'var(--color-warning)' }}>
                                        <MessageSquare size={12} style={{ color: 'var(--color-warning)' }} />
                                        <span>Brand: {brandContentFeedback}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};
