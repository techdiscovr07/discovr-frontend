import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import {
    FileText,
    CheckCircle2,
    XCircle,
    Upload,
    MessageSquare,
    Clock,
    Calendar,
    ChevronRight,
    Target,
    Zap,
    ArrowRight,
    Video,
    File as FileIcon,
    AlertCircle
} from 'lucide-react';
import { useCreatorCampaignContext } from '../CreatorCampaignContext';

export const CreatorCampaignLeftColumn: React.FC = () => {
    const {
        hasAnyBriefDetails, briefVideoTitle, briefPrimaryFocus, briefSecondaryFocus, briefCta,
        briefDos, briefDonts, firstBriefValue, briefData, campaignData, setScriptContent,
        setModalType, scriptDeliverableStatus,
        canUploadContent, canGoLive, negotiationStatus, isBrandAcceptedCreatorOffer,
        brandScriptFeedback, brandContentFeedback, contentDeliverableStatus
    } = useCreatorCampaignContext();

    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    const renderBriefItem = (icon: any, label: string, value: string) => (
        <motion.div
            variants={itemVariants}
            className="creator-brief-item-premium"
            style={{
                padding: 'var(--space-3)',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-tertiary)' }}>
                {React.createElement(icon, { size: 12 })}
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', margin: 0, fontWeight: 500 }}>{value || '-'}</p>
        </motion.div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Campaign Brief */}
            <Card className="content-card">
                <CardHeader className="compact-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-accent)'
                        }}>
                            <FileText size={18} />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Campaign Brief</h3>
                    </div>
                </CardHeader>
                <CardBody style={{ padding: 'var(--space-5)' }}>
                    {!hasAnyBriefDetails ? (
                        <div style={{
                            padding: 'var(--space-4)',
                            background: 'rgba(234, 179, 8, 0.05)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px dashed var(--color-warning)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)'
                        }}>
                            <AlertCircle size={18} style={{ color: 'var(--color-warning)' }} />
                            <p style={{ color: 'var(--color-warning)', fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0 }}>
                                Brief Not Yet Available
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                                {renderBriefItem(FileText, "Video Title", briefVideoTitle)}
                                {renderBriefItem(Target, "Primary Focus", briefPrimaryFocus)}
                                {renderBriefItem(Zap, "Secondary Focus", briefSecondaryFocus)}
                                {renderBriefItem(ArrowRight, "Call to Action", briefCta)}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CheckCircle2 size={10} /> Dos
                                    </span>
                                    <div style={{ padding: 'var(--space-3)', background: 'rgba(34, 197, 94, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34, 197, 94, 0.1)', fontSize: '13px', lineHeight: 1.5, color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>
                                        {briefDos || '-'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <XCircle size={10} /> Don'ts
                                    </span>
                                    <div style={{ padding: 'var(--space-3)', background: 'rgba(239, 68, 68, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.1)', fontSize: '13px', lineHeight: 1.5, color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>
                                        {briefDonts || '-'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        const url = firstBriefValue('sample_video_url', 'sampleVideoUrl', 'sample_video');
                                        if (url) window.open(url, '_blank');
                                    }}
                                    disabled={!firstBriefValue('sample_video_url', 'sampleVideoUrl', 'sample_video')}
                                    style={{ flex: 1, height: '44px', gap: '8px' }}
                                >
                                    <Video size={16} />
                                    View Sample
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        const url = firstBriefValue('brief_document_url', 'brief_document');
                                        if (url) window.open(url, '_blank');
                                    }}
                                    disabled={!firstBriefValue('brief_document_url', 'brief_document')}
                                    style={{ flex: 1, height: '44px', gap: '8px' }}
                                >
                                    <FileIcon size={16} />
                                    Brief Doc
                                </Button>
                            </div>
                        </motion.div>
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
