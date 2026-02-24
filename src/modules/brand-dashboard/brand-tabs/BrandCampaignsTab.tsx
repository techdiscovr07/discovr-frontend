import { NewCampaignModal } from '../components/NewCampaignModal';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal, LoadingSpinner, Card, CardBody } from '../../../components';
import {
    Calendar,
    Info,
} from 'lucide-react';
import { brandApi } from '../../../lib/api';

interface BrandCampaignsTabProps {
    searchQuery?: string;
    isModalOpen?: boolean;
    onModalClose?: () => void;
}

export const BrandCampaignsTab: React.FC<BrandCampaignsTabProps> = ({
    searchQuery = '',
    isModalOpen: externalModalOpen,
    onModalClose
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [internalModalOpen, setInternalModalOpen] = useState(false);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);
    const [matchingDialogCampaignName, setMatchingDialogCampaignName] = useState('');

    // Use external modal state if provided, otherwise use internal state
    const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;


    const fetchCampaigns = async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const data = await brandApi.getCampaigns() as any;
            if (Array.isArray(data)) {
                setCampaigns(data);
            } else if (data && Array.isArray(data.campaigns)) {
                setCampaigns(data.campaigns);
            } else {
                setCampaigns([]);
            }
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
            setCampaigns([]);
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    const parseCurrency = (val: any): number => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
            return parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
        }
        return 0;
    };

    const prevPathRef = useRef(location.pathname);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    // Refetch when returning from campaign details so status updates (e.g. after admin uploads creators) are reflected
    useEffect(() => {
        const prev = prevPathRef.current;
        prevPathRef.current = location.pathname;
        if (prev.startsWith('/brand/campaign/') && location.pathname === '/brand/dashboard') {
            fetchCampaigns(true);
        }
    }, [location.pathname]);

    const handleModalClose = () => {
        if (onModalClose) {
            onModalClose();
        } else {
            setInternalModalOpen(false);
        }
    };

    const normalizeStatus = (status: any) =>
        String(status || '')
            .toLowerCase()
            .replace(/\s+/g, '_');

    const isCreatorMatchingInProgress = (campaign: any) => {
        const status = normalizeStatus(campaign?.status);
        return status === 'awaiting_creators' || status === 'creator_review';
    };

    /** True when admin has uploaded creators and brand should review (creator_review). */
    const hasCreatorsShortlisted = (campaign: any) =>
        normalizeStatus(campaign?.status) === 'creator_review';

    const openMatchingDialog = (campaignName: string) => {
        setMatchingDialogCampaignName(campaignName || 'this campaign');
        setIsMatchingDialogOpen(true);
    };

    const getStatusColor = (status: string) => {
        const normalized = normalizeStatus(status);
        const statusMap: Record<string, string> = {
            active: 'status-active',
            pending: 'status-pending',
            negotiate: 'status-negotiation',
            content_review: 'status-content',
            planning: 'status-planning',
            completed: 'status-completed',
            awaiting_creators: 'status-awaiting',
            creator_review: 'status-review',
            creator_negotiation: 'status-negotiation',
            brief_pending: 'status-brief',
            script_review: 'status-script'
        };
        return statusMap[normalized] || 'status-planning';
    };

    const getStatusLabel = (status: string) => {
        const normalized = normalizeStatus(status);
        const labels: Record<string, string> = {
            pending: 'Pending for Approval',
            awaiting_creators: 'Awaiting Creators',
            creator_review: 'Creator Review',
            creator_negotiation: 'Creator Negotiation',
            brief_pending: 'Brief Pending',
            script_review: 'Script Review',
            content_review: 'Content Review',
            completed: 'Completed'
        };
        return labels[normalized] || status;
    };

    const filteredCampaigns = useMemo(() => {
        const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
        return safeCampaigns.filter(campaign =>
            campaign.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.status?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [campaigns, searchQuery]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>


            <NewCampaignModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={(campaignName) => {
                    openMatchingDialog(campaignName);
                    fetchCampaigns();
                }}
            />

            <Modal
                isOpen={isMatchingDialogOpen}
                onClose={() => setIsMatchingDialogOpen(false)}
                title="Campaign created successfully"
                subtitle="Creator matching in progress"
                size="md"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="campaign-matching-dialog-note">
                        <p style={{ margin: 0, color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                            Our AI is currently analyzing thousands of profiles to find creators
                            perfectly aligned with your campaign requirements.
                            We are matching the best creators for <strong>{matchingDialogCampaignName}</strong>.
                        </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setIsMatchingDialogOpen(false)}>
                            Got it
                        </Button>
                    </div>
                </div>
            </Modal>

            <div className="campaigns-container animate-fade-in">
                {/* Campaigns Grid */}
                <div className="campaigns-grid">
                    {filteredCampaigns.map((campaign) => {
                        const budgetNum = parseCurrency(campaign.total_budget ?? campaign.budget ?? 0);
                        const cpvNum = parseCurrency(campaign.cpv ?? 0);
                        const goLive =
                            campaign.go_live_date
                                ? new Date(campaign.go_live_date).toLocaleDateString()
                                : (campaign.startDate && campaign.endDate ? `${campaign.startDate} - ${campaign.endDate}` : '—');
                        const categories: string[] = Array.isArray(campaign.creator_categories)
                            ? campaign.creator_categories
                            : [];
                        const description: string = campaign.description || '';
                        const isMatching = isCreatorMatchingInProgress(campaign);

                        return (
                            <Card
                                key={campaign.id}
                                className="campaign-list-card"
                                onClick={() => {
                                    if (isMatching && !hasCreatorsShortlisted(campaign)) {
                                        openMatchingDialog(campaign.name);
                                        return;
                                    }
                                    navigate(`/brand/campaign/${campaign.id}`);
                                }}
                            >
                                <CardBody>
                                    <div className="campaign-top-bar">
                                        <span className={`status-pill ${getStatusColor(campaign.status)}`}>
                                            {getStatusLabel(campaign.status)}
                                        </span>
                                        <div className="dates-info">
                                            <Calendar size={14} />
                                            <span>{goLive}</span>
                                        </div>
                                    </div>

                                    <h3 className="campaign-title-clean">{campaign.name}</h3>

                                    {description && (
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5, margin: 'var(--space-3) 0' }}>
                                            {description.length > 120 ? `${description.slice(0, 120)}...` : description}
                                        </p>
                                    )}

                                    {isMatching && (
                                        <div className="campaign-matching-note">
                                            <Info size={14} />
                                            <span>
                                                {hasCreatorsShortlisted(campaign)
                                                    ? 'Creators have been shortlisted. View campaign details to review and proceed.'
                                                    : 'We are finding the best creators for this campaign.'}
                                            </span>
                                        </div>
                                    )}

                                    {categories.length > 0 && (
                                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                                            {categories.slice(0, 4).map((cat) => (
                                                <span
                                                    key={cat}
                                                    style={{
                                                        background: 'var(--color-bg-tertiary)',
                                                        padding: '4px 10px',
                                                        borderRadius: '999px',
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--color-text-secondary)'
                                                    }}
                                                >
                                                    {cat}
                                                </span>
                                            ))}
                                            {categories.length > 4 && (
                                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                                    +{categories.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="campaign-stats-row-clean">
                                        <div className="mini-stat-clean">
                                            <span className="label">Creators</span>
                                            <span className="value">{campaign.creator_count ?? campaign.targetCreators ?? 0}</span>
                                        </div>
                                        <div className="mini-stat-clean">
                                            <span className="label">Budget</span>
                                            <span className="value">₹{budgetNum.toLocaleString()}</span>
                                        </div>
                                        <div className="mini-stat-clean">
                                            <span className="label">CPV</span>
                                            <span className="value">₹{cpvNum.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="campaign-card-actions-clean">
                                        <Button
                                            variant="ghost"
                                            fullWidth
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isMatching && !hasCreatorsShortlisted(campaign)) {
                                                    openMatchingDialog(campaign.name);
                                                    return;
                                                }
                                                navigate(`/brand/campaign/${campaign.id}`);
                                            }}
                                        >
                                            View Campaign Details
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
