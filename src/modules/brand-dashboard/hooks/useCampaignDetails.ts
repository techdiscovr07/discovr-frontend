import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { IndianRupee, Zap, Percent, TrendingUp } from 'lucide-react';
import { brandApi } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';

export const useCampaignDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = (searchParams.get('tab') as 'overview' | 'creators' | 'confirmed' | 'brief' | 'scripts' | 'content') || 'overview';
    const setActiveTab = (tab: string) => {
        setSearchParams({ tab });
    };

    const [campaign, setCampaign] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
    const [isSubmittingBrief, setIsSubmittingBrief] = useState(false);

    const [briefData, setBriefData] = useState({
        video_title: '',
        primary_focus: '',
        secondary_focus: '',
        dos: '',
        donts: '',
        cta: '',
        script_template: '',
        sample_video_url: ''
    });
    const [brandScriptTemplate, setBrandScriptTemplate] = useState<string>('');
    const [isScriptTemplateModalOpen, setIsScriptTemplateModalOpen] = useState(false);
    const [isSubmittingScriptTemplate, setIsSubmittingScriptTemplate] = useState(false);
    const [sampleVideoFiles, setSampleVideoFiles] = useState<File[]>([]);
    const [isBriefEditing, setIsBriefEditing] = useState(false);
    const [isUploadSheetModalOpen, setIsUploadSheetModalOpen] = useState(false);
    const [creatorsSheetFile, setCreatorsSheetFile] = useState<File[]>([]);
    const [isUploadingSheet, setIsUploadingSheet] = useState(false);
    const [creators, setCreators] = useState<any[]>([]);
    const [bids, setBids] = useState<any[]>([]);
    const [creatorFilterTab, setCreatorFilterTab] = useState<'all' | 'accepted' | 'rejected' | 'negotiation'>('all');
    const [scripts, setScripts] = useState<any[]>([]);
    const [content, setContent] = useState<any[]>([]);
    const [scriptFilterTab, setScriptFilterTab] = useState<'accepted' | 'pending' | 'revisionRequested' | 'rejected'>('pending');
    const [contentFilterTab, setContentFilterTab] = useState<'accepted' | 'pending' | 'revisionRequested' | 'rejected'>('pending');

    // Demo Growth Data for visuals
    const growthData = [
        { date: 'Day 1', reach: 5000, engagement: 250, views: 12000 },
        { date: 'Day 3', reach: 18000, engagement: 950, views: 42000 },
        { date: 'Day 5', reach: 45000, engagement: 2400, views: 98000 },
        { date: 'Day 7', reach: 125000, engagement: 6800, views: 245000 },
        { date: 'Day 10', reach: 285000, engagement: 15400, views: 580000 },
        { date: 'Day 14', reach: 450000, engagement: 24500, views: 890000 },
    ];

    const [isFinalizingAmounts, setIsFinalizingAmounts] = useState(false);
    const [isEditFollowerRangesModalOpen, setIsEditFollowerRangesModalOpen] = useState(false);
    const [isUpdatingFollowerRanges, setIsUpdatingFollowerRanges] = useState(false);
    const [selectedFollowerRanges, setSelectedFollowerRanges] = useState<string[]>([]);
    const [isAIReviewOpen, setIsAIReviewOpen] = useState(false);
    const [selectedScript, setSelectedScript] = useState<any>(null);
    const [aiComment, setAiComment] = useState('');
    const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [isSubmittingAIReview, setIsSubmittingAIReview] = useState(false);
    const [isAIContentReviewOpen, setIsAIContentReviewOpen] = useState(false);
    const [selectedContentItem, setSelectedContentItem] = useState<any>(null);
    const [contentAiComment, setContentAiComment] = useState('');
    const [isAIContentAnalyzing, setIsAIContentAnalyzing] = useState(false);
    const [contentAnalysisProgress, setContentAnalysisProgress] = useState(0);
    const [isSubmittingAIContentReview, setIsSubmittingAIContentReview] = useState(false);
    const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
    const [counterBid, setCounterBid] = useState<any | null>(null);
    const [counterAmount, setCounterAmount] = useState('');
    const [isSubmittingCounter, setIsSubmittingCounter] = useState(false);

    // Sidebar/Modal for Creator Profile
    const [isCreatorProfileSidebarOpen, setIsCreatorProfileSidebarOpen] = useState(false);
    const [selectedProfileCreator, setSelectedProfileCreator] = useState<any | null>(null);
    const [isAnalyzingCreator, setIsAnalyzingCreator] = useState(false);

    const handleOpenCreatorProfile = (creator: any) => {
        setSelectedProfileCreator(creator);
        setIsCreatorProfileSidebarOpen(true);
    };

    const handleAnalyzeCreator = async (profileUrl: string) => {
        if (!profileUrl) return;
        setIsAnalyzingCreator(true);
        try {
            const result = await brandApi.analyzeCreator(profileUrl);
            setSelectedProfileCreator((prev: any) => ({ ...prev, ...result }));
            showToast('Creator data updated from profile link', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to analyze profile', 'error');
        } finally {
            setIsAnalyzingCreator(false);
        }
    };

    const getScriptStatusMeta = (rawStatus: string) => {
        const status = String(rawStatus || '').toLowerCase();
        if (status === 'script_approved' || status === 'approved') return { label: 'Accepted', tone: 'status-active' };
        if (status === 'script_rejected' || status === 'rejected') return { label: 'Rejected', tone: 'status-error' };
        if (status === 'script_revision_requested' || status === 'revision_requested') return { label: 'Changes Requested', tone: 'status-content-review' };
        if (status === 'script_pending' || status === 'pending') return { label: 'Pending Review', tone: 'status-planning' };
        return { label: status ? status.replace(/_/g, ' ') : 'Pending Review', tone: 'status-planning' };
    };

    const getScriptStatusBucket = (rawStatus: string): 'accepted' | 'rejected' | 'revisionRequested' | 'pending' | 'other' => {
        const status = String(rawStatus || '').toLowerCase();
        if (status === 'script_approved' || status === 'approved') return 'accepted';
        if (status === 'script_rejected' || status === 'rejected') return 'rejected';
        if (status === 'script_revision_requested' || status === 'revision_requested') return 'revisionRequested';
        if (status === 'script_pending' || status === 'pending') return 'pending';
        return 'other';
    };

    const scriptReviewStats = scripts.reduce((acc: any, script: any) => {
        const bucket = getScriptStatusBucket(script?.status);
        if (bucket === 'accepted') acc.accepted += 1;
        else if (bucket === 'rejected') acc.rejected += 1;
        else if (bucket === 'revisionRequested') acc.revisionRequested += 1;
        else if (bucket === 'pending') acc.pending += 1;
        else acc.other += 1;
        return acc;
    }, { accepted: 0, rejected: 0, revisionRequested: 0, pending: 0, other: 0 });

    const filteredScripts = scripts.filter((script: any) => {
        const bucket = getScriptStatusBucket(script?.status);
        if (scriptFilterTab === 'accepted') return bucket === 'accepted';
        if (scriptFilterTab === 'rejected') return bucket === 'rejected';
        if (scriptFilterTab === 'revisionRequested') return bucket === 'revisionRequested';
        return bucket === 'pending';
    });

    const getContentStatusBucket = (rawStatus: string): 'accepted' | 'rejected' | 'revisionRequested' | 'pending' | 'other' => {
        const status = String(rawStatus || '').toLowerCase();
        if (status === 'content_approved' || status === 'approved') return 'accepted';
        if (status === 'content_rejected' || status === 'rejected') return 'rejected';
        if (status === 'content_revision_requested' || status === 'revision_requested') return 'revisionRequested';
        if (status === 'content_pending' || status === 'pending') return 'pending';
        return 'other';
    };

    const contentReviewStats = content.reduce((acc: any, item: any) => {
        const bucket = getContentStatusBucket(item?.status);
        if (bucket === 'accepted') acc.accepted += 1;
        else if (bucket === 'rejected') acc.rejected += 1;
        else if (bucket === 'revisionRequested') acc.revisionRequested += 1;
        else if (bucket === 'pending') acc.pending += 1;
        else acc.other += 1;
        return acc;
    }, { accepted: 0, rejected: 0, revisionRequested: 0, pending: 0, other: 0 });

    const filteredContent = content.filter((item: any) => {
        const bucket = getContentStatusBucket(item?.status);
        if (contentFilterTab === 'accepted') return bucket === 'accepted';
        if (contentFilterTab === 'rejected') return bucket === 'rejected';
        if (contentFilterTab === 'revisionRequested') return bucket === 'revisionRequested';
        return bucket === 'pending';
    });

    const getContentStatusMeta = (rawStatus: string) => {
        const status = String(rawStatus || '').toLowerCase();
        if (status === 'content_approved' || status === 'approved') return { label: 'Accepted', tone: 'status-active' };
        if (status === 'content_rejected' || status === 'rejected') return { label: 'Rejected', tone: 'status-error' };
        if (status === 'content_revision_requested' || status === 'revision_requested') return { label: 'Changes Requested', tone: 'status-content-review' };
        if (status === 'content_pending' || status === 'pending') return { label: 'Pending Review', tone: 'status-planning' };
        if (status === 'content_live') return { label: 'Live', tone: 'status-active' };
        return { label: status ? status.replace(/_/g, ' ') : 'Pending Review', tone: 'status-planning' };
    };

    const fetchCampaign = async (isSilent = false) => {
        try {
            if (!isSilent) setIsLoading(true);
            const response = await brandApi.getCampaigns() as any;
            const campaigns = Array.isArray(response) ? response : (response?.campaigns || []);
            const found = campaigns.find((c: any) => c.id === id);
            if (found) {
                setCampaign(found);
                setBrandScriptTemplate(found.script_template || '');
                setIsBriefEditing(!found.brief_completed);
                setBriefData({
                    video_title: found.video_title || '',
                    primary_focus: found.primary_focus || '',
                    secondary_focus: found.secondary_focus || '',
                    dos: found.dos || '',
                    donts: found.donts || '',
                    cta: found.cta || '',
                    script_template: found.script_template || '',
                    sample_video_url: found.sample_video_url || ''
                });
            } else {
                setCampaign(null);
            }
        } catch (error) {
            console.error('Failed to fetch campaign:', error);
            if (!isSilent) setCampaign(null);
        } finally {
            if (!isSilent) setIsLoading(false);
        }
    };

    const fetchTabData = async () => {
        if (!id) return;
        try {
            switch (activeTab) {
                case 'creators':
                    const [creatorsData, bidsData] = await Promise.all([
                        brandApi.getCampaignCreators(id),
                        brandApi.getCreatorBids(id)
                    ]);
                    setCreators(Array.isArray(creatorsData) ? creatorsData : ((creatorsData as any)?.creators || []));
                    setBids(Array.isArray(bidsData) ? bidsData : ((bidsData as any)?.bids || (bidsData as any)?.creators || []));
                    break;
                case 'scripts':
                    const scriptsData: any = await brandApi.getCreatorScripts(id);
                    setScripts(Array.isArray(scriptsData) ? scriptsData : (scriptsData?.scripts || scriptsData?.creators || []));
                    break;
                case 'content':
                    const contentData: any = await brandApi.getCreatorContent(id);
                    setContent(Array.isArray(contentData) ? contentData : (contentData?.content || contentData?.creators || []));
                    break;
            }
        } catch (error) {
            console.error(`Failed to fetch ${activeTab} data:`, error);
        }
    };

    useEffect(() => {
        fetchCampaign();
    }, [id]);

    useEffect(() => {
        if (!id || !campaign) return;
        fetchTabData();

        // Background polling for real-time updates every 10 seconds
        const intervalId = setInterval(() => {
            fetchCampaign(true);
            fetchTabData();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [activeTab, id, campaign?.id]);

    const handleUploadCreatorsSheet = async () => {
        if (!id || creatorsSheetFile.length === 0) {
            showToast('Please select a file to upload', 'error');
            return;
        }

        setIsUploadingSheet(true);
        try {
            await brandApi.uploadCreatorsSheet(id, creatorsSheetFile[0]);
            showToast('Creators sheet uploaded successfully!', 'success');
            setIsUploadSheetModalOpen(false);
            setCreatorsSheetFile([]);
            const creatorsData: any = await brandApi.getCampaignCreators(id);
            setCreators(Array.isArray(creatorsData) ? creatorsData : (creatorsData?.creators || []));
        } catch (error: any) {
            console.error('Failed to upload creators sheet:', error);
            showToast(error.message || 'Failed to upload creators sheet', 'error');
        } finally {
            setIsUploadingSheet(false);
        }
    };

    const handleFinalizeAmounts = async () => {
        if (!id) return;
        setIsFinalizingAmounts(true);
        try {
            await brandApi.finalizeCreatorAmounts(id, []);
            try {
                await brandApi.submitCreatorSelection(id);
            } catch (submitErr) {
                console.warn('submitCreatorSelection after finalize failed:', submitErr);
            }

            const response = await brandApi.getCampaigns() as any;
            const campaigns = Array.isArray(response) ? response : (response?.campaigns || []);
            const found = campaigns.find((c: any) => c.id === id);
            if (found) {
                setCampaign(found);
                if (
                    found.review_status === 'creators_are_final' ||
                    found.status === 'brief_pending' ||
                    found.status === 'script_review' ||
                    found.status === 'content_review' ||
                    found.status === 'completed' ||
                    found.brief_completed === false
                ) {
                    setActiveTab('brief');
                }
            }

            const bidsData: any = await brandApi.getCreatorBids(id);
            setBids(Array.isArray(bidsData) ? bidsData : (bidsData?.bids || bidsData?.creators || []));

            showToast('Deals finalized. You can now upload the campaign brief.', 'success');
        } catch (error: any) {
            console.error('Failed to finalize amounts:', error);
            showToast(error.message || 'Failed to finalize amounts', 'error');
        } finally {
            setIsFinalizingAmounts(false);
        }
    };

    const [isSubmittingSelection, setIsSubmittingSelection] = useState(false);
    const handleBrandSubmitSelection = async () => {
        if (!id) return;
        setIsSubmittingSelection(true);
        try {
            // First, sync any local status changes to the backend
            const statusUpdates = creators
                .filter(c => c.status && c.status !== 'pending')
                .map(c => ({
                    creator_id: c.creator_id || c.id || c._id,
                    status: c.status
                }));

            if (statusUpdates.length > 0) {
                try {
                    await brandApi.updateCreatorStatuses(id, statusUpdates);
                } catch (updateErr) {
                    console.warn('Failed to sync some creator statuses, continuing with submission...', updateErr);
                }
            }

            await brandApi.submitCreatorSelection(id);
            showToast('Creator selection submitted successfully!', 'success');

            const response = await brandApi.getCampaigns() as any;
            const campaigns = Array.isArray(response) ? response : (response?.campaigns || []);
            const found = campaigns.find((c: any) => c.id === id);
            if (found) {
                setCampaign(found);
                // Also refresh creators and scripts to be safe
                const creatorsData: any = await brandApi.getCampaignCreators(id);
                setCreators(Array.isArray(creatorsData) ? creatorsData : (creatorsData?.creators || []));

                if (activeTab === 'scripts' || found.review_status === 'creators_are_final') {
                    const scriptsData: any = await brandApi.getCreatorScripts(id);
                    setScripts(Array.isArray(scriptsData) ? scriptsData : (scriptsData?.scripts || scriptsData?.creators || []));
                }
            }
        } catch (error: any) {
            console.error('Failed to submit selection:', error);
            showToast(error.message || 'Failed to submit selection', 'error');
        } finally {
            setIsSubmittingSelection(false);
        }
    };

    const handleReviewScript = async (creatorId: string, status: 'approved' | 'rejected' | 'revision_requested', feedback?: string) => {
        if (!id) return;
        try {
            const reviewResponse: any = await brandApi.reviewCreatorScript(id, creatorId, status, feedback);
            const updatedCount =
                Number(reviewResponse?.approved_count || 0) +
                Number(reviewResponse?.rejected_count || 0) +
                Number(reviewResponse?.revision_requested_count || 0);
            if (updatedCount > 0) {
                showToast(`Script reviewed. Updated: ${updatedCount}`, 'success');
            } else {
                showToast('No pending script was updated. It may already be reviewed.', 'info');
            }
            const scriptsData: any = await brandApi.getCreatorScripts(id);
            setScripts(Array.isArray(scriptsData) ? scriptsData : (scriptsData?.scripts || scriptsData?.creators || []));
        } catch (error: any) {
            console.error('Failed to review script:', error);
            showToast(error.message || 'Failed to review script', 'error');
        }
    };

    const handleOpenAIReview = (script: any) => {
        setSelectedScript(script);
        setAiComment(script?.script_feedback || '');
        setIsAIReviewOpen(true);
        setIsAIAnalyzing(true);
        setAnalysisProgress(0);
    };

    const handleSubmitAIReview = async (action: 'approved' | 'revision_requested') => {
        if (!selectedScript || !id) return;
        setIsSubmittingAIReview(true);
        try {
            await handleReviewScript(
                selectedScript.creator_id || selectedScript.id,
                action,
                aiComment.trim() || undefined
            );
            setIsAIReviewOpen(false);
            setSelectedScript(null);
            const scriptsData: any = await brandApi.getCreatorScripts(id);
            setScripts(Array.isArray(scriptsData) ? scriptsData : (scriptsData?.scripts || scriptsData?.creators || []));
        } finally {
            setIsSubmittingAIReview(false);
        }
    };

    useEffect(() => {
        if (!isAIReviewOpen || !isAIAnalyzing) return;
        const start = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - start;
            const pct = Math.min(100, Math.round((elapsed / 2000) * 100));
            setAnalysisProgress(pct);
            if (pct >= 100) {
                setIsAIAnalyzing(false);
                clearInterval(timer);
            }
        }, 120);
        return () => clearInterval(timer);
    }, [isAIReviewOpen, isAIAnalyzing]);

    useEffect(() => {
        if (!isAIContentReviewOpen || !isAIContentAnalyzing) return;
        const start = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - start;
            const pct = Math.min(100, Math.round((elapsed / 2000) * 100));
            setContentAnalysisProgress(pct);
            if (pct >= 100) {
                setIsAIContentAnalyzing(false);
                clearInterval(timer);
            }
        }, 120);
        return () => clearInterval(timer);
    }, [isAIContentReviewOpen, isAIContentAnalyzing]);

    const handleReviewContent = async (creatorId: string, status: 'approved' | 'rejected' | 'revision_requested', feedback?: string) => {
        if (!id) return;
        try {
            const reviewResponse: any = await brandApi.reviewCreatorContent(id, [{
                creator_id: creatorId,
                status,
                feedback
            }]);
            const updatedCount =
                Number(reviewResponse?.approved_count || 0) +
                Number(reviewResponse?.rejected_count || 0) +
                Number(reviewResponse?.revision_requested_count || 0);
            if (updatedCount > 0) {
                showToast(`Content reviewed. Updated: ${updatedCount}`, 'success');
            } else {
                showToast('No pending content was updated. It may already be reviewed.', 'info');
            }
            const contentData: any = await brandApi.getCreatorContent(id);
            setContent(Array.isArray(contentData) ? contentData : (contentData?.content || contentData?.creators || []));
        } catch (error: any) {
            console.error('Failed to review content:', error);
            showToast(error.message || 'Failed to review content', 'error');
        }
    };

    const handleOpenAIContentReview = (item: any) => {
        setSelectedContentItem(item);
        setContentAiComment(item?.content_feedback || '');
        setIsAIContentReviewOpen(true);
        setIsAIContentAnalyzing(true);
        setContentAnalysisProgress(0);
    };

    const getBidCreatorId = (bid: any) =>
        bid?.creator_id ||
        bid?.creatorId ||
        bid?.creator?.id ||
        bid?.creator?._id ||
        bid?.user_id ||
        bid?.id;

    const openCounterModal = (bid: any) => {
        const existingOffer =
            Number(bid?.proposed_amount) > 0
                ? String(bid.proposed_amount)
                : (Number(bid?.final_amount) > 0 ? String(bid.final_amount) : '');
        setCounterBid(bid);
        setCounterAmount(existingOffer);
        setIsCounterModalOpen(true);
    };

    const handleSubmitCounter = async () => {
        if (!id || !counterBid) return;
        const creatorId = getBidCreatorId(counterBid);
        if (!creatorId) {
            showToast('Creator ID not found for this bid', 'error');
            return;
        }
        const amount = Number(counterAmount);
        if (!Number.isFinite(amount) || amount <= 0) {
            showToast('Enter a valid counter amount', 'error');
            return;
        }

        setIsSubmittingCounter(true);
        try {
            await brandApi.respondToCreatorBid(id, creatorId, 'accept', amount);
            showToast('Counter offer sent', 'success');
            setIsCounterModalOpen(false);
            setCounterBid(null);
            setCounterAmount('');

            const bidsData: any = await brandApi.getCreatorBids(id);
            setBids(Array.isArray(bidsData) ? bidsData : (bidsData?.bids || bidsData?.creators || []));
        } catch (error: any) {
            showToast(error.message || 'Failed to send counter offer', 'error');
        } finally {
            setIsSubmittingCounter(false);
        }
    };

    const handleSubmitAIContentReview = async (action: 'approved' | 'revision_requested') => {
        if (!selectedContentItem || !id) return;
        setIsSubmittingAIContentReview(true);
        try {
            await handleReviewContent(
                selectedContentItem.creator_id || selectedContentItem.id,
                action,
                contentAiComment.trim() || undefined
            );
            setIsAIContentReviewOpen(false);
            setSelectedContentItem(null);
            const contentData: any = await brandApi.getCreatorContent(id);
            setContent(Array.isArray(contentData) ? contentData : (contentData?.content || contentData?.creators || []));
        } finally {
            setIsSubmittingAIContentReview(false);
        }
    };

    const handleBriefSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingBrief(true);
        try {
            const formData = new FormData();
            formData.append('campaign_id', id || '');
            formData.append('video_title', briefData.video_title);
            formData.append('primary_focus', briefData.primary_focus);
            formData.append('secondary_focus', briefData.secondary_focus);
            formData.append('dos', briefData.dos);
            formData.append('donts', briefData.donts);
            formData.append('cta', briefData.cta);
            if (briefData.sample_video_url) {
                formData.append('sample_video_url', briefData.sample_video_url);
            }
            if (briefData.script_template) {
                formData.append('script_template', briefData.script_template);
            }
            if (sampleVideoFiles.length > 0) {
                formData.append('sample_video', sampleVideoFiles[0]);
            }

            await brandApi.uploadBrief(formData);
            showToast('Campaign brief uploaded successfully!', 'success');
            setIsBriefModalOpen(false);
            const response = await brandApi.getCampaigns() as any;
            const campaigns = Array.isArray(response) ? response : (response?.campaigns || []);
            const updatedCampaign = campaigns.find((c: any) => c.id === id);
            if (updatedCampaign) {
                setCampaign(updatedCampaign);
                setBrandScriptTemplate(updatedCampaign.script_template || '');
                setIsBriefEditing(false);
                setBriefData({
                    video_title: updatedCampaign.video_title || '',
                    primary_focus: updatedCampaign.primary_focus || '',
                    secondary_focus: updatedCampaign.secondary_focus || '',
                    dos: updatedCampaign.dos || '',
                    donts: updatedCampaign.donts || '',
                    cta: updatedCampaign.cta || '',
                    script_template: updatedCampaign.script_template || '',
                    sample_video_url: updatedCampaign.sample_video_url || ''
                });
            }
        } catch (error: any) {
            console.error('Failed to upload brief:', error);
            showToast(error.message || 'Failed to upload brief', 'error');
        } finally {
            setIsSubmittingBrief(false);
        }
    };

    const handleScriptTemplateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingScriptTemplate(true);
        try {
            const formData = new FormData();
            formData.append('campaign_id', id || '');
            formData.append('script_template', brandScriptTemplate);
            if (campaign) {
                formData.append('video_title', campaign.video_title || '');
                formData.append('primary_focus', campaign.primary_focus || '');
                formData.append('secondary_focus', campaign.secondary_focus || '');
                formData.append('dos', campaign.dos || '');
                formData.append('donts', campaign.donts || '');
                formData.append('cta', campaign.cta || '');
            }

            await brandApi.uploadBrief(formData);
            showToast('Script template uploaded successfully!', 'success');
            setIsScriptTemplateModalOpen(false);
            const data = await brandApi.getCampaigns() as any[];
            const updatedCampaign = data.find(c => c.id === id);
            if (updatedCampaign) {
                setCampaign(updatedCampaign);
                setBrandScriptTemplate(updatedCampaign.script_template || '');
            }
        } catch (error: any) {
            console.error('Failed to upload script template:', error);
            showToast(error.message || 'Failed to upload script template', 'error');
        } finally {
            setIsSubmittingScriptTemplate(false);
        }
    };

    const followerRangeOptions = [
        { label: '1K – 10K', value: '1000-10000', desc: 'Nano' },
        { label: '10K – 50K', value: '10000-50000', desc: 'Micro' },
        { label: '50K – 100K', value: '50000-100000', desc: 'Mid-tier' },
        { label: '100K – 500K', value: '100000-500000', desc: 'Macro' },
        { label: '500K – 1M', value: '500000-1000000', desc: 'Mega' },
        { label: '1M+', value: '1000000-10000000', desc: 'Celebrity' }
    ];

    const handleOpenEditFollowerRanges = () => {
        if (campaign) {
            setSelectedFollowerRanges(campaign.follower_ranges || []);
            setIsEditFollowerRangesModalOpen(true);
        }
    };

    const handleUpdateFollowerRanges = async () => {
        if (!id || selectedFollowerRanges.length === 0) {
            showToast('Please select at least one follower range', 'error');
            return;
        }

        setIsUpdatingFollowerRanges(true);
        try {
            const updateData = {
                campaign_id: id,
                follower_ranges: selectedFollowerRanges
            };
            const response = await brandApi.updateCampaign(updateData);

            if (response) {
                const responseId = response.id || response._id;
                if (responseId === id) {
                    setCampaign(response);
                } else {
                    const data = await brandApi.getCampaigns() as any;
                    const campaigns = Array.isArray(data) ? data : (data?.campaigns || []);
                    const found = campaigns.find((c: any) => (c.id === id || c._id === id));
                    if (found) setCampaign(found);
                }
            } else {
                const data = await brandApi.getCampaigns() as any;
                const campaigns = Array.isArray(data) ? data : (data?.campaigns || []);
                const found = campaigns.find((c: any) => (c.id === id || c._id === id));
                if (found) setCampaign(found);
            }

            showToast('Follower ranges updated successfully!', 'success');
            setIsEditFollowerRangesModalOpen(false);
        } catch (error: any) {
            console.error('Failed to update follower ranges:', error);
            showToast(error.message || 'Failed to update follower ranges', 'error');
        } finally {
            setIsUpdatingFollowerRanges(false);
        }
    };

    const campaignData = campaign || {};
    const normalizedCampaignStatus = String(campaignData.status || '').toLowerCase();
    const campaignStatusLabelMap: Record<string, string> = {
        pending: 'Pending for Approval',
        awaiting_creators: 'Awaiting Creators',
        creator_review: 'Creator Review',
        creator_negotiation: 'Creator Negotiation',
        brief_pending: 'Brief Pending',
        script_review: 'Script Review',
        content_review: 'Content Review',
        completed: 'Completed'
    };
    const campaignStatusLabel = campaignStatusLabelMap[normalizedCampaignStatus] || campaignData.status || 'N/A';
    const campaignStatusTone =
        normalizedCampaignStatus === 'completed'
            ? 'status-completed'
            : normalizedCampaignStatus === 'pending'
                ? 'status-pending'
                : normalizedCampaignStatus === 'awaiting_creators'
                    ? 'status-awaiting'
                    : normalizedCampaignStatus === 'creator_review'
                        ? 'status-review'
                        : normalizedCampaignStatus === 'creator_negotiation'
                            ? 'status-negotiation'
                            : normalizedCampaignStatus === 'brief_pending'
                                ? 'status-brief'
                                : normalizedCampaignStatus === 'script_review'
                                    ? 'status-script'
                                    : normalizedCampaignStatus === 'content_review'
                                        ? 'status-content'
                                        : 'status-planning';

    const canShowBriefTab =
        campaignData.review_status === 'creators_are_final' ||
        campaignData.status === 'brief_pending' ||
        campaignData.status === 'script_review' ||
        campaignData.status === 'content_review' ||
        campaignData.status === 'completed' ||
        campaignData.brief_completed === false;

    const canShowConfirmedCreatorsTab =
        campaignData.review_status === 'creators_are_final' ||
        ['brief_pending', 'script_review', 'content_review', 'completed'].includes(normalizedCampaignStatus);

    const canShowNegotiationInCreators =
        campaignData.review_status === 'negotiation' ||
        campaignData.review_status === 'creators_are_final' ||
        campaignData.status === 'creator_negotiation' ||
        campaignData.status === 'brief_pending' ||
        campaignData.status === 'script_review' ||
        campaignData.status === 'content_review' ||
        campaignData.status === 'completed' ||
        bids.length > 0;

    const filteredCreators = (() => {
        const list = Array.isArray(creators) ? creators : [];
        if (creatorFilterTab === 'all' || creatorFilterTab === 'negotiation') return list;
        return list.filter((creator: any) => {
            const status = String(creator?.status || '').toLowerCase();
            if (creatorFilterTab === 'accepted') {
                return status === 'accepted' || status === 'shortlisted';
            }
            return status === 'rejected';
        });
    })();

    const confirmedCreators = (Array.isArray(creators) ? creators : []).filter((creator: any) => {
        const status = String(creator?.status || '').toLowerCase();
        // A creator is only "confirmed" if they have an agreed deal (amount_finalized or active)
        // or have already started the project workflow (scripts/content).
        return (
            status === 'amount_finalized' ||
            status === 'active' ||
            status.includes('script') ||
            status.includes('content') ||
            status === 'completed'
        );
    });

    const stats = [
        { label: 'Total Budget', value: `₹${(campaignData.total_budget || 0).toLocaleString()}`, icon: IndianRupee, trend: '62% used', trendType: 'neutral' },
        { label: 'Calculated CRM', value: '₹145', icon: Zap, trend: '-12% vs avg', trendType: 'positive' },
        { label: 'Engagement Rate', value: '5.2%', icon: Percent, trend: '+0.8% peak', trendType: 'positive' },
        { label: 'Total Reach', value: '450K+', icon: TrendingUp, trend: 'Viral', trendType: 'positive' }
    ];

    const advancedMetrics = [
        { label: 'CPM (Cost per 1k)', value: '₹22.50', sub: 'Target: ₹25.00' },
        { label: 'CPE (Cost per Eng)', value: '₹1.80', sub: 'Target: ₹2.10' },
        { label: 'Avg. Watch Time', value: '42s', sub: '75% completion' },
        { label: 'Sentiment Score', value: '88/100', sub: 'Mostly Positive' },
    ];

    const contextValue = {
        id,
        navigate,
        campaign,
        isLoading,
        campaignData,
        campaignStatusTone,
        campaignStatusLabel,
        canShowBriefTab,
        canShowConfirmedCreatorsTab,
        activeTab,
        setActiveTab,
        isUploadSheetModalOpen, setIsUploadSheetModalOpen,
        creatorsSheetFile, setCreatorsSheetFile,
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
        handleBrandSubmitSelection, isSubmittingSelection,
        stats, advancedMetrics, growthData,
        creatorFilterTab, setCreatorFilterTab, filteredCreators, confirmedCreators,
        creators, bids, handleFinalizeAmounts, isFinalizingAmounts,
        canShowNegotiationInCreators, showToast, setCreators, setBids,
        getBidCreatorId, openCounterModal, isBriefEditing, setIsBriefEditing,
        filteredScripts, scriptFilterTab, setScriptFilterTab, scriptReviewStats,
        getScriptStatusMeta, handleOpenAIReview, filteredContent,
        contentFilterTab, setContentFilterTab, contentReviewStats,
        getContentStatusMeta, handleOpenAIContentReview,
        handleOpenEditFollowerRanges,
        isCreatorProfileSidebarOpen, setIsCreatorProfileSidebarOpen,
        selectedProfileCreator, setSelectedProfileCreator,
        handleOpenCreatorProfile,
        isAnalyzingCreator, handleAnalyzeCreator
    };

    return contextValue;
};
