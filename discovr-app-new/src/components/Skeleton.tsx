import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular';
    className?: string;
    animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width,
    height,
    variant = 'rectangular',
    className = '',
    animation = 'pulse'
}) => {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`skeleton skeleton-${variant} skeleton-${animation} ${className}`}
            style={style}
            aria-label="Loading..."
        />
    );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => (
    <div className={`skeleton-text ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                variant="text"
                width={i === lines - 1 ? '60%' : '100%'}
                height={16}
            />
        ))}
    </div>
);

export const SkeletonCard: React.FC = () => (
    <div className="skeleton-card">
        <Skeleton variant="rectangular" height={200} />
        <div style={{ padding: 'var(--space-4)' }}>
            <div style={{ marginBottom: 'var(--space-2)' }}>
                <Skeleton variant="text" width="80%" height={20} />
            </div>
            <SkeletonText lines={2} />
        </div>
    </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
    <div className="skeleton-table">
        <div className="skeleton-table-header">
            {Array.from({ length: cols }).map((_, i) => (
                <Skeleton key={i} variant="text" width="100%" height={20} />
            ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="skeleton-table-row">
                {Array.from({ length: cols }).map((_, colIndex) => (
                    <Skeleton key={colIndex} variant="text" width="100%" height={16} />
                ))}
            </div>
        ))}
    </div>
);
