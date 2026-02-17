import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header, Button, Card, CardBody, Input } from '../components';
import { Instagram, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { formatFirebaseError } from '../utils/errorMessages';
import './CreatorLogin.css';

export const CreatorLogin: React.FC = () => {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await signIn(email, password, 'creator');
            navigate('/creator/dashboard');
        } catch (err: any) {
            console.error('Creator login failed:', err);
            const friendlyError = formatFirebaseError(err);
            setError(friendlyError);
            showToast(friendlyError, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInstagramLogin = async () => {
        setIsLoading(true);
        // Simulate OAuth connection
        setTimeout(() => {
            setIsLoading(false);
            navigate('/creator/dashboard');
        }, 800);
    };

    return (
        <div className="creator-login-page">
            <Header />

            <div className="creator-login-container">
                <div className="creator-login-content animate-fade-in">
                    <Card className="creator-login-card">
                        <CardBody>
                            <div className="creator-login-header">
                                <div className="creator-icon-wrapper">
                                    <Instagram size={48} />
                                </div>
                                <h1 className="creator-login-title">Creator Login</h1>
                                <p className="creator-login-description">
                                    Connect your account to access campaigns and collaborate with brands.
                                </p>
                            </div>

                            <form onSubmit={handleEmailLogin} className="creator-login-form">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="creator@example.com"
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
                                    <div className="auth-error animate-shake" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-error)' }}>
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
                                    Sign In with Email
                                </Button>

                                <div className="creator-login-divider">
                                    <span>or</span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    fullWidth
                                    leftIcon={<Instagram size={20} />}
                                    onClick={handleInstagramLogin}
                                    type="button"
                                >
                                    {isLoading ? 'Connecting...' : 'Continue with Instagram'}
                                </Button>
                            </form>

                            <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/creator/signup" 
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

                            <div className="creator-login-features">
                                <div className="creator-feature">
                                    <div className="creator-feature-icon">✓</div>
                                    <span>Manage campaigns</span>
                                </div>
                                <div className="creator-feature">
                                    <div className="creator-feature-icon">✓</div>
                                    <span>Submit bids & content</span>
                                </div>
                                <div className="creator-feature">
                                    <div className="creator-feature-icon">✓</div>
                                    <span>Track payments</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <p className="creator-login-footer">
                        By continuing, you agree to Discovr's Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};
