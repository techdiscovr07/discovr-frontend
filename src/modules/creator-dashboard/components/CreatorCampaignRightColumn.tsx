import React from 'react';
import { Card, CardHeader, CardBody } from '../../../components';
import { Info, Clock } from 'lucide-react';
import { useCreatorCampaignContext } from '../CreatorCampaignContext';

export const CreatorCampaignRightColumn: React.FC = () => {
    const {
        scriptReviewMeta, brandScriptFeedback, campaignData, formatINR,
        negotiationStatus
    } = useCreatorCampaignContext();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Script Review Status */}
            {scriptReviewMeta && (
                <Card className="content-card">
                    <CardHeader>
                        <h3>Script Review</h3>
                    </CardHeader>
                    <CardBody>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <span className={`status-badge ${scriptReviewMeta.tone}`} style={{ width: 'fit-content' }}>
                                {scriptReviewMeta.label}
                            </span>
                            <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                                {scriptReviewMeta.message}
                            </p>
                            {brandScriptFeedback && (
                                <div style={{
                                    marginTop: 'var(--space-2)',
                                    padding: 'var(--space-3)',
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border-subtle)',
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
                                        Brand Comment
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        color: 'var(--color-text-primary)',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: 1.5,
                                        fontSize: 'var(--text-sm)'
                                    }}>
                                        {brandScriptFeedback}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Campaign Stats */}
            <Card className="content-card">
                <CardHeader className="compact-card-header">
                    <h3>Campaign Details</h3>
                </CardHeader>
                <CardBody className="compact-card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-1) 0' }}>
                            <span className="compact-label">Total Budget</span>
                            <span className="compact-value" style={{ fontWeight: 700 }}>
                                {campaignData.total_budget !== undefined && campaignData.total_budget !== null ? formatINR(campaignData.total_budget) : '—'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-1) 0' }}>
                            <span className="compact-label">CPV</span>
                            <span className="compact-value" style={{ fontWeight: 700 }}>
                                {campaignData.cpv !== undefined && campaignData.cpv !== null ? formatINR(campaignData.cpv) : '—'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-1) 0' }}>
                            <span className="compact-label">Creators</span>
                            <span className="compact-value" style={{ fontWeight: 700 }}>
                                {campaignData.creator_count !== undefined && campaignData.creator_count !== null ? campaignData.creator_count : '—'}
                            </span>
                        </div>

                        <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                            <span className="compact-label" style={{ marginBottom: 'var(--space-1)', display: 'block' }}>Description</span>
                            <p className="compact-value" style={{ lineHeight: 1.4, fontSize: '12px' }}>
                                {campaignData.description || '—'}
                            </p>
                        </div>

                        {Array.isArray(campaignData.creator_categories) && campaignData.creator_categories.length > 0 && (
                            <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
                                <span className="compact-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                                    Categories
                                </span>
                                <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                                    {campaignData.creator_categories.map((cat: string) => (
                                        <span key={cat} style={{ background: 'var(--color-bg-tertiary)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-subtle)' }}>
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Status Card */}
            <Card style={{ background: 'linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.05) 0%, transparent 100%)' }}>
                <CardBody className="compact-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <h4 className="compact-label">Progress</h4>
                        <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-accent)' }}>
                            {campaignData.progress || 0}%
                        </span>
                    </div>
                    <div className="progress-bar" style={{ height: '6px', marginBottom: 'var(--space-2)' }}>
                        <div className="progress-fill" style={{ width: `${campaignData.progress || 0}%` }}></div>
                    </div>
                    {campaignData.deadline && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-warning)', fontSize: '10px', fontWeight: 600 }}>
                            <Clock size={12} />
                            DUE: {new Date(campaignData.deadline).toLocaleDateString()}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Payout Details */}
            <Card>
                <CardHeader className="compact-card-header">
                    <h3>Payment Schedule</h3>
                </CardHeader>
                <CardBody className="compact-card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="compact-label">Milestone 1 (Script)</span>
                            <span className="compact-value" style={{ fontWeight: 600 }}>₹150</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="compact-label">Milestone 2 (Content)</span>
                            <span className="compact-value" style={{ fontWeight: 600 }}>₹350</span>
                        </div>
                        <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: 'var(--space-1) 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="compact-label" style={{ color: 'var(--color-text-primary)', fontWeight: 800 }}>Total Contract</span>
                            <span style={{ fontWeight: 900, color: 'var(--color-success)', fontSize: 'var(--text-lg)' }}>₹500</span>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Support Card */}
            <Card className="notice-card" style={{ margin: 0 }}>
                <CardBody>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                        <Info size={20} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
                        <div>
                            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>Need Help?</h4>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Read the full creator policy or contact support if you have questions about this campaign.
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>

    );
};
