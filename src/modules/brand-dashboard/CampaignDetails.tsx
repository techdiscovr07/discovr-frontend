import React from 'react';
import { Button, LoadingSpinner } from '../../components';
import {
    ArrowLeft,
    Check,
    MessageSquare,
    FileText
} from 'lucide-react';

import { BrandCampaignProvider } from './BrandCampaignContext';
import { BrandCampaignModals } from './components/BrandCampaignModals';
import { CampaignBriefTab } from './components/CampaignBriefTab';
import { CampaignScriptsTab } from './components/CampaignScriptsTab';
import { CampaignContentTab } from './components/CampaignContentTab';
import { CampaignOverviewTab } from './components/CampaignOverviewTab';
import { CampaignCreatorsTab } from './components/CampaignCreatorsTab';
import { useCampaignDetails } from './hooks/useCampaignDetails';

import '../../components/DashboardShared.css';
import './BrandDashboard.css';

export const CampaignDetails: React.FC = () => {
    const contextValue = useCampaignDetails();

    const {
        navigate,
        id,
        campaign,
        isLoading,
        campaignData,
        campaignStatusTone,
        campaignStatusLabel,
        canShowBriefTab,
        activeTab,
        setActiveTab,
        handleBrandSubmitSelection,
        isSubmittingSelection,
        stats,
        advancedMetrics,
        growthData,
        creatorFilterTab,
        setCreatorFilterTab,
        filteredCreators,
        creators,
        bids,
        handleFinalizeAmounts,
        isFinalizingAmounts,
        canShowNegotiationInCreators,
        showToast,
        setCreators,
        setBids,
        getBidCreatorId,
        openCounterModal,
        isBriefEditing,
        setIsBriefEditing,
        briefData,
        setBriefData,
        handleBriefSubmit,
        setSampleVideoFiles,
        isSubmittingBrief,
        setIsScriptTemplateModalOpen,
        filteredScripts,
        scriptFilterTab,
        setScriptFilterTab,
        scriptReviewStats,
        getScriptStatusMeta,
        handleOpenAIReview,
        filteredContent,
        contentFilterTab,
        setContentFilterTab,
        contentReviewStats,
        getContentStatusMeta,
        handleOpenAIContentReview,
        handleOpenEditFollowerRanges
    } = contextValue;

    if (isLoading) return <LoadingSpinner />;
    if (!campaign) return <div>Campaign not found</div>;

    return (
        <BrandCampaignProvider value={contextValue}>
            <div className="dashboard" style={{ background: 'var(--color-bg-primary)' }}>
                <main className="dashboard-main" style={{ marginLeft: 0, width: '100%' }}>
                    <header className="dashboard-header" style={{ marginBottom: 'var(--space-8)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/brand/dashboard')}>
                                <ArrowLeft size={20} />
                            </Button>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <h1 className="dashboard-title">{campaignData.name}</h1>
                                    <span className={`status-badge ${campaignStatusTone}`}>{campaignStatusLabel}</span>
                                </div>
                                <p className="dashboard-subtitle">{campaignData.brand || 'Your Brand'} • Campaign ID: #{id || 'SC-2026'}</p>
                            </div>
                        </div>
                        <div className="tab-actions">
                            {canShowBriefTab && (
                                <Button variant="ghost" onClick={() => setActiveTab('brief')}>
                                    <FileText size={18} />
                                    {campaignData.brief_completed ? 'Update Brief' : 'Add Brief'}
                                </Button>
                            )}

                            {(campaignData.review_status === 'creators_are_final') ? (
                                <Button variant="ghost" onClick={() => navigate('/brand/dashboard')}>
                                    <Check size={18} />
                                    Selection Submitted
                                </Button>
                            ) : (
                                <Button onClick={handleBrandSubmitSelection} isLoading={isSubmittingSelection}>
                                    <Check size={18} />
                                    {campaignData.review_status === 'negotiation' ? 'Update Selection' : 'Submit Selection'}
                                </Button>
                            )}

                            <Button>
                                <MessageSquare size={18} />
                                Contact Creators
                            </Button>
                        </div>
                    </header>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <Button
                            variant={activeTab === 'overview' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </Button>
                        <Button
                            variant={activeTab === 'creators' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('creators')}
                        >
                            Creators
                        </Button>
                        {canShowBriefTab && (
                            <Button
                                variant={activeTab === 'brief' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('brief')}
                            >
                                Brief
                            </Button>
                        )}
                        <Button
                            variant={activeTab === 'scripts' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('scripts')}
                        >
                            Scripts
                        </Button>
                        <Button
                            variant={activeTab === 'content' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('content')}
                        >
                            Content
                        </Button>
                    </div>

                    <BrandCampaignModals />

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <CampaignOverviewTab
                            stats={stats}
                            advancedMetrics={advancedMetrics}
                            growthData={growthData}
                            campaignData={campaignData}
                            handleOpenEditFollowerRanges={handleOpenEditFollowerRanges}
                        />
                    )}

                    {activeTab === 'creators' && (
                        <CampaignCreatorsTab
                            creatorFilterTab={creatorFilterTab}
                            setCreatorFilterTab={(tab: string) => setCreatorFilterTab(tab as any)}
                            filteredCreators={filteredCreators}
                            creators={creators}
                            bids={bids}
                            handleFinalizeAmounts={handleFinalizeAmounts}
                            isFinalizingAmounts={isFinalizingAmounts}
                            handleBrandSubmitSelection={handleBrandSubmitSelection}
                            isSubmittingSelection={isSubmittingSelection}
                            canShowNegotiationInCreators={canShowNegotiationInCreators}
                            id={id}
                            showToast={showToast}
                            setCreators={setCreators}
                            setBids={setBids}
                            getBidCreatorId={getBidCreatorId}
                            openCounterModal={openCounterModal}
                        />
                    )}

                    {activeTab === 'brief' && (
                        <CampaignBriefTab
                            campaignData={campaignData}
                            isBriefEditing={isBriefEditing}
                            setIsBriefEditing={setIsBriefEditing}
                            briefData={briefData}
                            setBriefData={setBriefData}
                            handleBriefSubmit={handleBriefSubmit}
                            setSampleVideoFiles={setSampleVideoFiles}
                            isSubmittingBrief={isSubmittingBrief}
                        />
                    )}

                    {activeTab === 'scripts' && (
                        <CampaignScriptsTab
                            campaignData={campaignData}
                            setIsScriptTemplateModalOpen={setIsScriptTemplateModalOpen}
                            filteredScripts={filteredScripts}
                            scriptFilterTab={scriptFilterTab}
                            setScriptFilterTab={(tab: string) => setScriptFilterTab(tab as any)}
                            scriptReviewStats={scriptReviewStats}
                            getScriptStatusMeta={getScriptStatusMeta}
                            handleOpenAIReview={handleOpenAIReview}
                        />
                    )}

                    {activeTab === 'content' && (
                        <CampaignContentTab
                            filteredContent={filteredContent}
                            contentFilterTab={contentFilterTab}
                            setContentFilterTab={(tab: string) => setContentFilterTab(tab as any)}
                            contentReviewStats={contentReviewStats}
                            getContentStatusMeta={getContentStatusMeta}
                            handleOpenAIContentReview={handleOpenAIContentReview}
                        />
                    )}
                </main>
            </div>
        </BrandCampaignProvider>
    );
};
