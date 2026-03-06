import React from 'react';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import { Sparkles, FileText, ExternalLink } from 'lucide-react';

interface CampaignScriptsTabProps {
    campaignData: any;
    setIsScriptTemplateModalOpen: (isOpen: boolean) => void;
    filteredScripts: any[];
    scriptFilterTab: string;
    setScriptFilterTab: (tab: string) => void;
    scriptReviewStats: any;
    getScriptStatusMeta: (status: string) => any;
    handleOpenAIReview: (script: any) => void;
}

export const CampaignScriptsTab: React.FC<CampaignScriptsTabProps> = ({
    campaignData,
    setIsScriptTemplateModalOpen,
    filteredScripts,
    scriptFilterTab,
    setScriptFilterTab,
    scriptReviewStats,
    getScriptStatusMeta,
    handleOpenAIReview
}) => {
    return (
        <>
            <Card className="content-card">
                <CardHeader>
                    <div className="card-header-content">
                        <h3>Script Template</h3>
                        <Button size="sm" onClick={() => setIsScriptTemplateModalOpen(true)}>
                            {campaignData?.script_template ? 'Update Script Template' : 'Create Script Template'}
                        </Button>
                    </div>
                </CardHeader>
                <CardBody>
                    {campaignData?.script_template ? (
                        <div style={{
                            background: 'var(--color-bg-secondary)',
                            padding: 'var(--space-4)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border-subtle)',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            fontSize: 'var(--text-sm)'
                        }}>
                            {campaignData.script_template}
                        </div>
                    ) : (
                        <div style={{
                            background: 'var(--color-bg-secondary)',
                            padding: 'var(--space-4)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border-subtle)',
                            textAlign: 'center',
                            color: 'var(--color-text-tertiary)'
                        }}>
                            No script template uploaded yet. Create one for creators to see and finalize.
                        </div>
                    )}
                </CardBody>
            </Card>

            <Card className="content-card" style={{ marginTop: 'var(--space-6)' }}>
                <CardHeader>
                    <div className="card-header-content">
                        <h3>Creator Scripts ({filteredScripts.length})</h3>
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
                            variant={scriptFilterTab === 'accepted' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setScriptFilterTab('accepted')}
                        >
                            Accepted ({scriptReviewStats.accepted})
                        </Button>
                        <Button
                            variant={scriptFilterTab === 'pending' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setScriptFilterTab('pending')}
                        >
                            Pending ({scriptReviewStats.pending})
                        </Button>
                        <Button
                            variant={scriptFilterTab === 'revisionRequested' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setScriptFilterTab('revisionRequested')}
                        >
                            Changes Requested ({scriptReviewStats.revisionRequested})
                        </Button>
                        <Button
                            variant={scriptFilterTab === 'rejected' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setScriptFilterTab('rejected')}
                        >
                            Rejected ({scriptReviewStats.rejected})
                        </Button>
                    </div>
                    <div className="table-responsive">
                        <table className="creators-table">
                            <thead>
                                <tr>
                                    <th>Creator</th>
                                    <th>Script</th>
                                    <th>Status</th>
                                    <th>Submitted</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredScripts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
                                            No creators in this script status.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredScripts.map((script: any) => (
                                        <tr key={script.id || script.creator_id}>
                                            <td>
                                                <div className="creator-cell">
                                                    <div className="creator-avatar">
                                                        {script.avatar || '👤'}
                                                    </div>
                                                    <span className="creator-name">{script.name || script.creator_name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: '200px' }}>
                                                    {script.script_file_url ? (
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => window.open(script.script_file_url, '_blank')}
                                                            style={{ alignSelf: 'flex-start', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                                                        >
                                                            <FileText size={14} style={{ marginRight: '8px' }} />
                                                            View Script Doc
                                                            <ExternalLink size={12} style={{ marginLeft: '8px', opacity: 0.7 }} />
                                                        </Button>
                                                    ) : (
                                                        <div style={{
                                                            fontSize: 'var(--text-sm)',
                                                            color: 'var(--color-text-primary)',
                                                            fontWeight: 500,
                                                            maxWidth: '350px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {script.script_content || script.content || '-'}
                                                        </div>
                                                    )}
                                                    {(script.script_feedback || script.feedback) && (
                                                        <div style={{
                                                            fontSize: '11px',
                                                            color: 'var(--color-text-secondary)',
                                                            background: 'rgba(var(--color-accent-rgb), 0.03)',
                                                            padding: '6px 10px',
                                                            borderRadius: 'var(--radius-sm)',
                                                            borderLeft: '3px solid var(--color-accent)',
                                                            maxWidth: '350px',
                                                            lineHeight: 1.4
                                                        }}>
                                                            <strong style={{ color: 'var(--color-accent)', marginRight: '4px' }}>Your Comment:</strong>
                                                            {script.script_feedback || script.feedback}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                {(() => {
                                                    const meta = getScriptStatusMeta(script.status);
                                                    return <span className={`status-badge ${meta.tone}`}>{meta.label}</span>;
                                                })()}
                                            </td>
                                            <td>
                                                {script.script_submitted_at
                                                    ? new Date(script.script_submitted_at).toLocaleString()
                                                    : (script.submitted_at || script.created_at || '-')}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    {['script_pending', 'pending'].includes(String(script.status || '').toLowerCase()) ? (
                                                        <Button variant="ghost" size="sm" onClick={() => handleOpenAIReview(script)}>
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
        </>
    );
};
