import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardBody, Button } from '../components';
import { ShieldAlert, Home } from 'lucide-react';
import './AdminLogin.css';

export const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || '/';

    const getLoginPath = () => {
        if (from.startsWith('/admin')) return '/admin/login';
        if (from.startsWith('/brand')) return '/brand/login';
        if (from.startsWith('/creator')) return '/creator/login';
        return '/';
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-content animate-fade-in">
                    <Card className="auth-card">
                        <CardBody>
                            <div className="auth-header">
                                <div className="auth-icon-wrapper" style={{ background: 'var(--color-error)', opacity: 0.1 }}>
                                    <ShieldAlert size={32} style={{ color: 'var(--color-error)' }} />
                                </div>
                                <h1 className="auth-title">Access Denied</h1>
                                <p className="auth-description">
                                    You don't have permission to access this page. Please log in with the correct account type.
                                </p>
                            </div>

                            <div style={{ 
                                background: 'var(--color-surface-glass)', 
                                border: '1px solid var(--color-border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--space-4)',
                                marginBottom: 'var(--space-6)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-text-secondary)'
                            }}>
                                <p style={{ marginBottom: 'var(--space-2)' }}>
                                    <strong>Attempted to access:</strong> {from}
                                </p>
                                <p>
                                    If you believe this is an error, please contact support or try logging in again.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <Button 
                                    onClick={() => navigate(getLoginPath(), { state: { from: location } })}
                                    fullWidth
                                >
                                    Go to Login
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => navigate('/')}
                                    fullWidth
                                >
                                    <Home size={18} />
                                    Back to Home
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};
