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
                <CardHeader>
                    <h3>Campaign Details</h3>
                </CardHeader>
                <CardBody>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Total Budget</span>
                            <span style={{ fontWeight: 'var(--font-bold)' }}>
                                {campaignData.total_budget !== undefined && campaignData.total_budget !== null ? formatINR(campaignData.total_budget) : '—'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>CPV</span>
                            <span style={{ fontWeight: 'var(--font-bold)' }}>
                                {campaignData.cpv !== undefined && campaignData.cpv !== null ? formatINR(campaignData.cpv) : '—'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Creator Count</span>
                            <span style={{ fontWeight: 'var(--font-bold)' }}>
                                {campaignData.creator_count !== undefined && campaignData.creator_count !== null ? campaignData.creator_count : '—'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Description</span>
                            <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                                {campaignData.description || '—'}
                            </span>
                        </div>
                        {Array.isArray(campaignData.creator_categories) && campaignData.creator_categories.length > 0 && (
                            <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', display: 'block', marginBottom: 'var(--space-2)' }}>
                                    Categories
                                </span>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                    {campaignData.creator_categories.map((cat: string) => (
                                        <span key={cat} style={{ background: 'var(--color-bg-tertiary)', padding: '4px 10px', borderRadius: '20px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {(!Array.isArray(campaignData.creator_categories) || campaignData.creator_categories.length === 0) && (
                            <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', display: 'block', marginBottom: 'var(--space-1)' }}>
                                    Categories
                                </span>
                                <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>—</span>
                            </div>
                        )}
                        {Number(negotiationStatus?.final_amount) > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Your Deal Amount</span>
                                <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-success)', fontSize: 'var(--text-lg)' }}>
                                    {formatINR(negotiationStatus.final_amount)}
                                </span>
                            </div>
                        )}
                        {Number(negotiationStatus?.bid_amount) > 0 && Number(negotiationStatus?.final_amount) <= 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Your Proposal</span>
                                <span style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
                                    {formatINR(negotiationStatus.bid_amount)}
                                </span>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Status Card */}
            <Card style={{ background: 'linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.1) 0%, transparent 100%)' }}>
                <CardBody>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Current Progress</h4>
                        <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)' }}>
                            {campaignData.progress || 0}%
                        </span>
                    </div>
                    <div className="progress-bar" style={{ height: '8px', marginBottom: 'var(--space-4)' }}>
                        <div className="progress-fill" style={{ width: `${campaignData.progress || 0}%` }}></div>
                    </div>
                    {campaignData.deadline && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-warning)', fontSize: 'var(--text-xs)' }}>
                            <Clock size={14} />
                            Deadline: {new Date(campaignData.deadline).toLocaleDateString()}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Payout Details */}
            <Card>
                <CardHeader>
                    <h3>Payment Schedule</h3>
                </CardHeader>
                <CardBody>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Milestone 1 (Script)</span>
                            <span style={{ fontWeight: 'var(--font-semibold)' }}>₹150</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Milestone 2 (Content)</span>
                            <span style={{ fontWeight: 'var(--font-semibold)' }}>₹350</span>
                        </div>
                        <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: 'var(--space-2) 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-bold)' }}>Total Contract</span>
                            <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-success)', fontSize: 'var(--text-xl)' }}>₹500</span>
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
