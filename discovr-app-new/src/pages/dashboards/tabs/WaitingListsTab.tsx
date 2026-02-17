import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '../../../components';
import { CheckCircle, XCircle, Users, Building2, Clock } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { adminApi } from '../../../lib/api';
import adminDashboardData from '../../../data/adminDashboard.json';

interface WaitingListsTabProps {
    searchQuery?: string;
}

export const WaitingListsTab: React.FC<WaitingListsTabProps> = ({ searchQuery: headerSearchQuery = '' }) => {
    const [activeFilter, setActiveFilter] = useState<'all' | 'creators' | 'brands'>('all');
    const { showToast } = useToast();
    const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});

    // Get waiting lists data
    const pendingCreators = adminDashboardData.waitingLists?.creators || [];
    const pendingBrands = adminDashboardData.waitingLists?.brands || [];

    const handleApprove = async (type: 'creator' | 'brand', id: string, item: any) => {
        const key = `${type}-${id}`;
        setProcessing({ ...processing, [key]: true });
        try {
            if (type === 'brand') {
                // First, create the brand if it doesn't exist
                let brandId = item.brandId || item.id;
                if (!brandId) {
                    // Create brand first
                    const brandResult = await adminApi.createBrand({
                        name: item.name || item.companyName,
                        categories: item.industry ? [item.industry] : [],
                        logo_url: item.website || undefined
                    });
                    brandId = brandResult.id || brandResult._id;
                }
                
                // Then create a brand owner account
                // Generate a secure temporary password (in production, send via email)
                // Using crypto.getRandomValues for secure random generation
                const array = new Uint32Array(10);
                crypto.getRandomValues(array);
                const randomString = Array.from(array, dec => ('0' + dec.toString(36)).substr(-2)).join('');
                const tempPassword = `Temp${randomString.substring(0, 12)}!${Math.floor(Math.random() * 100)}`;
                await adminApi.createBrandOwner({
                    brand_id: brandId,
                    email: item.email,
                    password: tempPassword,
                    name: item.contactName || item.name
                });
                showToast(`Brand owner account created! Credentials sent to ${item.email}`, 'success');
            } else {
                // For creators, they can sign up themselves
                // This is just for tracking - creators sign up via the signup page
                showToast('Creator can sign up via the creator signup page', 'info');
            }
            // In a real implementation, you would refresh the waiting list here
        } catch (error: any) {
            console.error(`Failed to approve ${type}:`, error);
            showToast(error.message || `Failed to approve ${type}`, 'error');
        } finally {
            setProcessing({ ...processing, [key]: false });
        }
    };

    const handleReject = async (type: 'creator' | 'brand', id: string) => {
        const key = `${type}-${id}`;
        setProcessing({ ...processing, [key]: true });
        try {
            // For rejection, we just remove from the list (no backend endpoint needed)
            // In production, you might want to send a rejection email
            showToast(`${type === 'creator' ? 'Creator' : 'Brand'} rejected.`, 'info');
            // In a real implementation, you would:
            // - Call backend API to mark as rejected
            // - Send rejection email
            // - Refresh the waiting list
        } catch (error: any) {
            showToast(error.message || `Failed to reject ${type}`, 'error');
        } finally {
            setProcessing({ ...processing, [key]: false });
        }
    };

    const filteredCreators = pendingCreators.filter(creator =>
        creator.name.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
        creator.email?.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
        creator.handle?.toLowerCase().includes(headerSearchQuery.toLowerCase())
    );

    const filteredBrands = pendingBrands.filter(brand =>
        brand.name.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
        brand.email?.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
        brand.companyName?.toLowerCase().includes(headerSearchQuery.toLowerCase())
    );

    const getDaysWaiting = (submittedDate: string) => {
        const submitted = new Date(submittedDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - submitted.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <>
            {/* Filter Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                <Button
                    variant={activeFilter === 'all' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                >
                    All ({pendingCreators.length + pendingBrands.length})
                </Button>
                <Button
                    variant={activeFilter === 'creators' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('creators')}
                >
                    <Users size={16} />
                    Creators ({pendingCreators.length})
                </Button>
                <Button
                    variant={activeFilter === 'brands' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('brands')}
                >
                    <Building2 size={16} />
                    Brands ({pendingBrands.length})
                </Button>
            </div>

            {/* Pending Creators */}
            {(activeFilter === 'all' || activeFilter === 'creators') && (
                <Card className="content-card" style={{ marginBottom: 'var(--space-6)' }}>
                    <CardHeader>
                        <div className="card-header-content">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <Users size={20} style={{ color: 'var(--color-accent)' }} />
                                <h3>Pending Creators ({filteredCreators.length})</h3>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="no-padding">
                        {filteredCreators.length === 0 ? (
                            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                                <Users size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
                                <p>No pending creators found</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Creator</th>
                                            <th>Platform</th>
                                            <th>Followers</th>
                                            <th>Engagement</th>
                                            <th>Submitted</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCreators.map((creator) => (
                                            <tr key={creator.id}>
                                                <td>
                                                    <div className="creator-cell">
                                                        <div className="creator-avatar" style={{ width: 40, height: 40, fontSize: 18 }}>
                                                            {creator.avatar || creator.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="creator-name">{creator.name}</div>
                                                            <div className="creator-handle">{creator.handle || creator.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: 'var(--text-sm)' }}>{creator.platform || 'Multiple'}</span>
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                                        {creator.followers || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ color: 'var(--color-success)' }}>
                                                        {creator.engagementRate || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                        <Clock size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                                                        <span style={{ fontSize: 'var(--text-sm)' }}>
                                                            {getDaysWaiting(creator.submittedDate)} days ago
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="status-badge status-planning">
                                                        Pending Review
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleReject('creator', creator.id)}
                                                            disabled={processing[`creator-${creator.id}`]}
                                                            isLoading={processing[`creator-${creator.id}`]}
                                                            style={{ color: 'var(--color-error)' }}
                                                        >
                                                            <XCircle size={16} />
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApprove('creator', creator.id, creator)}
                                                            disabled={processing[`creator-${creator.id}`]}
                                                            isLoading={processing[`creator-${creator.id}`]}
                                                            style={{ background: 'var(--color-success)', color: 'white' }}
                                                        >
                                                            <CheckCircle size={16} />
                                                            Approve
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardBody>
                </Card>
            )}

            {/* Pending Brands */}
            {(activeFilter === 'all' || activeFilter === 'brands') && (
                <Card className="content-card">
                    <CardHeader>
                        <div className="card-header-content">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <Building2 size={20} style={{ color: 'var(--color-accent)' }} />
                                <h3>Pending Brands ({filteredBrands.length})</h3>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="no-padding">
                        {filteredBrands.length === 0 ? (
                            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                                <Building2 size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
                                <p>No pending brands found</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Brand</th>
                                            <th>Company</th>
                                            <th>Industry</th>
                                            <th>Contact</th>
                                            <th>Submitted</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBrands.map((brand) => (
                                            <tr key={brand.id}>
                                                <td>
                                                    <div className="brand-cell">
                                                        <span className="brand-logo" style={{ width: 40, height: 40, fontSize: 18 }}>
                                                            {brand.logo || brand.name.charAt(0)}
                                                        </span>
                                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>{brand.name}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: 'var(--text-sm)' }}>
                                                        {brand.companyName || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                                        {brand.industry || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: 'var(--text-sm)' }}>{brand.email}</span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                        <Clock size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                                                        <span style={{ fontSize: 'var(--text-sm)' }}>
                                                            {getDaysWaiting(brand.submittedDate)} days ago
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="status-badge status-planning">
                                                        Pending Review
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleReject('brand', brand.id)}
                                                            disabled={processing[`brand-${brand.id}`]}
                                                            isLoading={processing[`brand-${brand.id}`]}
                                                            style={{ color: 'var(--color-error)' }}
                                                        >
                                                            <XCircle size={16} />
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApprove('brand', brand.id, brand)}
                                                            disabled={processing[`brand-${brand.id}`]}
                                                            isLoading={processing[`brand-${brand.id}`]}
                                                            style={{ background: 'var(--color-success)', color: 'white' }}
                                                        >
                                                            <CheckCircle size={16} />
                                                            Approve
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardBody>
                </Card>
            )}
        </>
    );
};
