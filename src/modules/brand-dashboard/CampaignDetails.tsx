import { CampaignBriefTab } from './components/CampaignBriefTab';
import { CampaignScriptsTab } from './components/CampaignScriptsTab';
import { CampaignContentTab } from './components/CampaignContentTab';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, LoadingSpinner, Modal, Input, TextArea, FileUpload } from '../../components';
import {
    ArrowLeft,
    TrendingUp,
    IndianRupee,
    MessageSquare,
    FileText,
    Check,
    Edit,
    Sparkles,
    Clock,
    Activity,
    Zap,
    Target,
    Percent
} from 'lucide-react';


import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';



import { CampaignOverviewTab } from './components/CampaignOverviewTab';
import { CampaignCreatorsTab } from './components/CampaignCreatorsTab';
import { brandApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import './DashboardShared.css';
import './BrandDashboard.css';

export const CampaignDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
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
    const [activeTab, setActiveTab] = useState<'overview' | 'creators' | 'brief' | 'scripts' | 'content'>('overview');
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

    // Demo Growth Data for and visuals
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

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await brandApi.getCampaigns() as any;
                // Handle both array response and object {campaigns: []} response
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
                setCampaign(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

    // Fetch data based on active tab
    useEffect(() => {
        if (!id || !campaign) return;

        const fetchTabData = async () => {
            try {
                switch (activeTab) {
                    case 'creators':
                        const creatorsData: any = await brandApi.getCampaignCreators(id);
                        setCreators(Array.isArray(creatorsData) ? creatorsData : (creatorsData?.creators || []));
                        const bidsData: any = await brandApi.getCreatorBids(id);
                        setBids(Array.isArray(bidsData) ? bidsData : (bidsData?.bids || bidsData?.creators || []));
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

        fetchTabData();
    }, [activeTab, id, campaign]);

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
            // Refresh creators list
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
            // Ensure campaign review state is moved to final so brief upload is allowed.
            // Some backend flows require explicit "submit selection" after amount finalization.
            try {
                await brandApi.submitCreatorSelection(id);
            } catch (submitErr) {
                // Ignore secondary step errors here; we still refresh and surface state.
                console.warn('submitCreatorSelection after finalize failed:', submitErr);
            }

            // Refresh campaign state and bids so UI reflects finalization immediately.
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
            await brandApi.submitCreatorSelection(id);
            showToast('Creator selection submitted successfully!', 'success');
            // Refresh campaign to update UI
            const response = await brandApi.getCampaigns() as any;
            const campaigns = Array.isArray(response) ? response : (response?.campaigns || []);
            const found = campaigns.find((c: any) => c.id === id);
            if (found) {
                setCampaign(found);
                // Refresh scripts to show finalized creators
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
            // Refresh scripts
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
            // Refresh content
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
            // Refresh
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
            // Include existing brief data to preserve it
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
            // Refresh campaign
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
            console.log('Updating follower ranges:', updateData);
            const response = await brandApi.updateCampaign(updateData);
            console.log('Update response:', response);

            // Always refresh campaign data after successful update
            // The response should contain the updated campaign
            if (response) {
                // Check if response has id or _id matching our campaign
                const responseId = response.id || response._id;
                if (responseId === id) {
                    setCampaign(response);
                } else {
                    // Response might be in a different format, try to fetch fresh data
                    const data = await brandApi.getCampaigns() as any;
                    const campaigns = Array.isArray(data) ? data : (data?.campaigns || []);
                    const found = campaigns.find((c: any) => (c.id === id || c._id === id));
                    if (found) {
                        setCampaign(found);
                    }
                }
            } else {
                // Fallback: fetch campaigns list
                const data = await brandApi.getCampaigns() as any;
                const campaigns = Array.isArray(data) ? data : (data?.campaigns || []);
                const found = campaigns.find((c: any) => (c.id === id || c._id === id));
                if (found) {
                    setCampaign(found);
                }
            }

            showToast('Follower ranges updated successfully!', 'success');
            setIsEditFollowerRangesModalOpen(false);
        } catch (error: any) {
            console.error('Failed to update follower ranges:', error);
            let errorMessage = 'Failed to update follower ranges';
            if (error.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error.response) {
                errorMessage = error.response.message || errorMessage;
            }
            showToast(errorMessage, 'error');
        } finally {
            setIsUpdatingFollowerRanges(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (!campaign) return <div>Campaign not found</div>;

    const campaignData = campaign;
    const normalizedCampaignStatus = String(campaignData.status || '').toLowerCase();
    const campaignStatusLabelMap: Record<string, string> = {
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
            ? 'status-active'
            : normalizedCampaignStatus === 'content_review' || normalizedCampaignStatus === 'script_review'
                ? 'status-content-review'
                : normalizedCampaignStatus === 'creator_negotiation'
                    ? 'status-negotiate'
                    : 'status-planning';
    const canShowBriefTab =
        campaignData.review_status === 'creators_are_final' ||
        campaignData.status === 'brief_pending' ||
        campaignData.status === 'script_review' ||
        campaignData.status === 'content_review' ||
        campaignData.status === 'completed' ||
        campaignData.brief_completed === false;
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

    const getBidCreatorId = (bid: any) =>
        bid?.creator_id ||
        bid?.creatorId ||
        bid?.creator?.id ||
        bid?.creator?._id ||
        bid?.user_id ||
        bid?.id;

    // Debug: Log campaign data to see what's available
    console.log('Campaign data:', {
        id: campaignData.id,
        follower_ranges: campaignData.follower_ranges,
        min_followers: campaignData.min_followers,
        max_followers: campaignData.max_followers
    });



    // Build stats from real campaign data
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


    return (
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
                                                Script passes baseline checks. Review brand tone and final CTA before approval.
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
                                                TODO: replace static checks with live LLM review output.
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
                                                Video quality and brand mention look acceptable. Verify CTA placement before approval.
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
                                                TODO: replace static checks with live LLM/video analysis output.
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
                            {followerRangeOptions.map(opt => {
                                const isActive = selectedFollowerRanges.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setSelectedFollowerRanges(prev =>
                                            prev.includes(opt.value)
                                                ? prev.filter(v => v !== opt.value)
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
                        setCreatorFilterTab={setCreatorFilterTab}
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
                        setScriptFilterTab={setScriptFilterTab}
                        scriptReviewStats={scriptReviewStats}
                        getScriptStatusMeta={getScriptStatusMeta}
                        handleOpenAIReview={handleOpenAIReview}
                    />
                )}

                {activeTab === 'content' && (
                    <CampaignContentTab
                        filteredContent={filteredContent}
                        contentFilterTab={contentFilterTab}
                        setContentFilterTab={setContentFilterTab}
                        contentReviewStats={contentReviewStats}
                        getContentStatusMeta={getContentStatusMeta}
                        handleOpenAIContentReview={handleOpenAIContentReview}
                    />
                )}
            </main>
        </div>
    );
};
