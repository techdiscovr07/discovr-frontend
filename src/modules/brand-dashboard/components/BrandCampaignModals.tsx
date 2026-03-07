import React from 'react';
import { Button, Modal, Sidebar, Input, TextArea, FileUpload, Card, CardHeader, CardBody } from '../../../components';
import { Clock, Check, Sparkles, TrendingUp, MessageSquare, RefreshCw } from 'lucide-react';
import { useBrandCampaignContext } from '../BrandCampaignContext';

export const BrandCampaignModals: React.FC = () => {
    const {
        isUploadSheetModalOpen, setIsUploadSheetModalOpen,
        setCreatorsSheetFile,
        handleUploadCreatorsSheet, isUploadingSheet,
        isBriefModalOpen, setIsBriefModalOpen,
        briefData, setBriefData,
        handleBriefSubmit, setSampleVideoFiles, isSubmittingBrief,
        isScriptTemplateModalOpen, setIsScriptTemplateModalOpen,
        brandScriptTemplate, setBrandScriptTemplate,
        handleScriptTemplateSubmit, isSubmittingScriptTemplate,
        isAIReviewOpen, setIsAIReviewOpen,
        selectedScript, aiComment, setAiComment,
        handleSubmitAIReview, isSubmittingAIReview,
        isAIAnalyzing, analysisProgress,
        isAIContentReviewOpen, setIsAIContentReviewOpen,
        selectedContentItem, contentAiComment, setContentAiComment,
        handleSubmitAIContentReview, isSubmittingAIContentReview,
        isAIContentAnalyzing, contentAnalysisProgress,
        isCounterModalOpen, setIsCounterModalOpen,
        counterBid, setCounterBid, counterAmount, setCounterAmount,
        handleSubmitCounter, isSubmittingCounter,
        isEditFollowerRangesModalOpen, setIsEditFollowerRangesModalOpen,
        selectedFollowerRanges, setSelectedFollowerRanges,
        followerRangeOptions, handleUpdateFollowerRanges, isUpdatingFollowerRanges,
        isCreatorProfileSidebarOpen, setIsCreatorProfileSidebarOpen,
        selectedProfileCreator, isAnalyzingCreator, handleAnalyzeCreator,
        isReelModalOpen, setIsReelModalOpen, reelUrl
    } = useBrandCampaignContext();

    return (
        <>
            {/* Upload Creators Sheet Modal */}
            <Modal
                isOpen={isUploadSheetModalOpen}
                onClose={() => setIsUploadSheetModalOpen(false)}
                title="Upload Creators Sheet"
                subtitle="Upload an Excel file with creator information"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <FileUpload
                        accept=".xlsx,.xls"
                        maxSize={10}
                        onFileSelect={(files: File[]) => setCreatorsSheetFile(files)}
                        label="Creators Sheet (Excel)"
                        description="Upload Excel file with creator details"
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                        <Button variant="ghost" onClick={() => setIsUploadSheetModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUploadCreatorsSheet} isLoading={isUploadingSheet}>Upload</Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isBriefModalOpen}
                onClose={() => setIsBriefModalOpen(false)}
                title="Campaign Brief"
                subtitle="Provide instructions for creators"
                size="xl"
            >
                <form onSubmit={handleBriefSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <Input
                        label="Video Title"
                        placeholder="e.g., Unboxing Summer Collection"
                        value={briefData.video_title}
                        onChange={(e: any) => setBriefData({ ...briefData, video_title: e.target.value })}
                        required
                    />
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                        <Input
                            label="Primary Focus"
                            placeholder="Texture, Size, etc."
                            value={briefData.primary_focus}
                            onChange={(e: any) => setBriefData({ ...briefData, primary_focus: e.target.value })}
                            required
                        />
                        <Input
                            label="Secondary Focus"
                            placeholder="Packaging, Ease of use"
                            value={briefData.secondary_focus}
                            onChange={(e: any) => setBriefData({ ...briefData, secondary_focus: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                        <TextArea
                            label="Dos"
                            placeholder="Mention the specific features..."
                            value={briefData.dos}
                            onChange={(e: any) => setBriefData({ ...briefData, dos: e.target.value })}
                            required
                        />
                        <TextArea
                            label="Don'ts"
                            placeholder="Don't mention competitors..."
                            value={briefData.donts}
                            onChange={(e: any) => setBriefData({ ...briefData, donts: e.target.value })}
                            required
                        />
                    </div>
                    <Input
                        label="Call to Action"
                        placeholder="Click the link in bio"
                        value={briefData.cta}
                        onChange={(e: any) => setBriefData({ ...briefData, cta: e.target.value })}
                        required
                    />
                    <FileUpload
                        accept="video/*"
                        maxSize={50}
                        onFileSelect={(files: File[]) => setSampleVideoFiles(files)}
                        label="Sample Video (Optional)"
                        description="Upload a sample video to guide creators"
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                        <Button variant="ghost" onClick={() => setIsBriefModalOpen(false)}>Cancel</Button>
                        <Button type="submit" isLoading={isSubmittingBrief}>Submit Brief</Button>
                    </div>
                </form>
            </Modal>

            {/* Script Template Modal */}
            <Modal
                isOpen={isScriptTemplateModalOpen}
                onClose={() => setIsScriptTemplateModalOpen(false)}
                title="Script Template"
                subtitle="Create a script template for creators to see and finalize"
                size="xl"
            >
                <form onSubmit={handleScriptTemplateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <TextArea
                        label="Script Template"
                        placeholder="Enter the script content that creators will see and finalize..."
                        value={brandScriptTemplate}
                        onChange={(e: any) => setBrandScriptTemplate(e.target.value)}
                        required
                        rows={15}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                        <Button variant="ghost" onClick={() => setIsScriptTemplateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" isLoading={isSubmittingScriptTemplate}>Upload Script Template</Button>
                    </div>
                </form>
            </Modal>

            {/* AI Script Review Modal */}
            <Modal
                isOpen={isAIReviewOpen}
                onClose={() => !isSubmittingAIReview && setIsAIReviewOpen(false)}
                title="AI Script Review"
                subtitle="AI-assisted review with brand feedback"
                size="xl"
            >
                {selectedScript && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', maxHeight: '360px', overflow: 'auto' }}>
                                <p style={{ whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6 }}>
                                    {selectedScript.script_content || selectedScript.content || '-'}
                                </p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-3)' }}>
                                <div style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Creator</div>
                                    <div style={{ fontWeight: 'var(--font-semibold)' }}>{selectedScript.name || selectedScript.creator_name}</div>
                                </div>
                                <div style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Status</div>
                                    <div style={{ fontWeight: 'var(--font-semibold)' }}>{String(selectedScript.status || 'script_pending').replaceAll('_', ' ')}</div>
                                </div>
                                <div style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Updated</div>
                                    <div style={{ fontWeight: 'var(--font-semibold)' }}>
                                        {selectedScript.script_submitted_at ? new Date(selectedScript.script_submitted_at).toLocaleString() : '-'}
                                    </div>
                                </div>
                                <div style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Cost</div>
                                    <div style={{ fontWeight: 'var(--font-semibold)' }}>₹0</div>
                                </div>
                            </div>
                            <TextArea
                                label="Brand Comment"
                                placeholder="Add your comment for creator..."
                                rows={4}
                                value={aiComment}
                                onChange={(e: any) => setAiComment(e.target.value)}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSubmitAIReview('revision_requested')}
                                    isLoading={isSubmittingAIReview}
                                    disabled={isAIAnalyzing}
                                >
                                    Request Changes
                                </Button>
                                <Button
                                    onClick={() => handleSubmitAIReview('approved')}
                                    isLoading={isSubmittingAIReview}
                                    disabled={isAIAnalyzing}
                                >
                                    <Check size={16} />
                                    Approve Script
                                </Button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <Sparkles size={16} />
                                Automated checks
                            </h4>
                            {isAIAnalyzing ? (
                                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                        <Clock size={16} />
                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>AI is reviewing script...</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--color-bg-primary)', borderRadius: '999px', overflow: 'hidden' }}>
                                        <div style={{ width: `${analysisProgress}%`, height: '100%', background: 'var(--color-accent)', transition: 'width 120ms linear' }} />
                                    </div>
                                    <p style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
                                        Checking compliance, clarity, CTA, and brand safety...
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ padding: 'var(--space-3)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 'var(--radius-md)', background: 'rgba(168,85,247,0.08)' }}>
                                        <div style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)' }}>Agent Recommendation</div>
                                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                            {selectedScript.ai_analysis || "Script passes baseline checks. Review brand tone and final CTA before approval."}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
                                            Powered by Discovr AI
                                        </div>
                                    </div>
                                    {[
                                        'Brand safety checks',
                                        'On-screen CTA visuals',
                                        'Product description accuracy',
                                        'People-first language',
                                        'No negative phrasing',
                                        'No mention of competitors'
                                    ].map((item) => (
                                        <div key={item} style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 'var(--text-sm)' }}>{item}</span>
                                            <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-semibold)' }}>OK</span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* AI Content Review Modal */}
            <Modal
                isOpen={isAIContentReviewOpen}
                onClose={() => !isSubmittingAIContentReview && setIsAIContentReviewOpen(false)}
                title="AI Video Review"
                subtitle="AI-assisted content verification before approval"
                size="xl"
            >
                {selectedContentItem && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', minHeight: '220px' }}>
                                {(selectedContentItem.content_url || selectedContentItem.video_url) ? (
                                    <a
                                        href={selectedContentItem.content_url || selectedContentItem.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                                    >
                                        View uploaded video
                                    </a>
                                ) : (
                                    <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                                        No video URL available in this record.
                                    </p>
                                )}
                                {selectedContentItem.live_url && (
                                    <p style={{ marginTop: 'var(--space-3)', marginBottom: 0, fontSize: 'var(--text-sm)' }}>
                                        Live link: <a href={selectedContentItem.live_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>{selectedContentItem.live_url}</a>
                                    </p>
                                )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-3)' }}>
                                <div style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Creator</div>
                                    <div style={{ fontWeight: 'var(--font-semibold)' }}>{selectedContentItem.name || selectedContentItem.creator_name}</div>
                                </div>
                                <div style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Status</div>
                                    <div style={{ fontWeight: 'var(--font-semibold)' }}>{String(selectedContentItem.status || 'content_pending').replaceAll('_', ' ')}</div>
                                </div>
                                <div style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Updated</div>
                                    <div style={{ fontWeight: 'var(--font-semibold)' }}>
                                        {selectedContentItem.submitted_at || selectedContentItem.created_at || '-'}
                                    </div>
                                </div>
                            </div>
                            <TextArea
                                label="Brand Comment"
                                placeholder="Add feedback for creator..."
                                rows={4}
                                value={contentAiComment}
                                onChange={(e: any) => setContentAiComment(e.target.value)}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSubmitAIContentReview('revision_requested')}
                                    isLoading={isSubmittingAIContentReview}
                                    disabled={isAIContentAnalyzing}
                                >
                                    Request Changes
                                </Button>
                                <Button
                                    onClick={() => handleSubmitAIContentReview('approved')}
                                    isLoading={isSubmittingAIContentReview}
                                    disabled={isAIContentAnalyzing}
                                >
                                    <Check size={16} />
                                    Approve Video
                                </Button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <Sparkles size={16} />
                                Automated checks
                            </h4>
                            {isAIContentAnalyzing ? (
                                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                        <Clock size={16} />
                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>AI is reviewing video...</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--color-bg-primary)', borderRadius: '999px', overflow: 'hidden' }}>
                                        <div style={{ width: `${contentAnalysisProgress}%`, height: '100%', background: 'var(--color-accent)', transition: 'width 120ms linear' }} />
                                    </div>
                                    <p style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
                                        Checking clarity, safety, brand mention and CTA visibility...
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ padding: 'var(--space-3)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 'var(--radius-md)', background: 'rgba(168,85,247,0.08)' }}>
                                        <div style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)' }}>Agent Recommendation</div>
                                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                            {selectedContentItem.ai_analysis || "Video quality and brand mention look acceptable. Verify CTA placement before approval."}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
                                            Powered by Discovr AI
                                        </div>
                                    </div>
                                    {[
                                        'Brand safety checks',
                                        'On-screen CTA visuals',
                                        'Product placement quality',
                                        'Audio clarity',
                                        'No competitor mention'
                                    ].map((item) => (
                                        <div key={item} style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 'var(--text-sm)' }}>{item}</span>
                                            <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-semibold)' }}>OK</span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Counter Offer Modal */}
            <Modal
                isOpen={isCounterModalOpen}
                onClose={() => {
                    if (isSubmittingCounter) return;
                    setIsCounterModalOpen(false);
                    setCounterBid(null);
                    setCounterAmount('');
                }}
                title="Send Counter Offer"
                subtitle={counterBid ? `Creator: ${counterBid.name || counterBid.creator_name || 'Unknown'}` : 'Enter your offer amount'}
                size="sm"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label="Counter Amount (INR)"
                        type="number"
                        min="1"
                        value={counterAmount}
                        onChange={(e: any) => setCounterAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                if (isSubmittingCounter) return;
                                setIsCounterModalOpen(false);
                                setCounterBid(null);
                                setCounterAmount('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitCounter}
                            isLoading={isSubmittingCounter}
                            disabled={!counterAmount || Number(counterAmount) <= 0}
                        >
                            Send Counter
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Follower Ranges Modal */}
            <Modal
                isOpen={isEditFollowerRangesModalOpen}
                onClose={() => setIsEditFollowerRangesModalOpen(false)}
                title="Edit Follower Ranges"
                subtitle="Select one or more target creator tiers"
                size="md"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
                        {followerRangeOptions.map((opt: any) => {
                            const isActive = selectedFollowerRanges.includes(opt.value);
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setSelectedFollowerRanges((prev: any) =>
                                        prev.includes(opt.value)
                                            ? prev.filter((v: any) => v !== opt.value)
                                            : [...prev, opt.value]
                                    )}
                                    style={{
                                        padding: 'var(--space-3)',
                                        border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        background: isActive ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                                        color: isActive ? 'white' : 'var(--color-text-primary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 'var(--space-1)',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>{opt.label}</span>
                                    <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>{opt.desc}</span>
                                    {isActive && <Check size={16} style={{ marginTop: 'var(--space-1)' }} />}
                                </button>
                            );
                        })}
                    </div>
                    {selectedFollowerRanges.length === 0 && (
                        <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                            Please select at least one follower range
                        </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                        <Button variant="ghost" onClick={() => setIsEditFollowerRangesModalOpen(false)} disabled={isUpdatingFollowerRanges}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateFollowerRanges} isLoading={isUpdatingFollowerRanges} disabled={selectedFollowerRanges.length === 0}>
                            Update
                        </Button>
                    </div>
                </div>
            </Modal>
            {/* Creator Profile Sidebar */}
            <Sidebar
                isOpen={isCreatorProfileSidebarOpen}
                onClose={() => setIsCreatorProfileSidebarOpen(false)}
                title={selectedProfileCreator?.name || selectedProfileCreator?.creator_name || 'Creator Profile'}
                subtitle={(() => {
                    const url = selectedProfileCreator?.instagram || '';
                    if (!url) return selectedProfileCreator?.handle || selectedProfileCreator?.email;
                    try {
                        const parts = url.replace(/\/$/, '').split('/');
                        const lastPart = parts[parts.length - 1];
                        const handle = lastPart.split('?')[0];
                        return `@${handle.replace('@', '')}`;
                    } catch (e) {
                        return `@${url.split('@').pop()}`;
                    }
                })()}
                width="600px"
            >
                {selectedProfileCreator && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        {/* Quick Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
                            <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                <p style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' }}>Followers</p>
                                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#1a1a1a' }}>
                                    {selectedProfileCreator.followers ? (Number(selectedProfileCreator.followers) >= 1000000 ? (Number(selectedProfileCreator.followers) / 1000000).toFixed(1) + 'M' : (Number(selectedProfileCreator.followers) / 1000).toFixed(0) + 'K') : (selectedProfileCreator.follower_count || '0')}
                                </p>
                            </div>
                            <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                <p style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' }}>Avg Views</p>
                                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#1a1a1a' }}>{selectedProfileCreator.avg_views ? (Number(selectedProfileCreator.avg_views) >= 1000 ? (Number(selectedProfileCreator.avg_views) / 1000).toFixed(0) + 'K' : selectedProfileCreator.avg_views) : 'N/A'}</p>
                            </div>
                            <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                <p style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' }}>Engagement</p>
                                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#1a1a1a' }}>
                                    {selectedProfileCreator.engagement_rate
                                        ? `${Number(selectedProfileCreator.engagement_rate).toFixed(1)}%`
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Analysis Action */}
                        {!selectedProfileCreator.followers && (
                            <div style={{
                                padding: 'var(--space-4)',
                                background: 'rgba(59, 130, 246, 0.05)',
                                border: '1px dashed var(--color-accent)',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    <h5 style={{ margin: 0, fontSize: 'var(--text-sm)' }}>Missing real-time data?</h5>
                                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Analyze the profile link to fetch verified metrics.</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => handleAnalyzeCreator(selectedProfileCreator.instagram || selectedProfileCreator.handle)}
                                    isLoading={isAnalyzingCreator}
                                >
                                    <RefreshCw size={14} style={{ marginRight: '4px' }} />
                                    Analyze
                                </Button>
                            </div>
                        )}

                        {/* Deal Status */}
                        <Card style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardHeader style={{ padding: 'var(--space-4)', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <Sparkles size={18} style={{ color: 'var(--color-warning)' }} />
                                    <h4 style={{ margin: 0, color: '#1a1a1a' }}>Deal Information</h4>
                                </div>
                            </CardHeader>
                            <CardBody style={{ padding: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                    <span style={{ color: '#666' }}>Status:</span>
                                    <span className={`status-badge status-planning`} style={{ fontSize: '10px' }}>
                                        {String(selectedProfileCreator.status || 'pending').replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>Agreed Amount:</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>
                                        ₹{(selectedProfileCreator.final_amount || selectedProfileCreator.proposed_amount || 0).toLocaleString()}
                                    </span>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Workflow History */}
                        <div>
                            <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <Clock size={18} />
                                Campaign Timeline
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingLeft: 'var(--space-2)', borderLeft: '2px solid var(--color-border-subtle)' }}>
                                <div style={{ position: 'relative', paddingLeft: 'var(--space-4)' }}>
                                    <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }} />
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Campaign Started</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{selectedProfileCreator.created_at ? new Date(selectedProfileCreator.created_at).toLocaleDateString() : 'N/A'}</div>
                                </div>
                                {selectedProfileCreator.script_submitted_at && (
                                    <div style={{ position: 'relative', paddingLeft: 'var(--space-4)' }}>
                                        <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }} />
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Script Submitted</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(selectedProfileCreator.script_submitted_at).toLocaleDateString()}</div>
                                    </div>
                                )}
                                {selectedProfileCreator.content_submitted_at && (
                                    <div style={{ position: 'relative', paddingLeft: 'var(--space-4)' }}>
                                        <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }} />
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Video Uploaded</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(selectedProfileCreator.content_submitted_at).toLocaleDateString()}</div>
                                    </div>
                                )}
                                {!selectedProfileCreator.script_submitted_at && !selectedProfileCreator.content_submitted_at && (
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontStyle: 'italic', margin: 0 }}>
                                        Creator has not started work yet.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent Performance */}
                        <Card style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardBody style={{ padding: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <TrendingUp size={18} style={{ color: 'var(--color-accent)' }} />
                                        <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>Performance Prediction</span>
                                    </div>
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Waiting for post launch...</span>
                                </div>
                            </CardBody>
                        </Card>

                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                            <Button variant="primary" style={{ flex: 1 }}>
                                <MessageSquare size={16} />
                                Chat with Creator
                            </Button>
                            {selectedProfileCreator.instagram && (
                                <Button
                                    variant="secondary"
                                    onClick={() => window.open(selectedProfileCreator.instagram.startsWith('http') ? selectedProfileCreator.instagram : `https://instagram.com/${selectedProfileCreator.instagram.replace('@', '')}`, '_blank')}
                                >
                                    View Instagram
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Sidebar>
            <Modal
                isOpen={isReelModalOpen}
                onClose={() => setIsReelModalOpen(false)}
                title="Instagram Reel Preview"
                size="md"
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    minHeight: '400px'
                }}>
                    <div style={{
                        width: '100%',
                        aspectRatio: '9/16',
                        background: '#000',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <iframe
                            src={`${reelUrl.split('?')[0]}embed`}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            allowTransparency={true}
                            allow="encrypted-media"
                            title="Instagram Reel"
                        />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                            If the preview doesn't load, you can view it directly on Instagram.
                        </p>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.open(reelUrl, '_blank')}
                        >
                            Open on Instagram
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
