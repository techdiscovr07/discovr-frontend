import React from 'react';
import { Header, Button, Card, CardBody } from '../../components';
import { ArrowRight, Heart, Coffee, Zap, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './CareersPage.css';

export const CareersPage: React.FC = () => {
    const navigate = useNavigate();

    const jobs: any[] = [];

    const benefits = [
        {
            icon: <Heart size={24} />,
            title: 'Health & Wellness',
            description: 'Comprehensive health insurance. We care about your physical and mental wellbeing.'
        },
        {
            icon: <Coffee size={24} />,
            title: 'Flexible Work',
            description: 'Work from anywhere or join us in our beautiful offices. Core hours that respect your time.'
        },
        {
            icon: <Zap size={24} />,
            title: 'Growth Budget',
            description: 'Annual stipend for courses, books, and conferences to keep you learning and growing.'
        },
        {
            icon: <Users size={24} />,
            title: 'Team Retreats',
            description: 'Quarterly offsites to connect with your team, brainstorm, and celebrate our wins.'
        }
    ];

    return (
        <div className="careers-page">
            <Header transparent />

            {/* Hero Section */}
            <section className="careers-hero">
                <div className="careers-hero-gradient"></div>
                <div className="container">
                    <div className="careers-hero-content">
                        <div className="careers-hero-badge animate-fade-in">
                            <span>Join the Discovr Team</span>
                        </div>
                        <h1 className="careers-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <span>Build the Future of</span>
                            <br />
                            <span className="outline">Creator Economy</span>
                        </h1>
                        <p className="careers-description animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            We are building the ultimate bridge between premium brands and the top 1% of creators. Join us in shaping the next generation of digital influence in India.
                        </p>
                        <div className="careers-cta animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <Button size="lg" rightIcon={<ArrowRight size={20} />} onClick={() => document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' })}>
                                View Open Roles
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="careers-mission">
                <div className="container">
                    <div className="mission-grid">
                        <div className="mission-text">
                            <span className="signature-text">Our Mission</span>
                            <h2>Empowering creators and brands to do their best work.</h2>
                            <p>
                                At Discovr, we believe that influencer marketing shouldn't be a gamble. We are building technology that brings transparency, quality, and scale to the creator economy.
                            </p>
                            <p>
                                We're a fast-moving, passionate team of builders, creators, and operators. We value high agency, radical candor, and a bias for action.
                            </p>
                        </div>
                        <div className="mission-stats">
                            <div className="stat-card">
                                <h3>50+</h3>
                                <p>Team Members</p>
                            </div>
                            <div className="stat-card">
                                <h3>₹10M+</h3>
                                <p>Creator Payouts</p>
                            </div>
                            <div className="stat-card">
                                <h3>4.9/5</h3>
                                <p>Glassdoor Rating</p>
                            </div>
                            <div className="stat-card accent">
                                <h3>100%</h3>
                                <p>Self-Funded & Profitable</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perks & Benefits Section */}
            <section className="careers-perks">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                        <h2 className="section-title">Perks & Benefits</h2>
                        <p className="section-description" style={{ margin: '0 auto' }}>
                            We invest heavily in our team so they can focus on doing the best work of their lives.
                        </p>
                    </div>
                    <div className="perks-grid">
                        {benefits.map((benefit, i) => (
                            <div className="perk-card hover-lift" key={i}>
                                <div className="perk-icon-wrapper">
                                    {benefit.icon}
                                </div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Roles Section */}
            <section id="open-roles" className="open-roles-section">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-8)' }}>
                        <h2 className="section-title">Open <span className="outline">Roles</span></h2>
                        <p className="section-description" style={{ marginLeft: 0 }}>
                            We are currently not actively hiring, but we are always on the lookout for great talent. Send your resume to careers@discovr.com.
                        </p>
                    </div>

                    <div className="jobs-list">
                        {jobs.length === 0 ? (
                            <Card className="no-jobs-card">
                                <CardBody style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)' }}>
                                    <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>No open roles at the moment</h3>
                                    <p style={{ color: 'var(--color-text-tertiary)' }}>Please check back later or drop us an email.</p>
                                </CardBody>
                            </Card>
                        ) : (
                            jobs.map((job, i) => (
                                <Card key={i} className="job-card hover-lift" onClick={() => navigate('/careers')}>
                                    <CardBody style={{ padding: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 className="job-title">{job.title}</h3>
                                            <div className="job-meta">
                                                <span className="meta-tag">{job.department}</span>
                                                <span className="meta-item">{job.location}</span>
                                                <span className="meta-item">{job.type}</span>
                                            </div>
                                        </div>
                                        <div className="job-action">
                                            <Button variant="outline" rightIcon={<ArrowRight size={16} />}>Apply Now</Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
                        <p className="footer-text">
                            © 2026 Discovr. All rights reserved. Built for creators, by creators.
                        </p>
                        <div className="footer-legal">
                            <Link to="/privacy-policy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
