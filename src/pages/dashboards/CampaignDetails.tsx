import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, LoadingSpinner, Modal, Input, TextArea, FileUpload } from '../../components';
import {
    ArrowLeft,
    Users,
    TrendingUp,
    IndianRupee,
    Eye,
    MessageSquare,
    FileText,
    Check,
    Edit,
    Sparkles,
    Clock
} from 'lucide-react';

import { brandApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import './AdminDashboard.css';
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
    const [activeTab, setActiveTab] = useState<'overview' | 'creators' | 'bids' | 'brief' | 'scripts' | 'content'>('overview');
    const [isUploadSheetModalOpen, setIsUploadSheetModalOpen] = useState(false);
    const [creatorsSheetFile, setCreatorsSheetFile] = useState<File[]>([]);
    const [isUploadingSheet, setIsUploadingSheet] = useState(false);
    const [creators, setCreators] = useState<any[]>([]);
    const [bids, setBids] = useState<any[]>([]);
    const [scripts, setScripts] = useState<any[]>([]);
    const [content, setContent] = useState<any[]>([]);
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

    const getScriptStatusMeta = (rawStatus: string) => {
        const status = String(rawStatus || '').toLowerCase();
        if (status === 'script_approved' || status === 'approved') return { label: 'Accepted', tone: 'status-active' };
        if (status === 'script_rejected' || status === 'rejected') return { label: 'Rejected', tone: 'status-error' };
        if (status === 'script_revision_requested' || status === 'revision_requested') return { label: 'Changes Requested', tone: 'status-content-review' };
        if (status === 'script_pending' || status === 'pending') return { label: 'Pending Review', tone: 'status-planning' };
        return { label: status ? status.replace(/_/g, ' ') : 'Pending Review', tone: 'status-planning' };
    };

    const scriptReviewStats = scripts.reduce((acc: any, script: any) => {
        const status = String(script?.status || '').toLowerCase();
        if (status === 'script_approved' || status === 'approved') acc.accepted += 1;
        else if (status === 'script_rejected' || status === 'rejected') acc.rejected += 1;
        else if (status === 'script_revision_requested' || status === 'revision_requested') acc.revisionRequested += 1;
        else if (status === 'script_pending' || status === 'pending') acc.pending += 1;
        else acc.other += 1;
        return acc;
    }, { accepted: 0, rejected: 0, revisionRequested: 0, pending: 0, other: 0 });

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
                        break;
                    case 'bids':
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
                    found.status === 'awaiting_brief' ||
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
                if (activeTab === 'creators') {
                    setActiveTab('bids');
                }
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
    const canShowBriefTab =
        campaignData.review_status === 'creators_are_final' ||
        campaignData.status === 'awaiting_brief' ||
        campaignData.brief_completed === false;
    const canShowNegotiationTab =
        campaignData.review_status === 'negotiation' ||
        campaignData.review_status === 'creators_are_final' ||
        campaignData.status === 'awaiting_brief' ||
        bids.length > 0 ||
        activeTab === 'bids';

    // Debug: Log campaign data to see what's available
    console.log('Campaign data:', {
        id: campaignData.id,
        follower_ranges: campaignData.follower_ranges,
        min_followers: campaignData.min_followers,
        max_followers: campaignData.max_followers
    });



    // Build stats from real campaign data
    const stats = [
        { label: 'Total Budget', value: `₹${(campaignData.total_budget || 0).toLocaleString()}`, icon: IndianRupee },
        { label: 'Creator Count', value: String(campaignData.creator_count || 0), icon: Users },
        { label: 'CPV', value: `₹${campaignData.cpv || 0}`, icon: TrendingUp },
        { label: 'Status', value: campaignData.status || 'N/A', icon: Eye }
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
                                <span className={`status-badge ${campaignData.status === 'Active' ? 'status-active' : 'status-planning'}`}>{campaignData.status}</span>
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
                    {(campaignData.review_status !== 'creators_are_final') && (
                        <Button
                            variant={activeTab === 'creators' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('creators')}
                        >
                            Creators
                        </Button>
                    )}
                    {canShowNegotiationTab && (
                        <Button
                            variant={activeTab === 'bids' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('bids')}
                        >
                            Negotiation
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
                    <>
                        {/* Campaign Info */}
                        <div className="stats-grid">
                            {stats.map((stat: any, index: number) => (
                                <Card key={index} className="stat-card">
                                    <CardBody>
                                        <div className="stat-content">
                                            <div className="stat-icon"><stat.icon size={24} /></div>
                                            <div className="stat-details">
                                                <p className="stat-label">{stat.label}</p>
                                                <h3 className="stat-value">{stat.value}</h3>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>

                        {/* Campaign Details Card */}
                        <Card className="content-card" style={{ marginTop: 'var(--space-6)' }}>
                            <CardHeader>
                                <h3>Campaign Details</h3>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Description</p>
                                        <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.description || 'No description'}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Go Live Date</p>
                                        <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.go_live_date ? new Date(campaignData.go_live_date).toLocaleDateString() : 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Categories</p>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                            {(campaignData.creator_categories || []).map((cat: string) => (
                                                <span key={cat} style={{ background: 'var(--color-bg-tertiary)', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{cat}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', margin: 0 }}>Follower Ranges</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleOpenEditFollowerRanges}
                                                style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}
                                            >
                                                <Edit size={14} style={{ marginRight: '4px' }} />
                                                Edit
                                            </Button>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                            {(() => {
                                                const ranges = campaignData.follower_ranges || [];
                                                if (ranges.length === 0) {
                                                    // Fallback: try to construct from min/max followers if follower_ranges is not available
                                                    const minFollowers = campaignData.min_followers;
                                                    const maxFollowers = campaignData.max_followers;
                                                    if (minFollowers && maxFollowers) {
                                                        const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
                                                        return (
                                                            <span style={{ background: 'var(--color-bg-tertiary)', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                                                {fmt(minFollowers)} – {fmt(maxFollowers)}
                                                            </span>
                                                        );
                                                    }
                                                    return <span style={{ color: 'var(--color-text-tertiary)' }}>Not specified</span>;
                                                }
                                                return ranges.map((range: string) => {
                                                    const parts = range.split('-');
                                                    if (parts.length !== 2) return null;
                                                    const [min, max] = parts.map(Number);
                                                    if (isNaN(min) || isNaN(max)) return null;
                                                    const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
                                                    return (
                                                        <span key={range} style={{ background: 'var(--color-bg-tertiary)', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                                            {fmt(min)} – {fmt(max)}
                                                        </span>
                                                    );
                                                }).filter(Boolean);
                                            })()}
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Brief Status</p>
                                        <span className={`status-badge ${campaignData.brief_completed ? 'status-active' : 'status-planning'}`}>
                                            {campaignData.brief_completed ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Review Status</p>
                                        <span className={`status-badge ${campaignData.review_status === 'creators_are_final' ? 'status-active' : 'status-planning'}`}>
                                            {campaignData.review_status || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )}

                {activeTab === 'creators' && (
                    <Card className="content-card">
                        <CardHeader>
                            <div className="card-header-content">
                                <h3>Campaign Creators ({creators.length})</h3>
                                <Button size="sm" onClick={handleBrandSubmitSelection} isLoading={isSubmittingSelection}>
                                    <Check size={18} />
                                    Submit Selection
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody className="no-padding">
                            <div className="table-responsive">
                                <table className="creators-table">
                                    <thead>
                                        <tr>
                                            <th>Creator</th>
                                            <th>Instagram</th>
                                            <th>Status</th>
                                            <th>Amount</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creators.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
                                                    No creators added yet. Upload a creators sheet to get started.
                                                </td>
                                            </tr>
                                        ) : (
                                            creators.map((creator: any) => (
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
                                                    <td>₹{creator.amount || creator.final_amount || '0'}</td>
                                                    <td style={{ textAlign: 'right', display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={async () => {
                                                                if (!id) return;
                                                                try {
                                                                    await brandApi.updateCreatorStatuses(id, [{
                                                                        creator_id: creator.id || creator.creator_id,
                                                                        status: 'accepted'
                                                                    }]);
                                                                    showToast('Creator accepted successfully', 'success');
                                                                    // Refresh list
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
                                                                    await brandApi.updateCreatorStatuses(id, [{
                                                                        creator_id: creator.id || creator.creator_id,
                                                                        status: 'rejected'
                                                                    }]);
                                                                    showToast('Creator rejected', 'info');
                                                                    // Refresh list
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
                        </CardBody>
                    </Card>
                )}

                {activeTab === 'bids' && (
                    <Card className="content-card">
                        <CardHeader>
                            <div className="card-header-content">
                                <h3>Creator Negotiations ({bids.length})</h3>
                                <Button onClick={handleFinalizeAmounts} isLoading={isFinalizingAmounts}>
                                    Finalize Deals
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody className="no-padding">
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
                                                                                const creatorId = bid.creator_id || bid.id;
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
                                                                            onClick={() => {
                                                                                const amount = prompt("Enter counter offer amount:");
                                                                                if (amount) {
                                                                                    const numAmount = parseFloat(amount);
                                                                                    if (isNaN(numAmount)) {
                                                                                        showToast('Invalid amount', 'error');
                                                                                        return;
                                                                                    }
                                                                                    (async () => {
                                                                                        if (!id) return;
                                                                                        const creatorId = bid.creator_id || bid.id;
                                                                                        try {
                                                                                            await brandApi.respondToCreatorBid(id, creatorId, 'accept', numAmount);
                                                                                            showToast('Counter offer sent', 'success');
                                                                                            const bidsData: any = await brandApi.getCreatorBids(id);
                                                                                            setBids(Array.isArray(bidsData) ? bidsData : (bidsData?.bids || bidsData?.creators || []));
                                                                                        } catch (error: any) {
                                                                                            showToast(error.message || 'Failed to send counter offer', 'error');
                                                                                        }
                                                                                    })();
                                                                                }
                                                                            }}
                                                                        >
                                                                            Counter
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            style={{ color: 'var(--color-error)' }}
                                                                            onClick={async () => {
                                                                                if (!id) return;
                                                                                const creatorId = bid.creator_id || bid.id;
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
                        </CardBody>
                    </Card>
                )}

                {activeTab === 'brief' && (
                    <Card className="content-card">
                        <CardHeader>
                            <div className="card-header-content">
                                <h3>Campaign Brief</h3>
                                {campaignData.brief_completed && !isBriefEditing && (
                                    <Button size="sm" onClick={() => setIsBriefEditing(true)}>
                                        Edit Brief
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardBody>
                            {campaignData.brief_completed && !isBriefEditing ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Video Title</p>
                                        <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.video_title || '-'}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Primary Focus</p>
                                        <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.primary_focus || '-'}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Secondary Focus</p>
                                        <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.secondary_focus || '-'}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Call to Action</p>
                                        <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.cta || '-'}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Dos</p>
                                        <p style={{ color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{campaignData.dos || '-'}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Don'ts</p>
                                        <p style={{ color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{campaignData.donts || '-'}</p>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Sample Video</p>
                                        {campaignData.sample_video_url ? (
                                            <a
                                                href={campaignData.sample_video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                                            >
                                                View sample video
                                            </a>
                                        ) : (
                                            <p style={{ color: 'var(--color-text-primary)' }}>No sample video</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleBriefSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                    <Input
                                        label="Video Title"
                                        placeholder="e.g., Summer Launch Reel"
                                        value={briefData.video_title}
                                        onChange={(e: any) => setBriefData({ ...briefData, video_title: e.target.value })}
                                        required
                                    />
                                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                        <Input
                                            label="Primary Focus"
                                            placeholder="Product awareness"
                                            value={briefData.primary_focus}
                                            onChange={(e: any) => setBriefData({ ...briefData, primary_focus: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Secondary Focus"
                                            placeholder="Drive profile visits"
                                            value={briefData.secondary_focus}
                                            onChange={(e: any) => setBriefData({ ...briefData, secondary_focus: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                        <TextArea
                                            label="Dos"
                                            placeholder="Show product in first 5 seconds"
                                            value={briefData.dos}
                                            onChange={(e: any) => setBriefData({ ...briefData, dos: e.target.value })}
                                            required
                                        />
                                        <TextArea
                                            label="Don'ts"
                                            placeholder="No competitor mention"
                                            value={briefData.donts}
                                            onChange={(e: any) => setBriefData({ ...briefData, donts: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Input
                                        label="Call to Action"
                                        placeholder="Follow @brand"
                                        value={briefData.cta}
                                        onChange={(e: any) => setBriefData({ ...briefData, cta: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Sample Video URL (Optional)"
                                        placeholder="https://cdn.example.com/sample.mp4"
                                        value={briefData.sample_video_url}
                                        onChange={(e: any) => setBriefData({ ...briefData, sample_video_url: e.target.value })}
                                    />
                                    <FileUpload
                                        accept="video/*"
                                        maxSize={50}
                                        onFileSelect={(files: File[]) => setSampleVideoFiles(files)}
                                        label="Sample Video File (Optional)"
                                        description="Upload sample file if you don't want to use URL"
                                    />

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
                                        {campaignData.brief_completed && (
                                            <Button type="button" variant="ghost" onClick={() => setIsBriefEditing(false)}>
                                                Cancel
                                            </Button>
                                        )}
                                        <Button type="submit" isLoading={isSubmittingBrief}>
                                            {campaignData.brief_completed ? 'Update Brief' : 'Submit Brief'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardBody>
                    </Card>
                )}

                {activeTab === 'scripts' && (
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
                                    <h3>Creator Scripts ({scripts.length})</h3>
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
                                    <span className="status-badge status-active">Accepted: {scriptReviewStats.accepted}</span>
                                    <span className="status-badge status-error">Rejected: {scriptReviewStats.rejected}</span>
                                    <span className="status-badge status-content-review">Changes Requested: {scriptReviewStats.revisionRequested}</span>
                                    <span className="status-badge status-planning">Pending: {scriptReviewStats.pending}</span>
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
                                            {scripts.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
                                                        No scripts submitted yet.
                                                    </td>
                                                </tr>
                                            ) : (
                                                scripts.map((script: any) => (
                                                    <tr key={script.id || script.creator_id}>
                                                        <td>
                                                            <div className="creator-cell">
                                                                <div className="creator-avatar" style={{ width: 32, height: 32, fontSize: 16 }}>
                                                                    {script.avatar || '👤'}
                                                                </div>
                                                                <div>
                                                                    <div className="creator-name">{script.name || script.creator_name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {script.script_content || script.content || '-'}
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
                                                        <td style={{ textAlign: 'right', display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                                            {String(script.status || '').toLowerCase() === 'script_pending' ? (
                                                                <Button variant="ghost" size="sm" onClick={() => handleOpenAIReview(script)}>
                                                                    <Sparkles size={14} />
                                                                    Ask AI Review
                                                                </Button>
                                                            ) : (
                                                                <Button variant="ghost" size="sm" disabled>
                                                                    Reviewed
                                                                </Button>
                                                            )}
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
                )}

                {activeTab === 'content' && (
                    <Card className="content-card">
                        <CardHeader>
                            <div className="card-header-content">
                                <h3>Creator Content ({content.length})</h3>
                            </div>
                        </CardHeader>
                        <CardBody className="no-padding">
                            <div className="table-responsive">
                                <table className="creators-table">
                                    <thead>
                                        <tr>
                                            <th>Creator</th>
                                            <th>Content</th>
                                            <th>Status</th>
                                            <th>Submitted</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {content.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
                                                    No content submitted yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            content.map((item: any) => (
                                                <tr key={item.id || item.creator_id}>
                                                    <td>
                                                        <div className="creator-cell">
                                                            <div className="creator-avatar" style={{ width: 32, height: 32, fontSize: 16 }}>
                                                                {item.avatar || '👤'}
                                                            </div>
                                                            <div>
                                                                <div className="creator-name">{item.name || item.creator_name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {(() => {
                                                            const contentStatus = String(item.status || '').toLowerCase();
                                                            const isLive = contentStatus === 'content_live' || contentStatus === 'live';
                                                            if (isLive && item.live_url) {
                                                                return (
                                                                    <a href={item.live_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                                                                        View Live URL
                                                                    </a>
                                                                );
                                                            }
                                                            if (item.content_url) {
                                                                return (
                                                                    <a href={item.content_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                                                                        View Content
                                                                    </a>
                                                                );
                                                            }
                                                            if (item.live_url) {
                                                                return (
                                                                    <a href={item.live_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                                                                        View Live URL
                                                                    </a>
                                                                );
                                                            }
                                                            return item.content || '-';
                                                        })()}
                                                    </td>
                                                    <td>
                                                        {(() => {
                                                            const meta = getContentStatusMeta(item.status);
                                                            return <span className={`status-badge ${meta.tone}`}>{meta.label}</span>;
                                                        })()}
                                                    </td>
                                                    <td>{item.submitted_at || item.created_at || '-'}</td>
                                                    <td style={{ textAlign: 'right', display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                                        {String(item.status || '').toLowerCase() === 'content_pending' ? (
                                                            <Button variant="ghost" size="sm" onClick={() => handleOpenAIContentReview(item)}>
                                                                <Sparkles size={14} />
                                                                Ask AI Review
                                                            </Button>
                                                        ) : (
                                                            <Button variant="ghost" size="sm" disabled>
                                                                Reviewed
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </main>
        </div>
    );
};
