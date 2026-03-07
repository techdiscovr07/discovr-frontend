import React, { useState } from 'react';
import { Sparkles, Activity, Instagram, ExternalLink, Loader2 } from 'lucide-react';
import { brandApi } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';
import { Card, CardHeader, CardBody, Button } from '../../../components';

interface CampaignContentTabProps {
    filteredContent: any[];
    contentFilterTab: string;
    setContentFilterTab: (tab: string) => void;
    contentReviewStats: any;
    getContentStatusMeta: (status: string) => any;
    handleOpenAIContentReview: (item: any) => void;
}

export const CampaignContentTab: React.FC<CampaignContentTabProps> = ({
    filteredContent,
    contentFilterTab,
    setContentFilterTab,
    contentReviewStats,
    getContentStatusMeta,
    handleOpenAIContentReview
}) => {
    const { showToast } = useToast();
    const [trackingPost, setTrackingPost] = useState<any>(null);
    const [isTracking, setIsTracking] = useState<string | null>(null); // creator_id of currently tracking post

    const handleTrackPerformance = async (creatorId: string, url: string) => {
        if (!url) return;
        setIsTracking(creatorId);
        try {
            const data = await brandApi.trackBrandCreatorInstagramPost(creatorId, url);
            setTrackingPost({ ...data, creatorId });
            showToast('Live performance data updated!', 'success');
        } catch (error: any) {
            console.error('Failed to track performance:', error);
            showToast(error.message || 'Could not fetch live data. Ensure the post is public.', 'error');
        } finally {
            setIsTracking(null);
        }
    };

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
                                                    {item.avatar && item.avatar.startsWith('http') ? (
                                                        <img src={item.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                                    ) : (
                                                        item.avatar || '👤'
                                                    )}
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
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                                                                <a href={item.live_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                                                                    View Live URL
                                                                </a>
                                                                {item.live_url.includes('instagram.com') && (
                                                                    <button
                                                                        onClick={() => handleTrackPerformance(item.id || item.creator_id, item.live_url)}
                                                                        disabled={isTracking === (item.id || item.creator_id)}
                                                                        style={{
                                                                            all: 'unset',
                                                                            cursor: 'pointer',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 'var(--space-1)',
                                                                            fontSize: '11px',
                                                                            color: 'var(--color-info)',
                                                                            fontWeight: 600,
                                                                            opacity: isTracking === (item.id || item.creator_id) ? 0.5 : 1
                                                                        }}
                                                                    >
                                                                        {isTracking === (item.id || item.creator_id) ? (
                                                                            <Loader2 className="animate-spin" size={12} />
                                                                        ) : (
                                                                            <Activity size={12} />
                                                                        )}
                                                                        Track Live Performance
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    if (item.content_url) {
                                                        return (
                                                            <a href={item.content_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                                                                View Content
                                                            </a>
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
                                                {String(item.status || '').toLowerCase() === 'content_pending' ? (
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

                {/* Live Tracking Result Area */}
                {trackingPost && (
                    <div className="animate-fade-in" style={{
                        margin: 'var(--space-4)',
                        padding: '1.5rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '16px',
                        border: '1px solid var(--color-border-subtle)',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Activity size={20} color="var(--color-accent)" />
                                <h4 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Live Performance: {filteredContent.find(c => (c.id === trackingPost.creatorId || c.creator_id === trackingPost.creatorId))?.name || 'Creator'}</h4>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setTrackingPost(null)}>Close Tracker</Button>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ width: '100px', height: '130px', borderRadius: '12px', overflow: 'hidden', background: 'var(--color-bg-tertiary)' }}>
                                {trackingPost.media?.thumbnail_url || trackingPost.media?.media_url ? (
                                    <img
                                        src={trackingPost.media?.thumbnail_url || trackingPost.media?.media_url}
                                        alt="Post thumbnail"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Instagram size={28} color="var(--color-text-tertiary)" />
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Likes</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{trackingPost.media?.like_count?.toLocaleString()}</div>
                                    </div>
                                    <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                                        <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Comments</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{trackingPost.media?.comments_count?.toLocaleString()}</div>
                                    </div>
                                    {trackingPost.insights && Object.entries(trackingPost.insights).map(([key, val]: [string, any]) => (
                                        <div key={key} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                                            <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{key.replace(/_/g, ' ')}</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{val?.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                    <a
                                        href={trackingPost.media?.permalink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
                                    >
                                        Verify on Instagram <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};
