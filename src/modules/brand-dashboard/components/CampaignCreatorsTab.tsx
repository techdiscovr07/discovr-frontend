import React from 'react';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import { Check } from 'lucide-react';
import { brandApi } from '../../../lib/api';

interface CampaignCreatorsTabProps {
    creatorFilterTab: string;
    setCreatorFilterTab: (tab: string) => void;
    filteredCreators: any[];
    creators: any[];
    bids: any[];
    handleFinalizeAmounts: () => void;
    isFinalizingAmounts: boolean;
    handleBrandSubmitSelection: () => void;
    isSubmittingSelection: boolean;
    canShowNegotiationInCreators: boolean;
    id: string | undefined;
    showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
    setCreators: (creators: any[]) => void;
    setBids: (bids: any[]) => void;
    getBidCreatorId: (bid: any) => string | undefined;
    openCounterModal: (bid: any) => void;
    campaignData: any;
    hideFilters?: boolean;
    handleOpenCreatorProfile?: (creator: any) => void;
}

export const CampaignCreatorsTab: React.FC<CampaignCreatorsTabProps> = ({
    creatorFilterTab,
    setCreatorFilterTab,
    filteredCreators,
    creators,
    bids,
    handleFinalizeAmounts,
    isFinalizingAmounts,
    handleBrandSubmitSelection,
    isSubmittingSelection,
    canShowNegotiationInCreators,
    id,
    showToast,
    setCreators,
    setBids,
    getBidCreatorId,
    openCounterModal,
    campaignData,
    hideFilters = false,
    handleOpenCreatorProfile
}) => {
    return (
        <Card className="content-card">
            <CardHeader>
                <div className="card-header-content">
                    <h3>{creatorFilterTab === 'negotiation' ? `Creator Negotiations (${bids.length})` : `Campaign Creators (${filteredCreators.length})`}</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {/* Only show Finalize if not already final and we have accepted creators */}
                        {campaignData.review_status !== 'creators_are_final' && creators.some((c: any) => ['accepted', 'shortlisted', 'active'].includes(String(c.status).toLowerCase())) && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleFinalizeAmounts}
                                isLoading={isFinalizingAmounts}
                                style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)', borderColor: 'rgba(34, 197, 94, 0.2)' }}
                            >
                                <Check size={16} />
                                Finalize All Deals
                            </Button>
                        )}

                        <Button
                            variant={creatorFilterTab === 'negotiation' ? 'ghost' : 'primary'}
                            size="sm"
                            onClick={handleBrandSubmitSelection}
                            isLoading={isSubmittingSelection}
                            disabled={campaignData.review_status === 'creators_are_final'}
                        >
                            <Check size={18} />
                            {campaignData.review_status === 'negotiation' ? 'Update Selection' : 'Submit Selection'}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="no-padding">
                {!hideFilters && (
                    <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', gap: 'var(--space-2)' }}>
                        <Button size="sm" variant={creatorFilterTab === 'all' ? 'primary' : 'ghost'} onClick={() => setCreatorFilterTab('all')}>
                            All ({creators.length})
                        </Button>
                        <Button size="sm" variant={creatorFilterTab === 'accepted' ? 'primary' : 'ghost'} onClick={() => setCreatorFilterTab('accepted')}>
                            Accepted ({creators.filter((c: any) => {
                                const status = String(c?.status || '').toLowerCase();
                                return status === 'accepted' || status === 'shortlisted';
                            }).length})
                        </Button>
                        <Button size="sm" variant={creatorFilterTab === 'rejected' ? 'primary' : 'ghost'} onClick={() => setCreatorFilterTab('rejected')}>
                            Rejected ({creators.filter((c: any) => String(c?.status || '').toLowerCase() === 'rejected').length})
                        </Button>
                        {canShowNegotiationInCreators && (
                            <Button size="sm" variant={creatorFilterTab === 'negotiation' ? 'primary' : 'ghost'} onClick={() => setCreatorFilterTab('negotiation')}>
                                Negotiation ({bids.length})
                            </Button>
                        )}
                    </div>
                )}
                {creatorFilterTab !== 'negotiation' ? (
                    <div className="table-responsive">
                        <table className="creators-table">
                            <thead>
                                <tr>
                                    <th>Creator</th>
                                    <th>Instagram</th>
                                    <th>Status</th>
                                    <th>Performance</th>
                                    <th>Efficiency</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCreators.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
                                            {creators.length === 0 ? 'No creators added yet. Upload a creators sheet to get started.' : 'No creators found for this filter.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCreators.map((creator: any) => (
                                        <tr
                                            key={creator.id || creator.creator_id}
                                            onClick={() => handleOpenCreatorProfile?.(creator)}
                                            style={{ cursor: handleOpenCreatorProfile ? 'pointer' : 'default' }}
                                        >
                                            <td>
                                                <div className="creator-cell">
                                                    <div className="creator-avatar" style={{ width: 32, height: 32, fontSize: 16 }}>
                                                        {creator.avatar || '👤'}
                                                    </div>
                                                    <div>
                                                        <div className="creator-name">{creator.name || creator.creator_name}</div>
                                                        <div className="creator-handle">{creator.handle || creator.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {creator.instagram ? (() => {
                                                    const url = creator.instagram;
                                                    let username = '';
                                                    try {
                                                        const parts = url.replace(/\/$/, '').split('/');
                                                        const lastPart = parts[parts.length - 1];
                                                        username = lastPart.split('?')[0];
                                                    } catch (e) {
                                                        username = url;
                                                    }
                                                    return (
                                                        <a
                                                            href={url.startsWith('http') ? url : `https://instagram.com/${url.replace('@', '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}
                                                        >
                                                            @{username}
                                                        </a>
                                                    );
                                                })() : (
                                                    <span style={{ color: 'var(--color-text-tertiary)' }}>No link</span>
                                                )}
                                            </td>
                                            <td>
                                                {(() => {
                                                    const status = String(creator.status || '').toLowerCase();
                                                    let statusClass = 'status-planning';
                                                    if (status === 'accepted' || status === 'shortlisted' || status === 'script_approved' || status === 'amount_finalized') statusClass = 'status-active';
                                                    else if (status === 'rejected') statusClass = 'status-error';
                                                    else if (status === 'negotiation' || status === 'in_negotiation') statusClass = 'status-negotiation';
                                                    else if (status === 'pending') statusClass = 'status-pending';

                                                    return (
                                                        <span className={`status-badge ${statusClass}`}>
                                                            {creator.status ? creator.status.replace(/_/g, ' ') : 'Pending'}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
                                                        {creator.avg_views ? (Number(creator.avg_views) >= 1000 ? `${(Number(creator.avg_views) / 1000).toFixed(0)}k` : creator.avg_views) : 'N/A'} views
                                                    </div>
                                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
                                                        {creator.engagement_rate || creator.commercial || 'N/A'}{creator.engagement_rate ? '%' : ''} ER
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                                                        ₹{creator.avg_views && (creator.amount || creator.final_amount)
                                                            ? (Number(creator.amount || creator.final_amount) / Number(creator.avg_views)).toFixed(2)
                                                            : '0.00'} CPE
                                                    </div>
                                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                                        ₹{(() => {
                                                            const amt = Number(creator.amount || creator.final_amount || 0);
                                                            return amt.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                                                        })()} spent
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                {(() => {
                                                    const status = String(creator.status || '').toLowerCase();

                                                    // Hiding actions if creator has progressed beyond selection (to script, content, or finalized phases)
                                                    const isWorkflowPhase =
                                                        status.includes('script') ||
                                                        status.includes('content') ||
                                                        status === 'completed' ||
                                                        status === 'amount_finalized';

                                                    if (isWorkflowPhase) return null;

                                                    const isAccepted = status === 'accepted' || status === 'shortlisted' || status === 'active';
                                                    const currentId = creator.creator_id || creator.id || creator._id;

                                                    if (isAccepted) {
                                                        return (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                style={{ color: 'var(--color-error)' }}
                                                                onClick={async (e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    const updated = creators.map(c => {
                                                                        const cId = c.creator_id || c.id || c._id;
                                                                        if (cId === currentId) {
                                                                            return { ...c, status: 'rejected' };
                                                                        }
                                                                        return c;
                                                                    });
                                                                    setCreators(updated);

                                                                    if (id) {
                                                                        try {
                                                                            await brandApi.updateCreatorStatuses(id, [{
                                                                                creator_id: currentId,
                                                                                status: 'rejected'
                                                                            }]);
                                                                            showToast('Creator rejected', 'success');
                                                                        } catch (error: any) {
                                                                            showToast(error.message || 'Failed to update status', 'error');
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        );
                                                    } else {
                                                        return (
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={async (e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    const updated = creators.map(c => {
                                                                        const cId = c.creator_id || c.id || c._id;
                                                                        if (cId === currentId) {
                                                                            return { ...c, status: 'accepted' };
                                                                        }
                                                                        return c;
                                                                    });
                                                                    setCreators(updated);

                                                                    if (id) {
                                                                        try {
                                                                            await brandApi.updateCreatorStatuses(id, [{
                                                                                creator_id: currentId,
                                                                                status: 'accepted'
                                                                            }]);
                                                                            showToast('Creator accepted', 'success');
                                                                        } catch (error: any) {
                                                                            showToast(error.message || 'Failed to update status', 'error');
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                Accept
                                                            </Button>
                                                        );
                                                    }
                                                })()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="creators-table">
                            <thead>
                                <tr>
                                    <th>Creator</th>
                                    <th>Creator's Proposal</th>
                                    <th>Your Proposal</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bids.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
                                            No negotiation proposals received yet.
                                        </td>
                                    </tr>
                                ) : (
                                    bids.map((bid: any) => (
                                        <tr
                                            key={bid.id || bid.creator_id}
                                            onClick={() => handleOpenCreatorProfile?.(bid)}
                                            style={{ cursor: handleOpenCreatorProfile ? 'pointer' : 'default' }}
                                        >
                                            <td>
                                                <div className="creator-cell">
                                                    <div className="creator-avatar" style={{ width: 32, height: 32, fontSize: 16 }}>
                                                        {bid.avatar || '👤'}
                                                    </div>
                                                    <div>
                                                        <div className="creator-name">{bid.name || bid.creator_name}</div>
                                                        <div className="creator-handle">{bid.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {(bid.bid_amount || bid.amount) ? (
                                                    <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                                        ₹{(bid.bid_amount || bid.amount).toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>
                                                        Pending creator proposal
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {bid.final_amount ? (
                                                    <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-success)' }}>
                                                        ₹{bid.final_amount.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                                        {bid.proposed_amount ? (
                                                            <span style={{ fontWeight: 'var(--font-medium)', color: 'var(--color-warning)' }}>
                                                                Offered: ₹{bid.proposed_amount.toLocaleString()}
                                                            </span>
                                                        ) : (
                                                            <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>No offer yet</span>
                                                        )}
                                                        {(bid.status === 'bid_pending' || bid.status === 'amount_negotiated' || bid.status === 'pending') && (
                                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={async (e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        if (!id) return;
                                                                        const creatorId = getBidCreatorId(bid);
                                                                        if (!creatorId) {
                                                                            showToast('Creator ID not found for this bid', 'error');
                                                                            return;
                                                                        }
                                                                        try {
                                                                            await brandApi.respondToCreatorBid(id, creatorId, 'accept');
                                                                            showToast('Negotiation accepted', 'success');
                                                                            const bidsData: any = await brandApi.getCreatorBids(id);
                                                                            setBids(Array.isArray(bidsData) ? bidsData : (bidsData?.bids || bidsData?.creators || []));
                                                                        } catch (error: any) {
                                                                            showToast(error.message || 'Failed to accept', 'error');
                                                                        }
                                                                    }}
                                                                >
                                                                    Accept
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    style={{ color: 'var(--color-warning)' }}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        openCounterModal(bid);
                                                                    }}
                                                                >
                                                                    Counter
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    style={{ color: 'var(--color-error)' }}
                                                                    onClick={async (e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        if (!id) return;
                                                                        const creatorId = getBidCreatorId(bid);
                                                                        if (!creatorId) {
                                                                            showToast('Creator ID not found for this bid', 'error');
                                                                            return;
                                                                        }
                                                                        try {
                                                                            await brandApi.respondToCreatorBid(id, creatorId, 'reject');
                                                                            showToast('Negotiation rejected', 'success');
                                                                            const bidsData: any = await brandApi.getCreatorBids(id);
                                                                            setBids(Array.isArray(bidsData) ? bidsData : (bidsData?.bids || bidsData?.creators || []));
                                                                        } catch (error: any) {
                                                                            showToast(error.message || 'Failed to reject', 'error');
                                                                        }
                                                                    }}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${bid.status === 'accepted' || bid.status === 'amount_finalized' ? 'status-active' : bid.status === 'rejected' || bid.status === 'amount_rejected' ? 'status-error' : 'status-planning'}`}>
                                                    {bid.status === 'amount_finalized' ? 'Deal Agreed' :
                                                        bid.status === 'amount_negotiated' ? 'Negotiating' :
                                                            bid.status === 'bid_pending' ? 'Bid Received' :
                                                                (bid.status || 'Pending')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};
