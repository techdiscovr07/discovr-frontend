import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, LoadingSpinner, Card, CardBody } from '../../../components';
import {
    Users,
    IndianRupee,
    Calendar
} from 'lucide-react';
import { brandApi } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';
import brandDashboardData from '../../../data/brandDashboard.json';

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
    const { showToast } = useToast();
    const [internalModalOpen, setInternalModalOpen] = useState(false);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use external modal state if provided, otherwise use internal state
    const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;


    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const data = await brandApi.getCampaigns() as any;
            // Handle both array response and object {campaigns: []} response
            if (Array.isArray(data)) {
                setCampaigns(data);
            } else if (data && Array.isArray(data.campaigns)) {
                setCampaigns(data.campaigns);
            } else {
                setCampaigns(brandDashboardData.campaigns || []);
            }
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
            // Fallback to mock data for demo
            setCampaigns(brandDashboardData.campaigns || []);
        } finally {
            setIsLoading(false);
        }
    };

    const parseCurrency = (val: any): number => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
            return parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
        }
        return 0;
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleModalClose = () => {
        if (onModalClose) {
            onModalClose();
        } else {
            setInternalModalOpen(false);
        }
    };
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        budget: '',
        startDate: '',
        endDate: '',
        targetCreators: '',
        platform: 'Instagram',
        contentType: 'Posts',
        requirements: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await brandApi.createCampaign({
                ...formData,
                budget: parseFloat(formData.budget),
                targetCreators: parseInt(formData.targetCreators)
            });
            handleModalClose();
            showToast('Campaign created successfully!', 'success');
            fetchCampaigns(); // Refresh list
            // Reset form
            setFormData({
                name: '',
                description: '',
                budget: '',
                startDate: '',
                endDate: '',
                targetCreators: '',
                platform: 'Instagram',
                contentType: 'Posts',
                requirements: ''
            });
        } catch (error: any) {
            console.error('Failed to create campaign:', error);
            showToast(error.message || 'Failed to create campaign. Please try again.', 'error');
            handleModalClose();
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

    const getStatusColor = (status: string) => {
        const statusMap: Record<string, string> = {
            'Active': 'status-active',
            'Bidding': 'status-bidding',
            'Content Review': 'status-content-review',
            'Planning': 'status-planning',
            'Completed': 'status-completed',
            'Awaiting Brief': 'status-planning'
        };
        return statusMap[status] || 'status-default';
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
                            <label htmlFor="name">Campaign Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Summer Collection Launch"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your campaign goals and objectives..."
                                rows={4}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="platform">Platform *</label>
                                <select
                                    id="platform"
                                    name="platform"
                                    value={formData.platform}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    disabled
                                >
                                    <option value="Instagram">Instagram</option>
                                </select>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                                    Currently focusing on Instagram campaigns only.
                                </p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="contentType">Content Type *</label>
                                <select
                                    id="contentType"
                                    name="contentType"
                                    value={formData.contentType}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="Posts">Posts</option>
                                    <option value="Stories">Stories</option>
                                    <option value="Reels">Reels/Videos</option>
                                    <option value="Live">Live Streams</option>
                                    <option value="Mixed">Mixed Content</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Budget & Timeline */}
                    <div className="form-section">
                        <h3 className="form-section-title">Budget & Timeline</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="budget">
                                    <IndianRupee size={16} />
                                    Budget (INR) *
                                </label>
                                <input
                                    type="number"
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="5000"
                                    min="0"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="targetCreators">
                                    <Users size={16} />
                                    Target Creators *
                                </label>
                                <input
                                    type="number"
                                    id="targetCreators"
                                    name="targetCreators"
                                    value={formData.targetCreators}
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
                                <label htmlFor="startDate">
                                    <Calendar size={16} />
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endDate">
                                    <Calendar size={16} />
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="form-section">
                        <h3 className="form-section-title">Content Requirements</h3>

                        <div className="form-group">
                            <label htmlFor="requirements">Requirements & Guidelines</label>
                            <textarea
                                id="requirements"
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                placeholder="List specific requirements, hashtags, mentions, dos and don'ts..."
                                rows={6}
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="form-actions">
                        <Button type="button" variant="ghost" onClick={handleModalClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isSubmitting}>
                            Create Campaign
                        </Button>
                    </div>
                </form>
            </Modal>

            <div className="campaigns-container animate-fade-in">
                {/* Campaigns Grid */}
                <div className="campaigns-grid">
                    {filteredCampaigns.map((campaign) => {
                        const spentNum = parseCurrency(campaign.spent || 0);
                        const budgetNum = parseCurrency(campaign.budget || 0);
                        const progress = budgetNum > 0 ? Math.min((spentNum / budgetNum) * 100, 100) : 0;

                        return (
                            <Card key={campaign.id} className="campaign-list-card">
                                <CardBody>
                                    <div className="campaign-top-bar">
                                        <span className={`status-pill ${getStatusColor(campaign.status)}`}>
                                            {campaign.status}
                                        </span>
                                        <div className="dates-info">
                                            <Calendar size={14} />
                                            <span>{campaign.startDate} - {campaign.endDate}</span>
                                        </div>
                                    </div>

                                    <h3 className="campaign-title-clean">{campaign.name}</h3>

                                    <div className="campaign-progress-section">
                                        <div className="progress-labels">
                                            <span>Budget Spent</span>
                                            <span>{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="clean-progress-bar">
                                            <div
                                                className="clean-progress-fill"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="budget-values">
                                            <strong>₹{spentNum.toLocaleString()}</strong>
                                            <span className="total-budget">of ₹{budgetNum.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="campaign-stats-row-clean">
                                        <div className="mini-stat-clean">
                                            <span className="label">Creators</span>
                                            <span className="value">{campaign.targetCreators || 0}</span>
                                        </div>
                                        <div className="mini-stat-clean">
                                            <span className="label">Engagement</span>
                                            <span className="value">4.2%</span>
                                        </div>
                                    </div>

                                    <div className="campaign-card-actions-clean">
                                        <Button
                                            variant="ghost"
                                            fullWidth
                                            size="sm"
                                            onClick={() => navigate(`/brand/campaign/${campaign.id}`)}
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
