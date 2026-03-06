import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, LoadingSpinner, Modal, TextArea } from '../../components';
import { ArrowLeft, Calendar, IndianRupee, Users, Sparkles, Zap, BrainCircuit, Rocket } from 'lucide-react';
import { brandApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import '../../components/DashboardShared.css';
import './BrandDashboard.css';

export const NewCampaign: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [generationProgress, setGenerationProgress] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        totalBudget: '',
        creatorCount: '',
        goLiveDate: '',
        cpv: '',
        creatorCategories: [] as string[]
    });

    const availableCategories = [
        'Fashion', 'Beauty', 'Lifestyle', 'Food', 'Travel',
        'Tech', 'Fitness', 'Gaming', 'Education', 'Entertainment'
    ];

    const handleCategoryToggle = (category: string) => {
        setFormData(prev => ({
            ...prev,
            creatorCategories: prev.creatorCategories.includes(category)
                ? prev.creatorCategories.filter(c => c !== category)
                : [...prev.creatorCategories, category]
        }));
    };

    const handleAIGenerate = async () => {
        if (!aiPrompt.trim()) {
            showToast('Please describe your campaign idea first', 'error');
            return;
        }

        setIsGeneratingAI(true);
        setGenerationProgress(0);

        // Simulate AI thinking and generating with progress
        const interval = setInterval(() => {
            setGenerationProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return prev + Math.random() * 15;
            });
        }, 300);

        try {
            // Simulated delay for "AI processing"
            await new Promise(resolve => setTimeout(resolve, 3000));

            const lowerPrompt = aiPrompt.toLowerCase();
            let suggestedCategories: string[] = ['Lifestyle'];
            let suggestedBudget = '50000';
            let suggestedCreators = '10';
            let suggestedCPV = '0.50';

            // Simple keyword-based logic for demo (can be replaced with actual LLM API)
            if (lowerPrompt.includes('skincare') || lowerPrompt.includes('makeup') || lowerPrompt.includes('beauty')) {
                suggestedCategories = ['Beauty', 'Lifestyle'];
            } else if (lowerPrompt.includes('clothes') || lowerPrompt.includes('fashion') || lowerPrompt.includes('style')) {
                suggestedCategories = ['Fashion', 'Lifestyle'];
            } else if (lowerPrompt.includes('gaming') || lowerPrompt.includes('game') || lowerPrompt.includes('play')) {
                suggestedCategories = ['Gaming', 'Tech'];
            } else if (lowerPrompt.includes('food') || lowerPrompt.includes('restaurant') || lowerPrompt.includes('kitchen')) {
                suggestedCategories = ['Food'];
            }

            if (lowerPrompt.includes('budget') || lowerPrompt.includes('high') || lowerPrompt.includes('expensive')) {
                suggestedBudget = '250000';
                suggestedCreators = '25';
            }

            // Calculate a default "Go Live Date" 30 days from now
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 30);
            const dateString = defaultDate.toISOString().split('T')[0];

            setFormData({
                name: `AI Generated: ${aiPrompt.split(' ').slice(0, 3).join(' ')}...`,
                description: `This campaign is designed to: ${aiPrompt}\n\nKey Objectives:\n1. Increase brand awareness through high-quality creator content.\n2. Drive engagement in the ${suggestedCategories.join(' & ')} space.\n3. Target relevant audience tiers for maximum ROI.`,
                totalBudget: suggestedBudget,
                creatorCount: suggestedCreators,
                goLiveDate: dateString,
                cpv: suggestedCPV,
                creatorCategories: suggestedCategories
            });

            setGenerationProgress(100);
            setTimeout(() => {
                setIsGeneratingAI(false);
                setIsAIModalOpen(false);
                setAiPrompt('');
                showToast('Campaign details generated successfully!', 'success');
            }, 500);

        } finally {
            clearInterval(interval);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const campaignData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                creator_categories: formData.creatorCategories,
                total_budget: parseFloat(formData.totalBudget),
                creator_count: parseInt(formData.creatorCount),
                go_live_date: formData.goLiveDate,
                cpv: parseFloat(formData.cpv) || 0
            };

            const response = await brandApi.createCampaign(campaignData);
            if (response.id || response._id) {
                navigate(`/brand/campaign/${response.id || response._id}`);
            } else {
                navigate('/brand/dashboard');
            }
        } catch (err: any) {
            console.error('Failed to create campaign:', err);
            setError(err.message || 'Failed to create campaign. Please try again.');
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="dashboard" style={{ background: 'var(--color-bg-primary)' }}>
            {/* Main Content */}
            <main className="dashboard-main" style={{ marginLeft: 0, width: '100%' }}>
                {/* Header */}
                <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <Button variant="ghost" onClick={() => navigate('/brand/dashboard')}>
                            <ArrowLeft size={20} />
                            Back to Dashboard
                        </Button>
                        <h1 className="dashboard-title" style={{ marginTop: 'var(--space-4)' }}>Create New Campaign</h1>
                        <p className="dashboard-subtitle">Set up your influencer marketing campaign</p>
                    </div>

                    <div style={{ marginTop: 'var(--space-8)' }}>
                        <Button
                            onClick={() => setIsAIModalOpen(true)}
                            style={{
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                border: 'none',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
                                padding: 'var(--space-3) var(--space-5)',
                                fontWeight: 'bold'
                            }}
                        >
                            <Sparkles size={18} />
                            Create using AI
                        </Button>
                    </div>
                </header>

                {/* Form */}
                <Card className="content-card">
                    <CardBody>
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

                                <div className="form-group">
                                    <label htmlFor="creatorCategories">Creator Categories *</label>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 'var(--space-2)',
                                        marginTop: 'var(--space-2)'
                                    }}>
                                        {availableCategories.map(category => (
                                            <button
                                                key={category}
                                                type="button"
                                                onClick={() => handleCategoryToggle(category)}
                                                style={{
                                                    padding: 'var(--space-2) var(--space-4)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: formData.creatorCategories.includes(category)
                                                        ? '2px solid var(--color-primary)'
                                                        : '2px solid var(--color-border)',
                                                    background: formData.creatorCategories.includes(category)
                                                        ? 'var(--color-primary)'
                                                        : 'transparent',
                                                    color: formData.creatorCategories.includes(category)
                                                        ? 'white'
                                                        : 'var(--color-text-primary)',
                                                    cursor: 'pointer',
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 'var(--font-medium)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                    {formData.creatorCategories.length === 0 && (
                                        <p style={{
                                            marginTop: 'var(--space-2)',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--color-error)'
                                        }}>
                                            Please select at least one category
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
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="creatorCount">
                                            <Users size={16} />
                                            Number of Creators *
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
                                        </label>
                                        <input
                                            type="date"
                                            id="goLiveDate"
                                            name="goLiveDate"
                                            value={formData.goLiveDate}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cpv">
                                            <IndianRupee size={16} />
                                            Cost Per View (CPV) *
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
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div style={{
                                    padding: 'var(--space-4)',
                                    background: 'var(--color-error)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--space-4)'
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="form-actions" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-6)', marginTop: 'var(--space-2)' }}>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => navigate('/brand/dashboard')}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading || formData.creatorCategories.length === 0}
                                    style={{ padding: 'var(--space-3) var(--space-8)' }}
                                >
                                    {isLoading ? <LoadingSpinner /> : 'Create Campaign'}
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </main>

            {/* AI Generation Modal */}
            <Modal
                isOpen={isAIModalOpen}
                onClose={() => !isGeneratingAI && setIsAIModalOpen(false)}
                title="AI Campaign Builder"
                subtitle="Describe your campaign idea and let AI handle the heavy lifting"
                size="md"
            >
                {isGeneratingAI ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto var(--space-6)' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: '4px solid var(--color-bg-secondary)',
                                borderTopColor: 'var(--color-primary)',
                                animation: 'spin 1.5s linear infinite'
                            }} />
                            <BrainCircuit
                                size={32}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: 'var(--color-primary)'
                                }}
                            />
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>Generating Campaign...</h3>
                        <p style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-6)' }}>
                            Optimizing budget and creator categories for max reach.
                        </p>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: '999px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${generationProgress}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                                transition: 'width 0.4s ease'
                            }} />
                        </div>
                        <p style={{ marginTop: 'var(--space-2)', fontSize: '10px', color: 'var(--color-text-tertiary)' }}>{Math.round(generationProgress)}% Completed</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <div style={{ padding: 'var(--space-4)', background: 'rgba(168, 85, 247, 0.05)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-accent)' }}>
                            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <Zap size={16} style={{ color: 'var(--color-warning)' }} />
                                Tip: Be specific about your product, target audience, and main message.
                            </p>
                        </div>

                        <TextArea
                            label="What are you launching?"
                            placeholder="e.g., A high-performance running shoe for marathon enthusiasts, focusing on comfort and durability. Target audience: serious runners in urban areas."
                            value={aiPrompt}
                            onChange={(e: any) => setAiPrompt(e.target.value)}
                            rows={5}
                            autoFocus
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                            <Button variant="ghost" onClick={() => setIsAIModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAIGenerate}
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                    border: 'none',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)'
                                }}
                            >
                                <Rocket size={18} />
                                Generate Details
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
