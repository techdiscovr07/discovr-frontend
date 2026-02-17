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
    FileText
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { brandApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import campaignDetailsData from '../../data/campaignDetails.json';
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

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                // For now, list all and find by ID since we don't have GetCampaignByID endpoint in brandApi yet
                const data = await brandApi.getCampaigns() as any[];
                const found = data.find(c => c.id === id);
                if (found) {
                    setCampaign(found);
                } else {
                    // Fallback to mock
                    setCampaign(campaignDetailsData.campaigns[0]);
                }
            } catch (error) {
                console.error('Failed to fetch campaign:', error);
                setCampaign(campaignDetailsData.campaigns[0]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

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

    if (isLoading) return <LoadingSpinner />;
    if (!campaign) return <div>Campaign not found</div>;

    const campaignData = campaign;

    // Map icon names to actual icons
    const iconMap: Record<string, any> = {
        TrendingUp,
        Eye,
        Users,
        IndianRupee
    };

    // Check if campaign has stats, if not use mock stats structure
    const stats = (campaignData.stats || [
        { label: 'Total Engagement', value: '0', change: '0%', icon: 'TrendingUp' },
        { label: 'Total Reach', value: '0', change: '0%', icon: 'Eye' },
        { label: 'Creators', value: campaign.targetCreators || '0', change: '0', icon: 'Users' },
        { label: 'Budget', value: `₹${campaign.budget || 0}`, change: '0%', icon: 'IndianRupee' }
    ]).map((stat: any) => ({
        ...stat,
        icon: iconMap[stat.icon] || TrendingUp
    }));

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
                        <Button>
                            <MessageSquare size={18} />
                            Contact Creators
                        </Button>
                    </div>
                </header>

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
                            onFileSelect={(files) => setSampleVideoFiles(files)}
                            label="Sample Video (Optional)"
                            description="Upload a sample video to guide creators"
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                            <Button variant="ghost" onClick={() => setIsBriefModalOpen(false)}>Cancel</Button>
                            <Button type="submit" isLoading={isSubmittingBrief}>Submit Brief</Button>
                        </div>
                    </form>
                </Modal>

                {/* Stats Summary */}
                <div className="stats-grid">
                    {stats.map((stat: any, index: number) => (
                        <Card key={index} className="stat-card">
                            <CardBody>
                                <div className="stat-content">
                                    <div className="stat-icon"><stat.icon size={24} /></div>
                                    <div className="stat-details">
                                        <p className="stat-label">{stat.label}</p>
                                        <h3 className="stat-value">{stat.value}</h3>
                                        <p className="stat-change">{stat.change}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                <div className="analytics-grid">
                    {/* Growth Graph */}
                    <Card className="analytics-card" style={{ gridColumn: 'span 2' }}>
                        <CardHeader>
                            <div className="card-header-content">
                                <h3>Campaign Growth & Engagement</h3>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <Button variant="ghost" size="sm">Engagement</Button>
                                    <Button variant="ghost" size="sm">Reach</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={campaignData.growthData as any}>
                                    <defs>
                                        <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="day"
                                        stroke="rgba(255,255,255,0.3)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.3)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(17, 24, 39, 0.95)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="engagement"
                                        stroke="var(--color-accent)"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorEng)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>

                    {/* Platform Breakdown */}
                    <Card className="analytics-card">
                        <CardHeader>
                            <h3>Engagement by Content Type</h3>
                        </CardHeader>
                        <CardBody>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={campaignData.contentTypePerformance as any}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(17, 24, 39, 0.95)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px'
                                        }}
                                    />
                                    <Bar dataKey="engagement" fill="var(--color-info)" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>
                </div>

                {/* Creators List */}
                <Card className="content-card" style={{ marginTop: 'var(--space-8)' }}>
                    <CardHeader>
                        <div className="card-header-content">
                            <h3>Campaign Creators</h3>
                            <div className="search-box">
                                <Users size={16} />
                                <input type="text" placeholder="Search creators..." />
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="no-padding">
                        <div className="table-responsive">
                            <table className="creators-table">
                                <thead>
                                    <tr>
                                        <th>Creator</th>
                                        <th>Status</th>
                                        <th>Engagement</th>
                                        <th>Deliverables</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaignData.creators?.map((creator: any) => (
                                        <tr key={creator.id}>
                                            <td>
                                                <div className="creator-cell">
                                                    <div className="creator-avatar" style={{ width: 32, height: 32, fontSize: 16 }}>
                                                        {creator.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="creator-name">{creator.name}</div>
                                                        <div className="creator-handle">{creator.handle}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${creator.status === 'Published' ? 'status-active' :
                                                    creator.status === 'Review' ? 'status-content-review' :
                                                        'status-planning'
                                                    }`}>
                                                    {creator.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <TrendingUp size={14} style={{ color: 'var(--color-success)' }} />
                                                    {creator.engagement}
                                                </div>
                                            </td>
                                            <td>{creator.content}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/brand/campaign/${id}/creator/${creator.id}`)}
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <MessageSquare size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
};
