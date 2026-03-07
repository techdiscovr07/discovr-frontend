import React from 'react';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import { Sparkles } from 'lucide-react';

interface CampaignContentTabProps {
    filteredContent: any[];
    contentFilterTab: string;
    setContentFilterTab: (tab: string) => void;
    contentReviewStats: any;
    getContentStatusMeta: (status: string) => any;
    handleOpenAIContentReview: (item: any) => void;
    handleOpenReelModal: (url: string) => void;
}

export const CampaignContentTab: React.FC<CampaignContentTabProps> = ({
    filteredContent,
    contentFilterTab,
    setContentFilterTab,
    contentReviewStats,
    getContentStatusMeta,
    handleOpenAIContentReview,
    handleOpenReelModal
}) => {
    return (
        <Card className="content-card">
            <CardHeader>
                <div className="card-header-content">
                    <h3>Creator Content ({filteredContent.length})</h3>
                </div>
            </CardHeader>
            <CardBody className="no-padding">
                <div style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    flexWrap: 'wrap',
                    padding: 'var(--space-4)',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    background: 'var(--color-bg-secondary)'
                }}>
                    <Button
                        variant={contentFilterTab === 'accepted' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setContentFilterTab('accepted')}
                    >
                        Accepted ({contentReviewStats.accepted})
                    </Button>
                    <Button
                        variant={contentFilterTab === 'pending' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setContentFilterTab('pending')}
                    >
                        Pending ({contentReviewStats.pending})
                    </Button>
                    <Button
                        variant={contentFilterTab === 'revisionRequested' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setContentFilterTab('revisionRequested')}
                    >
                        Changes Requested ({contentReviewStats.revisionRequested})
                    </Button>
                    <Button
                        variant={contentFilterTab === 'rejected' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setContentFilterTab('rejected')}
                    >
                        Rejected ({contentReviewStats.rejected})
                    </Button>
                </div>
                <div className="table-responsive">
                    <table className="creators-table">
                        <thead>
                            <tr>
                                <th>Creator</th>
                                <th>Content</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContent.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
                                        No creators in this content status.
                                    </td>
                                </tr>
                            ) : (
                                filteredContent.map((item: any) => (
                                    <tr key={item.id || item.creator_id}>
                                        <td>
                                            <div className="creator-cell">
                                                <div className="creator-avatar">
                                                    {item.avatar || '👤'}
                                                </div>
                                                <span className="creator-name">{item.name || item.creator_name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: '150px' }}>
                                                {(() => {
                                                    const contentStatus = String(item.status || '').toLowerCase();
                                                    const isLive = contentStatus === 'content_live' || contentStatus === 'live';
                                                    if (isLive && item.live_url) {
                                                        return (
                                                            <a href={item.live_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                                                                View Live URL
                                                            </a>
                                                        );
                                                    }
                                                    if (item.content_url) {
                                                        const isInstagramReel = item.content_url.includes('instagram.com/reel/');
                                                        return (
                                                            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                                                <a href={item.content_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                                                                    View Content
                                                                </a>
                                                                {isInstagramReel && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        style={{ padding: '2px 8px', height: 'auto', fontSize: '10px' }}
                                                                        onClick={() => handleOpenReelModal(item.content_url)}
                                                                    >
                                                                        Play Reel
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    if (item.live_url) {
                                                        return (
                                                            <a href={item.live_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                                                                View Live URL
                                                            </a>
                                                        );
                                                    }
                                                    return <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{item.content || '-'}</span>;
                                                })()}
                                                {(item.content_feedback || item.video_feedback || item.feedback) && (
                                                    <div style={{
                                                        fontSize: '11px',
                                                        color: 'var(--color-text-secondary)',
                                                        background: 'rgba(var(--color-warning-rgb), 0.03)',
                                                        padding: '6px 10px',
                                                        borderRadius: 'var(--radius-sm)',
                                                        borderLeft: '3px solid var(--color-warning)',
                                                        maxWidth: '350px',
                                                        lineHeight: 1.4
                                                    }}>
                                                        <strong style={{ color: 'var(--color-warning)', marginRight: '4px' }}>Your Comment:</strong>
                                                        {item.content_feedback || item.video_feedback || item.feedback}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {(() => {
                                                const meta = getContentStatusMeta(item.status);
                                                return <span className={`status-badge ${meta.tone}`}>{meta.label}</span>;
                                            })()}
                                        </td>
                                        <td>{item.submitted_at || item.created_at || '-'}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {['content_pending', 'pending'].includes(String(item.status || '').toLowerCase()) ? (
                                                    <Button variant="ghost" size="sm" onClick={() => handleOpenAIContentReview(item)}>
                                                        <Sparkles size={14} />
                                                        Ask AI Review
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="sm" disabled>
                                                        Reviewed
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
};
