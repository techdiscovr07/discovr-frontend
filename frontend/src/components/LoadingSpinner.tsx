import React from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
        </div>
    );
};
