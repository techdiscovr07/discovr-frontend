import React, { useState } from 'react';
import { Header, Button, Input, Card, CardBody } from '../components';
import { ArrowRight, Sparkles, Users, TrendingUp, Instagram, Mail, User, Building2, CheckCircle } from 'lucide-react';
import { joinWaitlist } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [showBrandForm, setShowBrandForm] = useState(false);
    const [formData, setFormData] = useState({
        brandName: '',
        contactName: '',
        email: '',
        website: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [budget, setBudget] = useState(50000);

    const getCalcResults = (val: number) => {
        return {
            reach: Math.floor(val * 0.45).toLocaleString() + '+',
            creators: Math.floor(val / 5000),
            ugc: Math.floor(val / 2500)
        };
    };

    const results = getCalcResults(budget);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await joinWaitlist({
                brand_name: formData.brandName,
                contact_name: formData.contactName,
                email: formData.email,
                website: formData.website
            });
            showToast('Successfully joined waitlist! We\'ll contact you soon.', 'success');
            setSubmitted(true);
            setTimeout(() => {
                setShowBrandForm(false);
                setSubmitted(false);
                setFormData({ brandName: '', contactName: '', email: '', website: '' });
            }, 3000);
        } catch (error: any) {
            console.error('Failed to submit waitlist:', error);
            showToast(error.message || 'Failed to join waitlist. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="landing-page">
            <Header transparent />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-gradient"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text-side animate-fade-in">
                            <div className="hero-badge">
                                <Instagram size={14} style={{ marginRight: 8 }} />
                                <span>The New Instagram Gold Standard</span>
                            </div>

                            <h1 className="hero-title">
                                <span>Scale Your</span>
                                <span className="outline">Presence</span>
                                <span>Fast.</span>
                            </h1>

                            <p className="hero-description">
                                Optimized for the Gram. Discovr connects premium Indian brands with the top 1% of Instagram creators for maximum engagement.
                            </p>

                            <div className="hero-cta">
                                <Button
                                    size="lg"
                                    rightIcon={<ArrowRight size={20} />}
                                    onClick={() => setShowBrandForm(true)}
                                >
                                    Scale My Brand
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => navigate('/auth/creator/signup')}
                                >
                                    Join as Creator
                                </Button>
                            </div>
                        </div>

                        <div className="hero-visual animate-slide-in-right">
                            <div className="hero-main-card">
                                {/* Visual placeholder or image would go here */}
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(45deg, #111, #222)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.1)'
                                }}>
                                    <Users size={120} />
                                </div>
                            </div>
                            <div className="hero-float-card f1">
                                <Instagram size={16} style={{ marginRight: 8, color: '#E1306C' }} />
                                48k+ Instagram Ready
                            </div>
                            <div className="hero-float-card f2">
                                <TrendingUp size={16} style={{ marginRight: 8 }} />
                                12.4% Avg Engagement
                            </div>
                        </div>
                    </div>
                </div>
                {/* Floating Elements */}
                <div className="hero-float hero-float-1 animate-float"></div>
                <div className="hero-float hero-float-2 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="hero-float hero-float-3 animate-float" style={{ animationDelay: '2s' }}></div>
            </section>

            {/* Trust Bar Marquee */}
            <div className="trust-bar">
                <div className="marquee-container">
                    {[...Array(10)].map((_, i) => (
                        <React.Fragment key={i}>
                            <div className="marquee-item">NIKE</div>
                            <div className="marquee-item">ZOMATO</div>
                            <div className="marquee-item">BOAT</div>
                            <div className="marquee-item">MYNTRA</div>
                            <div className="marquee-item">LENSKART</div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Creator Spotlight */}
            <section className="spotlight-section">
                <div className="container">
                    <div className="section-header">
                        <span className="signature-text">Top Tier Talent</span>
                        <h2 className="section-title">The Elite 1% Spotlight</h2>
                        <p className="section-description">We only work with creators who have verified engagement and high-quality production value.</p>
                    </div>

                    <div className="creator-grid">
                        {[
                            { name: 'Riya Sharma', niche: 'Fashion & Luxury', score: 9.8, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop' },
                            { name: 'Arjun Mehta', niche: 'Tech & Lifestyle', score: 9.5, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
                            { name: 'Sarah Khan', niche: 'Beauty & Skincare', score: 9.7, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
                            { name: 'Vikram Singh', niche: 'Fitness & Health', score: 9.4, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' }
                        ].map((creator, i) => (
                            <div className="creator-card" key={i}>
                                <div className="creator-avatar" style={{ backgroundImage: `url(${creator.img})` }}></div>
                                <div className="creator-info">
                                    <span className="niche">{creator.niche}</span>
                                    <h3>{creator.name}</h3>
                                </div>
                                <div className="creator-stats">
                                    <div className="score-badge">SCORE: {creator.score}</div>
                                    <div className="verified-tag">
                                        <CheckCircle size={14} /> Verified
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-container">
                        <div className="stat-item">
                            <h2 className="stat-number">500<span style={{ color: 'var(--color-accent)' }}>+</span></h2>
                            <p className="stat-label">Hand-Picked Creators</p>
                        </div>
                        <div className="stat-item">
                            <h2 className="stat-number">₹85L<span style={{ color: 'var(--color-accent-alt)' }}>+</span></h2>
                            <p className="stat-label">Payouts Processed</p>
                        </div>
                        <div className="stat-item">
                            <h2 className="stat-number">120<span style={{ color: 'var(--color-accent)' }}>+</span></h2>
                            <p className="stat-label">Live Campaigns</p>
                        </div>
                        <div className="stat-item">
                            <h2 className="stat-number">25M<span style={{ color: 'var(--color-accent-alt)' }}>+</span></h2>
                            <p className="stat-label">Total Gained Reach</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-12)' }}>
                        <h2 className="section-title">The Blueprint to <span style={{ color: 'var(--color-accent)' }}>Global Reach.</span></h2>
                        <p className="section-description" style={{ marginLeft: 0 }}>
                            We handled the boring stuff. You handle the influence.
                        </p>
                    </div>

                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">01</div>
                            <h3 className="step-title">Drop the Brief</h3>
                            <p className="step-description">Tell us who you need. Our AI scans the elite 1% to find your perfect match in seconds.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">02</div>
                            <h3 className="step-title">Pick the Best</h3>
                            <p className="step-description">No spam. Only high-caliber creators bid on your project. You choose the vibe.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">03</div>
                            <h3 className="step-title">Review the Magic</h3>
                            <p className="step-description">Approve scripts and content in our secure hub. Total control, zero friction.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">04</div>
                            <h3 className="step-title">Get Results</h3>
                            <p className="step-description">Auto-payments kick in once you're happy. Scalable influence, handled.</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-8)' }}>
                        <span className="signature-text">"Influencer marketing shouldn't be a gamble." — The Discovr Team</span>
                    </div>
                </div>
            </section>

            {/* ROI Calculator Section */}
            <section className="calculator-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Scale Your ROI</h2>
                        <p className="section-description">Calculate the impact of your next high-performance campaign.</p>
                    </div>

                    <div className="calc-card">
                        <div className="calc-inputs">
                            <div>
                                <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>Monthly Budget</h3>
                                <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>
                                    ₹{budget.toLocaleString()}
                                </div>
                                <input
                                    type="range"
                                    min="50000"
                                    max="1000000"
                                    step="50000"
                                    value={budget}
                                    onChange={(e) => setBudget(parseInt(e.target.value))}
                                    className="budget-slider"
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)', color: 'var(--color-text-tertiary)', fontSize: '10px' }}>
                                    <span>₹50K</span>
                                    <span>₹10L</span>
                                </div>
                            </div>

                            <Button size="lg" onClick={() => setShowBrandForm(true)}>Get Custom Quote</Button>
                        </div>

                        <div className="calc-results">
                            <div className="result-item" style={{ marginBottom: 'var(--space-8)' }}>
                                <h4>Est. Gained Reach</h4>
                                <div className="result-value" style={{ color: 'var(--color-accent-alt)' }}>{results.reach}</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div className="result-item">
                                    <h4>Top-Tier Creators</h4>
                                    <div className="result-value" style={{ fontSize: 'var(--text-3xl)' }}>{results.creators}</div>
                                </div>
                                <div className="result-item">
                                    <h4>UGC Ad Assets</h4>
                                    <div className="result-value" style={{ fontSize: 'var(--text-3xl)' }}>{results.ugc}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Campaign Types Section */}
            <section className="campaign-types-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">One Platform. <span className="outline">Infinite</span> Formats.</h2>
                        <p className="section-description">
                            Whatever your strategy, we have the creators who can execute it with precision.
                        </p>
                    </div>

                    <div className="types-grid">
                        <div className="type-card hover-lift">
                            <div className="type-icon-wrapper">
                                <Sparkles size={32} className="type-icon" />
                            </div>
                            <h3>UGC Ad Mastery</h3>
                            <p>Raw, authentic content that bypasses the "ad filter." Higher ROAS, lower CPA. High-impact creators only.</p>
                        </div>
                        <div className="type-card hover-lift">
                            <div className="type-icon-wrapper">
                                <Instagram size={24} className="type-icon" />
                            </div>
                            <h3>Social Shoutouts</h3>
                            <p>Direct endorsements reaching engaged audiences in your niche.</p>
                        </div>
                        <div className="type-card hover-lift">
                            <div className="type-icon-wrapper">
                                <TrendingUp size={24} className="type-icon" />
                            </div>
                            <h3>Performance ROI</h3>
                            <p>Conversion-focused collaborations with trackable links.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Common Questions</h2>
                        <p className="section-description">Everything you need to know about the elite creator networking platform.</p>
                    </div>

                    <div className="faq-grid">
                        {[
                            { q: "How do you verify the elite 1% of creators?", a: "We use a proprietary AI audit that scans for follower quality, comment sentiment, and consistent engagement rates over 12 months. Only those who pass our strict 'Anti-bot' filter are allowed on the platform." },
                            { q: "What is the typical turnaround for a campaign?", a: "Most UGC campaigns are completed within 7-10 days. This includes brief approval, creator selection, content production, and your final review." },
                            { q: "How does the payment protection work?", a: "Your funds are held in a secure Escrow-style system. We only release payment to the creator once you have approved the final content assets." },
                            { q: "Can I manage multiple brands from one account?", a: "Yes. Our Brand Dashboard supports multi-project management, allowing you to run distinct campaigns for different products or subsidiaries simultaneously." }
                        ].map((item, i) => (
                            <div className="faq-item" key={i} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                                <div className="faq-question">
                                    {item.q}
                                    <span style={{ transition: 'transform 0.3s ease', transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                                </div>
                                {activeFaq === i && (
                                    <div className="faq-answer animate-fade-in">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* UGC Reels Section */}
            <section className="reels-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Proof of <span className="outline">Performance</span></h2>
                        <p className="section-description">High-converting UGC assets crafted by the top 1% of Instagram creators.</p>
                    </div>

                    <div className="reels-grid">
                        {[
                            { tag: 'UGC ADS', title: 'Performance ROI', img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=600&fit=crop' },
                            { tag: 'STORYTELLING', title: 'Brand Narrative', img: 'https://images.unsplash.com/photo-1491147334573-44cbb4602074?w=300&h=600&fit=crop' },
                            { tag: 'LIFESTYLE', title: 'Viral Organic', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=600&fit=crop' }
                        ].map((reel, i) => (
                            <div className="phone-mockup" key={i}>
                                <div className="reel-content" style={{ backgroundImage: `url(${reel.img})` }}>
                                    <div className="reel-overlay">
                                        <span className="reel-tag">{reel.tag}</span>
                                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>{reel.title}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA Section */}
            <section className="bottom-cta-section">
                <div className="container">
                    <div className="cta-container">
                        <h2 className="cta-title">Ready to scale your brand reach?</h2>
                        <p className="cta-subtitle">Join 100+ brands already using Discovr to grow their audience.</p>
                        <Button
                            size="lg"
                            rightIcon={<ArrowRight size={20} />}
                            onClick={() => setShowBrandForm(true)}
                        >
                            Get Started Now
                        </Button>
                    </div>
                </div>
            </section>

            {/* Brand Waitlist Modal */}
            {showBrandForm && (
                <div className="modal-overlay" onClick={() => !submitted && setShowBrandForm(false)}>
                    <Card className="modal-content animate-scale-in" onClick={() => { }}>
                        <CardBody>
                            {!submitted ? (
                                <>
                                    <h2 className="modal-title">Join Brand Waitlist</h2>
                                    <p className="modal-description">
                                        Be among the first brands to access Discovr's influencer marketing platform.
                                    </p>

                                    <form onSubmit={handleSubmit} className="waitlist-form">
                                        <Input
                                            label="Brand Name"
                                            placeholder="Your brand name"
                                            required
                                            leftIcon={<Building2 size={18} />}
                                            value={formData.brandName}
                                            onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                                        />

                                        <Input
                                            label="Contact Name"
                                            placeholder="Your full name"
                                            required
                                            leftIcon={<User size={18} />}
                                            value={formData.contactName}
                                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                        />

                                        <Input
                                            label="Email"
                                            type="email"
                                            placeholder="your@email.com"
                                            required
                                            leftIcon={<Mail size={18} />}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />

                                        <Input
                                            label="Website (Optional)"
                                            placeholder="https://yourbrand.com"
                                            leftIcon={<Building2 size={18} />}
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        />

                                        <div className="modal-actions">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setShowBrandForm(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" isLoading={isSubmitting}>
                                                Join Waitlist
                                            </Button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="success-message">
                                    <div className="success-icon">✓</div>
                                    <h3>You're on the list!</h3>
                                    <p>We'll reach out soon with early access details.</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <Link to="/" className="header-logo" style={{ marginBottom: 'var(--space-6)', padding: 0 }}>
                                <img src="/logo.png" alt="Discovr" className="header-logo-img" />
                                <span className="logo-text">discovr</span>
                            </Link>
                            <p className="footer-tagline">
                                Maximizing Instagram scale for Indian brands. The ultimate bridge between visionaries and creators.
                            </p>
                            <div className="footer-social">
                                <a href="#" className="social-link"><Instagram size={20} /></a>
                                <a href="#" className="social-link"><Users size={20} /></a>
                                <a href="#" className="social-link"><Mail size={20} /></a>
                            </div>
                        </div>

                        <div className="footer-links-grid">
                            <div className="footer-column">
                                <h4>Product</h4>
                                <ul>
                                    <li><a href="#">Features</a></li>
                                    <li><a href="#">For Brands</a></li>
                                    <li><a href="#">For Creators</a></li>
                                    <li><a href="#">Case Studies</a></li>
                                </ul>
                            </div>
                            <div className="footer-column">
                                <h4>Company</h4>
                                <ul>
                                    <li><a href="#">About Us</a></li>
                                    <li><a href="#">Careers</a></li>
                                    <li><a href="#">Contact</a></li>
                                    <li><a href="#">Newsroom</a></li>
                                </ul>
                            </div>
                            <div className="footer-column">
                                <h4>Resources</h4>
                                <ul>
                                    <li><a href="#">Documentation</a></li>
                                    <li><a href="#">API Reference</a></li>
                                    <li><a href="#">Help Center</a></li>
                                    <li><a href="#">Community</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p className="footer-text">
                            © 2026 Discovr. All rights reserved. Built for creators, by creators.
                        </p>
                        <div className="footer-legal">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
