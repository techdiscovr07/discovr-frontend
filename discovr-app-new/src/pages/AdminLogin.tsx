import React, { useState } from 'react';
import { Header, Button, Input, Card, CardBody } from '../components';
import { Shield, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { formatFirebaseError } from '../utils/errorMessages';
import './AdminLogin.css';

export const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await signIn(email, password, 'admin');
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error('Admin login failed:', err);
            const friendlyError = formatFirebaseError(err);
            setError(friendlyError);
            showToast(friendlyError, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Header />

            <div className="auth-container">
                <div className="auth-content animate-fade-in">
                    <Card className="auth-card">
                        <CardBody>
                            <div className="auth-header">
                                <div className="auth-icon-wrapper">
                                    <Shield size={48} />
                                </div>
                                <h1 className="auth-title">Admin Portal</h1>
                                <p className="auth-description">
                                    Manage brands, campaigns, and platform operations
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="auth-form">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="admin@discovr.com"
                                    required
                                    leftIcon={<Mail size={18} />}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    leftIcon={<Lock size={18} />}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                {error && (
                                    <div className="auth-error animate-shake">
                                        {error}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                                    <Link to="/forgot-password" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', textDecoration: 'none' }}>
                                        Forgot Password?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    fullWidth
                                    isLoading={isLoading}
                                >
                                    Sign In
                                </Button>
                            </form>

                            <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/admin/signup" 
                                        style={{ 
                                            color: 'var(--color-primary)', 
                                            textDecoration: 'none',
                                            fontWeight: 500
                                        }}
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};
