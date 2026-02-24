import React from 'react';

import { Button } from '../../components';
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
        setModalType
    } = contextValue;

    if (!campaignData) {
        return (
            <div className="dashboard" style={{ background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <div className="loading-spinner" style={{ marginBottom: 'var(--space-4)' }}></div>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Loading campaign details...</p>
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                        If this takes too long, the campaign may not be available or you may need to link it first.
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
                <main className="dashboard-main" style={{ marginLeft: 0, width: '100%', padding: 'var(--space-8)' }}>
                    {/* Header */}
                    <header className="dashboard-header" style={{ marginBottom: 'var(--space-8)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/creator/dashboard')}>
                                <ArrowLeft size={20} />
                            </Button>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <h1 className="dashboard-title">{campaignData.name}</h1>
                                    <span className={`status-badge status-active`}>{campaignData.status}</span>
                                </div>
                                <p className="dashboard-subtitle">
                                    {campaignData.brand} • Creator Campaign Details
                                </p>
                            </div>
                        </div>
                        <div className="tab-actions">
                            {!negotiationStatus && (
                                <Button variant="ghost" onClick={() => setModalType('link')}>
                                    <LinkIcon size={18} />
                                    Link Campaign
                                </Button>
                            )}
                            {negotiationStatus && !isBrandAcceptedCreatorOffer && brandOfferAmount > 0 &&
                                (negotiationStatusKey === 'accepted' || negotiationStatusKey === 'bid_pending' || negotiationStatusKey === 'amount_negotiated' || !negotiationStatusKey) && (
                                    <Button variant="secondary" onClick={() => setModalType('negotiate')}>
                                        {negotiationStatus.bid_amount && Number(negotiationStatus.bid_amount) > 0 ? 'Update Bid' : 'Negotiate'}
                                    </Button>
                                )}
                            {negotiationStatus && !isBrandAcceptedCreatorOffer && brandOfferAmount <= 0 &&
                                (negotiationStatusKey === 'accepted' || negotiationStatusKey === 'bid_pending' || negotiationStatusKey === 'amount_negotiated' || !negotiationStatusKey) && (
                                    <Button variant="ghost" onClick={() => setModalType('negotiate')}>
                                        {negotiationStatus.bid_amount && negotiationStatus.bid_amount > 0 ? 'Update Proposal' : 'Start Negotiation'}
                                    </Button>
                                )}
                            {!negotiationStatus && (campaignData?.stage === 'negotiate' || campaignData?.status === 'Negotiate' || campaignData?.status === 'In Negotiation') && (
                                <Button variant="ghost" onClick={() => setModalType('negotiate')}>
                                    Start Negotiation
                                </Button>
                            )}
                            <Button variant="ghost">
                                <MessageSquare size={18} />
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
