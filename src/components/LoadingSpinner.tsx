import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullPage = false }) => {
    return (
        <div className={`spinner-container ${fullPage ? 'full-page shadow-pulse' : ''}`}>
            <div className="spinner-wrapper">
                <div className="spinner"></div>
                {fullPage && <div className="spinner-glow"></div>}
            </div>
        </div>
    );
};
