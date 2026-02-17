import React, { useEffect, useState } from 'react';
import { Card, CardBody, Button, LoadingSpinner } from '../../../components';
import { MoreVertical } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import adminDashboardData from '../../../data/adminDashboard.json';

interface BrandsTabProps {
    searchQuery?: string;
}

export const BrandsTab: React.FC<BrandsTabProps> = ({ searchQuery = '' }) => {
    const [brands, setBrands] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await adminApi.getBrands();
                setBrands(data || []);
            } catch (error) {
                console.error('Failed to fetch brands:', error);
                // Fallback to mock data for demo purposes
                setBrands(adminDashboardData.brands);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBrands();
    }, []);

    const filteredBrands = brands.filter(brand =>
        (brand.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (brand.logo?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {/* Brands Grid */}
            <div className="brands-grid">
                {filteredBrands.map((brand, index) => (
                    <Card key={brand.id} hover className="brand-card animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        <CardBody>
                            <div className="brand-card-header">
                                <div className="brand-card-logo">{brand.logo}</div>
                                <button className="action-button">
                                    <MoreVertical size={16} />
                                </button>
                            </div>

                            <h3 className="brand-card-name">{brand.name}</h3>
                            <span className="status-badge status-active">{brand.status}</span>

                            <div className="brand-card-stats">
                                <div className="brand-stat">
                                    <span className="brand-stat-label">Campaigns</span>
                                    <span className="brand-stat-value">{brand.campaigns}</span>
                                </div>
                                <div className="brand-stat">
                                    <span className="brand-stat-label">Creators</span>
                                    <span className="brand-stat-value">{brand.activeCreators}</span>
                                </div>
                                <div className="brand-stat">
                                    <span className="brand-stat-label">Total Spent</span>
                                    <span className="brand-stat-value">{brand.totalSpent}</span>
                                </div>
                            </div>

                            <div className="brand-card-footer">
                                <span className="brand-joined">Joined {new Date(brand.joinedDate).toLocaleDateString()}</span>
                                <Button variant="ghost" size="sm">View Details</Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </>
    );
};
