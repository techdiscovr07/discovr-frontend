import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { creatorApi } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';

export const useCreatorCampaignDetails = () => {
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
    const [isLoading, setIsLoading] = useState(true);

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

    const contentDeliverableStatus = (() => {
        if (currentWorkflowStatus === 'content_live') return 'Completed';
        if (currentWorkflowStatus === 'content_approved') return 'Accepted';
        if (isContentUnderBrandReview) return 'In Review';
        if (isContentChangesRequested) return 'Changes Requested';
        if (canUploadContent) return 'Pending';
        return 'Pending';
    })();

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
        const merged = { ...(base || {}), ...(extra || {}) };
        merged.id = merged.id || merged._id || merged.campaign_id;
        merged.brand =
            merged.brand ||
            merged.brand_name ||
            merged.brandName ||
            merged.brand_company ||
            'Partner Brand';
        if (merged.creator_categories && !Array.isArray(merged.creator_categories)) {
            merged.creator_categories = [String(merged.creator_categories)];
        }
        if (!merged.creator_categories) merged.creator_categories = [];
        return merged;
    };

    const fetchCampaignData = async (isSilent = false) => {
        if (!id) return;
        if (!isSilent) setIsLoading(true);
        try {
            // Fetch everything in parallel for maximum speed
            const [briefResult, negotiationResult] = await Promise.allSettled([
                creatorApi.getCampaignBrief(id),
                creatorApi.getBidStatus(id)
            ]);

            if (negotiationResult.status === 'fulfilled') {
                setNegotiationStatus(negotiationResult.value);
            }

            if (briefResult.status === 'fulfilled' && briefResult.value) {
                const brief = briefResult.value;
                setBriefData(brief);
                const briefCampaign = brief.campaign || brief;
                const merged = normalizeCampaign(null, briefCampaign);

                const bc = briefCampaign || {};
                const pick = (...vals: any[]) => vals.find(v => v !== null && v !== undefined && v !== '') ?? undefined;

                const finalCampaignData = {
                    ...merged,
                    status: pick(brief.status, merged.status, 'Active'),
                    brand: pick(bc.brand_name, brief.brand_name, merged.brand, 'Partner Brand'),
                    video_title: pick(bc.video_title, brief.video_title, merged.video_title),
                    primary_focus: pick(bc.primary_focus, brief.primary_focus, merged.primary_focus),
                    secondary_focus: pick(bc.secondary_focus, brief.secondary_focus, merged.secondary_focus),
                    dos: pick(bc.dos, brief.dos, merged.dos),
                    donts: pick(bc.donts, brief.donts, merged.donts),
                    cta: pick(bc.cta, brief.cta, bc.call_to_action, brief.call_to_action, merged.cta),
                    brief_completed: pick(bc.brief_completed, brief.brief_completed, merged.brief_completed),
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
            }
        } catch (error) {
            console.error('Failed to fetch campaign data:', error);
            if (!isSilent) showToast('Failed to load campaign details. Please try again.', 'error');
        } finally {
            if (!isSilent) setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = searchParams.get('token');
        if (token && id) {
            setCreatorToken(token);
            setModalType('link');
        }

        fetchCampaignData();

        // Background polling for "real-time" updates every 10 seconds
        const intervalId = setInterval(() => {
            fetchCampaignData(true);
        }, 10000);

        return () => clearInterval(intervalId);
    }, [id, searchParams]);

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
            await fetchCampaignData(true);
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
            await fetchCampaignData(true);
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
            await fetchCampaignData(true);

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
            await fetchCampaignData(true);
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

                const finalAmount =
                    negotiationStatus?.final_amount ||
                    campaignData?.final_amount ||
                    briefData?.final_amount ||
                    briefData?.campaign?.final_amount;
                const hasFinalAmount = finalAmount && Number(finalAmount) > 0;

                const negotiationStatusValue =
                    negotiationStatus?.status ||
                    campaignData?.negotiation_status ||
                    briefData?.status;

                const isDealFinalizedValue =
                    hasFinalAmount ||
                    negotiationStatusValue === 'accepted' ||
                    negotiationStatusValue === 'amount_finalized' ||
                    negotiationStatus?.status === 'accepted' ||
                    negotiationStatus?.status === 'amount_finalized' ||
                    currentWorkflowStatus === 'accepted' ||
                    currentWorkflowStatus === 'amount_finalized';
                const isRevisionRequested = scriptNeedsRevision;

                if (!isDealFinalizedValue && !isRevisionRequested) {
                    showToast('Submit script only after amount is finalized or when revision is requested', 'error');
                    setIsSubmitting(false);
                    return;
                }

                const finalScript = scriptContent || briefData?.campaign?.script_template || briefData?.script_template || campaignData?.script_template || '';
                await creatorApi.uploadScript(id, finalScript);
                showToast('Script finalized and submitted successfully!', 'success');
            } else if (modalType === 'content') {
                if (contentFiles.length === 0 && !contentLink.trim()) {
                    showToast('Please upload a video file or provide a content link.', 'error');
                    setIsSubmitting(false);
                    return;
                }
                await creatorApi.uploadContent(id, contentFiles[0], contentLink);
                showToast('Content submitted successfully! Waiting for brand review.', 'success');
            }
            setIsSuccess(true);

            await fetchCampaignData(true);

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

            await fetchCampaignData(true);
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

        const finalAmount =
            negotiationStatus?.final_amount ||
            campaignData?.final_amount ||
            briefData?.final_amount ||
            briefData?.campaign?.final_amount;
        const hasFinalAmount = finalAmount && Number(finalAmount) > 0;

        const negotiationStatusValue =
            negotiationStatus?.status ||
            campaignData?.negotiation_status ||
            briefData?.status;

        const isDealFinalizedValue =
            hasFinalAmount ||
            negotiationStatusValue === 'accepted' ||
            negotiationStatusValue === 'amount_finalized' ||
            negotiationStatus?.status === 'accepted' ||
            negotiationStatus?.status === 'amount_finalized' ||
            currentWorkflowStatus === 'accepted' ||
            currentWorkflowStatus === 'amount_finalized';
        const isRevisionRequested = scriptNeedsRevision;

        if (!isDealFinalizedValue && !isRevisionRequested) {
            showToast('Submit script only after amount is finalized or when revision is requested', 'error');
            return;
        }

        setIsSubmittingInlineScript(true);
        try {
            await creatorApi.uploadScript(id, finalScript);
            showToast('Script submitted successfully!', 'success');

            await fetchCampaignData(true);
        } catch (error: any) {
            console.error('Failed to submit script:', error);
            const errorMessage = error.message || 'Failed to submit script';
            if (errorMessage.includes('amount is finalized') || errorMessage.includes('revision is requested')) {
                showToast('Unable to submit: Please ensure the deal amount is finalized by the brand before submitting your script.', 'error');
            } else {
                showToast(errorMessage, 'error');
            }
        } finally {
            setIsSubmittingInlineScript(false);
        }
    };

    const contextValue = {
        id,
        navigate,
        hasAnyBriefDetails, briefVideoTitle, briefPrimaryFocus, briefSecondaryFocus, briefCta,
        briefDos, briefDonts, firstBriefValue, briefData, campaignData, setScriptContent,
        setModalType, canSubmitScript, scriptDeliverableStatus, brandScriptFeedback,
        inlineScriptContent, setInlineScriptContent, handleInlineScriptSubmit,
        isSubmittingInlineScript, canUploadContent, isContentChangesRequested,
        contentDeliverableStatus,
        brandContentFeedback, isContentUnderBrandReview, canGoLive, scriptIsNextStep,
        currentWorkflowStatus, negotiationStatus, isBrandAcceptedCreatorOffer,
        negotiationStatusKey, brandOfferAmount, formatINR, scriptReviewMeta,
        modalType, isLinking, creatorToken, setCreatorToken, handleLinkCampaign,
        isNegotiating, negotiationAmount, setNegotiationAmount, handleNegotiate,
        isSubmitting, isSuccess, handleAcceptDeal, handleRejectDeal,
        scriptContent, contentFiles, setContentFiles, contentLink, setContentLink, handleAction,
        liveLink, setLiveLink, handleGoLive, isLoading
    };

    return contextValue;
};
