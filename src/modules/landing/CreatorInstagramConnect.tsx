import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, Card, CardBody } from '../../components';
import { Instagram, ArrowRight } from 'lucide-react';
import { updateProfile } from '../../lib/api';
import './CreatorLogin.css';
import { auth } from '../../lib/firebase';

export const CreatorInstagramConnect: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleConnectInstagram = async () => {
        setIsLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Not authenticated");

            // Try fetching the auth URL from backend
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
            const redirectUrl = `${window.location.origin}/creator/dashboard`;
            const response = await fetch(`${apiUrl}/integrations/instagram/connect?redirect=${encodeURIComponent(redirectUrl)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to get Instagram connect URL: ${text}`);
            }

            const data = await response.json();
            if (data.auth_url) {
                window.location.href = data.auth_url;
            } else {
                throw new Error("No auth URL returned");
            }
        } catch (err: any) {
            console.error('Failed to connect to Instagram:', err);

            // Fallback for demo purposes if backend Instagram integration isn't configured
            alert('Falling back to mock connect for demo.\nError: ' + err.message);
            await updateProfile({ insta_connected: true } as any);
            navigate('/creator/dashboard');
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
                                <div className="creator-icon-wrapper" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white' }}>
                                    <Instagram size={48} />
                                </div>
                                <h1 className="creator-login-title">Connect Instagram</h1>
                                <p className="creator-login-description">
                                    Step 2: Connect your professional or creator Instagram account to verify your identity and start receiving campaigns.
                                </p>
                            </div>

                            <div style={{ marginTop: 'var(--space-8)' }}>
                                <Button
                                    size="lg"
                                    fullWidth
                                    onClick={handleConnectInstagram}
                                    isLoading={isLoading}
                                    rightIcon={<ArrowRight size={20} />}
                                    style={{
                                        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                        border: 'none',
                                        color: 'white'
                                    }}
                                >
                                    Connect with Instagram
                                </Button>

                                <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                                    <Button
                                        variant="ghost"
                                        onClick={() => navigate('/creator/dashboard')}
                                    >
                                        Skip for now
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <p className="creator-login-footer">
                        We only access basic demographic data to match you with brands.
                    </p>
                </div>
            </div>
        </div>
    );
};
