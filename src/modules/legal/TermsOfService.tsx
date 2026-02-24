import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components';
import { ArrowLeft, Instagram, Users, Mail } from 'lucide-react';
import './PrivacyPolicy.css'; // since it seems to use PrivacyPolicy.css
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
                            <p className="legal-updated">Last Updated: February 23, 2026</p>
                        </header>

                        <p className="legal-intro">
                            Please read these getdiscovr.ai Terms of Service ("Terms") carefully because they're a binding agreement between you and Discovr, Inc. ("getdiscovr.ai," "us," or "we") and apply to your use of our website at www.getdiscovr.ai, the martech ad platform we make available through it, and/or any related services and apps (collectively referred to as our "Service"). By clicking on an "accept" button, creating an account, or otherwise accessing and/or using our Service, you automatically agree to these Terms, acknowledge our <Link to="/privacy-policy">Privacy Policy</Link>, and certify that you are at least 13 years of age and providing truthful and accurate information about yourself.
                        </p>
                        <p className="legal-intro">
                            If you are less than 18 years of age, please ask your parent or legal guardian to review and agree to these Terms on your behalf. If you're accepting these Terms on behalf of a company, Brand, or Creator, you represent that you have full authority to bind that entity. If you do not agree with these Terms, do not create an account or use our Service.
                        </p>
                        <p className="legal-intro legal-notice">
                            <strong>IMPORTANT:</strong> THESE TERMS CONTAIN A BINDING AND MANDATORY ARBITRATION AND CLASS ACTION/JURY TRIAL WAIVER PROVISION THAT REQUIRES THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR CLASS ACTIONS, AND LIMITS THE REMEDIES AVAILABLE TO YOU IN THE EVENT OF CERTAIN DISPUTES.
                        </p>

                        <section className="legal-section">
                            <h2>1. YOUR ACCOUNT</h2>
                            <p>If you create an account on our Service, you are responsible for maintaining the security of your account. You agree to keep your contact and billing information (including your email address) up-to-date and to comply with all billing procedures, including providing and maintaining accurate and lawful billing information for active accounts. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.</p>
                            <p>You are fully responsible for all activity that occurs under or in connection with your account. If you have created an account on behalf of another person or entity, you represent that you have all necessary rights and consents from that person or entity to do so. If you are a Creator, you must initially create your own account before granting others access to it. You will not create an account if you have been previously banned or removed from our Service.</p>
                        </section>

                        <section className="legal-section">
                            <h2>2. OUR SERVICE</h2>
                            <p>Our Service offers brand users (each, a "Brand") the ability to discover, connect with, and launch ad campaigns (each, an "Ad") to promote and/or endorse their product, service, or brand. Ads are generally fulfilled by content creators (each, a "Creator") via sponsored posts, stories, reels, or other Instagram content formats agreed upon by a Brand and Creator and supported by our Service. Each Creator has sole discretion to determine how to fulfill and personalize an Ad for a Brand; however, by accepting a Brand's bid/request for an Ad, a Creator is also accepting and agreeing to such Brand's Ad campaign requirements, including the timeframe for fulfillment, and to serve the Ad within Creator Content on the platforms or properties specified in the campaign requirements (the "Properties").</p>
                            <p>We'll refer to anything a Brand provides to a Creator in connection with an Ad bid/request — such as the details of a Brand's ad campaign, text, images, audio, video, or other materials — as "Brand Submissions," and the format/means by which a Creator fulfills an Ad as "Creator Content." The terms "you" or "your" in these Terms refer generically to any user of our Service, whether a Brand, a Creator, visitor, or otherwise.</p>
                            <p>Subject to your compliance with these Terms, we grant you a non-exclusive, non-sublicensable, non-transferable, revocable right to access and use our Service for the purpose of purchasing and/or selling Ads and other purposes authorized by these Terms. We may update, upgrade, revise, or change our Service and its features and functionality at any time. Updates are considered part of our Service.</p>
                        </section>

                        <section className="legal-section">
                            <h2>3. RESTRICTIONS; ACKNOWLEDGEMENTS</h2>
                            <h3>3.1 Restrictions</h3>
                            <p>You will not:</p>
                            <ul>
                                <li>Violate any law, regulation, or court order.</li>
                                <li>Access, download, use, or export our Service in violation of United States or other applicable export laws or regulations.</li>
                                <li>Violate, infringe, or misappropriate the intellectual property, privacy, publicity, moral, or other legal rights of any third party.</li>
                                <li>Use a false identity or provide any false or misleading information to us or to other users of our Service.</li>
                                <li>Submit, post, promote, share, or communicate anything that is explicitly or implicitly: illegal, abusive, harassing, violent, threatening, hateful (including hate speech), racist, derogatory, harmful to any reputation, pornographic, indecent, profane, obscene, or otherwise objectionable.</li>
                                <li>Send advertising or commercial communications other than Ads, including spam or any other unsolicited or unauthorized communications.</li>
                                <li>Engage in harvesting or use software, including spyware, designed to collect data from our Service or from any user of our Service.</li>
                                <li>Transmit any virus, computer instruction, or technological means intended to disrupt, damage, or interfere with our Service or the use of computers or related systems.</li>
                                <li>Stalk, harass, threaten, harm, or impersonate any third party.</li>
                                <li>Participate in or promote any fraudulent or illegal activity, including phishing, money laundering, or fraud.</li>
                                <li>Use any means to scrape or crawl any part of our Service.</li>
                                <li>Attempt to circumvent any technological measure implemented by us, our providers, or any other third party to protect our Service, users, or other third parties.</li>
                                <li>Access our Service to obtain information to build a similar or competitive website, application, or service.</li>
                                <li>Attempt to decipher, decompile, disassemble, or reverse engineer any of the software or other underlying code used to provide our Service.</li>
                                <li>Use our Service to promote any financial instrument or advice, including crypto investments.</li>
                                <li>Conclude any transaction initiated through our Service outside of our Service, or otherwise terminate, reduce, or negatively alter your relationship with getdiscovr.ai for the purpose of engaging in a similar transaction outside our Service.</li>
                                <li>Advocate, encourage, or assist any third party in doing any of the foregoing.</li>
                            </ul>
                            <p>Brand Submissions will not disparage or defame any person, entity, brand, or business. Creators will not fulfill an Ad for any user involved in or promoting illegal or unlawful activity, violence, or hate speech.</p>
                            <p>We reserve the right to decide whether your use of our Service violates these Terms and may, at any time, without notice or liability and in our sole discretion, suspend or terminate your access to our Service, remove or ban you, or take other appropriate action for violation of these Terms.</p>

                            <h3>3.2 Brand Acknowledgements</h3>
                            <p>You acknowledge and agree that:</p>
                            <ul>
                                <li>Creator Content (excluding elements of any Brand Submission incorporated therein) is owned by the Creator who created it, and Brand does not have any right or license to repurpose or independently use Creator Content except as expressly agreed with a Creator under Section 4.1.3.</li>
                                <li>We are not liable or responsible for any Brand Submission, Ad, or Creator Content, or for any damages, losses, costs, expenses, or liabilities incurred by you related to Creator Content.</li>
                                <li>You have no expectation of privacy with respect to any Brand Submissions.</li>
                                <li>You will not edit, change, modify, or create any derivative work of Creator Content unless otherwise expressly agreed with a Creator under Section 4.1.3.</li>
                                <li>Creator Content may contain Ads for multiple Brands, so you may not be the only Brand referenced in Creator Content, except as explicitly agreed in the requirements for any Ad.</li>
                                <li>getdiscovr.ai and Creator each retain the right and sole discretion to reject any bid/request for an Ad you submit. Repeated rejections due to Terms violations may result in suspension or termination of your account. No payment will be made to a Creator for any declined, canceled, or unfulfilled request.</li>
                            </ul>

                            <h3>3.3 Creator Acknowledgements</h3>
                            <p>You acknowledge and agree that:</p>
                            <ul>
                                <li>For any reason and without notice, we may refuse to accept or transmit Ad bids/requests or Creator Content and may remove the same from our Service.</li>
                                <li>By accepting a Brand's bid/request for an Ad, you are also accepting and agreeing to such Brand's Ad campaign requirements.</li>
                                <li>Creator Content will be non-confidential and will not include any information that you do not have the right to use or disclose. We will not be responsible or liable for any use or disclosure of Creator Content, including any personal information belonging to you or a third party.</li>
                                <li>We are not liable or responsible for any bids/requests for Ads, Brand Submissions, or for any damages, losses, costs, expenses, or liabilities incurred by you related to Creator Content or use thereof.</li>
                                <li>If applicable to the format of your Creator Content, you will not wear branded clothing or have any brand logos visible in Creator Content.</li>
                            </ul>
                        </section>

                        <section className="legal-section">
                            <h2>4. LICENSES; INTELLECTUAL PROPERTY; CONFIDENTIAL INFORMATION</h2>
                            <h3>4.1 Licenses</h3>
                            <h4>4.1.1 Brand License Grant to getdiscovr.ai</h4>
                            <p>You hereby grant to getdiscovr.ai a non-exclusive, worldwide, royalty-free, fully paid, unlimited, sublicensable (through multiple tiers of sublicenses), perpetual, and irrevocable license, in any and all manner and media, to use, reproduce, distribute, modify, adapt, reformat, and create derivative works of the following for the purposes of operating and providing our Service: (i) any Ad request that you make or send to any Creator, including any subsequent communications regarding the Ad bid/request and Brand Submissions sent in connection therewith, and (ii) any content that you submit to us, whether through our Service or otherwise. We will not be responsible or liable for any use or disclosure of such content, including any personal information belonging to you or a third party.</p>

                            <h4>4.1.2 Creator License Grant to getdiscovr.ai</h4>
                            <p>Our Service allows you to upload, submit, store, send, transmit, approve, and receive content and data, including Creator Content and communications related to Ad bids/requests ("Materials"). When you upload, submit, store, send, transmit, approve, or receive Materials to or through our Service, you grant to us a non-exclusive, worldwide, royalty-free, fully paid, unlimited, sublicensable (through multiple tiers of sublicenses), perpetual, and irrevocable license in any and all manner and media, to use, reproduce, distribute, modify, adapt, reformat, and create derivative works of such Materials for the purposes of operating and providing our Service. Third parties (including other users of our Service) may search for and see any Materials you submit to public areas of our Service.</p>

                            <h4>4.1.3 Brand Ad License; Creator License Grant to Brand</h4>
                            <p>Subject to each of Creator's and Brand's agreement through the Service, Creator may accept bids to permit, and Brands may serve, Ads on Properties other than such channels or accounts owned and/or controlled by Creator (a "Brand Ad License"). Subject to Brand's compliance with these Terms, including timely payment, Creator hereby grants Brand a limited, exclusive (except as to the license granted to getdiscovr.ai), royalty-free, fully paid, worldwide, sublicensable, irrevocable license to use, reproduce, distribute, edit, and publicly display the Ad solely as paid advertising — not as organic content — on social media platforms (including Facebook, Instagram, LinkedIn, Snapchat, TikTok, and Twitter) and online platforms, display networks, and in-app advertising. This license excludes television, OTT, CTV, OOH, and similar streaming media (other than social media platforms).</p>
                            <p>The "Brand Ad License Period" begins from the earlier of (1) the date the Ad is first used by Brand as permitted herein, or (2) fourteen (14) days after the date such license is approved by Creator through the Service. The Brand Ad License Period automatically renews for successive 30-day periods unless terminated by either Brand or Creator at least five (5) days prior to each subsequent renewal.</p>
                            <p>Brand acknowledges and agrees that in connection with its use of any Ad, it will: (a) comply with all applicable laws and regulations, including FTC guidelines requiring appropriate disclosures such as #ad or #sponsored; (b) comply with any applicable collective bargaining agreements; and (c) be subject to additional fees multiplied by the number of unauthorized license periods if it uses an Ad after the termination or expiration of the Brand Ad License Period.</p>

                            <h3>4.2 Intellectual Property Rights Ownership</h3>
                            <h4>4.2.1 Our Service</h4>
                            <p>We or our licensors own all right, title, and interest in and to: (i) our Service and the "look and feel" of our Service, including all software, ideas, processes, and other content available on or through our Service, and all associated intellectual property rights, as well as our Confidential Information (individually, and collectively, "Discovr Content"), and (ii) our trademarks, logos, and brand elements ("Marks"). Our Service, Discovr Content, and Marks are each protected under U.S. and international laws. You may not duplicate, copy, sell, resell, sublicense, commercialize, or reuse any portion of the Discovr Content, Marks, visual design elements, or concepts without our prior express written consent.</p>

                            <h4>4.2.2 Feedback; Aggregated and De-identified Data</h4>
                            <p>We own and have the unrestricted right to use and incorporate into our Service or other getdiscovr.ai offerings, any suggestions, enhancement requests, recommendations, or other feedback provided by you relating to our Service and/or our business. You agree that we may internally use and modify (but not disclose) Confidential Information, Ad bids/requests, Brand Submissions, and Materials for the purpose of generating aggregated and de-identified information regarding use of our Service, which we may share with third parties for marketing and development purposes. We will never disclose aggregated and de-identified information to a third party in a manner that would identify you or any identifiable individual as the source of the information.</p>

                            <h3>4.3 Confidential Information</h3>
                            <h4>4.3.1 Definition</h4>
                            <p>"Confidential Information" means any information disclosed by a user to getdiscovr.ai or disclosed by getdiscovr.ai to a user that, under the circumstances surrounding the disclosure and given the nature of the information, should reasonably be understood to be confidential. getdiscovr.ai and the applicable user each agree (i) to take reasonable steps to protect the discloser's Confidential Information from unauthorized use, access, and disclosure, (ii) not to disclose the discloser's Confidential Information to any third party except as required by applicable laws or regulations, and (iii) not to use any of the discloser's Confidential Information other than in connection with performing obligations or exercising rights under these Terms. Our Service is deemed to be our Confidential Information.</p>
                            <p>Each party may disclose Confidential Information to its respective employees, affiliates, consultants, or other agents ("Representatives") who have a need to know such information, solely as necessary to perform obligations or exercise rights under these Terms, provided each Representative is bound by confidentiality obligations at least as protective as those herein.</p>

                            <h4>4.3.2 Exceptions</h4>
                            <p>Confidential Information does not include information that (i) is or becomes generally known or available to the public through no act or omission of the recipient, (ii) was known by the recipient without restrictions prior to receiving such information from the discloser, (iii) is rightfully acquired by the recipient without restrictions from a third party who has the right to disclose it, or (iv) is independently developed by the recipient without use of or reference to the discloser's Confidential Information.</p>
                        </section>

                        <section className="legal-section">
                            <h2>5. COPYRIGHT INFRINGEMENT</h2>
                            <p>Digital Millennium Copyright Act ("DMCA") Notice. We respond to notices of alleged copyright infringement and terminate access to our Service for repeat infringers. If you believe that your material has been copied in a way that constitutes copyright infringement, please forward the following information to the Copyright Agent named below:</p>
                            <ul>
                                <li>Your address, telephone number, and email address.</li>
                                <li>A description of the work that you claim is being infringed.</li>
                                <li>A description of the material that you claim is infringing and are requesting be removed, along with information about where it is located.</li>
                                <li>A statement that you have "a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law."</li>
                                <li>An electronic or physical signature of the copyright owner or a person authorized to act for the copyright owner.</li>
                                <li>A statement by you, made under penalty of perjury, that the information you are providing is accurate and that you are the copyright owner or authorized to act on behalf of the copyright owner.</li>
                            </ul>
                            <p className="legal-contact">
                                <strong>Copyright Agent:</strong><br />
                                Discovr, Inc. (getdiscovr.ai)<br />
                                Email: <a href="mailto:legal@getdiscovr.ai">legal@getdiscovr.ai</a><br />
                                Website: <a href="https://www.getdiscovr.ai" target="_blank" rel="noopener noreferrer">www.getdiscovr.ai</a>
                            </p>
                            <p>If you do not follow these requirements, your notice may not be valid. Only notices of alleged copyright infringement should be sent to our Copyright Agent. If we determine that you are a repeat infringer, we may terminate your access to our Service, remove or ban you, and take any other action we deem appropriate.</p>
                        </section>

                        <section className="legal-section">
                            <h2>6. REPRESENTATIONS AND WARRANTIES; INDEMNIFICATION; DISCLAIMERS</h2>
                            <h3>6.1 Representations and Warranties</h3>
                            <h4>6.1.1 Brand</h4>
                            <p>Brand represents and warrants to getdiscovr.ai and to the applicable Creator that: (i) Ad bids/requests and Brand Submissions are factually correct and not infringing, misleading, disparaging, or defamatory, and otherwise comply with these Terms; (ii) it either owns or has all rights necessary in and to Brand Submissions, including use of Brand's name, trademark, trade name, trade dress, or logos; and (iii) it will not contact, respond to, or communicate with any user that Brand meets on or through our Service except through our Service. The applicable Creator is an intended third-party beneficiary of this Section.</p>

                            <h4>6.1.2 Creator</h4>
                            <p>Creator represents and warrants to getdiscovr.ai and to the applicable Brand that: (i) it either owns or has all rights necessary in and to Creator Content and has the right to undertake the activities described in these Terms; (ii) its agreement to and provision of services under these Terms does not violate any agreement with any third party; (iii) any statements made in connection with a Brand are factually correct, not misleading or defamatory, and represent its true opinion; (iv) Creator Content does not infringe or misappropriate any intellectual property, privacy, publicity, moral, or other rights of any third party, or violate any law or regulation; (v) it will not post or make publicly available any Ad that a Brand has requested not be posted, or otherwise use or share any Brand Submissions other than through a mutually agreed Ad; (vi) Creator Content is not addressed to or intended to appeal to children under 13 years of age; (vii) it is at least 13 years of age; (viii) a parent or legal guardian has reviewed and agreed to these Terms if it is under 18 years of age; and (ix) it will not communicate with any user it meets through our Service except through our Service. The applicable Brand is an intended third-party beneficiary of this Section.</p>

                            <h4>6.1.3 Sponsored Content</h4>
                            <p>You represent and warrant that you will comply with all applicable laws, rules, and regulations, including U.S. Federal Trade Commission policies and guidelines concerning the use of endorsements and testimonials in advertising, including the use of terms such as 'sponsored' or 'ad,' and that any Creator Content (including the Ads therein) is compliant with the terms and conditions of the Properties on which it is being posted or used.</p>

                            <h3>6.2 Indemnification</h3>
                            <h4>6.2.1 Brand Indemnification</h4>
                            <p>Brand agrees to indemnify, defend (at its sole expense), and hold harmless getdiscovr.ai and the applicable Creator from and against any and all third-party claims, proceedings, or demands in connection with or relating to: (i) Brand Submissions, (ii) Brand's use of Creator Content unless such use is expressly permitted by Creator, or (iii) Brand's offerings, products, or services. Brand will pay all losses, damages, and expenses of any kind awarded in a judgment or agreed to in a settlement in connection with any such indemnified claim. The Creator is an intended third-party beneficiary of this Section.</p>

                            <h4>6.2.2 Creator Indemnification</h4>
                            <p>Creator agrees to indemnify, defend (at its sole expense), and hold harmless getdiscovr.ai and the applicable Brand and its officers, employees, directors, shareholders, agents, licensors, and affiliates, from and against any and all third-party claims, proceedings, or demands in connection with or relating to Creator Content. Creator will pay all losses, damages, and expenses of any kind awarded in a judgment or agreed to in a settlement in connection with any such indemnified claim. The Brand is an intended third-party beneficiary of this Section.</p>

                            <h4>6.2.3 General Indemnification</h4>
                            <p>You agree to indemnify, defend (at its sole expense), and hold harmless getdiscovr.ai and its officers, employees, directors, shareholders, agents, licensors, and affiliates, from and against any and all third-party claims, proceedings, or demands in connection with or relating to: (i) these Terms, or (ii) your use of our Service. You will pay all losses, damages, and expenses of any kind awarded in a judgment or agreed to in a settlement in connection with any such indemnified claim.</p>

                            <h3>6.3 Disclaimers; Limitations on Liability</h3>
                            <p className="legal-caps">TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, OUR SERVICE AND ALL DISCOVR CONTENT AND OTHER CONTENT ACCESSIBLE ON OUR SERVICE ARE PROVIDED "AS IS" AND WITHOUT ANY REPRESENTATION OR WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE, ALL OF WHICH ARE EXPRESSLY DISCLAIMED. GETDISCOVR.AI DOES NOT MAKE ANY REPRESENTATIONS OR WARRANTIES REGARDING RESULTS THAT MAY BE OBTAINED FROM USE OF OUR SERVICE, INCLUDING GUARANTEEING SPECIFIC RESULTS OF ADVERTISING CAMPAIGNS.</p>
                            <p className="legal-caps">GETDISCOVR.AI DOES NOT REPRESENT OR WARRANT THAT OUR SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT OUR SERVICE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. USE OF OUR SERVICE IS AT YOUR SOLE RISK.</p>
                            <p className="legal-caps">TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL GETDISCOVR.AI OR ITS AFFILIATES, OFFICERS, DIRECTORS, SHAREHOLDERS, EMPLOYEES, AGENTS, SUCCESSORS, OR ASSIGNS BE LIABLE TO YOU OR ANY THIRD PARTY FOR (i) ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES (INCLUDING FOR LOSS OF PROFITS, REVENUE, OR DATA) OR FOR THE COST OF OBTAINING SUBSTITUTE PRODUCTS, OR (ii) AGGREGATE DIRECT DAMAGES THAT EXCEED (a) IF YOU ARE A BRAND, THE CAMPAIGN FEES ACTUALLY RECEIVED BY US FROM YOU DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (b) IF YOU ARE A CREATOR, THE LOWER OF THE FEES PAID/REMITTED BY US TO YOU DURING THE SIX (6) MONTHS PRECEDING THE CLAIM OR FOR THE AD(S) UNDER WHICH THE LIABILITY AROSE.</p>
                        </section>

                        <section className="legal-section">
                            <h2>7. FEES; PAYMENT TERMS</h2>
                            <h3>7.1 Brands</h3>
                            <p>You will submit a bid on our Service to a Creator for an Ad or Brand Ad License. Once a Creator accepts your bid and fulfills the Ad request, or a Brand Ad License Period begins, you will pay the full amount of such bid, which will include a Campaign Fee. "Campaign Fee" means a fee equal to twenty percent (20%) of the total campaign budget for the Ad or Brand Ad License that you bid for. getdiscovr.ai will facilitate payment of the bid amount to the applicable Creator. All transactions are settled in US Dollars. You are responsible for paying all applicable Taxes associated with your purchases hereunder, other than Taxes on getdiscovr.ai's income.</p>
                            <p>If we invoice you, you agree to pay all amounts due within thirty (30) days from receipt of invoice. Past due invoices are subject to interest of the lesser of one and one half percent (1.5%) per month or the maximum amount permitted by law.</p>
                            <p>You may pay for an Ad or Brand Ad License using a valid payment card through our third-party payment provider. By providing your payment information, you agree that we may place a pre-authorization hold and, after your request has been fulfilled, authorize the payment provider to charge you for all amounts due. No returns, exchanges, or refunds will be issued.</p>
                            <p>We may suspend or cancel your bids/requests for Ads if: (i) your payment method is declined, or (ii) you have been previously banned or removed from our Service. We also reserve the right to change our fees and payment procedures at any time.</p>

                            <h3>7.2 Creators</h3>
                            <p>Subject to these Terms, getdiscovr.ai will facilitate payment to you of the full amount of a Brand's accepted bid, plus any applicable production fee, provided that you have fulfilled the Ad request and promptly after the applicable Brand remits payment to getdiscovr.ai. If Creator Content is taken down for any reason within ten (10) business days after fulfillment, you agree to refund getdiscovr.ai any and all fees already paid to you in connection with such Ad request. All transactions are settled in US Dollars.</p>
                            <p>getdiscovr.ai is not responsible for and will not withhold or remit any contributions, payments, taxes, or deductions for Social Security, retirement benefits, unemployment insurance, annuities, or pension or welfare fund payments, or residual or any other type of payment or contribution to any third party related to Creator or on Creator's behalf, including to any agency or manager or under any union or collective bargaining unit agreements.</p>
                            <p>You agree to register with the third-party payment provider selected by getdiscovr.ai. You will provide the payment provider any information required to receive payments, including information about the bank account you own at a regulated financial institution. getdiscovr.ai will not be responsible for any damages, delays, losses, costs, or liabilities arising out of or in connection with your inability to receive payments as a result of your failure to provide such information.</p>

                            <h3>7.3 Creator Referral Program</h3>
                            <p>getdiscovr.ai may from time to time make available to Creators a list of potential Creators it wishes to participate in the Service (each, a "Target Referral"). Creators and Target Referrals may earn Referral Fees for each Target Referral who creates an account and fulfills an Ad, subject to the following terms and conditions (the "Referral Program"):</p>

                            <h4>7.3.1 Eligibility</h4>
                            <p>Eligibility to participate in this Referral Program is limited to individuals registered as Creators. Brands and Creator's managers, agents, representatives, or other affiliates may not participate on behalf of a Creator. The Referral Program cannot be used for affiliate lead generation or other commercial purposes. Employees, officers, directors, contractors, agents, and representatives of getdiscovr.ai may not participate in the Referral Program.</p>

                            <h4>7.3.2 Referral Fees</h4>
                            <p>When a Creator selects a Target Referral, getdiscovr.ai will provide a unique referral link ("Referral Link"). If the Target Referral uses the Referral Link to create an account and completes an Ad within six (6) months of account creation ("Completed Referral"), getdiscovr.ai will pay the referring Creator and the Target Referral each a one-time referral fee in the amount designated within the Service ("Referral Fee"). Each Target Referral may result in only one Completed Referral and may only be paid one Referral Fee. No Referral Fee will be due if the Target Referral does not use your Referral Link or has previously created an account with the Service.</p>

                            <h4>7.3.3 Personal Use Only</h4>
                            <p>This Referral Program may be used only for personal purposes. You may share Referral Links only with your personal connections and may not advertise any Referral Link or share it publicly (e.g., on a social media channel). We reserve the right to revoke or refuse to issue any Referral Fees for Target Referrals we suspect were generated through improper channels.</p>

                            <h4>7.3.4 Modification and Termination</h4>
                            <p>getdiscovr.ai reserves the right to modify the terms of the Referral Program and/or suspend or terminate the Referral Program or any Creator's participation in the Referral Program at any time for any reason. A violation of this Section 7.3 may result in forfeiture of all Referral Fees earned through the Referral Program.</p>
                        </section>

                        <section className="legal-section">
                            <h2>8. TERMINATION</h2>
                            <p>You may cancel your Service account at any time by contacting us at <a href="mailto:support@getdiscovr.ai">support@getdiscovr.ai</a>. We reserve the right to terminate any user's access to our Service at any time, for any reason, in our sole discretion. If you violate any of these Terms, your right to use our Service automatically terminates.</p>
                            <p>We reserve the right to suspend or terminate your account and/or access to our Service: (i) if you are fifteen (15) days or more overdue on a payment; (ii) if we deem such action necessary as a result of your breach of Section 3; (iii) if we reasonably determine such action is necessary to avoid harm to us or other users; or (iv) as required by law or at the request of governmental entities.</p>
                            <p>Upon any expiration or termination, you will immediately cease any further use of our Service. getdiscovr.ai will make any of your materials/content, including any of your Confidential Information, available to you for electronic retrieval for a period of thirty (30) days. Any terms that by their nature extend beyond expiration or termination of these Terms will survive.</p>
                        </section>

                        <section className="legal-section">
                            <h2>9. CLASS ACTION WAIVER; ARBITRATION AGREEMENT AND WAIVER OF CERTAIN RIGHTS</h2>
                            <h3>9.1 Class Action Waiver</h3>
                            <p className="legal-caps">YOU AND GETDISCOVR.AI EXPRESSLY AGREE THAT: (i) ANY ARBITRATION PROCEEDING WILL TAKE PLACE ON AN INDIVIDUAL BASIS; (ii) YOU EXPRESSLY WAIVE YOUR ABILITY TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, MASS, COLLECTIVE, PRIVATE ATTORNEY GENERAL, OR OTHER REPRESENTATIVE PROCEEDING; (iii) THERE SHALL BE NO CLASS CLAIMS, CONSOLIDATION, OR JOINDER ALLOWED IN ANY ARBITRATION BETWEEN THE PARTIES; (iv) IF THIS ARBITRATION AGREEMENT IS FOUND INAPPLICABLE TO YOUR DISPUTE WITH GETDISCOVR.AI, THIS CLASS ACTION WAIVER WILL CONTINUE TO APPLY IN LITIGATION; AND (v) YOU AGREE THAT THIS CLASS ACTION WAIVER IS AN ESSENTIAL ELEMENT OF OUR CONTRACT AND MAY NOT BE SEVERED.</p>

                            <h3>9.2 Arbitration Agreement and Waiver of Certain Rights</h3>
                            <h4>9.2.1 Arbitration.</h4>
                            <p>You and getdiscovr.ai agree to resolve any disputes between you through binding and final arbitration instead of through court proceedings. You and getdiscovr.ai each hereby waive any right to a jury trial of any controversy, claim, counterclaim, or other dispute arising between you relating to these Terms or our Service (each a "Claim"). Any Claim will be submitted for binding arbitration in accordance with the Rules of the American Arbitration Association ("AAA Rules"). The arbitration will be heard and determined by a single arbitrator. The arbitrator's decision will be in writing, will include the arbitrator's reasons for the decision, will be final and binding upon the parties, and may be enforced in any court of competent jurisdiction.</p>

                            <h4>9.2.2 Cost and Fees.</h4>
                            <p>If you demonstrate that the costs of arbitration will be prohibitive as compared to the costs of litigation, getdiscovr.ai will pay as much of the administrative costs and arbitrator's fees required for the arbitration as the arbitrator deems necessary to prevent the cost of the arbitration from being prohibitive.</p>

                            <h4>9.2.3 No Preclusions.</h4>
                            <p>This arbitration agreement does not preclude you or getdiscovr.ai from seeking action by federal, state, or local government agencies. You and getdiscovr.ai each also have the right to bring any qualifying Claim in small claims court. In addition, you and getdiscovr.ai each retain the right to apply to any court of competent jurisdiction for provisional relief.</p>

                            <h4>9.2.4 No Class Representative.</h4>
                            <p>You and getdiscovr.ai each agree that with respect to any Claim, neither may act as a class representative or participate as a member of a class of claimants. The arbitrator can decide only individual Claims and may not consolidate or join the claims of other persons or parties who may be similarly situated.</p>

                            <h4>9.2.5 Severability; No Waiver; Survival.</h4>
                            <p>If any provision of this Section 9 is found to be invalid or unenforceable, that provision will be deemed appropriately modified to give effect to its intent or, if modification is not possible, will be severed and the remainder of this Section 9 will continue in full force and effect. This Section 9 will survive the termination of your relationship with getdiscovr.ai.</p>

                            <h4>9.2.6 Thirty (30) Day Opt-Out Right.</h4>
                            <p>You have the right to opt out of the provisions of this Arbitration Agreement by sending written notice of your decision to opt out within thirty (30) days after first becoming subject to this Arbitration Agreement to: Discovr, Inc. (getdiscovr.ai), <a href="mailto:legal@getdiscovr.ai">legal@getdiscovr.ai</a>. Your notice must include your name and address, any usernames, each email address you have used in connection with our Service or to set up an account (if applicable), and an unequivocal statement that you want to opt out of this Arbitration Agreement.</p>

                            <h4>9.2.7 Limitations.</h4>
                            <p>This Section 9 limits certain rights, including the right to maintain certain court actions, the right to a jury trial, the right to participate in any form of class or representative claim, the right to engage in discovery except as provided in AAA rules, and the right to certain remedies and forms of relief.</p>
                        </section>

                        <section className="legal-section">
                            <h2>10. MODIFICATIONS</h2>
                            <p>We may change these Terms from time to time for any reason. If we make any changes, we will change the Last Updated date above and post the new Terms. You should consult these Terms regularly for any changes. By continuing to use or access our Service, you agree to be bound by our then-current Terms.</p>
                        </section>

                        <section className="legal-section">
                            <h2>11. MISCELLANEOUS</h2>
                            <p>Our Service may contain links to social media platforms or third-party websites, including features and functionalities that link to or provide you with access to third-party content completely independent of getdiscovr.ai (collectively "Third Party Sites and Content"). You acknowledge and agree that: (i) such links do not mean that we endorse or are affiliated with such Third Party Sites and Content, and (ii) we are not responsible or liable for any damages, losses, costs, expenses, or liabilities related to your access or use of such Third Party Sites and Content.</p>
                            <p>These Terms and any related action will be governed by and construed in accordance with the laws of the State of New York, excluding its conflicts of laws rules. Venue for any dispute arising out of these Terms will be the state and federal courts in New York County, NY, and you consent to personal jurisdiction to such courts.</p>
                            <p>You acknowledge and agree that the relationship between us is solely that of independent contracting parties. This is not an employment agreement and does not create an employment relationship between you and getdiscovr.ai. No joint venture, partnership, or agency relationship is intended or created by these Terms. You have no authority to bind getdiscovr.ai and you will not hold yourself out as an employee, agent, or authorized representative of getdiscovr.ai.</p>
                            <p>Neither party will be responsible for delays or failures to perform (except with respect to payment obligations) resulting from acts beyond the reasonable control of such party.</p>
                            <p>Any waiver or failure to enforce any provision of these Terms on one occasion will not be deemed a waiver of any other provision or of such provision on any other occasion. If any provision of these Terms is held invalid or unenforceable, that part will be modified to reflect the original intention of the parties, and the other parts will remain in full force and effect.</p>
                            <p>The term "including" in these Terms will be interpreted broadly and will mean "including, without limitation." Titles are for convenience only and will not be considered when interpreting these Terms.</p>
                            <p>Neither party may assign any of its rights or obligations under these Terms without the prior written consent of the other party, except that getdiscovr.ai may assign its rights and obligations without consent in connection with any merger, consolidation, reorganization, change in control, or sale of all or substantially all of its assets related to these Terms or similar transaction.</p>
                            <p>If you have any questions about these Terms, please contact us at <a href="mailto:support@getdiscovr.ai">support@getdiscovr.ai</a></p>
                        </section>
                    </div>
                </div>
            </main>

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
