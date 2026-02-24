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
}

export const CampaignContentTab: React.FC<CampaignContentTabProps> = ({
    filteredContent,
    contentFilterTab,
    setContentFilterTab,
    contentReviewStats,
    getContentStatusMeta,
    handleOpenAIContentReview
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
                                                <div className="creator-avatar" style={{ width: 32, height: 32, fontSize: 16 }}>
                                                    {item.avatar || '👤'}
                                                </div>
                                                <div>
                                                    <div className="creator-name">{item.name || item.creator_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {(() => {
                                                const contentStatus = String(item.status || '').toLowerCase();
                                                const isLive = contentStatus === 'content_live' || contentStatus === 'live';
                                                if (isLive && item.live_url) {
                                                    return (
                                                        <a href={item.live_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                                                            View Live URL
                                                        </a>
                                                    );
                                                }
                                                if (item.content_url) {
                                                    return (
                                                        <a href={item.content_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                                                            View Content
                                                        </a>
                                                    );
                                                }
                                                if (item.live_url) {
                                                    return (
                                                        <a href={item.live_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                                                            View Live URL
                                                        </a>
                                                    );
                                                }
                                                return item.content || '-';
                                            })()}
                                        </td>
                                        <td>
                                            {(() => {
                                                const meta = getContentStatusMeta(item.status);
                                                return <span className={`status-badge ${meta.tone}`}>{meta.label}</span>;
                                            })()}
                                        </td>
                                        <td>{item.submitted_at || item.created_at || '-'}</td>
                                        <td style={{ textAlign: 'right', display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
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
