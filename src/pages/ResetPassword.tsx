import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardBody, Button, Input } from '../components';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { resetPassword, verifyResetToken } from '../lib/api';
import { LoadingSpinner } from '../components';
import './ResetPassword.css';

export const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);
    
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });

    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                showToast('Invalid reset link', 'error');
                setIsLoading(false);
                return;
            }

            try {
                await verifyResetToken(token);
                setIsTokenValid(true);
            } catch (error: any) {
                console.error('Token verification failed:', error);
                showToast('Invalid or expired reset link', 'error');
                setIsTokenValid(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [token, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (passwordData.password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        if (!token) {
            showToast('Invalid reset link', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await resetPassword(token, passwordData.password);
            setIsSuccess(true);
            showToast('Password reset successfully!', 'success');
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/admin/login');
            }, 3000);
        } catch (error: any) {
            console.error('Failed to reset password:', error);
            showToast(error.message || 'Failed to reset password', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="auth-page">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isTokenValid) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <Card className="auth-card">
                        <CardBody>
                            <div className="auth-error">
                                <h2>Invalid Reset Link</h2>
                                <p>The password reset link is invalid or has expired.</p>
                                <Link to="/forgot-password">
                                    <Button>Request New Reset Link</Button>
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <Card className="auth-card">
                        <CardBody>
                            <div className="auth-success">
                                <CheckCircle size={64} style={{ color: 'var(--color-success)', marginBottom: 'var(--space-4)' }} />
                                <h2>Password Reset Successful!</h2>
                                <p>Your password has been reset. Redirecting to login...</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <Card className="auth-card">
                    <CardBody>
                        <div className="auth-header">
                            <Link to="/" className="auth-back-link">
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="auth-title">Reset Password</h1>
                            <p className="auth-subtitle">
                                Enter your new password below.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="Enter new password"
                                value={passwordData.password}
                                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                leftIcon={<Lock size={18} />}
                                required
                                autoFocus
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm new password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                leftIcon={<Lock size={18} />}
                                required
                            />

                            <Button type="submit" isLoading={isSubmitting} className="auth-submit-button">
                                Reset Password
                            </Button>
                        </form>

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
