import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal, LoadingSpinner, Card, CardBody } from '../../../components';
import {
    Users,
    IndianRupee,
    Calendar,
    Users2,
    Tag,
    Info,
    Target,
    Check,
    AlertCircle
} from 'lucide-react';
import { brandApi } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';

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
    const { showToast } = useToast();
    const [internalModalOpen, setInternalModalOpen] = useState(false);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    const defaultCategories = [
        'Fashion', 'Beauty', 'Lifestyle', 'Food', 'Travel',
        'Tech', 'Fitness', 'Gaming', 'Education', 'Entertainment'
    ];
    const [availableCategories, setAvailableCategories] = useState<string[]>(defaultCategories);
    const [newCategory, setNewCategory] = useState('');
    const [newCategoryError, setNewCategoryError] = useState('');

    const followerRangeOptions = [
        { label: '1K – 10K', value: '1000-10000', desc: 'Nano' },
        { label: '10K – 50K', value: '10000-50000', desc: 'Micro' },
        { label: '50K – 100K', value: '50000-100000', desc: 'Mid-tier' },
        { label: '100K – 500K', value: '100000-500000', desc: 'Macro' },
        { label: '500K – 1M', value: '500000-1000000', desc: 'Mega' },
        { label: '1M+', value: '1000000-10000000', desc: 'Celebrity' }
    ];

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        totalBudget: '',
        creatorCount: '',
        goLiveDate: '',
        cpv: '',
        creatorCategories: [] as string[],
        platform: 'Instagram',
        contentType: 'Posts',
        requirements: '',
        followerRanges: ['10000-50000'] as string[]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.creatorCategories.length === 0) {
            showToast('Please select at least one creator category', 'error');
            return;
        }

        if (!formData.name.trim() || !formData.description.trim()) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        if (parseFloat(formData.totalBudget) <= 0 || parseInt(formData.creatorCount) <= 0) {
            showToast('Budget and creator count must be greater than 0', 'error');
            return;
        }

        if (parseFloat(formData.cpv) <= 0) {
            showToast('Cost Per View (CPV) must be greater than 0', 'error');
            return;
        }

        if (formData.followerRanges.length === 0) {
            showToast('Please select at least one follower range', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const campaignData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                creator_categories: formData.creatorCategories,
                total_budget: parseFloat(formData.totalBudget),
                creator_count: parseInt(formData.creatorCount),
                go_live_date: formData.goLiveDate,
                cpv: parseFloat(formData.cpv),
                follower_ranges: formData.followerRanges
            };

            const createdCampaign = await brandApi.createCampaign(campaignData) as any;
            handleModalClose();
            showToast('Campaign created successfully', 'success');
            openMatchingDialog(createdCampaign?.name || campaignData.name);
            fetchCampaigns(); // Refresh list
            // Reset form
            setFormData({
                name: '',
                description: '',
                totalBudget: '',
                creatorCount: '',
                goLiveDate: '',
                cpv: '',
                creatorCategories: [],
                platform: 'Instagram',
                contentType: 'Posts',
                requirements: '',
                followerRanges: ['10000-50000']
            });
        } catch (error: any) {
            console.error('Failed to create campaign:', error);
            showToast(error.message || 'Failed to create campaign. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddCategory = () => {
        const category = newCategory.trim();
        if (!category) {
            setNewCategoryError('Enter a category name');
            return;
        }

        const exists = availableCategories.some(
            existing => existing.toLowerCase() === category.toLowerCase()
        );

        if (exists) {
            setNewCategoryError('This category already exists');
            return;
        }

        const normalizedCategory = category
            .split(' ')
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        setAvailableCategories(prev => [...prev, normalizedCategory]);
        setFormData(prev => ({
            ...prev,
            creatorCategories: [...prev.creatorCategories, normalizedCategory]
        }));
        setNewCategory('');
        setNewCategoryError('');
    };

    const getStatusColor = (status: string) => {
        const normalized = normalizeStatus(status);
        const statusMap: Record<string, string> = {
            active: 'status-active',
            negotiate: 'status-negotiate',
            content_review: 'status-content-review',
            planning: 'status-planning',
            completed: 'status-completed',
            awaiting_creators: 'status-planning',
            creator_review: 'status-planning',
            creator_negotiation: 'status-negotiate',
            brief_pending: 'status-planning',
            script_review: 'status-content-review'
        };
        return statusMap[normalized] || 'status-default';
    };

    const getStatusLabel = (status: string) => {
        const normalized = normalizeStatus(status);
        const labels: Record<string, string> = {
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

            {/* New Campaign Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title="Create New Campaign"
                subtitle="Set up your influencer marketing campaign"
                size="xl"
            >
                <form onSubmit={handleSubmit} className="campaign-form">
                    {/* Campaign Details */}
                    <div className="form-section">
                        <h3 className="form-section-title">Campaign Details</h3>

                        <div className="form-group">
                            <label htmlFor="name">
                                Campaign Name *
                                <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>
                                    Give your campaign a memorable name
                                </span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Summer Collection Launch 2024"
                                required
                                className="form-input"
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                Description *
                                <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>
                                    Explain your campaign goals and what you want to achieve
                                </span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your campaign goals, target audience, key messaging, and what success looks like..."
                                rows={4}
                                required
                                className="form-input"
                                maxLength={1000}
                            />
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)', textAlign: 'right' }}>
                                {formData.description.length}/1000 characters
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="creatorCategories">
                                <Tag size={16} style={{ display: 'inline', marginRight: 'var(--space-2)' }} />
                                Creator Categories *
                                <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>
                                    Select categories that match your target creators (multiple selection)
                                </span>
                            </label>
                            <select
                                id="creatorCategories"
                                name="creatorCategories"
                                multiple
                                value={formData.creatorCategories}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData(prev => ({
                                        ...prev,
                                        creatorCategories: selectedOptions
                                    }));
                                }}
                                required
                                className="form-input"
                                style={{
                                    minHeight: '120px',
                                    padding: 'var(--space-3)',
                                    background: 'var(--color-bg-secondary)',
                                    border: formData.creatorCategories.length === 0 ? '1px solid var(--color-error)' : '1px solid var(--color-border)'
                                }}
                                size={availableCategories.length}
                            >
                                {availableCategories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <p style={{
                                marginTop: 'var(--space-2)',
                                fontSize: 'var(--text-xs)',
                                color: 'var(--color-text-tertiary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-1)'
                            }}>
                                <Info size={12} />
                                Hold Ctrl (or Cmd on Mac) to select multiple categories
                            </p>
                            {formData.creatorCategories.length === 0 && (
                                <p style={{
                                    marginTop: 'var(--space-1)',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-error)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-1)'
                                }}>
                                    <Info size={14} />
                                    Please select at least one category
                                </p>
                            )}
                            {formData.creatorCategories.length > 0 && (
                                <p style={{
                                    marginTop: 'var(--space-1)',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-primary)',
                                    fontWeight: 'var(--font-medium)'
                                }}>
                                    {formData.creatorCategories.length} categor{formData.creatorCategories.length === 1 ? 'y' : 'ies'} selected: {formData.creatorCategories.join(', ')}
                                </p>
                            )}
                            <div className="category-add-row">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => {
                                        setNewCategory(e.target.value);
                                        if (newCategoryError) setNewCategoryError('');
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCategory();
                                        }
                                    }}
                                    placeholder="Add your own category (e.g., Finance)"
                                    className="form-input"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleAddCategory}
                                >
                                    Add Category
                                </Button>
                            </div>
                            {newCategoryError && (
                                <p className="category-add-error">{newCategoryError}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <Users2 size={16} />
                                Follower Range *
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>
                                    Select one or more target creator tiers
                                </span>
                            </label>
                            <div className="ncf-range-options">
                                {followerRangeOptions.map(opt => {
                                    const isActive = formData.followerRanges.includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`ncf-range-option ${isActive ? 'ncf-range-option--active' : ''}`}
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                followerRanges: prev.followerRanges.includes(opt.value)
                                                    ? prev.followerRanges.filter(v => v !== opt.value)
                                                    : [...prev.followerRanges, opt.value]
                                            }))}
                                        >
                                            <span className="ncf-range-option-label">{opt.label}</span>
                                            <span className="ncf-range-option-desc">{opt.desc}</span>
                                            {isActive && <Check size={14} className="ncf-range-option-check" />}
                                        </button>
                                    );
                                })}
                            </div>
                            {formData.followerRanges.length === 0 && (
                                <p style={{
                                    marginTop: 'var(--space-1)',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-error)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-1)'
                                }}>
                                    <AlertCircle size={14} />
                                    Please select at least one range
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Budget & Timeline */}
                    <div className="form-section">
                        <h3 className="form-section-title">Budget & Timeline</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="totalBudget">
                                    <IndianRupee size={16} />
                                    Total Budget (INR) *
                                    <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>
                                        Total amount allocated for this campaign
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    id="totalBudget"
                                    name="totalBudget"
                                    value={formData.totalBudget}
                                    onChange={handleChange}
                                    placeholder="50000"
                                    min="0"
                                    step="0.01"
                                    required
                                    className="form-input"
                                />
                                {formData.totalBudget && parseFloat(formData.totalBudget) > 0 && formData.creatorCount && parseInt(formData.creatorCount) > 0 && (
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                                        ≈ ₹{Math.round(parseFloat(formData.totalBudget) / parseInt(formData.creatorCount)).toLocaleString()} per creator
                                    </p>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="creatorCount">
                                    <Users size={16} />
                                    Number of Creators *
                                    <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>
                                        How many creators do you want to work with?
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    id="creatorCount"
                                    name="creatorCount"
                                    value={formData.creatorCount}
                                    onChange={handleChange}
                                    placeholder="10"
                                    min="1"
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="goLiveDate">
                                    <Calendar size={16} />
                                    Go Live Date *
                                    <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>
                                        When should creators publish content?
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    id="goLiveDate"
                                    name="goLiveDate"
                                    value={formData.goLiveDate}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cpv">
                                    <Target size={16} />
                                    Cost Per View (CPV) *
                                    <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>
                                        Maximum cost per view in INR
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    id="cpv"
                                    name="cpv"
                                    value={formData.cpv}
                                    onChange={handleChange}
                                    placeholder="0.50"
                                    min="0"
                                    step="0.01"
                                    required
                                    className="form-input"
                                />
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                                    The maximum amount you're willing to pay per view
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="form-section">
                        <h3 className="form-section-title">Content Requirements (Optional)</h3>

                        <div className="form-group">
                            <label htmlFor="requirements">
                                Requirements & Guidelines
                                <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>
                                    Add specific requirements, hashtags, mentions, dos and don'ts
                                </span>
                            </label>
                            <textarea
                                id="requirements"
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                placeholder="Example:&#10;- Use hashtags: #Summer2024 #Fashion&#10;- Mention @yourbrand in caption&#10;- Include product link in bio&#10;- Do: Show product in natural settings&#10;- Don't: Use filters that change product colors"
                                rows={6}
                                className="form-input"
                            />
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                                These guidelines will be shared with creators when they join your campaign
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="form-actions" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 'var(--space-4)',
                        borderTop: '1px solid var(--color-border)',
                        marginTop: 'var(--space-4)'
                    }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                            * Required fields
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <Button type="button" variant="ghost" onClick={handleModalClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                disabled={isSubmitting || formData.creatorCategories.length === 0}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Campaign'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>

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
                            We are finding suitable and best candidates for this campaign.
                            Please give us some time. We are matching creators for{' '}
                            <strong>{matchingDialogCampaignName}</strong>.
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
                            <Card key={campaign.id} className="campaign-list-card">
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
                                            onClick={() => {
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
