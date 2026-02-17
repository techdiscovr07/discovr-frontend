import React, { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input, Button, Card, CardBody } from './';
import './AdvancedSearch.css';

interface AdvancedSearchProps {
    onSearch: (query: string, filters: SearchFilters) => void;
    placeholder?: string;
    showFilters?: boolean;
}

export interface SearchFilters {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    type?: string;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
    onSearch,
    placeholder = 'Search...',
    showFilters = true
}) => {
    const [query, setQuery] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({});

    const handleSearch = () => {
        onSearch(query, filters);
    };

    const handleClear = () => {
        setQuery('');
        setFilters({});
        onSearch('', {});
    };

    const handleFilterChange = (key: keyof SearchFilters, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onSearch(query, newFilters);
    };

    return (
        <div className="advanced-search">
            <div className="search-bar">
                <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {query && (
                        <button className="search-clear" onClick={handleClear}>
                            <X size={16} />
                        </button>
                    )}
                </div>
                {showFilters && (
                    <Button
                        variant="ghost"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        leftIcon={<SlidersHorizontal size={18} />}
                    >
                        Filters
                    </Button>
                )}
                <Button onClick={handleSearch} leftIcon={<Search size={18} />}>
                    Search
                </Button>
            </div>

            {showAdvanced && showFilters && (
                <Card className="search-filters-card">
                    <CardBody>
                        <div className="filters-grid">
                            <div className="filter-group">
                                <label>Date Range</label>
                                <div className="date-range">
                                    <Input
                                        type="date"
                                        value={filters.dateFrom || ''}
                                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                    />
                                    <span>to</span>
                                    <Input
                                        type="date"
                                        value={filters.dateTo || ''}
                                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="filter-group">
                                <label>Status</label>
                                <select
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Sort By</label>
                                <select
                                    value={filters.sortBy || 'date'}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                >
                                    <option value="date">Date</option>
                                    <option value="name">Name</option>
                                    <option value="amount">Amount</option>
                                    <option value="status">Status</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Order</label>
                                <select
                                    value={filters.sortOrder || 'desc'}
                                    onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>

                        <div className="filters-actions">
                            <Button variant="ghost" onClick={() => {
                                setFilters({});
                                onSearch(query, {});
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
};
