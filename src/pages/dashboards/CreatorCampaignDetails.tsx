import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Modal, TextArea, Input, FileUpload } from '../../components';
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    Calendar,
    FileText,
    MessageSquare,
    Upload,
    Info,
    ChevronRight,
    Link as LinkIcon,
    BadgeCheck
} from 'lucide-react';
import { creatorApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import './AdminDashboard.css';
import './CreatorDashboard.css';

export const CreatorCampaignDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [modalType, setModalType] = useState<'script' | 'content' | 'go-live' | 'link' | 'negotiate' | 'accept-deal' | 'reject-deal' | null>(null);
    const [scriptContent, setScriptContent] = useState('');
    const [contentLink, setContentLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [campaignData, setCampaignData] = useState<any>(null);
    const [negotiationStatus, setNegotiationStatus] = useState<any>(null);
    const [briefData, setBriefData] = useState<any>(null);
    const [isLinking, setIsLinking] = useState(false);
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [negotiationAmount, setNegotiationAmount] = useState('');
    const [creatorToken, setCreatorToken] = useState('');
    const [inlineScriptContent, setInlineScriptContent] = useState('');
    const [isSubmittingInlineScript, setIsSubmittingInlineScript] = useState(false);
    const [contentFiles, setContentFiles] = useState<File[]>([]);
    const [liveLink, setLiveLink] = useState('');

    const formatINR = (value: any) => {
        const num = typeof value === 'number' ? value : parseFloat(String(value ?? '').replace(/,/g, ''));
        if (!isFinite(num)) return '—';
        return `₹${num.toLocaleString()}`;
    };

    const scriptReviewMeta = (() => {
        const status = String(briefData?.status || campaignData?.status || '').toLowerCase();
        if (status === 'script_approved') {
            return { label: 'Script Accepted', tone: 'status-active', message: 'Brand has approved your script. You can move to content submission.' };
        }
        if (status === 'content_revision_requested') {
            return { label: 'Script Accepted', tone: 'status-active', message: 'Your script is approved. Brand requested changes in video content only.' };
        }
        if (status === 'content_rejected') {
            return { label: 'Script Accepted', tone: 'status-active', message: 'Your script is approved. Please re-upload video content based on feedback.' };
        }
        if (status === 'content_pending' || status === 'content_approved' || status === 'content_live') {
            return { label: 'Script Accepted', tone: 'status-active', message: 'Your script is approved.' };
        }
        if (status === 'script_revision_requested' || status === 'script_rejected') {
            return { label: 'Changes Requested', tone: 'status-content-review', message: 'Brand requested updates to your script. Please revise and submit again.' };
        }
        if (status === 'script_pending') {
            return { label: 'Under Review', tone: 'status-planning', message: 'Your script is submitted and waiting for brand review.' };
        }
        return null;
    })();

    const scriptDeliverableStatus = (() => {
        const status = String(briefData?.status || campaignData?.status || '').toLowerCase();
        if (status === 'script_approved') return 'Accepted';
        if (status === 'content_pending' || status === 'content_approved' || status === 'content_rejected' || status === 'content_revision_requested' || status === 'content_live') return 'Accepted';
        if (status === 'script_revision_requested' || status === 'script_rejected') return 'Changes Requested';
        if (status === 'script_pending') return 'In Review';
        return inlineScriptContent?.trim() ? 'Draft Ready' : 'Pending';
    })();

    const currentWorkflowStatus = String(briefData?.status || campaignData?.status || '').toLowerCase();
    const canUploadContent =
        currentWorkflowStatus === 'script_approved' ||
        currentWorkflowStatus === 'content_rejected' ||
        currentWorkflowStatus === 'content_revision_requested';
    const isContentUnderBrandReview = currentWorkflowStatus === 'content_pending';
    const canGoLive = currentWorkflowStatus === 'content_approved';
    // Check multiple sources for final_amount
    const finalAmountFromAllSources = 
        negotiationStatus?.final_amount || 
        campaignData?.final_amount || 
        briefData?.final_amount ||
        briefData?.campaign?.final_amount;
    const dealIsFinalized =
        (finalAmountFromAllSources && Number(finalAmountFromAllSources) > 0) ||
        negotiationStatus?.status === 'accepted' ||
        negotiationStatus?.status === 'amount_finalized' ||
        campaignData?.negotiation_status === 'accepted' ||
        campaignData?.negotiation_status === 'amount_finalized' ||
        briefData?.status === 'accepted' ||
        briefData?.status === 'amount_finalized' ||
        currentWorkflowStatus === 'accepted' ||
        currentWorkflowStatus === 'amount_finalized';
    const scriptNeedsRevision =
        currentWorkflowStatus === 'script_revision_requested' ||
        currentWorkflowStatus === 'script_rejected';
    const scriptAlreadySubmitted =
        currentWorkflowStatus === 'script_pending' ||
        currentWorkflowStatus === 'script_approved' ||
        currentWorkflowStatus === 'content_pending' ||
        currentWorkflowStatus === 'content_approved' ||
        currentWorkflowStatus === 'content_rejected' ||
        currentWorkflowStatus === 'content_revision_requested' ||
        currentWorkflowStatus === 'content_live';
    const canSubmitScript =
        scriptNeedsRevision ||
        (dealIsFinalized && !scriptAlreadySubmitted);
    const scriptSubmissionLocked = scriptAlreadySubmitted && !scriptNeedsRevision;
    const scriptIsNextStep = canSubmitScript;

    const brandScriptFeedback =
        (briefData?.script_feedback && String(briefData.script_feedback).trim()) ||
        (campaignData?.script_feedback && String(campaignData.script_feedback).trim()) ||
        '';
    const brandContentFeedback =
        (briefData?.content_feedback && String(briefData.content_feedback).trim()) ||
        (campaignData?.content_feedback && String(campaignData.content_feedback).trim()) ||
        (briefData?.video_feedback && String(briefData.video_feedback).trim()) ||
        (campaignData?.video_feedback && String(campaignData.video_feedback).trim()) ||
        (briefData?.feedback && String(briefData.feedback).trim()) ||
        (campaignData?.feedback && String(campaignData.feedback).trim()) ||
        '';
    const isContentChangesRequested =
        currentWorkflowStatus === 'content_rejected' ||
        currentWorkflowStatus === 'content_revision_requested';
    const briefSources: any[] = [
        briefData?.campaign,
        briefData,
        briefData?.campaign?.brief,
        briefData?.brief,
        briefData?.campaign_data,
        briefData?.brief_data,
        campaignData,
        campaignData?.campaign,
        campaignData?.brief,
        campaignData?.campaign_data,
        campaignData?.brief_data,
    ].filter(Boolean);
    const firstBriefValue = (...keys: string[]) => {
        for (const source of briefSources) {
            for (const key of keys) {
                const val = source?.[key];
                if (val === null || val === undefined) continue;
                if (typeof val === 'string') {
                    if (val.trim()) return val.trim();
                    continue;
                }
                if (Array.isArray(val) && val.length > 0) {
                    return val.join('\n');
                }
                if (typeof val === 'number' || typeof val === 'boolean') {
                    return String(val);
                }
            }
        }
        return '';
    };
    const briefVideoTitle =
        firstBriefValue('video_title', 'videoTitle', 'title') ||
        campaignData?.name;
    const briefPrimaryFocus =
        firstBriefValue('primary_focus', 'primaryFocus');
    const briefSecondaryFocus =
        firstBriefValue('secondary_focus', 'secondaryFocus');
    const briefDos =
        firstBriefValue('dos', 'do');
    const briefDonts =
        firstBriefValue('donts', 'dont');
    const briefCta =
        firstBriefValue('cta', 'call_to_action');
    const hasAnyBriefDetails = Boolean(briefVideoTitle || briefPrimaryFocus || briefSecondaryFocus || campaignData?.description);

    const normalizeCampaign = (base: any, extra: any) => {
        // Merge campaign summary (list) + brief.campaign into a single object for rendering.
        // Summary has progress/deadline/requirements; brief has cpv/categories/budget/follower_ranges.
        const merged = { ...(base || {}), ...(extra || {}) };
        // Normalize common alternates
        merged.id = merged.id || merged._id || merged.campaign_id;
        merged.brand =
            merged.brand ||
            merged.brand_name ||
            merged.brandName ||
            merged.brand_company ||
            'Partner Brand';
        // Ensure creator_categories is always an array
        if (merged.creator_categories && !Array.isArray(merged.creator_categories)) {
            merged.creator_categories = [String(merged.creator_categories)];
        }
        if (!merged.creator_categories) merged.creator_categories = [];
        return merged;
    };

    useEffect(() => {
        const fetchCampaignData = async () => {
            if (!id) return;
            try {
                // First, try to get campaign from campaigns list as fallback
                let campaignFromList: any = null;
                try {
                    const campaignsData = await creatorApi.getCampaigns() as any;
                    const campaignsArray = Array.isArray(campaignsData)
                        ? campaignsData
                        : (campaignsData?.campaigns || campaignsData?.data || []);

                    // Try multiple ID matching strategies
                    campaignFromList = campaignsArray.find((c: any) => {
                        const campaignId = c.id || c._id || c.campaign_id;
                        return campaignId === id || campaignId?.toString() === id?.toString();
                    });

                    if (campaignFromList) {
                        console.log('Found campaign from list:', campaignFromList);
                    } else {
                        console.log('Campaign not found in list. Looking for ID:', id, 'Available campaigns:', campaignsArray.map((c: any) => ({ id: c.id, _id: c._id, campaign_id: c.campaign_id })));
                    }
                } catch (err) {
                    console.error('Failed to fetch campaigns list:', err);
                }

                // Try to get campaign brief
                try {
                    const brief = await creatorApi.getCampaignBrief(id);
                    setBriefData(brief);

                    // Set campaignData from brief if available
                    // Backend returns { campaign: {...}, status: "...", final_amount: ..., brief_access: ... }
                    if (brief) {
                        // Extract campaign data from brief (could be brief.campaign or brief itself)
                        const briefCampaign = brief.campaign || brief;
                        const merged = normalizeCampaign(campaignFromList, briefCampaign);

                        // Ensure key fields are present
                        // campaignFromList is the raw campaign from getCampaigns() — it has
                        // top-level brief fields (dos/donts/cta/etc.) that getCampaignBrief may omit.
                        const cl = campaignFromList || {};
                        const bc = briefCampaign || {};
                        const pick = (...vals: any[]) => vals.find(v => v !== null && v !== undefined && v !== '') ?? undefined;
                        const finalCampaignData = {
                            ...merged,
                            // Brief response has status and final_amount at top level
                            status: pick(brief.status, merged.status, 'Active'),
                            brand: pick(bc.brand_name, brief.brand_name, merged.brand, 'Partner Brand'),
                            video_title: pick(bc.video_title, brief.video_title, cl.video_title, merged.video_title),
                            primary_focus: pick(bc.primary_focus, brief.primary_focus, cl.primary_focus, merged.primary_focus),
                            secondary_focus: pick(bc.secondary_focus, brief.secondary_focus, cl.secondary_focus, merged.secondary_focus),
                            dos: pick(bc.dos, brief.dos, cl.dos, merged.dos),
                            donts: pick(bc.donts, brief.donts, cl.donts, merged.donts),
                            cta: pick(bc.cta, brief.cta, bc.call_to_action, brief.call_to_action, cl.cta, cl.call_to_action, merged.cta),
                            brief_completed: pick(bc.brief_completed, brief.brief_completed, cl.brief_completed, merged.brief_completed),
                            // Ensure these are passed through from brief
                            cpv: (briefCampaign.cpv !== undefined ? briefCampaign.cpv : brief.cpv) !== undefined
                                ? (briefCampaign.cpv !== undefined ? briefCampaign.cpv : brief.cpv)
                                : merged.cpv,
                            total_budget: (briefCampaign.total_budget !== undefined ? briefCampaign.total_budget : brief.total_budget) !== undefined
                                ? (briefCampaign.total_budget !== undefined ? briefCampaign.total_budget : brief.total_budget)
                                : merged.total_budget,
                            creator_categories: briefCampaign.creator_categories || brief.creator_categories || merged.creator_categories,
                            follower_ranges: briefCampaign.follower_ranges || brief.follower_ranges || merged.follower_ranges
                        };

                        setCampaignData(finalCampaignData);
                    } else if (campaignFromList) {
                        // If brief request succeeds but returns null (unlikely but possible), fall back to list data
                        setCampaignData(normalizeCampaign(campaignFromList, null));
                    }
                } catch (briefError) {
                    console.error('Failed to fetch campaign brief:', briefError);
                    // If brief fails but we have campaign from list, use that
                    if (campaignFromList) {
                        setCampaignData(normalizeCampaign(campaignFromList, null));
                    } else {
                        showToast('Failed to load campaign details. You may need to link the campaign first.', 'info');
                    }
                }

                // Try to get negotiation status (this can fail, it's optional)
                try {
                    const negotiationData = await creatorApi.getBidStatus(id);
                    setNegotiationStatus(negotiationData);
                } catch (negotiationError) {
                    console.error('Failed to fetch negotiation status:', negotiationError);
                    // Negotiation status is optional, so we don't show error for this
                }
            } catch (error) {
                console.error('Failed to fetch campaign data:', error);
                showToast('Failed to load campaign details. Please try again.', 'error');
            }
        };

        // Check if we need to link campaign
        const token = searchParams.get('token');
        if (token && id) {
            setCreatorToken(token);
            setModalType('link');
        }

        fetchCampaignData();
    }, [id, searchParams, showToast]);

    useEffect(() => {
        const template =
            briefData?.campaign?.script_template ||
            briefData?.script_template ||
            campaignData?.script_template ||
            '';
        if (!inlineScriptContent && template) {
            setInlineScriptContent(template);
        }
    }, [briefData, campaignData, inlineScriptContent]);

    const handleLinkCampaign = async () => {
        if (!id) return;
        setIsLinking(true);
        try {
            await creatorApi.linkCampaign(id, creatorToken);
            showToast('Campaign linked successfully!', 'success');
            setModalType(null);
            setCreatorToken('');
            // Refresh data
            const brief = await creatorApi.getCampaignBrief(id);
            setBriefData(brief);
            if (brief && brief.campaign) {
                setCampaignData({
                    ...brief.campaign,
                    status: brief.status || brief.campaign.status,
                    brand: brief.campaign.brand_name || 'Partner Brand'
                });
            }
        } catch (error: any) {
            console.error('Failed to link campaign:', error);
            showToast(error.message || 'Failed to link campaign', 'error');
        } finally {
            setIsLinking(false);
        }
    };

    const handleNegotiate = async () => {
        if (!id || !negotiationAmount) return;
        setIsNegotiating(true);
        try {
            await creatorApi.submitBid(id, parseFloat(negotiationAmount));
            showToast('Negotiation proposal submitted successfully!', 'success');
            setModalType(null);
            setNegotiationAmount('');
            // Refresh negotiation status
            const negotiationData = await creatorApi.getBidStatus(id);
            setNegotiationStatus(negotiationData);

            // Refresh campaign data
            const brief = await creatorApi.getCampaignBrief(id);
            setBriefData(brief);

            // Also refresh from campaigns list to get updated status
            try {
                const campaignsData = await creatorApi.getCampaigns() as any;
                const campaignsArray = Array.isArray(campaignsData)
                    ? campaignsData
                    : (campaignsData?.campaigns || campaignsData?.data || []);
                const updatedCampaign = campaignsArray.find((c: any) => {
                    const campaignId = c.id || c._id || c.campaign_id;
                    return campaignId === id || campaignId?.toString() === id?.toString();
                });

                if (brief) {
                    const merged = normalizeCampaign(updatedCampaign, brief);
                    const finalCampaignData = {
                        ...merged,
                        status: brief.status || merged.status || 'Active',
                        brand: brief.brand_name || merged.brand || 'Partner Brand',
                        cpv: brief.cpv !== undefined ? brief.cpv : merged.cpv,
                        total_budget: brief.total_budget !== undefined ? brief.total_budget : merged.total_budget,
                        creator_categories: brief.creator_categories || merged.creator_categories,
                        follower_ranges: brief.follower_ranges || merged.follower_ranges
                    };
                    setCampaignData(finalCampaignData);
                } else if (updatedCampaign) {
                    setCampaignData(normalizeCampaign(updatedCampaign, null));
                }
            } catch (err) {
                console.error('Failed to refresh campaign list:', err);
            }
        } catch (error: any) {
            console.error('Failed to submit negotiation:', error);
            showToast(error.message || 'Failed to submit negotiation', 'error');
        } finally {
            setIsNegotiating(false);
        }
    };

    const handleAcceptDeal = async () => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            await creatorApi.respondToBid(id, 'accept');
            showToast('Deal accepted successfully!', 'success');
            setIsSuccess(true);
            setModalType(null);
            // Refresh negotiation status
            const negotiationData = await creatorApi.getBidStatus(id);
            setNegotiationStatus(negotiationData);

            // Refresh campaign data
            const brief = await creatorApi.getCampaignBrief(id);
            setBriefData(brief);

            // Also refresh from campaigns list to get updated status
            try {
                const campaignsData = await creatorApi.getCampaigns() as any;
                const campaignsArray = Array.isArray(campaignsData)
                    ? campaignsData
                    : (campaignsData?.campaigns || campaignsData?.data || []);
                const updatedCampaign = campaignsArray.find((c: any) => {
                    const campaignId = c.id || c._id || c.campaign_id;
                    return campaignId === id || campaignId?.toString() === id?.toString();
                });

                if (brief) {
                    const merged = normalizeCampaign(updatedCampaign, brief);
                    const finalCampaignData = {
                        ...merged,
                        status: brief.status || merged.status || 'Active',
                        brand: brief.brand_name || merged.brand || 'Partner Brand',
                        cpv: brief.cpv !== undefined ? brief.cpv : merged.cpv,
                        total_budget: brief.total_budget !== undefined ? brief.total_budget : merged.total_budget,
                        creator_categories: brief.creator_categories || merged.creator_categories,
                        follower_ranges: brief.follower_ranges || merged.follower_ranges
                    };
                    setCampaignData(finalCampaignData);
                } else if (updatedCampaign) {
                    setCampaignData(normalizeCampaign(updatedCampaign, null));
                }
            } catch (err) {
                console.error('Failed to refresh campaign list:', err);
            }

            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
        } catch (error: any) {
            console.error('Failed to accept deal:', error);
            showToast(error.message || 'Failed to accept deal', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRejectDeal = async () => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            await creatorApi.respondToBid(id, 'reject');
            showToast('Deal declined successfully.', 'info');
            setModalType(null);

            // Refresh negotiation status
            const negotiationData = await creatorApi.getBidStatus(id);
            setNegotiationStatus(negotiationData);

            // Refresh campaign data
            const brief = await creatorApi.getCampaignBrief(id);
            setBriefData(brief);
            if (brief && brief.campaign) {
                setCampaignData({
                    ...brief.campaign,
                    status: brief.status || brief.campaign.status,
                    brand: brief.campaign.brand_name || 'Partner Brand'
                });
            } else if (brief) {
                // Handle flat brief object
                const merged = normalizeCampaign(null, brief);
                setCampaignData({
                    ...merged,
                    status: brief.status,
                    brand: brief.brand_name
                });
            }
        } catch (error: any) {
            console.error('Failed to decline deal:', error);
            showToast(error.message || 'Failed to decline deal', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAction = async () => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            if (modalType === 'script') {
                if (scriptSubmissionLocked) {
                    showToast('Script already submitted. You can submit again only when brand requests changes.', 'info');
                    setIsSubmitting(false);
                    return;
                }

                // Validate that deal is finalized or script revision is requested
                // Check multiple sources for final_amount
                const finalAmount = 
                    negotiationStatus?.final_amount || 
                    campaignData?.final_amount || 
                    briefData?.final_amount ||
                    briefData?.campaign?.final_amount;
                const hasFinalAmount = finalAmount && Number(finalAmount) > 0;
                
                // Check negotiation status from multiple sources
                const negotiationStatusValue = 
                    negotiationStatus?.status || 
                    campaignData?.negotiation_status ||
                    briefData?.status;
                
                const isDealFinalized =
                    hasFinalAmount ||
                    negotiationStatusValue === 'accepted' ||
                    negotiationStatusValue === 'amount_finalized' ||
                    negotiationStatus?.status === 'accepted' ||
                    negotiationStatus?.status === 'amount_finalized' ||
                    currentWorkflowStatus === 'accepted' ||
                    currentWorkflowStatus === 'amount_finalized';
                const isRevisionRequested = scriptNeedsRevision;
                
                if (!isDealFinalized && !isRevisionRequested) {
                    showToast('Submit script only after amount is finalized or when revision is requested', 'error');
                    setIsSubmitting(false);
                    return;
                }

                // Use scriptContent if provided, otherwise use brand template
                const finalScript = scriptContent || briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template || '';
                await creatorApi.uploadScript(id, finalScript);
                showToast('Script finalized and submitted successfully!', 'success');
            } else if (modalType === 'content') {
                if (contentFiles.length === 0) {
                    showToast('Please upload a content video file before submitting.', 'error');
                    setIsSubmitting(false);
                    return;
                }
                await creatorApi.uploadContent(id, contentFiles[0], contentLink);
                showToast('Content uploaded successfully! Waiting for brand review.', 'success');
            }
            setIsSuccess(true);

            // Refresh brief to update status
            const brief = await creatorApi.getCampaignBrief(id);
            setBriefData(brief);
            if (brief && brief.campaign) {
                setCampaignData({
                    ...brief.campaign,
                    status: brief.status || brief.campaign.status,
                    brand: brief.campaign.brand_name || 'Partner Brand'
                });
            }

            setTimeout(() => {
                setModalType(null);
                setIsSuccess(false);
                setScriptContent('');
                setContentLink('');
                setContentFiles([]);
            }, 2000);
        } catch (error: any) {
            console.error('Failed to submit:', error);
            const errorMessage = error.message || 'Failed to submit';
            // If backend returns validation error, provide more context
            if (errorMessage.includes('amount is finalized') || errorMessage.includes('revision is requested')) {
                showToast('Unable to submit: Please ensure the deal amount is finalized by the brand before submitting your script.', 'error');
            } else {
                showToast(errorMessage, 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoLive = async () => {
        if (!id) return;
        const finalLiveLink = (liveLink || '').trim();
        if (!finalLiveLink) {
            showToast('Please add your live content link.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await creatorApi.goLive(id, finalLiveLink);
            showToast('Marked as live successfully!', 'success');
            setModalType(null);
            setLiveLink('');

            const brief = await creatorApi.getCampaignBrief(id);
            setBriefData(brief);
            if (brief && brief.campaign) {
                setCampaignData({
                    ...brief.campaign,
                    status: brief.status || brief.campaign.status,
                    brand: brief.campaign.brand_name || 'Partner Brand'
                });
            }
        } catch (error: any) {
            console.error('Failed to mark content live:', error);
            showToast(error.message || 'Failed to mark content live', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInlineScriptSubmit = async () => {
        if (!id) return;
        const finalScript = (inlineScriptContent || '').trim();
        if (!finalScript) {
            showToast('Please add script content before submitting.', 'error');
            return;
        }

        if (scriptSubmissionLocked) {
            showToast('Script already submitted. You can submit again only when brand requests changes.', 'info');
            return;
        }

        // Validate that deal is finalized or script revision is requested
        // Check multiple sources for final_amount
        const finalAmount = 
            negotiationStatus?.final_amount || 
            campaignData?.final_amount || 
            briefData?.final_amount ||
            briefData?.campaign?.final_amount;
        const hasFinalAmount = finalAmount && Number(finalAmount) > 0;
        
        // Check negotiation status from multiple sources
        const negotiationStatusValue = 
            negotiationStatus?.status || 
            campaignData?.negotiation_status ||
            briefData?.status;
        
        const isDealFinalized =
            hasFinalAmount ||
            negotiationStatusValue === 'accepted' ||
            negotiationStatusValue === 'amount_finalized' ||
            negotiationStatus?.status === 'accepted' ||
            negotiationStatus?.status === 'amount_finalized' ||
            currentWorkflowStatus === 'accepted' ||
            currentWorkflowStatus === 'amount_finalized';
        const isRevisionRequested = scriptNeedsRevision;
        
        if (!isDealFinalized && !isRevisionRequested) {
            showToast('Submit script only after amount is finalized or when revision is requested', 'error');
            return;
        }

        setIsSubmittingInlineScript(true);
        try {
            await creatorApi.uploadScript(id, finalScript);
            showToast('Script submitted successfully!', 'success');

            const brief = await creatorApi.getCampaignBrief(id);
            setBriefData(brief);
            if (brief && brief.campaign) {
                setCampaignData({
                    ...brief.campaign,
                    status: brief.status || brief.campaign.status,
                    brand: brief.campaign.brand_name || 'Partner Brand'
                });
            }
        } catch (error: any) {
            console.error('Failed to submit script:', error);
            const errorMessage = error.message || 'Failed to submit script';
            // If backend returns validation error, provide more context
            if (errorMessage.includes('amount is finalized') || errorMessage.includes('revision is requested')) {
                showToast('Unable to submit: Please ensure the deal amount is finalized by the brand before submitting your script.', 'error');
            } else {
                showToast(errorMessage, 'error');
            }
        } finally {
            setIsSubmittingInlineScript(false);
        }
    };

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
                        {negotiationStatus && negotiationStatus.final_amount && negotiationStatus.final_amount > 0 &&
                            (negotiationStatus.status === 'bid_pending' || negotiationStatus.status === 'amount_negotiated' || !negotiationStatus.status) && (
                                <>
                                    <Button variant="primary" onClick={() => setModalType('accept-deal')}>
                                        Accept Deal
                                    </Button>
                                    <Button variant="secondary" onClick={() => setModalType('negotiate')}>
                                        Negotiate
                                    </Button>
                                </>
                            )}
                        {negotiationStatus && (!negotiationStatus.final_amount || negotiationStatus.final_amount <= 0) &&
                            (negotiationStatus.status === 'bid_pending' || negotiationStatus.status === 'amount_negotiated' || !negotiationStatus.status) && (
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
                    {/* Left Column: Brief & Tasks */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                        {/* Campaign Brief */}
                        <Card className="content-card">
                            <CardHeader>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <FileText size={20} style={{ color: 'var(--color-accent)' }} />
                                    <h3>Campaign Brief & Guidelines</h3>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {!hasAnyBriefDetails ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'rgba(var(--color-warning-rgb), 0.1)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-warning)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <Info size={20} style={{ color: 'var(--color-warning)' }} />
                                            <h5 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-bold)', color: 'var(--color-warning)', margin: 0 }}>
                                                Brief Not Yet Available
                                            </h5>
                                        </div>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                                            The brand will share the campaign brief once it is ready.
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Video Title</p>
                                            <p style={{ color: 'var(--color-text-primary)' }}>{briefVideoTitle || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Primary Focus</p>
                                            <p style={{ color: 'var(--color-text-primary)' }}>{briefPrimaryFocus || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Secondary Focus</p>
                                            <p style={{ color: 'var(--color-text-primary)' }}>{briefSecondaryFocus || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Call to Action</p>
                                            <p style={{ color: 'var(--color-text-primary)' }}>{briefCta || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Dos</p>
                                            <p style={{ color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{briefDos || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Don'ts</p>
                                            <p style={{ color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{briefDonts || '-'}</p>
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Sample Video</p>
                                            {(firstBriefValue('sample_video_url', 'sampleVideoUrl', 'sample_video')) ? (
                                                <a
                                                    href={firstBriefValue('sample_video_url', 'sampleVideoUrl', 'sample_video')}
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
                                )}

                                {/* Brand Script Template Section */}
                                {(briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template) && (
                                    <div style={{ 
                                        marginTop: 'var(--space-6)', 
                                        padding: 'var(--space-4)', 
                                        background: 'var(--color-bg-secondary)', 
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border-subtle)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                            <h5 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                                                Brand Script Template
                                            </h5>
                                            <Button 
                                                size="sm" 
                                                variant="primary"
                                                onClick={() => {
                                                    const submittedScript = briefData?.script_content || campaignData?.script_content || '';
                                                    const template = briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template;
                                                    setScriptContent(submittedScript || template || '');
                                                    setModalType('script');
                                                }}
                                            >
                                                <CheckCircle2 size={16} style={{ marginRight: 'var(--space-2)' }} />
                                                Finalize Script
                                            </Button>
                                        </div>
                                        <div style={{ 
                                            background: 'var(--color-bg-primary)', 
                                            padding: 'var(--space-4)', 
                                            borderRadius: 'var(--radius-sm)',
                                            whiteSpace: 'pre-wrap',
                                            fontFamily: 'monospace',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--color-text-primary)',
                                            border: '1px solid var(--color-border)',
                                            maxHeight: '300px',
                                            overflow: 'auto'
                                        }}>
                                            {briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template}
                                        </div>
                                        <p style={{ 
                                            marginTop: 'var(--space-2)', 
                                            fontSize: 'var(--text-xs)', 
                                            color: 'var(--color-text-tertiary)',
                                            fontStyle: 'italic'
                                        }}>
                                            Review the script template above and click "Finalize Script" to confirm and submit it.
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* Inline Script Submission */}
                        {canSubmitScript && (
                            <Card className="content-card">
                                <CardHeader>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <Upload size={20} style={{ color: 'var(--color-accent)' }} />
                                        <h3>Submit Script</h3>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                        {(scriptDeliverableStatus === 'Changes Requested' && brandScriptFeedback) && (
                                            <div style={{
                                                padding: 'var(--space-4)',
                                                background: 'rgba(var(--color-warning-rgb), 0.1)',
                                                border: '1px solid rgba(var(--color-warning-rgb), 0.35)',
                                                borderRadius: 'var(--radius-md)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                                    <MessageSquare size={16} style={{ color: 'var(--color-warning)' }} />
                                                    <span style={{ fontWeight: 'var(--font-semibold)' }}>Brand requested changes</span>
                                                </div>
                                                <p style={{ margin: 0, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                                                    {brandScriptFeedback}
                                                </p>
                                            </div>
                                        )}
                                        <TextArea
                                            label="Script Content"
                                            placeholder="Write your campaign script here..."
                                            rows={8}
                                            value={inlineScriptContent}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInlineScriptContent(e.target.value)}
                                            required
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button onClick={handleInlineScriptSubmit} isLoading={isSubmittingInlineScript}>
                                                Submit Script
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        <Card className="content-card">
                            <CardHeader>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Upload size={20} style={{ color: 'var(--color-accent)' }} />
                                    <h3>Upload Content</h3>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {canUploadContent && (
                                        <>
                                            {isContentChangesRequested && (
                                                <div style={{
                                                    padding: 'var(--space-4)',
                                                    background: 'rgba(251, 191, 36, 0.1)',
                                                    border: '1px solid rgba(251, 191, 36, 0.35)',
                                                    borderRadius: 'var(--radius-md)'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                                        <MessageSquare size={16} style={{ color: 'var(--color-warning)' }} />
                                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>Changes required by brand</span>
                                                    </div>
                                                    <p style={{ margin: 0, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 'var(--text-sm)' }}>
                                                        {brandContentFeedback || 'Your uploaded content needs revision. Please update it and re-upload for review.'}
                                                    </p>
                                                </div>
                                            )}
                                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                                {isContentChangesRequested
                                                    ? 'Please make the requested updates and re-upload your video.'
                                                    : 'Your script is approved. Upload your video for brand review.'}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button onClick={() => setModalType('content')}>
                                                    {isContentChangesRequested ? 'Re-upload Content' : 'Upload Content'}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {isContentUnderBrandReview && (
                                        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                            Your video is uploaded and pending brand review. You can go live only after approval.
                                        </p>
                                    )}
                                    {canGoLive && (
                                        <>
                                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                                Brand approved your content. You can now add your live post link.
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button onClick={() => setModalType('go-live')}>
                                                    Go Live
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {(!canUploadContent && !isContentUnderBrandReview && !canGoLive) && (
                                        <>
                                            {scriptIsNextStep ? (
                                                <>
                                                    <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                                                        Submit your script for brand review first. Upload content unlocks after script approval.
                                                    </p>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => {
                                                                const template = briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template || '';
                                                                const submitted = briefData?.script_content || campaignData?.script_content || '';
                                                                setScriptContent(submitted || template);
                                                                setModalType('script');
                                                            }}
                                                        >
                                                            Submit Script
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : currentWorkflowStatus === 'script_pending' ? (
                                                <p style={{ margin: 0, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                                    Your script is under review. Upload content unlocks after script approval.
                                                </p>
                                            ) : (
                                                <p style={{ margin: 0, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                                    Upload content unlocks after script approval.
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Negotiation Status Card */}
                        {negotiationStatus && (
                            <Card className="content-card" style={{ maxWidth: '440px', alignSelf: 'flex-start' }}>
                                <CardHeader>
                                    <h3>Negotiation Status</h3>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
                                            <span className={`status-badge ${(negotiationStatus.status === 'amount_finalized' || negotiationStatus.status === 'accepted') ? 'status-active' : negotiationStatus.status === 'rejected' ? 'status-error' : 'status-planning'}`}>
                                                {negotiationStatus.status === 'accepted' ? 'Deal Accepted' :
                                                    negotiationStatus.status === 'bid_pending' ? 'Bid Submitted' :
                                                        negotiationStatus.status === 'amount_negotiated' ? 'Negotiating' :
                                                            negotiationStatus.status === 'amount_finalized' ? 'Deal Agreed' :
                                                                negotiationStatus.status === 'rejected' ? 'Declined' :
                                                                    'Pending'}
                                            </span>
                                        </div>
                                        {Number(negotiationStatus?.bid_amount) > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: 'var(--color-text-secondary)' }}>Your Proposal</span>
                                                <span style={{ fontWeight: 'var(--font-bold)' }}>{formatINR(negotiationStatus.bid_amount)}</span>
                                            </div>
                                        )}
                                        {Number(negotiationStatus?.final_amount) > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: 'var(--color-text-secondary)' }}>Brand's Proposal</span>
                                                <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>{formatINR(negotiationStatus.final_amount)}</span>
                                            </div>
                                        )}
                                        {/* Show Accept Deal / Decline / Update Bid only when not yet accepted by brand (not accepted and not amount_finalized) */}
                                        {(negotiationStatus.status === 'amount_negotiated' || negotiationStatus.status === 'bid_pending') && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                                {Number(negotiationStatus?.final_amount) > 0 && (
                                                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                                        <Button onClick={() => setModalType('accept-deal')} fullWidth variant="primary">
                                                            Accept Deal
                                                        </Button>
                                                        <Button
                                                            onClick={() => setModalType('reject-deal')}
                                                            fullWidth
                                                            variant="outline"
                                                            style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                                                        >
                                                            Decline
                                                        </Button>
                                                    </div>
                                                )}
                                                <Button onClick={() => setModalType('negotiate')} fullWidth variant={Number(negotiationStatus?.final_amount) > 0 ? "secondary" : "primary"}>
                                                    {negotiationStatus.bid_amount ? 'Update Bid' : 'Make an Offer'}
                                                </Button>
                                            </div>
                                        )}
                                        {/* Show start/update negotiation button if no brand proposal yet */}
                                        {(Number(negotiationStatus?.final_amount) <= 0) &&
                                            (negotiationStatus.status === 'bid_pending' || negotiationStatus.status === 'amount_negotiated' || !negotiationStatus.status) && (
                                                <Button onClick={() => setModalType('negotiate')} fullWidth variant="secondary">
                                                    {negotiationStatus.bid_amount && negotiationStatus.bid_amount > 0 ? 'Update Proposal' : 'Start Negotiation'}
                                                </Button>
                                            )}
                                        {/* Show deal accepted/finalized message when brand has accepted (accepted or amount_finalized) */}
                                        {(negotiationStatus.status === 'amount_finalized' || negotiationStatus.status === 'accepted') && (
                                            <div style={{
                                                padding: 'var(--space-3)',
                                                background: 'rgba(34, 197, 94, 0.1)',
                                                borderRadius: 'var(--radius-md)',
                                                textAlign: 'center'
                                            }}>
                                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                                                    {negotiationStatus.status === 'amount_finalized' ? 'Deal Finalized' : 'Deal Accepted'}
                                                </p>
                                                {Number(negotiationStatus?.final_amount) > 0 && (
                                                    <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>
                                                        {formatINR(negotiationStatus.final_amount)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* Deliverables Checklist */}
                        <Card className="content-card">
                            <CardHeader>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Clock size={20} style={{ color: 'var(--color-warning)' }} />
                                    <h3>My Deliverables</h3>
                                </div>
                            </CardHeader>
                            <CardBody className="no-padding">
                                <div className="table-responsive">
                                    <table className="creators-table">
                                        <thead>
                                            <tr>
                                                <th>Task</th>
                                                <th>Deadline</th>
                                                <th>Status</th>
                                                <th style={{ textAlign: 'right' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { name: 'Concept & Script Submission', date: 'Mar 15, 2026', status: scriptDeliverableStatus, type: 'script' },
                                                { name: 'Instagram Reel - Outdoor Shoot', date: 'Mar 18, 2026', status: 'Pending', type: 'content' },
                                                { name: 'Instagram Story - Behind the scenes', date: 'Mar 19, 2026', status: 'Upcoming', type: 'content' },
                                                { name: 'Final Post Submission', date: 'Mar 22, 2026', status: 'Upcoming', type: 'content' }
                                            ].map((task, i) => (
                                                <tr key={i}>
                                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{task.name}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                                            <Calendar size={14} />
                                                            {task.date}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${task.status === 'Completed' || task.status === 'Accepted' ? 'status-active' :
                                                            task.status === 'Pending' || task.status === 'Changes Requested' ? 'status-content-review' :
                                                                task.status === 'In Review' ? 'status-planning' :
                                                                'status-planning'
                                                            }`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {(task.type !== 'script' || (task.status !== 'Accepted' && task.status !== 'In Review')) &&
                                                            (task.type !== 'content' || canUploadContent) && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setModalType(task.type as any)}
                                                            >
                                                                {task.type === 'script' ? 'Submit' : 'Upload'}
                                                                <ChevronRight size={14} />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Column: Mini Stats & Action Center */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        {/* Script Review Status */}
                        {scriptReviewMeta && (
                            <Card className="content-card">
                                <CardHeader>
                                    <h3>Script Review</h3>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                        <span className={`status-badge ${scriptReviewMeta.tone}`} style={{ width: 'fit-content' }}>
                                            {scriptReviewMeta.label}
                                        </span>
                                        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                                            {scriptReviewMeta.message}
                                        </p>
                                        {brandScriptFeedback && (
                                            <div style={{
                                                marginTop: 'var(--space-2)',
                                                padding: 'var(--space-3)',
                                                background: 'var(--color-bg-secondary)',
                                                border: '1px solid var(--color-border-subtle)',
                                                borderRadius: 'var(--radius-md)'
                                            }}>
                                                <p style={{
                                                    margin: 0,
                                                    marginBottom: 'var(--space-1)',
                                                    fontSize: 'var(--text-xs)',
                                                    letterSpacing: '0.04em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--color-text-tertiary)',
                                                    fontWeight: 'var(--font-semibold)'
                                                }}>
                                                    Brand Comment
                                                </p>
                                                <p style={{
                                                    margin: 0,
                                                    color: 'var(--color-text-primary)',
                                                    whiteSpace: 'pre-wrap',
                                                    lineHeight: 1.5,
                                                    fontSize: 'var(--text-sm)'
                                                }}>
                                                    {brandScriptFeedback}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* Campaign Stats */}
                        <Card className="content-card">
                            <CardHeader>
                                <h3>Campaign Details</h3>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Total Budget</span>
                                        <span style={{ fontWeight: 'var(--font-bold)' }}>
                                            {campaignData.total_budget !== undefined && campaignData.total_budget !== null ? formatINR(campaignData.total_budget) : '—'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>CPV</span>
                                        <span style={{ fontWeight: 'var(--font-bold)' }}>
                                            {campaignData.cpv !== undefined && campaignData.cpv !== null ? formatINR(campaignData.cpv) : '—'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Creator Count</span>
                                        <span style={{ fontWeight: 'var(--font-bold)' }}>
                                            {campaignData.creator_count !== undefined && campaignData.creator_count !== null ? campaignData.creator_count : '—'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Description</span>
                                        <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                                            {campaignData.description || '—'}
                                        </span>
                                    </div>
                                    {Array.isArray(campaignData.creator_categories) && campaignData.creator_categories.length > 0 && (
                                        <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', display: 'block', marginBottom: 'var(--space-2)' }}>
                                                Categories
                                            </span>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                                {campaignData.creator_categories.map((cat: string) => (
                                                    <span key={cat} style={{ background: 'var(--color-bg-tertiary)', padding: '4px 10px', borderRadius: '20px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {(!Array.isArray(campaignData.creator_categories) || campaignData.creator_categories.length === 0) && (
                                        <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', display: 'block', marginBottom: 'var(--space-1)' }}>
                                                Categories
                                            </span>
                                            <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>—</span>
                                        </div>
                                    )}
                                    {Number(negotiationStatus?.final_amount) > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Your Deal Amount</span>
                                            <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-success)', fontSize: 'var(--text-lg)' }}>
                                                {formatINR(negotiationStatus.final_amount)}
                                            </span>
                                        </div>
                                    )}
                                    {Number(negotiationStatus?.bid_amount) > 0 && Number(negotiationStatus?.final_amount) <= 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)' }}>
                                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Your Proposal</span>
                                            <span style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
                                                {formatINR(negotiationStatus.bid_amount)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Status Card */}
                        <Card style={{ background: 'linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.1) 0%, transparent 100%)' }}>
                            <CardBody>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                    <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Current Progress</h4>
                                    <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)' }}>
                                        {campaignData.progress || 0}%
                                    </span>
                                </div>
                                <div className="progress-bar" style={{ height: '8px', marginBottom: 'var(--space-4)' }}>
                                    <div className="progress-fill" style={{ width: `${campaignData.progress || 0}%` }}></div>
                                </div>
                                {campaignData.deadline && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-warning)', fontSize: 'var(--text-xs)' }}>
                                        <Clock size={14} />
                                        Deadline: {new Date(campaignData.deadline).toLocaleDateString()}
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* Payout Details */}
                        <Card>
                            <CardHeader>
                                <h3>Payment Schedule</h3>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Milestone 1 (Script)</span>
                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>₹150</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Milestone 2 (Content)</span>
                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>₹350</span>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: 'var(--space-2) 0' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-bold)' }}>Total Contract</span>
                                        <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-success)', fontSize: 'var(--text-xl)' }}>₹500</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Support Card */}
                        <Card className="notice-card" style={{ margin: 0 }}>
                            <CardBody>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                                    <Info size={20} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
                                    <div>
                                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>Need Help?</h4>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                            Read the full creator policy or contact support if you have questions about this campaign.
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Link Campaign Modal */}
                <Modal
                    isOpen={modalType === 'link'}
                    onClose={() => !isLinking && setModalType(null)}
                    title="Link Campaign"
                    subtitle="Link this campaign to your account"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input
                            label="Creator Token (Optional)"
                            placeholder="Token from email invitation"
                            value={creatorToken}
                            onChange={(e) => setCreatorToken(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                            <Button variant="ghost" onClick={() => setModalType(null)} disabled={isLinking}>Cancel</Button>
                            <Button onClick={handleLinkCampaign} isLoading={isLinking}>Link Campaign</Button>
                        </div>
                    </div>
                </Modal>

                {/* Negotiate Modal */}
                <Modal
                    isOpen={modalType === 'negotiate'}
                    onClose={() => !isNegotiating && setModalType(null)}
                    title="Negotiate Deal"
                    subtitle={negotiationStatus?.final_amount ? "Propose a counter-amount" : "Enter your proposed amount"}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {negotiationStatus?.final_amount && (
                            <div style={{
                                padding: 'var(--space-4)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--space-2)'
                            }}>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>
                                    Brand's Proposal
                                </p>
                                <p style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
                                    ₹{negotiationStatus.final_amount.toLocaleString()}
                                </p>
                            </div>
                        )}
                        <Input
                            label="Your Proposed Amount (INR)"
                            type="number"
                            placeholder="5000"
                            value={negotiationAmount}
                            onChange={(e) => setNegotiationAmount(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                        />
                        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                            <Button variant="ghost" onClick={() => setModalType(null)} disabled={isNegotiating}>Cancel</Button>
                            <Button onClick={handleNegotiate} isLoading={isNegotiating} disabled={!negotiationAmount || parseFloat(negotiationAmount) <= 0}>
                                Submit Proposal
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Accept Deal Modal */}
                <Modal
                    isOpen={modalType === 'accept-deal'}
                    onClose={() => !isSubmitting && setModalType(null)}
                    title="Accept Deal"
                    subtitle="Confirm acceptance of the brand's proposal"
                >
                    {!isSuccess ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
                                Are you sure you want to accept the brand's proposed deal?
                            </p>
                            {negotiationStatus?.final_amount && (
                                <div style={{
                                    padding: 'var(--space-6)',
                                    background: 'var(--color-bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                                        Final Amount
                                    </p>
                                    <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>
                                        ₹{negotiationStatus.final_amount.toLocaleString()}
                                    </p>
                                </div>
                            )}
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                                By accepting, you agree to the terms and conditions of this campaign.
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                                <Button variant="ghost" onClick={() => setModalType(null)} disabled={isSubmitting}>Cancel</Button>
                                <Button onClick={handleAcceptDeal} isLoading={isSubmitting} variant="primary">Confirm Acceptance</Button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                                <BadgeCheck size={32} />
                            </div>
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>Deal Accepted!</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>You can now proceed to script submission.</p>
                        </div>
                    )}
                </Modal>

                {/* Reject Deal Modal */}
                <Modal
                    isOpen={modalType === 'reject-deal'}
                    onClose={() => !isSubmitting && setModalType(null)}
                    title="Decline Deal"
                    subtitle="Decline the brand's proposal"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
                            Are you sure you want to decline this deal? This action may end the negotiation for this campaign.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                            <Button variant="ghost" onClick={() => setModalType(null)} disabled={isSubmitting}>Cancel</Button>
                            <Button
                                onClick={handleRejectDeal}
                                isLoading={isSubmitting}
                                variant="outline"
                                style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                            >
                                Decline Deal
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Modals (Integrated for completeness) */}
                <Modal
                    isOpen={modalType === 'script' || modalType === 'content'}
                    onClose={() => !isSubmitting && setModalType(null)}
                    title={modalType === 'script' ? 'Finalize Script' : 'Upload Content'}
                    size="md"
                >
                    {!isSuccess ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                            {modalType === 'script' ? (
                                <>
                                    {(briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template) && (
                                        <div style={{ 
                                            padding: 'var(--space-3)', 
                                            background: 'var(--color-bg-secondary)', 
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--color-border-subtle)',
                                            marginBottom: 'var(--space-2)'
                                        }}>
                                            <p style={{ 
                                                fontSize: 'var(--text-xs)', 
                                                color: 'var(--color-text-tertiary)',
                                                marginBottom: 'var(--space-2)',
                                                fontWeight: 'var(--font-semibold)'
                                            }}>
                                                Brand Script Template:
                                            </p>
                                            <div style={{ 
                                                background: 'var(--color-bg-primary)', 
                                                padding: 'var(--space-3)', 
                                                borderRadius: 'var(--radius-sm)',
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: 'monospace',
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--color-text-primary)',
                                                border: '1px solid var(--color-border)',
                                                maxHeight: '200px',
                                                overflow: 'auto'
                                            }}>
                                                {briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template}
                                            </div>
                                        </div>
                                    )}
                                    <TextArea
                                        label={(briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template) 
                                            ? "Review and Edit Script (if needed)" 
                                            : "Script Content"}
                                        placeholder={(briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template)
                                            ? "Review the brand template above and make any edits if needed..."
                                            : "Write your campaign script here..."}
                                        rows={10}
                                        value={scriptContent}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScriptContent(e.target.value)}
                                        required
                                    />
                                    {(briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template) && (
                                        <p style={{ 
                                            fontSize: 'var(--text-xs)', 
                                            color: 'var(--color-text-tertiary)',
                                            fontStyle: 'italic'
                                        }}>
                                            The brand script template is pre-filled. Review it and click "Finalize Script" to confirm and submit.
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    {isContentChangesRequested && (
                                        <div style={{
                                            padding: 'var(--space-3)',
                                            background: 'rgba(251, 191, 36, 0.1)',
                                            border: '1px solid rgba(251, 191, 36, 0.35)',
                                            borderRadius: 'var(--radius-md)'
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                marginBottom: 'var(--space-1)',
                                                fontSize: 'var(--text-xs)',
                                                letterSpacing: '0.04em',
                                                textTransform: 'uppercase',
                                                color: 'var(--color-text-tertiary)',
                                                fontWeight: 'var(--font-semibold)'
                                            }}>
                                                Required changes
                                            </p>
                                            <p style={{
                                                margin: 0,
                                                color: 'var(--color-text-primary)',
                                                whiteSpace: 'pre-wrap',
                                                lineHeight: 1.5,
                                                fontSize: 'var(--text-sm)'
                                            }}>
                                                {brandContentFeedback || 'Brand requested content changes. Update your video and upload again.'}
                                            </p>
                                        </div>
                                    )}
                                    <FileUpload
                                        accept="video/*"
                                        maxSize={100}
                                        onFileSelect={(files: File[]) => setContentFiles(files)}
                                        label="Upload Content Video"
                                        description="Upload the video file for this campaign"
                                    />
                                    <Input
                                        label="Content Link (Optional)"
                                        placeholder="https://instagram.com/p/..."
                                        value={contentLink}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContentLink(e.target.value)}
                                    />
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
                                <Button variant="ghost" onClick={() => setModalType(null)} disabled={isSubmitting}>Cancel</Button>
                                <Button onClick={handleAction} isLoading={isSubmitting} disabled={modalType === 'content' && contentFiles.length === 0}>
                                    {modalType === 'script' ? 'Finalize Script' : 'Submit'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: 'var(--space-8) 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-4)' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
                                <CheckCircle2 size={40} />
                            </div>
                            <h3>Submission Successful!</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>Your submission has been sent to the brand for review.</p>
                        </div>
                    )}
                </Modal>

                <Modal
                    isOpen={modalType === 'go-live'}
                    onClose={() => !isSubmitting && setModalType(null)}
                    title="Go Live"
                    subtitle="Submit your published reel/post link"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input
                            label="Live Post Link"
                            placeholder="https://instagram.com/reel/..."
                            value={liveLink}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLiveLink(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
                            <Button variant="ghost" onClick={() => setModalType(null)} disabled={isSubmitting}>Cancel</Button>
                            <Button onClick={handleGoLive} isLoading={isSubmitting} disabled={!liveLink.trim()}>
                                Mark as Live
                            </Button>
                        </div>
                    </div>
                </Modal>
            </main >
        </div >
    );
};
