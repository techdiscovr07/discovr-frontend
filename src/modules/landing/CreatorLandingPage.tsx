import React, { useState } from 'react';
import { Header, Button, Input, Card, CardBody } from '../../components';
import { ArrowRight, Sparkles, DollarSign, Shield, CheckCircle, Video, Award } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import './CreatorLandingPage.css';

export const CreatorLandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleJoinWaitlist = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            showToast('You have been added to the creator waitlist!', 'success');
            setName('');
            setEmail('');
        }, 1500);
    };

    return (
        <div className="creator-landing">
            <Header transparent />

            {/* Hero Section */}
            <section className="cr-hero">
                <div className="cr-hero-bg"></div>
                <div className="container">
                    <div className="cr-hero-content">
                        <div className="cr-hero-text">
                            <div className="cr-badge animate-fade-in">
                                <Sparkles size={14} style={{ marginRight: 8 }} />
                                <span>For Premium Creators</span>
                            </div>

                            <h1 className="cr-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                Get Paid For Your <span className="outline">Influence.</span>
                            </h1>

                            <p className="cr-description animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                Join the exclusive network of top 1% Indian creators. Work with premium brands, maintain complete creative control, and get paid securely and on time.
                            </p>

                            <form onSubmit={handleJoinWaitlist} className="cr-cta-form animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                <div className="cr-input-stack">
                                    <Input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e: any) => setName(e.target.value)}
                                        required
                                        style={{ marginBottom: 0 }}
                                    />
                                    <div className="cr-input-group">
                                        <Input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e: any) => setEmail(e.target.value)}
                                            required
                                            style={{ marginBottom: 0 }}
                                        />
                                        <Button type="submit" size="lg" isLoading={isSubmitting}>
                                            Apply to Join
                                        </Button>
                                    </div>
                                </div>
                                <p className="cr-cta-hint">Only high-engagement creators are accepted. <Link to="/creator/login">Already a member? Login</Link></p>
                            </form>
                        </div>

                        <div className="cr-hero-visual animate-slide-in-right">
                            <div className="cr-mockup">
                                <div className="cr-mockup-header">
                                    <div className="cr-mockup-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <div className="cr-mockup-title">Discovr Creator Hub</div>
                                </div>
                                <div className="cr-mockup-body">
                                    <div className="cr-stat-row">
                                        <div className="cr-stat-box">
                                            <span className="cr-stat-label">Earnings This Month</span>
                                            <span className="cr-stat-value">₹2,45,000</span>
                                        </div>
                                        <div className="cr-stat-box">
                                            <span className="cr-stat-label">Active Campaigns</span>
                                            <span className="cr-stat-value">4</span>
                                        </div>
                                    </div>
                                    <div className="cr-mockup-list">
                                        <div className="cr-mockup-item">
                                            <div className="cr-mi-icon" style={{ background: '#FF3B3020', color: '#FF3B30' }}><Video size={16} /></div>
                                            <div className="cr-mi-info">
                                                <h4>Nike Summer Pre-launch</h4>
                                                <p>Script Approved • Awaiting Content</p>
                                            </div>
                                            <div className="cr-mi-price">₹85,000</div>
                                        </div>
                                        <div className="cr-mockup-item">
                                            <div className="cr-mi-icon" style={{ background: '#34C75920', color: '#34C759' }}><Shield size={16} /></div>
                                            <div className="cr-mi-info">
                                                <h4>Lenskart Air Series</h4>
                                                <p>Content Live • Payment Processed</p>
                                            </div>
                                            <div className="cr-mi-price">₹1,20,000</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="cr-benefits">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="signature-text">Why Discovr?</span>
                        <h2 className="section-title">Built for the <span style={{ color: 'var(--color-accent)' }}>Elite</span></h2>
                        <p className="section-description mx-auto">Stop chasing leads and negotiating terms. We bring premium brands directly to you.</p>
                    </div>

                    <div className="cr-benefits-grid">
                        <div className="cr-benefit-card hover-lift">
                            <div className="cr-bc-icon"><DollarSign size={24} /></div>
                            <h3>Guaranteed Payments</h3>
                            <p>Funds are held in escrow before you start shooting. When the brand approves, you get paid immediately. Zero chasing invoices.</p>
                        </div>
                        <div className="cr-benefit-card hover-lift">
                            <div className="cr-bc-icon"><Award size={24} /></div>
                            <h3>Premium Brands Only</h3>
                            <p>We vet every brand on the platform. You'll only receive campaign briefs from verified, high-quality companies.</p>
                        </div>
                        <div className="cr-benefit-card hover-lift">
                            <div className="cr-bc-icon"><Shield size={24} /></div>
                            <h3>Total Creative Control</h3>
                            <p>You choose which campaigns to pitch for. Set your own rates, counter-offer, and maintain your authentic voice.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="cr-how">
                <div className="container">
                    <div className="cr-how-grid">
                        <div className="cr-how-visual">
                            <div className="cr-step-card step-1">
                                <div className="cr-step-icon">1</div>
                                <div>
                                    <h4>Get Briefs</h4>
                                    <p>Browse exclusive campaign briefs tailored to your niche.</p>
                                </div>
                            </div>
                            <div className="cr-step-card step-2">
                                <div className="cr-step-icon">2</div>
                                <div>
                                    <h4>Pitch & Negotiate</h4>
                                    <p>Submit your proposal and rate directly to the brand.</p>
                                </div>
                            </div>
                            <div className="cr-step-card step-3">
                                <div className="cr-step-icon">3</div>
                                <div>
                                    <h4>Create & Earn</h4>
                                    <p>Upload content for approval and get paid instantly.</p>
                                </div>
                            </div>
                        </div>
                        <div className="cr-how-text">
                            <h2 className="section-title">A workflow designed around <span className="outline">you.</span></h2>
                            <p className="section-description">
                                We eliminated the friction from brand deals. Our platform acts as your personal agent, handling the contracts, briefs, revisions, and payments in one secure place.
                            </p>
                            <ul className="cr-feature-list">
                                <li><CheckCircle size={20} className="text-accent" /> Standardized, clear campaign briefs</li>
                                <li><CheckCircle size={20} className="text-accent" /> In-built script and content review tools</li>
                                <li><CheckCircle size={20} className="text-accent" /> Direct communication with brand managers</li>
                                <li><CheckCircle size={20} className="text-accent" /> Performance analytics and portfolio building</li>
                            </ul>
                            <div style={{ marginTop: 'var(--space-8)' }}>
                                <Button size="lg" onClick={() => navigate('/creator/signup')}>
                                    Create Free Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application CTA */}
            <section className="cr-bottom-cta">
                <div className="container">
                    <Card className="cr-cta-card">
                        <CardBody className="cr-cta-body">
                            <div className="cr-cta-content">
                                <h2>Apply to join the Network</h2>
                                <p>We are currently accepting applications from creators with at least 10k engaged followers across Instagram or YouTube.</p>
                                <div className="cr-cta-actions">
                                    <Button size="lg" rightIcon={<ArrowRight size={20} />} onClick={() => navigate('/creator/signup')}>
                                        Start Application
                                    </Button>
                                    <Button size="lg" variant="ghost" onClick={() => navigate('/creator/login')}>
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 'var(--space-8)' }}>
                        <p className="footer-text">
                            © 2026 Discovr. All rights reserved. Built for creators, by creators.
                        </p>
                        <div className="footer-legal">
                            <Link to="/privacy-policy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer >
        </div >
    );
};
