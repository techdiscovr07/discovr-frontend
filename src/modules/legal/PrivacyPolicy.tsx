import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components';
import { ArrowLeft, Instagram, Users, Mail } from 'lucide-react';
import './PrivacyPolicy.css';
import '../landing/LandingPage.css'; /* footer styles */

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="legal-page">
            <Header transparent />

            <main className="legal-main">
                <div className="container legal-container">
                    <Link to="/" className="legal-back">
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    <div className="legal-content">
                        <header className="legal-header">
                            <p className="legal-brand">getdiscovr.ai</p>
                            <h1 className="legal-title">Privacy Policy</h1>
                            <p className="legal-updated">Last Updated: February 23, 2026</p>
                        </header>

                        <p className="legal-intro">
                            Welcome to getdiscovr.ai. Discovr, Inc. ("Discovr," "we," and "us") is the owner and operator of the getdiscovr.ai website and platform, and your privacy is important to us. We have developed this Privacy Policy (this "Policy") to describe the information we collect, how that information may be used, with whom it may be shared, and your choices, in connection with your use of our website at www.getdiscovr.ai, the martech ad platform we make available, and/or any related services and apps (collectively referred to in this Policy as our "Service").
                        </p>
                        <p className="legal-intro">
                            By accessing the Service, you agree to be bound by this Policy. If you do not agree to the terms of this Policy, please do not use the Service. Each time you use the Service, the current version of this Policy will apply. Accordingly, when you use the Service, you should check the date of this Policy (which appears at the top) and review any changes since you last reviewed it. Your use of the Service is also subject to the getdiscovr.ai Terms of Service available at <a href="https://getdiscovr.ai/terms" target="_blank" rel="noopener noreferrer">https://getdiscovr.ai/terms</a>.
                        </p>
                        <p className="legal-intro">
                            If you have any questions regarding this Policy, please contact us at <a href="mailto:privacy@getdiscovr.ai">privacy@getdiscovr.ai</a>.
                        </p>

                        <section className="legal-section">
                            <h2>INFORMATION WE COLLECT</h2>
                            <p>Our Service offers brand users (each, a "Brand") the ability to discover, connect with, and launch ad campaigns (each, an "Ad") to promote and/or endorse their products, services, or brand. The Ad is generally fulfilled by content creators (each, a "Creator") via sponsored posts, stories, reels, or other content formats on Instagram, and may be fulfilled through other formats as set forth in getdiscovr.ai's Terms of Service.</p>
                            <p>In this Policy, we'll refer to anything a Brand provides to a Creator in connection with an Ad bid/request — such as the details of a Brand's ad campaign, text, images, video, or other materials — as "Brand Submissions," and the format/means by which a Creator fulfills an Ad as "Creator Content." The terms "you" or "your" in this Policy will refer generically to any user of our Service, whether a Brand, a Creator, visitor, or otherwise.</p>
                            <p>We collect two types of information: "personal information," which is information that can be used to identify you (such as your name or email address), and "aggregate information," which is information that cannot be used to identify you (such as frequency of visits to our website and your browser type).</p>

                            <h3>Information You Provide to Us</h3>
                            <p><strong>Your Account Information:</strong> When you register for an account with getdiscovr.ai, you will be asked to provide certain personal information, including your email address, phone number, date of birth, and physical location (such as your zip code) to set up your account and verify your identity. If you are a company using our Service, we may ask for additional information such as company name and job title. From a Creator, we will collect information about how the Creator wishes to use the Service, the types of Brands they prefer to work with, and the nature of content they wish to monetize using the Service.</p>
                            <p><strong>Your Content:</strong> When you use our Service, we collect content you submit in connection with Ad bids/requests, including text, photos, videos, Instagram posts, stories, and other Creator Content, or the details of an Ad campaign and other Brand Submissions (collectively, "Your Content"). Your Content is subject to our Terms of Service at all times.</p>
                            <p><strong>Performance Data and Conversion Data:</strong> We may collect performance data and metrics related to Creators, Brands, and/or Ad campaigns, as well as conversion data and attribution. We may use third-party analytics providers, including Meta (Instagram's parent company), Google Analytics, and others to collect such information. For Brands, you may also provide getdiscovr.ai access to your own sources of performance and conversion data. Getdiscovr.ai may combine performance and conversion data provided by you and/or your service providers with data collected by the Service.</p>
                            <p><strong>Your Communications with Us and Other Users:</strong> We collect information when you communicate with us and about your communications with other users through the Service, including log data and aggregated information about those communications.</p>
                            <p><strong>Payment Information:</strong> If you are a Brand or a Creator, we may collect your payment information through the Service to process bid amounts, fees, and payments. All payment information is stored and processed by our third-party payment processors, such as Stripe. We encourage you to review Stripe's policies (available at stripe.com/privacy). In limited circumstances, Getdiscovr.ai may permit alternative payment methods such as ACH or wire transfer, and will provide relevant payment instructions directly.</p>

                            <h3>Information We Automatically Collect</h3>
                            <p>As with most apps and websites, when you use our Service we automatically receive and collect information from your device. This includes:</p>
                            <ul>
                                <li>Device information, such as operating system, hardware, system version, IP address, device ID, and device language.</li>
                                <li>The specific actions you take when using our Service, including pages and screens you view, search terms you enter, and how you interact with our Service.</li>
                                <li>The time, frequency, connection type, and duration of your use of our Service.</li>
                                <li>Information about your wireless and mobile network connections, such as mobile phone number, service provider, and signal strength.</li>
                                <li>Information regarding your interaction with email messages and in-app communications, such as whether you opened, clicked on, or forwarded them.</li>
                                <li>Identifiers associated with cookies or other technologies that may uniquely identify your device or browser.</li>
                                <li>Pages you visited before or after navigating to our website.</li>
                            </ul>

                            <h3>Information We Collect from Instagram</h3>
                            <p>In connection with using the Service, a Creator may authorize getdiscovr.ai to access and obtain data from the Creator's Instagram account using application program interfaces provided by Meta (the "Meta APIs"). Getdiscovr.ai's use, storage, and/or transfer of information received from Meta APIs will adhere to Meta's Platform Policy and applicable data use requirements.</p>
                            <p>Creators will authorize getdiscovr.ai to access Instagram data via Meta APIs by providing consent through Meta's authorization process. Getdiscovr.ai does not receive (and please do not send getdiscovr.ai) your Instagram login credentials.</p>
                            <p>A Creator's Instagram data (including Personal Information such as follower count, engagement metrics, and public profile details) may be shared with Brands in connection with a current or former Ad campaign, or with Brands the Creator is interested in working with in the future.</p>

                            <h3>Employment Opportunities</h3>
                            <p>If we or a third-party service provider have collected your Personal Information in connection with a career opportunity at getdiscovr.ai, you are giving us permission to use and retain your Personal Information for evaluating your application and interacting with you about relevant roles. This information may be processed by a third-party talent tracking solution provider and relevant vendors carrying out recruitment work on our behalf. We or our service providers may ask you to provide self-identifying information (such as veteran status, gender, and ethnicity) in accordance with applicable employment regulations. Providing such self-identifying information is voluntary.</p>

                            <h3>Cookies and Analytics</h3>
                            <p>Cookies are alphanumeric identifiers we transfer to your computer's hard drive through your web browser to help us identify you when you visit our website. You may configure your browser to accept all cookies, be notified when a cookie is set, or reject all cookies. Rejecting all cookies may disable certain features of our Service that require registration.</p>
                            <p>We may use third parties, such as Google Analytics, to analyze traffic to our website. Google Analytics does not create individual profiles for visitors and only collects aggregate data. To disable Google Analytics, you may download the browser add-on at <a href="http://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">http://tools.google.com/dlpage/gaoptout</a>. We may also use cookies, pixels, beacons, or other web tracking technologies to track time spent on our Service and content engagement.</p>
                            <p>At the present time, our Service does not respond to "Do Not Track" signals or similar mechanisms.</p>
                        </section>

                        <section className="legal-section">
                            <h2>HOW WE USE YOUR INFORMATION</h2>
                            <p>In general, we collect information from you so that we can provide our Service, operate our business, and fulfill information you request from us. This includes the following uses and purposes:</p>
                            <ul>
                                <li>Create and administer your account.</li>
                                <li>Fulfill requests from Brands to identify and connect with Creators, and facilitate resulting Ad campaigns.</li>
                                <li>Provide, operate, improve, maintain, and protect our Service.</li>
                                <li>Track performance data and conversion metrics to help you optimize use of the Service.</li>
                                <li>Provide technical and other support.</li>
                                <li>Communicate with you.</li>
                                <li>Enable and facilitate acceptance and processing of payments.</li>
                                <li>Send you Service and company updates, marketing communications (where you have opted in), and information about products and services that may interest you.</li>
                                <li>Conduct research and analysis, and monitor and analyze trends and usage.</li>
                                <li>Enhance or improve user experience, our business, and our Service, including safety and security.</li>
                                <li>Personalize our Service to you by, for example, customizing content that you see.</li>
                                <li>Create advertising models and other methodologies to improve the performance of Ad campaigns.</li>
                                <li>Communicate with you and respond to inquiries.</li>
                                <li>Operate our business and perform any function we believe in good faith is necessary to protect the security or proper functioning of our Service.</li>
                                <li>Comply with any applicable law, regulation, subpoena, legal process, or governmental request.</li>
                                <li>Enforce contracts and applicable Terms of Service, including investigation of potential violations.</li>
                                <li>Detect, prevent, or otherwise address fraud, security, or technical issues.</li>
                                <li>Protect against harm to the rights, property, or safety of getdiscovr.ai, our users, customers, or the public.</li>
                            </ul>
                        </section>

                        <section className="legal-section">
                            <h2>HOW WE SHARE YOUR INFORMATION</h2>
                            <p>We do not sell your personal information. Like most companies, we share information in certain circumstances with third parties through the operation of our Service and business. Below we explain when that happens.</p>

                            <h3>Third Party Tools and Service Providers</h3>
                            <p>We do not currently use third party tools as part of the Service and therefore do not share your Personal Information with third party tools. If we decide to use third party tools in the future, we will update this Privacy Policy to identify those tools and what information is shared with them, if any. We will provide you the opportunity to opt out of sharing your data with third party tools if you choose.</p>
                            <p>We may use third party service providers to assist us with operating our business and providing our Service, such as vendors that help us maintain our Service and partners that assist us with marketing and communication. These service providers will have access to your information in order to provide services to us.</p>

                            <h3>Creator Accounts & User Communications</h3>
                            <p>If you have a Creator account, your profile and user information — including but not limited to your demographic information, talent rank, Instagram performance metrics, and Your Content — are accessible by Brands.</p>
                            <p>Brands and Creators can also message directly through the Service, and getdiscovr.ai will display your name to other users to facilitate these communications.</p>

                            <h3>As Directed By You and With Your Consent</h3>
                            <p>Except as otherwise provided in this Policy, we share information with companies, organizations, or individuals outside of getdiscovr.ai only at your direction or when we have your consent to do so.</p>

                            <h3>Legal Proceedings</h3>
                            <p>We may share information with third party companies, organizations, governmental authorities, or individuals outside of getdiscovr.ai if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to:</p>
                            <ul>
                                <li>Meet any applicable law, regulation, subpoena, legal process, or governmental request.</li>
                                <li>Enforce a contract, including any applicable Terms of Service, including investigation of potential violations.</li>
                                <li>Detect, prevent, or otherwise address fraud, security, or technical issues.</li>
                                <li>Protect against harm to the rights, property, or safety of getdiscovr.ai, our users, customers, or the public as required or permitted by law.</li>
                            </ul>

                            <h3>Sale or Merger</h3>
                            <p>We may share information about you as part of a merger or acquisition. If getdiscovr.ai or any of its affiliates is involved in a merger, asset sale, financing, liquidation, bankruptcy, or acquisition of all or some portion of our business, we may share and/or transfer your information with the relevant company before and after the transaction closes. In such a case, unless permitted or otherwise directed by applicable law, your information would remain subject to the terms of the applicable privacy policy in effect at the time of such transfer.</p>

                            <h3>Conversion Data</h3>
                            <p>While we may share aggregated anonymized conversion data and metrics (e.g., a Creator is in the top 10% at driving conversions) with third parties (including other Creators and Brands), getdiscovr.ai will not share Brand-specific conversion data with any other Brand or Creator.</p>
                        </section>

                        <section className="legal-section">
                            <h2>CHOICES ABOUT YOUR INFORMATION</h2>
                            <p>We strive to provide you with choices with respect to your information. You can opt not to disclose certain information to us, but keep in mind some information may be needed to create an account or to use some of our Service and features.</p>

                            <h3>Modification and Access to Your Information</h3>
                            <p>You can access and modify most of your information through the Service. If you would like to modify or access additional information not available through the Service, please contact us at <a href="mailto:privacy@getdiscovr.ai">privacy@getdiscovr.ai</a>. We may ask you to verify your identity or provide additional information before we act on your request.</p>

                            <h3>Deleting Your Information or Your Account</h3>
                            <p>You can delete most of your information through the Service, and you can delete your account through our desktop and mobile-enabled app. You may also request deletion of your account by contacting us at <a href="mailto:privacy@getdiscovr.ai">privacy@getdiscovr.ai</a>. Please note that in some cases we may be prohibited from deleting certain information, and some information may remain in our records after your deletion. We may use any aggregated or de-identified data derived from or incorporating your information after you update or delete it, but not in a manner that would identify you personally.</p>

                            <h3>Marketing</h3>
                            <p>If you opt-in, or when you use the Service, we may send you newsletters and other messages, including marketing emails, SMS text messages, and other communications about our products and services. You may unsubscribe from getdiscovr.ai marketing communications at any time by following the "unsubscribe" link at the bottom of any such communication.</p>
                            <p>If you do not wish to continue receiving SMS/MMS mobile messages from us, reply STOP, END, CANCEL, UNSUBSCRIBE, or QUIT to any mobile message from us. If you sign up to receive text messages from getdiscovr.ai, you agree to receive recurring automated promotional and personalized marketing text messages. Consent to receive automated marketing text messages is not a condition of any purchase. Message and data rates may apply.</p>
                        </section>

                        <section className="legal-section">
                            <h2>INTERNATIONAL TRANSFER</h2>
                            <p>We are based in the United States, and our Service is hosted there. If you are using our Service from another country, the laws governing our collection and use of information may be different from the laws of your country. If you decide to use our Service, or share your information with us, you are agreeing to be governed by the laws of the United States and agree to the transfer of your information to the United States.</p>
                        </section>

                        <section className="legal-section">
                            <h2>CHILDREN</h2>
                            <p>Our Service is not directed at children under 13, and we do not knowingly collect information from children under 13. If you are under 13, please do not attempt to use our Service or send any information about yourself to us. If you are the parent of a child under the age of 13 and you believe they have shared information with us, please contact us at <a href="mailto:privacy@getdiscovr.ai">privacy@getdiscovr.ai</a> so that we can remove such information from our systems.</p>
                        </section>

                        <section className="legal-section">
                            <h2>SECURITY OF YOUR INFORMATION</h2>
                            <p>We use reasonable security measures, including measures designed to protect against unauthorized or unlawful processing and against accidental loss, destruction, or damage to your information. However, since the Internet is not a 100% secure environment, we cannot guarantee the security of any information you transmit to us. It is your responsibility to protect the security of your login information.</p>
                        </section>

                        <section className="legal-section">
                            <h2>THIRD PARTY WEBSITES AND SERVICES</h2>
                            <p>Our Service may contain links to other websites and services operated by third parties, and may include social media features such as buttons or links. These third-party websites and services may collect information about you if you click on a link or visit those websites. Your interactions with these features and third parties are governed by the privacy policy of the third party, not by this Policy.</p>
                        </section>

                        <section className="legal-section">
                            <h2>CHANGES TO THIS POLICY</h2>
                            <p>We may make changes to this Policy from time to time. When we do, we will post the updated version on this page. We encourage you to read this page each time you use our Service so that you will be aware of any changes, and your continued use of our Service shall constitute your acceptance of any such changes. Changes to this Policy take effect from the date of publication unless stated otherwise.</p>
                        </section>

                        <section className="legal-section">
                            <h2>CONTACT US</h2>
                            <p>If you have any comments, questions, concerns, or suggestions about this Policy, or about our privacy practices in general, please contact us at:</p>
                            <p className="legal-contact">
                                <strong>getdiscovr.ai (Discovr, Inc.)</strong><br />
                                Email: <a href="mailto:privacy@getdiscovr.ai">privacy@getdiscovr.ai</a><br />
                                Website: <a href="https://www.getdiscovr.ai" target="_blank" rel="noopener noreferrer">www.getdiscovr.ai</a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer - matches LandingPage structure */}
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
                                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                    <li><Link to="/terms">Terms of Service</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="footer-text">
                            © 2026 Discovr. All rights reserved. Built for creators, by creators.
                        </p>
                        <div className="footer-legal">
                            <Link to="/privacy-policy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
