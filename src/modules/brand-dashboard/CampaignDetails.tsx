import React, { Suspense } from 'react';
import { Button, LoadingSpinner, NotificationCenter } from '../../components';
import {
    Check,
    ArrowLeft,
    FileText,
    MessageSquare,
    Users,
    Settings
} from 'lucide-react';

import { BrandCampaignProvider } from './BrandCampaignContext';
import { BrandCampaignModals } from './components/BrandCampaignModals';

const CampaignBriefTab = React.lazy(() => import('./components/CampaignBriefTab').then(m => ({ default: m.CampaignBriefTab })));
const CampaignScriptsTab = React.lazy(() => import('./components/CampaignScriptsTab').then(m => ({ default: m.CampaignScriptsTab })));
const CampaignContentTab = React.lazy(() => import('./components/CampaignContentTab').then(m => ({ default: m.CampaignContentTab })));
const CampaignOverviewTab = React.lazy(() => import('./components/CampaignOverviewTab').then(m => ({ default: m.CampaignOverviewTab })));
const CampaignCreatorsTab = React.lazy(() => import('./components/CampaignCreatorsTab').then(m => ({ default: m.CampaignCreatorsTab })));
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
        canShowConfirmedCreatorsTab,
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
        confirmedCreators,
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
        handleOpenEditFollowerRanges,
        handleOpenCreatorProfile
    } = contextValue;

    if (isLoading) return <LoadingSpinner />;
    if (!campaign) return <div>Campaign not found</div>;

    return (
        <BrandCampaignProvider value={contextValue}>
            <div className="dashboard" style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
                <main className="dashboard-main" style={{ marginLeft: 0, width: '100%', padding: '0 var(--space-8)' }}>
                    <header className="dashboard-header" style={{
                        margin: '0 -var(--space-8) var(--space-6)',
                        padding: 'var(--space-4) var(--space-8)',
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/brand/dashboard?tab=campaigns')}
                                style={{ width: '36px', height: '36px', padding: 0, borderRadius: 'var(--radius-full)' }}
                            >
                                <ArrowLeft size={18} />
                            </Button>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: '2px' }}>
                                    <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: 0 }}>{campaignData.name}</h1>
                                    <span className={`status-badge ${campaignStatusTone}`} style={{ fontSize: '10px', padding: '2px 8px' }}>{campaignStatusLabel}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                    <span>{campaignData.brand_name || campaignData.brand || 'Your Brand'}</span>
                                    <span style={{ opacity: 0.3 }}>•</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>#{id?.slice(-8) || 'SC-2026'}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                            {/* Global Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                <NotificationCenter />
                                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} style={{ width: '36px', height: '36px', padding: 0 }}>
                                    <Users size={18} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} style={{ width: '36px', height: '36px', padding: 0 }}>
                                    <Settings size={18} />
                                </Button>
                            </div>

                            {/* Campaign Actions */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                paddingLeft: 'var(--space-4)',
                                borderLeft: '1px solid var(--color-border-subtle)'
                            }}>
                                {canShowBriefTab && (
                                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('brief')}>
                                        <FileText size={16} />
                                        {campaignData.brief_completed ? 'Update Brief' : 'Add Brief'}
                                    </Button>
                                )}

                                {campaignData.brief_document_url && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => window.open(campaignData.brief_document_url, '_blank')}
                                        style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                                    >
                                        <FileText size={16} />
                                        View Brief Doc
                                    </Button>
                                )}

                                {(campaignData.review_status === 'creators_are_final') ? (
                                    <Button variant="ghost" size="sm" onClick={() => navigate('/brand/dashboard')}>
                                        <Check size={16} />
                                        Done
                                    </Button>
                                ) : (
                                    <Button variant="primary" size="sm" onClick={handleBrandSubmitSelection} isLoading={isSubmittingSelection}>
                                        <Check size={16} />
                                        {campaignData.review_status === 'negotiation' ? 'Update Selection' : 'Submit Selection'}
                                    </Button>
                                )}

                                <Button variant="secondary" size="sm">
                                    <MessageSquare size={16} />
                                    Contact
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Tabs */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--space-1)',
                        marginBottom: 'var(--space-8)',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        paddingBottom: 'var(--space-1)',
                        position: 'relative'
                    }}>
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
                        {canShowConfirmedCreatorsTab && (
                            <Button
                                variant={activeTab === 'confirmed' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('confirmed')}
                            >
                                Confirmed
                            </Button>
                        )}
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
                    <Suspense fallback={<div style={{ padding: 'var(--space-20)', display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>}>
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
                                campaignData={campaignData}
                                handleOpenCreatorProfile={handleOpenCreatorProfile}
                            />
                        )}

                        {activeTab === 'confirmed' && (
                            <CampaignCreatorsTab
                                creatorFilterTab="accepted"
                                setCreatorFilterTab={() => { }} // Disable internal filtering
                                filteredCreators={confirmedCreators}
                                creators={confirmedCreators}
                                bids={[]}
                                handleFinalizeAmounts={() => { }}
                                isFinalizingAmounts={false}
                                handleBrandSubmitSelection={() => { }}
                                isSubmittingSelection={false}
                                canShowNegotiationInCreators={false}
                                id={id}
                                showToast={showToast}
                                setCreators={() => { }}
                                setBids={() => { }}
                                getBidCreatorId={() => undefined}
                                openCounterModal={() => { }}
                                campaignData={{ ...campaignData, review_status: 'creators_are_final' }}
                                hideFilters={true}
                                handleOpenCreatorProfile={handleOpenCreatorProfile}
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
                                setBriefDocumentFiles={contextValue.setBriefDocumentFiles}
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
                    </Suspense>
                </main>
            </div>
        </BrandCampaignProvider>
    );
};
