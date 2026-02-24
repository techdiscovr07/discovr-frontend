import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    width?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    width = '500px'
}) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="sidebar-overlay" onClick={onClose}>
            <div
                className="sidebar-container"
                style={{ width }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sidebar-header">
                    <div>
                        <h2 className="sidebar-title">{title}</h2>
                        {subtitle && <p className="sidebar-subtitle">{subtitle}</p>}
                    </div>
                    <button className="sidebar-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="sidebar-body">
                    {children}
                </div>
            </div>
        </div>
    );
};
