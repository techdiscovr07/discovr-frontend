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
    Edit
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
        cta: ''
    });
    const [sampleVideoFiles, setSampleVideoFiles] = useState<File[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'creators' | 'bids' | 'scripts' | 'content'>('overview');
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

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await brandApi.getCampaigns() as any;
                // Handle both array response and object {campaigns: []} response
                const campaigns = Array.isArray(response) ? response : (response?.campaigns || []);
                const found = campaigns.find((c: any) => c.id === id);
                if (found) {
                    setCampaign(found);
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
                        setBids(Array.isArray(bidsData) ? bidsData : (bidsData?.bids || []));
                        break;
                    case 'scripts':
                        const scriptsData: any = await brandApi.getCreatorScripts(id);
                        setScripts(Array.isArray(scriptsData) ? scriptsData : (scriptsData?.scripts || []));
                        break;
                    case 'content':
                        const contentData: any = await brandApi.getCreatorContent(id);
                        setContent(Array.isArray(contentData) ? contentData : (contentData?.content || []));
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
            showToast('Creator amounts finalized successfully!', 'success');
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
            await brandApi.reviewCreatorScript(id, creatorId, status, feedback);
            showToast(`Script ${status} successfully!`, 'success');
            // Refresh scripts
            const scriptsData: any = await brandApi.getCreatorScripts(id);
            setScripts(Array.isArray(scriptsData) ? scriptsData : (scriptsData?.scripts || []));
        } catch (error: any) {
            console.error('Failed to review script:', error);
            showToast(error.message || 'Failed to review script', 'error');
        }
    };





    const handleReviewContent = async (creatorId: string, status: 'approved' | 'rejected' | 'revision_requested', feedback?: string) => {
        if (!id) return;
        try {
            await brandApi.reviewCreatorContent(id, [{
                creator_id: creatorId,
                status,
                feedback
            }]);
            showToast(`Content ${status} successfully!`, 'success');
            // Refresh content
            const contentData: any = await brandApi.getCreatorContent(id);
            setContent(Array.isArray(contentData) ? contentData : (contentData?.content || []));
        } catch (error: any) {
            console.error('Failed to review content:', error);
            showToast(error.message || 'Failed to review content', 'error');
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
            if (sampleVideoFiles.length > 0) {
                formData.append('sample_video', sampleVideoFiles[0]);
            }

            await brandApi.uploadBrief(formData);
            showToast('Campaign brief uploaded successfully!', 'success');
            setIsBriefModalOpen(false);
            // Refresh
            const data = await brandApi.getCampaigns() as any[];
            setCampaign(data.find(c => c.id === id));
        } catch (error: any) {
            console.error('Failed to upload brief:', error);
            showToast(error.message || 'Failed to upload brief', 'error');
        } finally {
            setIsSubmittingBrief(false);
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
                        <Button variant="ghost" onClick={() => setIsBriefModalOpen(true)}>
                            <FileText size={18} />
                            {campaignData.brief_completed ? 'Update Brief' : 'Complete Brief'}
                        </Button>

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
                    {(campaignData.review_status === 'negotiation' || campaignData.review_status === 'creators_are_final') && (
                        <Button
                            variant={activeTab === 'bids' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('bids')}
                        >
                            Negotiation
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creators.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
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
                                                        <span className={`status-badge ${creator.status === 'accepted' ? 'status-active' : 'status-planning'}`}>
                                                            {creator.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td>₹{creator.amount || creator.final_amount || '0'}</td>
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
                                            <th>Notes</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bids.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
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
                                                            <span style={{ color: 'var(--color-text-tertiary)' }}>Not proposed</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${bid.status === 'accepted' ? 'status-active' : bid.status === 'rejected' ? 'status-error' : 'status-planning'}`}>
                                                            {bid.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td>{bid.notes || '-'}</td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {bid.status === 'pending' && (
                                                            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm"
                                                                    onClick={async () => {
                                                                        const creatorId = bid.creator_id || bid.id;
                                                                        if (!creatorId) {
                                                                            showToast('Creator ID not found', 'error');
                                                                            return;
                                                                        }
                                                                        try {
                                                                            await brandApi.respondToCreatorBid(id, creatorId, 'accept');
                                                                            showToast('Negotiation accepted', 'success');
                                                                            // Refresh bids
                                                                            const bidsData: any = await brandApi.getCreatorBids(id);
                                                                            setBids(Array.isArray(bidsData) ? bidsData : (bidsData?.bids || []));
                                                                        } catch (error: any) {
                                                                            showToast(error.message || 'Failed to accept negotiation', 'error');
                                                                        }
                                                                    }}
                                                                >
                                                                    Accept
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm"
                                                                    onClick={async () => {
                                                                        const creatorId = bid.creator_id || bid.id;
                                                                        if (!creatorId) {
                                                                            showToast('Creator ID not found', 'error');
                                                                            return;
                                                                        }
                                                                        try {
                                                                            await brandApi.respondToCreatorBid(id, creatorId, 'reject');
                                                                            showToast('Negotiation rejected', 'success');
                                                                            // Refresh bids
                                                                            const bidsData: any = await brandApi.getCreatorBids(id);
                                                                            setBids(Array.isArray(bidsData) ? bidsData : (bidsData?.bids || []));
                                                                        } catch (error: any) {
                                                                            showToast(error.message || 'Failed to reject negotiation', 'error');
                                                                        }
                                                                    }}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        )}
                                                        {bid.status !== 'pending' && (
                                                            <Button variant="ghost" size="sm">
                                                                <Eye size={16} />
                                                                View
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

                {activeTab === 'scripts' && (
                    <Card className="content-card">
                        <CardHeader>
                            <div className="card-header-content">
                                <h3>Creator Scripts ({scripts.length})</h3>
                            </div>
                        </CardHeader>
                        <CardBody className="no-padding">
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
                                                        <span className={`status-badge ${script.status === 'approved' ? 'status-active' : script.status === 'rejected' ? 'status-error' : 'status-planning'}`}>
                                                            {script.status || 'Pending Review'}
                                                        </span>
                                                    </td>
                                                    <td>{script.submitted_at || script.created_at || '-'}</td>
                                                    <td style={{ textAlign: 'right', display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                                        <Button variant="ghost" size="sm" onClick={() => handleReviewScript(script.creator_id || script.id, 'approved')}>
                                                            ✓ Approve
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleReviewScript(script.creator_id || script.id, 'rejected')}>
                                                            ✗ Reject
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
                                                        {item.content_url ? (
                                                            <a href={item.content_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                                                                View Content
                                                            </a>
                                                        ) : (
                                                            item.content || '-'
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${item.status === 'approved' ? 'status-active' : item.status === 'rejected' ? 'status-error' : 'status-planning'}`}>
                                                            {item.status || 'Pending Review'}
                                                        </span>
                                                    </td>
                                                    <td>{item.submitted_at || item.created_at || '-'}</td>
                                                    <td style={{ textAlign: 'right', display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                                        <Button variant="ghost" size="sm" onClick={() => handleReviewContent(item.creator_id || item.id, 'approved')}>
                                                            ✓ Approve
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleReviewContent(item.creator_id || item.id, 'rejected')}>
                                                            ✗ Reject
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
            </main>
        </div>
    );
};
