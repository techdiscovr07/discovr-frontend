import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, LoadingSpinner } from '../../components';
import { ArrowLeft, Calendar, IndianRupee, Users } from 'lucide-react';
import { brandApi } from '../../lib/api';
import '../dashboards/AdminDashboard.css';
import './BrandDashboard.css';

export const NewCampaign: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
            // Navigate to campaign details or dashboard
            if (response.id) {
                navigate(`/brand/campaign/${response.id}`);
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
                <header className="dashboard-header">
                    <div>
                        <Button variant="ghost" onClick={() => navigate('/brand/dashboard')}>
                            <ArrowLeft size={20} />
                            Back to Dashboard
                        </Button>
                        <h1 className="dashboard-title" style={{ marginTop: 'var(--space-4)' }}>Create New Campaign</h1>
                        <p className="dashboard-subtitle">Set up your influencer marketing campaign</p>
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
                                                    fontWeight: 'var(--font-medium)'
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
                            <div className="form-actions">
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
                                >
                                    {isLoading ? <LoadingSpinner /> : 'Create Campaign'}
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
};
