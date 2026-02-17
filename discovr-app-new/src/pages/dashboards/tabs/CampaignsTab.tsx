import React, { useEffect, useState } from 'react';
import { Card, CardBody, Button, LoadingSpinner } from '../../../components';
import { Users, Calendar, IndianRupee } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import adminDashboardData from '../../../data/adminDashboard.json';

interface CampaignsTabProps {
    searchQuery?: string;
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({ searchQuery = '' }) => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const data = await adminApi.getCampaigns() as any[];
                setCampaigns(data || []);
            } catch (error) {
                console.error('Failed to fetch admin campaigns:', error);
                setCampaigns(adminDashboardData.campaigns);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter(campaign =>
        (campaign.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (campaign.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {/* Campaigns List */}
            <div className="campaigns-list">
                {filteredCampaigns.map((campaign, index) => (
                    <Card key={campaign.id} hover className="campaign-detail-card animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        <CardBody>
                            <div className="campaign-detail-header">
                                <div className="campaign-brand-info">
                                    <span className="brand-logo-small">{campaign.brandLogo}</span>
                                    <div>
                                        <h3 className="campaign-detail-name">{campaign.name}</h3>
                                        <p className="campaign-brand-name">{campaign.brand}</p>
                                    </div>
                                </div>
                                <span className={`status-badge status-${campaign.status.toLowerCase().replace(' ', '-')}`}>
                                    {campaign.status}
                                </span>
                            </div>

                            <div className="campaign-detail-stats">
                                <div className="campaign-stat">
                                    <Users size={16} />
                                    <span>{campaign.creators} creators</span>
                                </div>
                                <div className="campaign-stat">
                                    <IndianRupee size={16} />
                                    <span>{campaign.spent} / {campaign.budget}</span>
                                </div>
                                <div className="campaign-stat">
                                    <Calendar size={16} />
                                    <span>Due {new Date(campaign.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="campaign-progress">
                                <div className="progress-header">
                                    <span className="progress-label">Progress</span>
                                    <span className="progress-value">{campaign.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${campaign.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="campaign-detail-footer">
                                <Button variant="ghost" size="sm">View Details</Button>
                                <Button variant="secondary" size="sm">Manage</Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </>
    );
};
