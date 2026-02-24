import { CreatorCampaignModals } from './components/CreatorCampaignModals';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components';
import {
    ArrowLeft,
    MessageSquare,
    Link as LinkIcon,
} from 'lucide-react';
import { creatorApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { CreatorCampaignProvider } from './CreatorCampaignContext';
import { CreatorCampaignLeftColumn } from './components/CreatorCampaignLeftColumn';
import { CreatorCampaignRightColumn } from './components/CreatorCampaignRightColumn';
import '../../components/DashboardShared.css';
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
    const parseAmount = (value: any): number => {
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
        const cleaned = String(value).replace(/[^0-9.]/g, '');
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    };
    const canUploadContent =
        currentWorkflowStatus === 'script_approved' ||
        currentWorkflowStatus === 'content_rejected' ||
        currentWorkflowStatus === 'content_revision_requested';
    const isContentUnderBrandReview = currentWorkflowStatus === 'content_pending';
    const canGoLive = currentWorkflowStatus === 'content_approved';
    const negotiationStatusKey = String(negotiationStatus?.status || '').toLowerCase();
    const creatorBidAmount = parseAmount(negotiationStatus?.bid_amount) || parseAmount(campaignData?.bid_amount);
    const isBrandAcceptedCreatorOffer = negotiationStatusKey === 'accepted' && creatorBidAmount > 0;
    const brandOfferAmount =
        parseAmount(negotiationStatus?.final_amount) ||
        parseAmount(negotiationStatus?.proposed_amount) ||
        parseAmount(campaignData?.final_amount) ||
        parseAmount(campaignData?.proposed_amount) ||
        parseAmount(campaignData?.amount);
    // Check multiple sources for final_amount
    const finalAmountFromAllSources =
        negotiationStatus?.final_amount ||
        campaignData?.final_amount ||
        briefData?.final_amount ||
        briefData?.campaign?.final_amount;
    const dealIsFinalized =
        (finalAmountFromAllSources && Number(finalAmountFromAllSources) > 0) ||
        isBrandAcceptedCreatorOffer ||
        negotiationStatus?.status === 'amount_finalized' ||
        campaignData?.negotiation_status === 'amount_finalized' ||
        briefData?.status === 'amount_finalized' ||
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

    const contextValue = {
        hasAnyBriefDetails, briefVideoTitle, briefPrimaryFocus, briefSecondaryFocus, briefCta,
        briefDos, briefDonts, firstBriefValue, briefData, campaignData, setScriptContent,
        setModalType, canSubmitScript, scriptDeliverableStatus, brandScriptFeedback,
        inlineScriptContent, setInlineScriptContent, handleInlineScriptSubmit,
        isSubmittingInlineScript, canUploadContent, isContentChangesRequested,
        brandContentFeedback, isContentUnderBrandReview, canGoLive, scriptIsNextStep,
        currentWorkflowStatus, negotiationStatus, isBrandAcceptedCreatorOffer,
        negotiationStatusKey, brandOfferAmount, formatINR, scriptReviewMeta,
        modalType, isLinking, creatorToken, setCreatorToken, handleLinkCampaign,
        isNegotiating, negotiationAmount, setNegotiationAmount, handleNegotiate,
        isSubmitting, isSuccess, handleAcceptDeal, handleRejectDeal,
        scriptContent, contentFiles, setContentFiles, contentLink, setContentLink, handleAction,
        liveLink, setLiveLink, handleGoLive
    };

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
