import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components';
import { ArrowLeft } from 'lucide-react';
import './PrivacyPolicy.css';
import '../landing/LandingPage.css';

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
              <p className="legal-updated">Last Updated: March 2026</p>
            </header>

            <p className="legal-intro">
              Welcome to Discovr AI. Discovr AI Private Limited (&quot;Discovr AI,&quot; &quot;we,&quot; or &quot;us&quot;) operates the Discovr AI website and platform. We value your privacy. This Privacy Policy (&quot;Policy&quot;) explains what information we collect, how we use it, when we may share it, and the choices available to you when you use our website at www.getdiscovr.ai, our platform, and any related products, services, or applications (together, the &quot;Service&quot;).
            </p>
            <p className="legal-intro">
              By accessing or using the Service, you agree to this Policy. If you do not agree, please do not use the Service. The version of this Policy in effect at the time you use the Service applies. We encourage you to review this Policy periodically and check the date at the top for updates.
            </p>
            <p className="legal-intro">
              Your use of the Service is also governed by the Discovr AI Terms of Service: <Link to="/terms">https://www.getdiscovr.ai/terms</Link>.
            </p>
            <p className="legal-intro">
              If you have questions about this Policy, contact us at <a href="mailto:support@getdiscovr.ai">support@getdiscovr.ai</a>.
            </p>

            <section className="legal-section">
              <h2>INFORMATION WE COLLECT</h2>
              <p>Our Service helps brand users (each a &quot;Brand&quot;) plan, manage, and run creator/influencer advertising campaigns, including workflow coordination, approvals, and performance reporting. Campaigns may be delivered by content creators (each a &quot;Creator&quot;) through formats such as videos, posts, ad reads, or other creator-led deliverables, as described in our Terms of Service.</p>
              <p>In this Policy: &quot;Brand Submissions&quot; means the information and materials a Brand provides for a campaign (for example: campaign details, instructions, text, audio, video, creative assets, and guidelines). &quot;Creator Content&quot; means the content or deliverables a Creator produces or provides in connection with a campaign. &quot;you&quot; or &quot;your&quot; refers to any user of the Service (Brand, Creator, visitor, or otherwise). Some sections may apply differently to Brands and Creators.</p>
              <p>We collect: &quot;Personal Information&quot;: information that identifies or can reasonably be used to identify you (e.g., name, email address, phone number), and &quot;Aggregate Information&quot;: information that does not identify you (e.g., browser type or general usage patterns). We collect Personal Information and Aggregate Information in the situations described below.</p>

              <h3>Information You Provide to Us</h3>
              <p><strong>Your Account Information</strong> — When you sign up for a Discovr AI account, we may request certain Personal Information and preference details. Depending on your use of the Service, this may include your email address, phone number, and location information (such as city/state/country or postal code) to set up and manage your account and verify access. If you are using the Service on behalf of a business, we may also request details such as company name and job title. If you are a Creator, we may collect information related to how you intend to use the Service, the types of Brands you want to work with, and your content and monetization preferences.</p>
              <p><strong>Your Content</strong> — We collect information and content you submit through the Service in connection with campaigns and workflows—such as text, photos, videos, scripts, drafts, social media posts, messages, and other Creator Content (if you are a Creator), or campaign details and Brand Submissions (if you are a Brand). Collectively, this is &quot;Your Content.&quot; Your Content remains subject to our Terms of Service and may be accessed, used, and/or shared as described there.</p>
              <p><strong>Performance Data and Conversion Data</strong> — We may collect campaign performance metrics and related data for Brands, Creators, and campaigns, including conversion and attribution signals where available. This data may be collected through platform analytics or third-party analytics providers. For Brands, you may choose to provide access to your own performance/conversion sources or authorize us to collect such information from your vendors or service providers in connection with the Service. We may combine data obtained from these sources with data collected through the Service to support the purposes described in this Policy.</p>
              <p><strong>Communications With Us and Other Users</strong> — We collect information when you contact us, and we collect information about communications between users when those communications occur through the Service. For example, if you email us, we collect your email address and the contents of your message. If you message other users via the Service, we may retain logs of those interactions and may create Aggregate Information based on them.</p>
              <p><strong>Aggregate Information</strong> — Aggregate Information does not identify you. We may collect it automatically through your use of the Service, and we may also transform information containing Personal Information into de-identified or aggregated data. We may use, store, and share Aggregate Information without restriction, where permitted by law.</p>
              <p><strong>Payment Information</strong> — Payment processing: If you are a Brand or Creator, we may collect payment-related information needed to charge fees, process payouts, or support transactions. Payment details are often handled by third-party payment processors; we recommend reviewing the processor&apos;s policies. Payment issues: We may access limited payment details to help resolve payment or transaction issues. Alternative methods: In some cases, we may allow payment methods such as bank transfers and will share relevant instructions and any additional terms directly.</p>

              <h3>Information We Automatically Collect</h3>
              <p>Like most websites and apps, the Service may automatically collect information from your device and usage, including: device details (operating system, hardware model, system version, device language); IP address and device identifiers; actions on the Service (pages/screens viewed, searches, clicks, interactions); time, frequency, connection type, and duration of use; network information (carrier, network type, signal strength); engagement with emails or in-app messages (opens/clicks/forwards); cookie or similar technology identifiers (see &quot;Cookies and Analytics&quot;); pages visited before or after our website; device connectivity information such as carrier/SIM-related details (where available).</p>

              <h3>Information From Connected Social Accounts / APIs</h3>
              <p>Creators may choose to connect social/content platform accounts and authorize Discovr AI to access certain data via third-party APIs (for example, Meta/YouTube APIs or other platform APIs) (&quot;Platform APIs&quot;). Our collection, use, storage, and transfer of information obtained via Platform APIs will follow the applicable platform terms and data policies, including any limited-use requirements. Creators connect accounts through the platform&apos;s authorization flow (e.g., OAuth). Discovr AI does not request (and you should not provide) your platform login passwords. A Creator&apos;s platform data (which may include Personal Information) may be shared with Brands in connection with current or past campaigns, or with Brands the Creator is interested in working with, depending on features and settings within the Service.</p>

              <h3>Employment Opportunities</h3>
              <p>If you apply for a role at Discovr AI, we (or our service providers) may collect your Personal Information for recruiting purposes, including evaluating your application and communicating with you. This data may be processed by a third-party applicant tracking system and shared with vendors supporting recruitment. Where required or allowed, we may request voluntary self-identification information for lawful reporting purposes.</p>

              <h3>Cookies and Analytics</h3>
              <p>Cookies are small identifiers stored via your browser that help us recognize your device and improve the Service. You can manage cookies through your browser settings (accept, block, or be notified). Blocking cookies may limit certain features. We may use analytics providers to understand traffic and usage. We may also use cookies, pixels, beacons, and similar technologies to measure engagement with the Service and content. Third parties may process this information on our behalf under our instructions and consistent with this Policy. At this time, the Service may not respond to &quot;Do Not Track&quot; signals.</p>
            </section>

            <section className="legal-section">
              <h2>HOW WE USE YOUR INFORMATION</h2>
              <p>We collect and use information to provide the Service and operate our business, including to: create and manage accounts; help Brands identify and connect with Creators and support campaign execution; run, maintain, improve, and secure the Service; measure performance and conversion signals to support optimization; provide customer support and respond to requests; communicate with you about service-related matters; process payments and payouts; send product updates and, where permitted, marketing communications; conduct analytics, research, and usage trend monitoring; improve safety, fraud prevention, and security; personalize the Service (e.g., tailoring what you see); develop and improve matching, measurement, reporting, and methodology used to improve campaign outcomes; comply with legal obligations and respond to lawful requests; enforce our Terms of Service and investigate possible violations; detect, prevent, and address fraud, security incidents, and technical issues; protect the rights, property, and safety of Discovr AI, our users, and the public; for other purposes disclosed at collection, with your consent, or as otherwise described in this Policy.</p>
            </section>

            <section className="legal-section">
              <h2>HOW WE SHARE YOUR INFORMATION</h2>
              <p>We do not sell your Personal Information. We may share information in limited situations to operate the Service.</p>
              <p><strong>Third-Party Tools and Service Providers</strong> — We may share information with vendors who support our operations and Service delivery (e.g., hosting, analytics, support tools, communications, payment processing). They may access information only as necessary to provide services to us. If we add new third-party tools that receive Personal Information, we will update this Policy accordingly and provide choices where required.</p>
              <p><strong>Creator Accounts &amp; User Communications</strong> — If you are a Creator, your profile and certain information you choose to provide, along with campaign-relevant data, may be visible to Brands through the Service to support campaign decisions and execution. Brands and Creators may communicate through the Service. We may display your name and relevant identifiers to enable these communications.</p>
              <p><strong>With Your Direction or Consent</strong> — We may share information outside Discovr AI when you instruct us to do so or give consent.</p>
              <p><strong>Legal Requirements and Protection</strong> — We may disclose information if we believe in good faith that it is necessary to: comply with law, regulation, subpoena, legal process, or government request; enforce agreements (including our Terms of Service) and investigate potential violations; prevent or address fraud, security issues, or technical problems; protect the rights, property, or safety of Discovr AI, our users, or the public.</p>
              <p><strong>Business Transactions</strong> — If Discovr AI is involved in a merger, acquisition, asset sale, financing, or similar transaction, information may be transferred as part of that process and will remain subject to applicable privacy protections, unless the law requires otherwise.</p>
              <p><strong>Conversion Data</strong> — We may share aggregated or anonymized conversion data and benchmarks. We do not share Brand-specific conversion data with another Brand without authorization.</p>
            </section>

            <section className="legal-section">
              <h2>CHOICES ABOUT YOUR INFORMATION</h2>
              <p>You have options regarding your information. You may choose not to provide certain information, but some details may be required to create an account or access particular features.</p>
              <p><strong>Access and Updates</strong> — You may be able to view and update certain information in the Service. For other requests, contact support@getdiscovr.ai. We may verify identity before acting on requests and may deny requests where required (for example, to prevent fraud or to comply with legal retention obligations).</p>
              <p><strong>Deletion</strong> — You may be able to delete certain information through the Service and may request account deletion by contacting support@getdiscovr.ai. In some cases, we may need to retain information for legal, compliance, or record-keeping reasons. We may retain aggregated or de-identified data derived from your information.</p>
              <p><strong>Marketing</strong> — If you opt in (or where otherwise permitted), we may send marketing communications. You can unsubscribe via the link in emails or by contacting us. If we send SMS, you can opt out by replying STOP (or similar instructions provided).</p>
            </section>

            <section className="legal-section">
              <h2>INTERNATIONAL TRANSFERS</h2>
              <p>Discovr AI is based in India. Our Service may use infrastructure or vendors in India and other countries. If you use the Service from outside India, your information may be transferred, stored, or processed in India or other locations in accordance with applicable law and safeguards.</p>
            </section>

            <section className="legal-section">
              <h2>CHILDREN</h2>
              <p>The Service is not intended for children, and we do not knowingly collect Personal Information from children under the age for valid consent under applicable law. If you believe a child has provided data to us, contact support@getdiscovr.ai.</p>
            </section>

            <section className="legal-section">
              <h2>SECURITY</h2>
              <p>We use reasonable safeguards intended to protect information against unauthorized access and unlawful processing, and against accidental loss or damage. However, no internet-based system can be guaranteed fully secure. You are responsible for safeguarding your login credentials.</p>
            </section>

            <section className="legal-section">
              <h2>THIRD-PARTY WEBSITES AND SERVICES</h2>
              <p>The Service may include links to third-party websites or services. Those third parties may collect information from you. Your interactions with them are governed by their policies, not this Policy.</p>
            </section>

            <section className="legal-section">
              <h2>CHANGES TO THIS POLICY</h2>
              <p>We may revise this Policy from time to time. We will post updates and adjust the &quot;Last Updated&quot; date. Continued use of the Service after updates means you accept the revised Policy.</p>
            </section>

            <section className="legal-section">
              <h2>CONTACT US</h2>
              <p>
                If you have questions, concerns, or requests regarding this Policy, please contact:<br /><br />
                <strong>Discovr AI Private Limited</strong><br />
                Website: www.getdiscovr.ai<br />
                Email: support@getdiscovr.ai<br />
                Address: B-201, Polaris Business Park, Marol, Andheri East, Mumbai - 400093
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
