import React, { useState } from 'react';
import { Header, Button, Input, Card, CardBody } from '../components';
import { Shield, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AdminLogin.css';

export const AdminSignup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
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
            await signUp(email, password, name, 'admin');
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error('Admin signup failed:', err);
            setError(err.message || 'Signup failed. Please try again.');
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
                                <h1 className="auth-title">Admin Signup</h1>
                                <p className="auth-description">
                                    Create an admin account to manage the platform
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="auth-form">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    leftIcon={<User size={18} />}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

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
                                    <div className="auth-error animate-shake">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    size="lg"
                                    fullWidth
                                    isLoading={isLoading}
                                >
                                    Create Admin Account
                                </Button>
                            </form>

                            <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                                <Link 
                                    to="/admin/login" 
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
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};
