import React, { useState } from 'react';
import { Button, Modal, TextArea } from '../../../components';
import { IndianRupee, Users, Calendar, Target, Users2, Tag, Info, AlertCircle, Check, Sparkles, BrainCircuit, Rocket, Zap } from 'lucide-react';
import { brandApi } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';

interface NewCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (campaignName: string) => void;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [generationProgress, setGenerationProgress] = useState(0);

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

    const deliverableOptions = [
        { label: 'Reels', value: 'Reels', icon: '🎬' },
        { label: 'Posts', value: 'Posts', icon: '🖼️' },
        { label: 'Stories', value: 'Stories', icon: '📱' },
        { label: 'Usage Rights', value: 'Rights', icon: '⚖️' }
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
        followerRanges: ['10000-50000'] as string[],
        deliverables: [
            { type: 'Reels', quantity: 1 }
        ] as { type: string, quantity: number }[]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAIGenerate = async () => {
        if (!aiPrompt.trim()) {
            showToast('Please describe your campaign idea first', 'error');
            return;
        }

        setIsGeneratingAI(true);
        setGenerationProgress(0);

        const interval = setInterval(() => {
            setGenerationProgress(prev => Math.min(prev + Math.random() * 15, 95));
        }, 300);

        try {
            await new Promise(resolve => setTimeout(resolve, 2500));

            const lowerPrompt = aiPrompt.toLowerCase();
            let suggestedCategories: string[] = ['Lifestyle'];
            let suggestedBudget = '50000';
            let suggestedCreators = '10';
            let suggestedCPV = '0.50';
            let suggestedRanges = ['10000-50000'];

            if (lowerPrompt.includes('skincare') || lowerPrompt.includes('makeup') || lowerPrompt.includes('beauty')) {
                suggestedCategories = ['Beauty', 'Lifestyle'];
            } else if (lowerPrompt.includes('fashion') || lowerPrompt.includes('clothing')) {
                suggestedCategories = ['Fashion', 'Lifestyle'];
            } else if (lowerPrompt.includes('tech') || lowerPrompt.includes('gadget') || lowerPrompt.includes('app')) {
                suggestedCategories = ['Tech'];
            }

            if (lowerPrompt.includes('high budget') || lowerPrompt.includes('expensive')) {
                suggestedBudget = '200000';
                suggestedCreators = '20';
                suggestedRanges = ['50000-100000', '100000-500000'];
            }

            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 30);
            const dateString = defaultDate.toISOString().split('T')[0];

            setFormData({
                ...formData,
                name: `AI: ${aiPrompt.split(' ').slice(0, 3).join(' ')}...`,
                description: `Campaign Objective: ${aiPrompt}\n\nOur AI has optimized this campaign for the ${suggestedCategories.join('/')} market.`,
                totalBudget: suggestedBudget,
                creatorCount: suggestedCreators,
                goLiveDate: dateString,
                cpv: suggestedCPV,
                creatorCategories: suggestedCategories,
                followerRanges: suggestedRanges,
                deliverables: [
                    { type: 'Reels', quantity: 2 },
                    { type: 'Stories', quantity: 3 }
                ]
            });

            setGenerationProgress(100);
            setTimeout(() => {
                setIsGeneratingAI(false);
                setIsAIModalOpen(false);
                setAiPrompt('');
                showToast('Campaign pre-filled by AI!', 'success');
            }, 500);
        } finally {
            clearInterval(interval);
        }
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
                follower_ranges: formData.followerRanges,
                deliverables: formData.deliverables
            };

            const createdCampaign = await brandApi.createCampaign(campaignData) as any;

            showToast('Campaign created successfully', 'success');
            onSuccess(createdCampaign?.name || campaignData.name);
            onClose();

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
                followerRanges: ['10000-50000'],
                deliverables: [
                    { type: 'Reels', quantity: 1 }
                ]
            });
        } catch (error: any) {
            console.error('Failed to create campaign:', error);
            showToast(error.message || 'Failed to create campaign. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 'var(--space-4)' }}>
                        <span>Create New Campaign</span>
                        <Button
                            size="sm"
                            onClick={() => setIsAIModalOpen(true)}
                            style={{
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                border: 'none',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                boxShadow: '0 4px 10px rgba(168, 85, 247, 0.2)',
                                padding: 'var(--space-2) var(--space-4)',
                                transform: 'scale(1)',
                                marginLeft: 'auto'
                            }}
                        >
                            <Sparkles size={14} />
                            Magic AI
                        </Button>
                    </div>
                }
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
                            <div className="category-pill-selection">
                                {availableCategories.map(category => {
                                    const isActive = formData.creatorCategories.includes(category);
                                    return (
                                        <button
                                            key={category}
                                            type="button"
                                            className={`category-pill ${isActive ? 'active' : ''}`}
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    creatorCategories: prev.creatorCategories.includes(category)
                                                        ? prev.creatorCategories.filter(c => c !== category)
                                                        : [...prev.creatorCategories, category]
                                                }));
                                            }}
                                        >
                                            {category}
                                            {isActive && <Check size={14} />}
                                        </button>
                                    );
                                })}
                            </div>
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

                    {/* Campaign Deliverables */}
                    <div className="form-section">
                        <h3 className="form-section-title">Campaign Deliverables *</h3>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>
                            Specify what content pieces and rights you expect from each creator.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                            {deliverableOptions.map(opt => {
                                const deliverable = formData.deliverables.find(d => d.type === opt.value);
                                const isActive = !!deliverable;
                                return (
                                    <div
                                        key={opt.value}
                                        style={{
                                            padding: 'var(--space-4)',
                                            background: isActive ? 'rgba(var(--color-primary-rgb), 0.05)' : 'var(--color-bg-secondary)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`,
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 'var(--space-3)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                                                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{opt.label}</span>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={isActive}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            deliverables: [...prev.deliverables, { type: opt.value, quantity: 1 }]
                                                        }));
                                                    } else {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            deliverables: prev.deliverables.filter(d => d.type !== opt.value)
                                                        }));
                                                    }
                                                }}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                                            />
                                        </div>

                                        {isActive && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'auto', background: 'var(--color-bg-primary)', padding: '4px', borderRadius: '8px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            deliverables: prev.deliverables.map(d =>
                                                                d.type === opt.value ? { ...d, quantity: Math.max(1, d.quantity - 1) } : d
                                                            )
                                                        }));
                                                    }}
                                                    style={{ all: 'unset', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-tertiary)', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold' }}
                                                >
                                                    -
                                                </button>
                                                <div style={{ flex: 1, textAlign: 'center' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{deliverable.quantity}</span>
                                                    <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', display: 'block', textTransform: 'uppercase' }}>Qty</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            deliverables: prev.deliverables.map(d =>
                                                                d.type === opt.value ? { ...d, quantity: d.quantity + 1 } : d
                                                            )
                                                        }));
                                                    }}
                                                    style={{ all: 'unset', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-tertiary)', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold' }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {formData.deliverables.length === 0 && (
                            <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-error)', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertCircle size={12} /> Please select at least one deliverable.
                            </p>
                        )}
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
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
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

            {/* AI Builder Prompt Modal */}
            <Modal
                isOpen={isAIModalOpen}
                onClose={() => !isGeneratingAI && setIsAIModalOpen(false)}
                title="AI Magic Campaign Builder"
                subtitle="Describe your idea and we'll generate the details"
                size="md"
            >
                {isGeneratingAI ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
                        <div style={{ position: 'relative', width: '70px', height: '70px', margin: '0 auto var(--space-4)' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: '3px solid var(--color-bg-secondary)',
                                borderTopColor: 'var(--color-primary)',
                                animation: 'spin 1.2s linear infinite'
                            }} />
                            <BrainCircuit size={28} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--color-primary)' }} />
                        </div>
                        <h3>Building Campaign...</h3>
                        <div style={{ width: '100%', height: '6px', background: 'var(--color-bg-secondary)', borderRadius: '999px', overflow: 'hidden', marginTop: 'var(--space-4)' }}>
                            <div style={{ width: `${generationProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', transition: 'width 0.4s ease' }} />
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', padding: 'var(--space-2) 0' }}>
                        <div style={{ padding: 'var(--space-4)', background: 'rgba(168, 85, 247, 0.08)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-accent)', display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Zap size={18} style={{ color: 'var(--color-warning)' }} />
                            </div>
                            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                                Describe your product and what you want to achieve. Our AI will build the perfect campaign brief for you.
                            </p>
                        </div>
                        <div style={{ flex: 1 }}>
                            <TextArea
                                label="Your Campaign Idea"
                                placeholder="e.g., A luxury watch launch for high-income professionals. Focus on precision and status."
                                value={aiPrompt}
                                onChange={(e: any) => setAiPrompt(e.target.value)}
                                rows={5}
                                autoFocus
                                className="ai-builder-textarea"
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-4)',
                            marginTop: 'var(--space-2)',
                            paddingTop: 'var(--space-4)',
                            borderTop: '1px solid var(--color-border-subtle)'
                        }}>
                            <Button variant="ghost" onClick={() => setIsAIModalOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handleAIGenerate}
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                    border: 'none',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: 'var(--space-2) var(--space-6)'
                                }}
                            >
                                <Rocket size={18} style={{ marginRight: '8px' }} />
                                Magic Generate
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </>
    );
};
