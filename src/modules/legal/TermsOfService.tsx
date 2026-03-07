import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components';
import { ArrowLeft } from 'lucide-react';
import './PrivacyPolicy.css';
import '../landing/LandingPage.css';

export const TermsOfService: React.FC = () => {
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
              <h1 className="legal-title">Terms of Service</h1>
              <p className="legal-updated">Last Updated: March 2026</p>
            </header>

            <p className="legal-intro">
              Please read these Terms of Service (&quot;Terms&quot;) carefully. These Terms form a legally binding agreement between you and Discovr AI Private Limited (&quot;Discovr AI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) and govern your access to and use of our website at www.getdiscovr.ai, our creator advertising platform, and any related products, features, services, applications, and tools (collectively, the &quot;Service&quot;).
            </p>
            <p className="legal-intro">
              By clicking &quot;accept,&quot; creating an account, or otherwise accessing or using the Service, you confirm that you (a) have read and agree to these Terms, (b) acknowledge our <Link to="/privacy-policy">Privacy Policy</Link>, and (c) will provide accurate information. If you do not agree, do not use the Service.
            </p>
            <p className="legal-intro">
              If you are under 18 years old, you may use the Service only with the consent and supervision of a parent or legal guardian who agrees to these Terms on your behalf. If you are using the Service on behalf of an organization, brand, agency, or creator entity, you represent that you have authority to bind that entity to these Terms.
            </p>
            <p className="legal-intro legal-notice">
              <strong>Dispute Notice:</strong> These Terms include a dispute resolution clause, which may require arbitration on an individual basis and may limit class actions (see Section 12).
            </p>
            <p className="legal-intro">
              If you have questions, contact <a href="mailto:support@getdiscovr.ai">support@getdiscovr.ai</a>.
            </p>

            <section className="legal-section">
              <h2>1) Account Registration and Security</h2>
              <p><strong>Account responsibility.</strong> You are responsible for all activity under your account and for keeping your login credentials secure.</p>
              <p><strong>Accurate information.</strong> You agree to provide and maintain accurate, current, and complete account and billing information.</p>
              <p><strong>Unauthorized access.</strong> Notify us immediately if you suspect unauthorized access or misuse.</p>
              <p><strong>No re-registration after ban.</strong> You may not create a new account if we have suspended or terminated your access previously, unless we provide written approval.</p>
            </section>

            <section className="legal-section">
              <h2>2) The Service and Key Definitions</h2>
              <p>Discovr AI helps brands and agencies (each, a &quot;Brand&quot;) plan, coordinate, and measure creator/influencer advertising campaigns, and helps creators/influencers (each, a &quot;Creator&quot;) participate in campaigns and deliver content.</p>
              <p>&quot;Brand Submissions&quot; means campaign briefs, instructions, creative assets, guidelines, and any other materials submitted by a Brand through the Service.</p>
              <p>&quot;Creator Content&quot; means content or deliverables produced or posted by a Creator in connection with a campaign (including scripts, drafts, videos, posts, captions, etc.).</p>
              <p>&quot;Campaign&quot; means a Brand&apos;s campaign request/brief and associated workflow, deliverables, and reporting within the Service.</p>
              <p>&quot;Properties&quot; means the social channels, websites, or platforms where Creator Content may be published or used as part of a Campaign, as agreed between Brand and Creator and supported by the Service.</p>
              <p><strong>License to use the Service.</strong> Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable right to access and use the Service for its intended business purposes.</p>
              <p>We may modify, update, suspend, or discontinue parts of the Service at any time. Updates and modifications are part of the Service.</p>
            </section>

            <section className="legal-section">
              <h2>3) User Conduct, Restrictions, and Compliance</h2>
              <h3>3.1 Prohibited conduct</h3>
              <p>You agree not to (and not to assist others to):</p>
              <ul>
                <li>violate any applicable law, regulation, or court order</li>
                <li>infringe intellectual property, privacy, publicity, or other rights of any party</li>
                <li>impersonate others or provide misleading information</li>
                <li>submit or distribute unlawful, abusive, harassing, hateful, violent, pornographic, obscene, or otherwise objectionable material</li>
                <li>send spam or unauthorized commercial communications through the Service</li>
                <li>scrape, crawl, or harvest data from the Service (including user data), or attempt to bypass access controls</li>
                <li>introduce malware, disrupt systems, or attempt to reverse engineer the Service</li>
                <li>use the Service to create or build a competing product by copying our features, flows, or content</li>
                <li>attempt to route transactions initiated via the Service outside the Service for the purpose of avoiding platform processes or fees</li>
              </ul>
              <p>We may suspend or terminate access if we reasonably believe you have violated these Terms, and we may take other actions we deem necessary to protect the Service, users, or our business.</p>
              <h3>3.2 Brand-specific responsibilities</h3>
              <p>If you are a Brand, you agree that:</p>
              <ul>
                <li>your Brand Submissions are accurate and lawful, and do not defame or disparage others</li>
                <li>you have rights to all content/assets you provide (logos, trademarks, creatives, etc.)</li>
                <li>you will comply with advertising and endorsement disclosure laws and guidelines applicable to your Campaigns, including Indian requirements (e.g., ASCI influencer advertising guidelines) and platform policies as applicable</li>
              </ul>
              <h3>3.3 Creator-specific responsibilities</h3>
              <p>If you are a Creator, you agree that:</p>
              <ul>
                <li>you will deliver Creator Content consistent with agreed Campaign requirements (timelines, deliverables, usage requirements)</li>
                <li>Creator Content will not contain content that you do not have the right to publish or disclose</li>
                <li>you will follow applicable disclosure requirements (e.g., &quot;#ad&quot; / &quot;#sponsored&quot; or equivalent), and comply with platform policies and applicable advertising guidelines</li>
                <li>you will not submit Creator Content that infringes third-party rights or violates law</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4) Content, Licenses, and Intellectual Property</h2>
              <h3>4.1 Ownership</h3>
              <p><strong>Your content.</strong> As between you and Discovr AI, you retain ownership of the content you create or submit (Brand Submissions or Creator Content), subject to the licenses granted below.</p>
              <p><strong>Our platform.</strong> Discovr AI (and its licensors) owns the Service, including all software, workflows, designs, interfaces, and branding (&quot;Discovr AI Content&quot;) and related intellectual property.</p>
              <h3>4.2 License you grant to Discovr AI</h3>
              <p>To operate the Service, you grant Discovr AI a worldwide, non-exclusive, royalty-free license to host, store, reproduce, transmit, display, and otherwise use your content and materials submitted through the Service, solely to: provide and improve the Service; facilitate Campaign workflows (including approvals, collaboration, reporting); maintain security, prevent fraud, and enforce policies; generate aggregated/de-identified insights (without identifying you). This license continues as needed to provide the Service and for reasonable archival/legal purposes, unless prohibited by law or contract.</p>
              <h3>4.3 Creator content and brand usage</h3>
              <p>Unless the Brand and Creator agree otherwise in writing (including within the Service), a Brand may use Creator Content only as necessary for the Campaign and reporting within the Service. Any repurposing, whitelisting, paid usage, or extended usage rights must be explicitly agreed and documented.</p>
              <h3>4.4 Feedback</h3>
              <p>If you provide suggestions or feedback, you grant us the right to use it without restriction or compensation, including incorporating it into the Service.</p>
            </section>

            <section className="legal-section">
              <h2>5) Confidentiality</h2>
              <p>&quot;Confidential Information&quot; means non-public information disclosed by one party to the other that a reasonable person would understand to be confidential, including product details, business plans, pricing, and certain campaign information.</p>
              <p>Each party agrees to: protect Confidential Information using reasonable care; use it only to perform obligations or exercise rights under these Terms; disclose it only to representatives who need to know and are bound by confidentiality obligations.</p>
              <p>Confidential Information does not include information that is publicly available without breach, independently developed, or rightfully obtained without restriction.</p>
            </section>

            <section className="legal-section">
              <h2>6) Third-Party Platforms and Integrations</h2>
              <p>The Service may integrate with or link to third-party platforms (e.g., social networks, analytics providers, payment processors). Your use of those third parties is governed by their terms and policies. We do not control third-party services and are not responsible for their actions or downtime.</p>
              <p>Creators may connect social accounts through platform authorization flows (e.g., OAuth). You agree not to share passwords with us.</p>
            </section>

            <section className="legal-section">
              <h2>7) Fees, Billing, Taxes, and Payments</h2>
              <h3>7.1 Brand payments</h3>
              <p>Brands may be required to pay fees for Campaigns or subscriptions as displayed in the Service or agreed in writing. Fees may include platform/service fees and may change over time with notice as required by law.</p>
              <p><strong>Invoices/Payment terms.</strong> If we invoice you, payment terms will be stated on the invoice. Late payments may incur interest/penalties as allowed by law.</p>
              <p><strong>Taxes.</strong> Fees may be exclusive of applicable taxes (including GST) unless stated otherwise. You are responsible for taxes applicable to your purchases except taxes on our income.</p>
              <h3>7.2 Creator payouts</h3>
              <p>Creators may receive payments through payment processors or bank transfers supported by the Service, subject to: completion of required onboarding and verification; applicable tax requirements (including withholding/TDS where legally required); chargebacks, disputes, or reversals as applicable; platform rules, timing, and reconciliation windows. Creators are responsible for reporting their income and complying with their tax obligations.</p>
              <h3>7.3 Payment processors</h3>
              <p>We may use third-party payment providers. You agree that payment processing is governed by the provider&apos;s terms and privacy policy. We are not responsible for errors or delays caused by payment providers.</p>
              <h3>7.4 No refunds (unless stated)</h3>
              <p>Unless required by law or expressly stated in writing, fees are non-refundable. Specific Campaign cancellation/credit rules (if any) may be described in the Service or in a written order form.</p>
            </section>

            <section className="legal-section">
              <h2>8) Termination and Suspension</h2>
              <p><strong>By you.</strong> You may stop using the Service at any time. You may request account closure by contacting support.</p>
              <p><strong>By us.</strong> We may suspend or terminate access to the Service if we believe you violated these Terms, if required by law, or to protect the Service and users.</p>
              <p><strong>Effect of termination.</strong> Upon termination, your right to use the Service ends immediately. Certain sections survive termination by their nature (including confidentiality, IP, disclaimers, limitation of liability, indemnity, and dispute resolution). We may provide a limited window for account data export where feasible, subject to legal retention and security requirements.</p>
            </section>

            <section className="legal-section">
              <h2>9) Disclaimers</h2>
              <p>To the maximum extent permitted under applicable law: The Service is provided &quot;as is&quot; and &quot;as available.&quot; We do not guarantee specific business outcomes, including specific campaign performance, reach, conversions, or ROI. We do not warrant that the Service will be uninterrupted, secure, or error-free, or that defects will be corrected immediately. You are responsible for your use of the Service and for verifying outputs, including campaign decisions and any AI-assisted outputs.</p>
            </section>

            <section className="legal-section">
              <h2>10) Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, Discovr AI (and its directors, employees, affiliates, and partners) will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, goodwill, or business interruption.</p>
              <p>To the extent liability cannot be excluded, our aggregate liability for any claims relating to the Service will be limited to the amounts paid by you to Discovr AI for the Service in the 12 months preceding the event giving rise to the claim (or a lower amount if required by applicable law).</p>
            </section>

            <section className="legal-section">
              <h2>11) Indemnity</h2>
              <p>You agree to indemnify and hold harmless Discovr AI and its affiliates, directors, employees, and agents from any third-party claims arising from: your use of the Service; your violation of these Terms; your content (Brand Submissions or Creator Content); your products, services, or advertising claims (if you are a Brand); your infringement of third-party rights. We will notify you of any claim and cooperate reasonably at your expense.</p>
            </section>

            <section className="legal-section">
              <h2>12) Dispute Resolution; Arbitration; Class Waiver</h2>
              <h3>12.1 Good-faith resolution</h3>
              <p>Before formal proceedings, you agree to first contact us at support@getdiscovr.ai and attempt to resolve disputes informally.</p>
              <h3>12.2 Arbitration</h3>
              <p>If not resolved, disputes may be referred to arbitration under the Arbitration and Conciliation Act, 1996. Seat and venue: Mumbai, Maharashtra, India (unless we agree otherwise). Language: English. Arbitrator: A sole arbitrator appointed by mutual agreement (or per the Act if not agreed).</p>
              <h3>12.3 Class action waiver</h3>
              <p>To the extent permitted by law, disputes will be brought on an individual basis and not as a class, collective, or representative action.</p>
              <h3>12.4 Court jurisdiction for permitted matters</h3>
              <p>Either party may seek interim injunctive relief or other urgent relief in courts of competent jurisdiction at Mumbai.</p>
            </section>

            <section className="legal-section">
              <h2>13) Governing Law</h2>
              <p>These Terms are governed by the laws of India, without regard to conflict of laws principles. Subject to Section 12, courts in Mumbai, Maharashtra will have jurisdiction.</p>
            </section>

            <section className="legal-section">
              <h2>14) Miscellaneous</h2>
              <p><strong>Third-party links.</strong> The Service may contain links to third-party sites; we are not responsible for them.</p>
              <p><strong>Independent relationship.</strong> These Terms do not create employment, partnership, or agency relationship between you and Discovr AI.</p>
              <p><strong>Force majeure.</strong> Neither party is liable for delays beyond reasonable control (excluding payment obligations).</p>
              <p><strong>Severability.</strong> If a provision is unenforceable, the remainder stays effective.</p>
              <p><strong>Assignment.</strong> You may not assign these Terms without our consent; we may assign in connection with corporate restructurings or asset transfers.</p>
              <p><strong>Updates.</strong> We may update these Terms from time to time by posting an updated version and changing the &quot;Last Updated&quot; date. Continued use means acceptance.</p>
            </section>

            <section className="legal-section">
              <h2>15) Contact</h2>
              <p>
                <strong>Discovr AI Private Limited</strong><br />
                Website: www.getdiscovr.ai<br />
                Email: support@getdiscovr.ai<br />
                Registered Address: B 201 Polaris, Marol, Mumbai - 40059
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
