import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Input } from '../components';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { forgotPassword } from '../lib/api';
import './ForgotPassword.css';

export const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
            showToast('Password reset email sent! Check your inbox.', 'success');
        } catch (error: any) {
            console.error('Failed to send reset email:', error);
            showToast(error.message || 'Failed to send reset email', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <Card className="auth-card">
                    <CardBody>
                        <div className="auth-header">
                            <Link to="/" className="auth-back-link">
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="auth-title">Forgot Password?</h1>
                            <p className="auth-subtitle">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="auth-form">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    leftIcon={<Mail size={18} />}
                                    required
                                    autoFocus
                                />

                                <Button type="submit" isLoading={isLoading} className="auth-submit-button">
                                    Send Reset Link
                                </Button>
                            </form>
                        ) : (
                            <div className="auth-success">
                                <div className="auth-success-icon">✓</div>
                                <h3>Check Your Email</h3>
                                <p>
                                    We've sent a password reset link to <strong>{email}</strong>
                                </p>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)' }}>
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsSubmitted(false)}
                                    style={{ marginTop: 'var(--space-4)' }}
                                >
                                    Try Another Email
                                </Button>
                            </div>
                        )}

                        <div className="auth-footer">
                            <Link to="/admin/login" className="auth-link">
                                Back to Login
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
