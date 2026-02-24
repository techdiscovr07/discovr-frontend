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
    openCounterModal
}) => {
    return (
        <Card className="content-card">
            <CardHeader>
                <div className="card-header-content">
                    <h3>{creatorFilterTab === 'negotiation' ? `Creator Negotiations (${bids.length})` : `Campaign Creators (${filteredCreators.length})`}</h3>
                    {creatorFilterTab === 'negotiation' ? (
                        <Button onClick={handleFinalizeAmounts} isLoading={isFinalizingAmounts}>
                            Finalize Deals
                        </Button>
                    ) : (
                        <Button size="sm" onClick={handleBrandSubmitSelection} isLoading={isSubmittingSelection}>
                            <Check size={18} />
                            Submit Selection
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardBody className="no-padding">
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
                                        <tr key={creator.id || creator.creator_id}>
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
                                                {creator.instagram ? (
                                                    <a
                                                        href={creator.instagram.startsWith('http') ? creator.instagram : `https://instagram.com/${creator.instagram.replace('@', '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                                                    >
                                                        {creator.instagram}
                                                    </a>
                                                ) : (
                                                    <span style={{ color: 'var(--color-text-tertiary)' }}>No link</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${creator.status === 'accepted' || creator.status === 'shortlisted' ? 'status-active' : creator.status === 'rejected' ? 'status-error' : 'status-planning'}`}>
                                                    {creator.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{(Math.floor(Math.random() * 50) + 10)}k views</div>
                                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>{(Math.random() * 5 + 2).toFixed(1)}% ER</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>₹{(Math.random() * 2 + 1).toFixed(2)} CPE</div>
                                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>₹{creator.amount || creator.final_amount || '0'} spent</div>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right', display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={async () => {
                                                        if (!id) return;
                                                        try {
                                                            await brandApi.updateCreatorStatuses(id, [{ creator_id: creator.id || creator.creator_id, status: 'accepted' }]);
                                                            showToast('Creator accepted successfully', 'success');
                                                            const creatorsData: any = await brandApi.getCampaignCreators(id);
                                                            setCreators(Array.isArray(creatorsData) ? creatorsData : (creatorsData?.creators || []));
                                                        } catch (err: any) {
                                                            showToast('Failed to update status', 'error');
                                                        }
                                                    }}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    style={{ color: 'var(--color-error)' }}
                                                    onClick={async () => {
                                                        if (!id) return;
                                                        try {
                                                            await brandApi.updateCreatorStatuses(id, [{ creator_id: creator.id || creator.creator_id, status: 'rejected' }]);
                                                            showToast('Creator rejected', 'info');
                                                            const creatorsData: any = await brandApi.getCampaignCreators(id);
                                                            setCreators(Array.isArray(creatorsData) ? creatorsData : (creatorsData?.creators || []));
                                                        } catch (err: any) {
                                                            showToast('Failed to update status', 'error');
                                                        }
                                                    }}
                                                >
                                                    Reject
                                                </Button>
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
                                        <tr key={bid.id || bid.creator_id}>
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
                                                <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                                    ₹{(bid.bid_amount || bid.amount || '0').toLocaleString()}
                                                </span>
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
                                                                    onClick={async () => {
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
                                                                    onClick={() => openCounterModal(bid)}
                                                                >
                                                                    Counter
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    style={{ color: 'var(--color-error)' }}
                                                                    onClick={async () => {
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
