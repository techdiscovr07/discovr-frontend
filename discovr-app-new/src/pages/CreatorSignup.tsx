import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Header, Button, Card, CardBody, Input } from '../components';
import { Instagram, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './CreatorLogin.css';

export const CreatorSignup: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { signUp } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Get campaign_id from URL if present (for campaign-specific signup)
    const campaignId = searchParams.get('campaign_id');

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            await signUp(email, password, name, 'creator');
            
            // If signed up from campaign link, navigate to campaign details
            if (campaignId) {
                navigate(`/creator/campaign/${campaignId}`);
            } else {
                navigate('/creator/dashboard');
            }
        } catch (err: any) {
            console.error('Creator signup failed:', err);
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                                <h1 className="creator-login-title">Creator Signup</h1>
                                <p className="creator-login-description">
                                    {campaignId 
                                        ? "You've been selected for a campaign! Create your account to get started."
                                        : "Create your creator account to join campaigns and collaborate with brands."
                                    }
                                </p>
                            </div>

                            <form onSubmit={handleEmailSignup} className="creator-login-form">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    placeholder="Your Name"
                                    required
                                    leftIcon={<User size={18} />}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

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

                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    leftIcon={<Lock size={18} />}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />

                                {error && (
                                    <div className="auth-error animate-shake" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-error)' }}>
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    size="lg"
                                    fullWidth
                                    isLoading={isLoading}
                                >
                                    Create Creator Account
                                </Button>
                            </form>

                            <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                                <Link 
                                    to="/creator/login" 
                                    style={{ 
                                        color: 'var(--color-primary)', 
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        fontSize: 'var(--text-sm)'
                                    }}
                                >
                                    <ArrowLeft size={16} />
                                    Back to Login
                                </Link>
                            </div>

                            <div className="creator-login-features">
                                <div className="creator-feature">
                                    <div className="creator-feature-icon">✓</div>
                                    <span>Join campaigns</span>
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
