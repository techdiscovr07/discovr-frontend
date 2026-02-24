import React from 'react';

import { Button, LoadingSpinner } from '../../components';
import {
    ArrowLeft,
    MessageSquare,
    Link as LinkIcon,
} from 'lucide-react';
import { CreatorCampaignProvider } from './CreatorCampaignContext';
import { CreatorCampaignLeftColumn } from './components/CreatorCampaignLeftColumn';
import { CreatorCampaignRightColumn } from './components/CreatorCampaignRightColumn';
import { CreatorCampaignModals } from './components/CreatorCampaignModals';
import { useCreatorCampaignDetails } from './hooks/useCreatorCampaignDetails';
import '../../components/DashboardShared.css';
import './CreatorDashboard.css';

export const CreatorCampaignDetails: React.FC = () => {
    const contextValue = useCreatorCampaignDetails();
    const {
        id,
        navigate,
        campaignData,
        negotiationStatus,
        isBrandAcceptedCreatorOffer,
        brandOfferAmount,
        negotiationStatusKey,
        setModalType,
        isLoading,
        hasAnyBriefDetails
    } = contextValue;

    if (isLoading && !campaignData) {
        return <LoadingSpinner fullPage />;
    }

    if (!campaignData) {
        return (
            <div className="dashboard" style={{ background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <div className="status-badge status-error" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Unavailable</div>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Campaign Not Found</p>
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                        This campaign may not be available or you may need to link it first using a valid creator token.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/creator/dashboard')}
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Button>
                        {id && (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setModalType('link')}
                            >
                                <LinkIcon size={16} />
                                Link Campaign
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <CreatorCampaignProvider value={contextValue}>
            <div className="dashboard" style={{ background: 'var(--color-bg-primary)' }}>
                <main className="dashboard-main" style={{ marginLeft: 0, width: '100%', padding: 'var(--space-6)' }}>
                    {/* Compact Premium Header */}
                    <header className="campaign-details-header-premium">
                        <div className="header-left-group">
                            <Button
                                variant="ghost"
                                className="header-back-btn"
                                onClick={() => navigate('/creator/dashboard')}
                            >
                                <ArrowLeft size={18} />
                            </Button>

                            <div className="header-info-group">
                                <p className="header-breadcrumb-premium">
                                    {campaignData.brand} • Campaigns
                                </p>
                                <div className="header-title-row">
                                    <h1 className="header-title-premium">{campaignData.name}</h1>
                                    <span className={`badge-premium live`}>
                                        {campaignData.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="header-actions-group">
                            {!negotiationStatus && (
                                <Button variant="secondary" size="sm" onClick={() => setModalType('link')}>
                                    <LinkIcon size={14} />
                                    Link Campaign
                                </Button>
                            )}

                            {negotiationStatus && !isBrandAcceptedCreatorOffer && brandOfferAmount > 0 &&
                                (negotiationStatusKey === 'accepted' || negotiationStatusKey === 'bid_pending' || negotiationStatusKey === 'amount_negotiated' || !negotiationStatusKey) && (
                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <Button variant="primary" size="sm" onClick={() => setModalType('accept-deal')}>
                                            Accept Offer
                                        </Button>
                                        {!hasAnyBriefDetails && (
                                            <Button variant="secondary" size="sm" onClick={() => setModalType('negotiate')}>
                                                {negotiationStatus.bid_amount && Number(negotiationStatus.bid_amount) > 0 ? 'Update Bid' : 'Negotiate'}
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" onClick={() => setModalType('reject-deal')} style={{ color: 'var(--color-error)' }}>
                                            Decline
                                        </Button>
                                    </div>
                                )}

                            {negotiationStatus && !isBrandAcceptedCreatorOffer && brandOfferAmount <= 0 && !hasAnyBriefDetails &&
                                (negotiationStatusKey === 'accepted' || negotiationStatusKey === 'bid_pending' || negotiationStatusKey === 'amount_negotiated' || !negotiationStatusKey) && (
                                    <Button variant="secondary" size="sm" onClick={() => setModalType('negotiate')}>
                                        {negotiationStatus.bid_amount && negotiationStatus.bid_amount > 0 ? 'Update Proposal' : 'Start Negotiation'}
                                    </Button>
                                )}

                            <Button variant="ghost" size="sm">
                                <MessageSquare size={14} />
                                Contact Brand
                            </Button>
                        </div>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
                        <CreatorCampaignLeftColumn />
                        <CreatorCampaignRightColumn />
                    </div>

                    <CreatorCampaignModals />
                </main >
            </div >
        </CreatorCampaignProvider>
    );
};
