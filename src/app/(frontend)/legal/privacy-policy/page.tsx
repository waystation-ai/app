import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose prose-lg">
        <header className="mb-8">
          <h1>Privacy Policy</h1>
          <p className="text-gray-600 italic">Last Updated: <time dateTime="2025-03-05">March 5, 2025</time></p>
        </header>

        <section>
          <h2>Introduction</h2>
          <p>Welcome to WayStation (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), a service provided by 43D Corporation. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.</p>
        </section>

        <section>
          <h2>Information Collection and Use</h2>
          <p>WayStation is designed to connect Large Language Models (LLMs) such as ChatGPT or Claude with productivity apps like Monday, Google Drive, or Slack. We prioritize your privacy and data security in the following ways:</p>
          <ul>
            <li>We do not store any of the data that is passed between apps and LLM providers such as OpenAI and Anthropic</li>
            <li>User authentication is handled through Clerk, a third-party authentication service</li>
            <li>The only information we retain are access tokens necessary for connecting to your productivity apps</li>
          </ul>
          
          <h3>Types of Data We Collect</h3>
          <p>We collect the following categories of personal data:</p>
          <ul>
            <li><strong>Account Information:</strong> Email address and authentication details managed by our identity provider</li>
            <li><strong>Access Tokens:</strong> Encrypted tokens required to connect to third-party services</li>
            <li><strong>Usage Data:</strong> Anonymous analytics about feature usage and performance metrics</li>
            <li><strong>Log Data:</strong> System logs for security and troubleshooting purposes</li>
          </ul>
        </section>

        <section>
          <h2>Legal Basis for Processing</h2>
          <p>We process your personal data based on the following legal grounds:</p>
          <ul>
            <li><strong>Contract Performance:</strong> Processing necessary to provide our services as outlined in our Terms of Service</li>
            <li><strong>Legitimate Interests:</strong> Processing that serves our legitimate business interests, such as improving our services and ensuring security</li>
            <li><strong>Consent:</strong> Processing based on your explicit consent, which you can withdraw at any time</li>
            <li><strong>Legal Obligations:</strong> Processing required to comply with applicable laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2>Data Storage and Processing</h2>
          <p>WayStation is hosted on Vercel&apos;s infrastructure in the United States. While we process data to provide our services, we maintain a minimal data retention policy:</p>
          <ul>
            <li>Data passing through our service is not stored or logged</li>
            <li>Access tokens are securely stored and encrypted</li>
            <li>All data processing occurs in real-time</li>
          </ul>
          
          <h3>Data Storage Policy</h3>
          <p>43D stores Customer Data in accordance with industry best practices for security and reliability. All data is encrypted both in transit (TLS 1.3) and at rest (AES-256) with robust key management. Customer Data is stored in SOC 2 compliant cloud infrastructure with geographical redundancy for disaster recovery. For enterprise customers, data locality options are available to address regional compliance requirements. Data is logically segregated by a customer to prevent unauthorized access between tenants. Regular backup processes ensure data recoverability, and all storage systems are continuously monitored for security and performance. Access to stored data is strictly controlled through role-based permissions and multi-factor authentication.</p>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>43D will retain Customer Data in accordance with applicable legal requirements and customer agreements. Customer Data will be retained only for as long as necessary to provide the service and fulfill contractual obligations. By default, data will be retained throughout the active subscription period. Enterprise customers have the option to specify custom retention periods aligned with their internal policies. Upon subscription termination, Customer Data will be retained for a maximum of 30 days to allow for account recovery or data export, after which it will enter the archival process.</p>
        </section>

        <section>
          <h2>Data Removal and Deletion</h2>
          <p>43D will remove Customer Data in accordance with our documented data lifecycle management procedures. Upon subscription termination or explicit customer request, data will enter a 30-day grace period before permanent deletion. Enterprise customers can request immediate removal via our secure customer portal. Archival processes include secure data purging from primary storage, backup systems, and caches. Data removal is comprehensive across all systems and verified through automated integrity checks. 43D maintains detailed logs of all deletion activities for audit purposes, and customers receive a confirmation once the removal is complete.</p>
        </section>

        <section>
          <h2>International Data Transfers</h2>
          <p>As our services are provided from the United States, your information may be processed and stored in the U.S. and other countries where our service providers maintain facilities. By using our services, you consent to the transfer of information to countries that may have different data protection rules than your country.</p>
          
          <p>For users in the European Economic Area (EEA), United Kingdom, or Switzerland, we implement appropriate safeguards for international data transfers, including:</p>
          <ul>
            <li>Standard Contractual Clauses approved by the European Commission</li>
            <li>Ensuring sub-processors maintain adequate data protection measures</li>
            <li>Data localization options for enterprise customers with specific compliance requirements</li>
          </ul>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal data:</p>
          <ul>
            <li><strong>Access:</strong> You can request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> You can request that we delete your personal data</li>
            <li><strong>Restriction:</strong> You can request that we restrict the processing of your data</li>
            <li><strong>Portability:</strong> You can request a copy of your data in a structured, machine-readable format</li>
            <li><strong>Objection:</strong> You can object to our processing of your data</li>
          </ul>
          
          <p>To exercise these rights, please contact us at <a href="mailto:privacy@waystation.ai">privacy@waystation.ai</a>. We will respond to your request within 30 days.</p>
        </section>

        <section>
          <h2>Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to enhance your experience on our website and services. These technologies may collect information such as your IP address, browser type, and usage patterns.</p>
          
          <p>We use the following types of cookies:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the operation of our website and services</li>
            <li><strong>Analytical Cookies:</strong> Help us understand how visitors interact with our website</li>
            <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization</li>
          </ul>
          
          <p>You can manage your cookie preferences through your browser settings. However, disabling certain cookies may limit your ability to use some features of our services.</p>
        </section>

        <section>
          <h2>Children&apos;s Privacy</h2>
          <p>Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected personal data from a child without verification of parental consent, we will take steps to remove that information from our servers.</p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>We use several third-party services to provide our functionality:</p>
          <ul>
            <li>Clerk for user authentication and management</li>
            <li>Vercel for hosting services</li>
            <li>OpenAI, Anthropic, and other LLM providers</li>
            <li>Integration with productivity tools (Monday, Google Drive, Slack, etc.)</li>
          </ul>
          <p>Each of these services has their own privacy policies and terms of service. We encourage you to review these policies.</p>
          
          <p>For a complete list of our sub-processors and their data handling practices, please see our <Link href="/legal/sub-processors">Sub-Processors Guidelines</Link>.</p>
        </section>

        <section>
          <h2>Security</h2>
          <p>We implement appropriate technical and organizational measures to maintain the security of your information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.</p>
          
          <h3>Data Breach Notification</h3>
          <p>In the event of a data breach that affects your personal information, we will:</p>
          <ul>
            <li>Notify affected users without undue delay, typically within 72 hours of becoming aware of the breach</li>
            <li>Provide information about the nature of the breach, the data affected, and steps we&apos;re taking to address it</li>
            <li>Notify relevant regulatory authorities as required by applicable law</li>
            <li>Work diligently to mitigate any potential harm resulting from the breach</li>
          </ul>
        </section>

        <section>
          <h2>Opt-Out Options</h2>
          <p>You can opt out of certain data processing activities:</p>
          <ul>
            <li><strong>Marketing Communications:</strong> You can unsubscribe from our marketing emails by clicking the &ldquo;unsubscribe&rdquo; link in any marketing email we send</li>
            <li><strong>Analytics:</strong> You can opt out of analytics tracking by adjusting your cookie preferences</li>
            <li><strong>Account Deletion:</strong> You can request deletion of your account and associated data by contacting us</li>
          </ul>
        </section>

        <section>
          <h2>Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date. For significant changes, we will provide additional notice such as an email notification. Changes are effective when posted.</p>
        </section>

        <section>
          <h2>Data Protection Officer</h2>
          <p>We have appointed a Data Protection Officer (DPO) responsible for overseeing questions regarding this Privacy Policy. If you have questions or concerns about our data practices, please contact our DPO at:</p>
          <p>
            Data Protection Officer<br />
            43D Corporation<br />
            395 S Gordon Way<br />
            Los Altos, CA 94022<br />
            Email: <a href="mailto:dpo@waystation.ai">dpo@waystation.ai</a>
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>
            43D Corporation<br />
            395 S Gordon Way<br />
            Los Altos, CA 94022<br />
            Email: <a href="mailto:privacy@waystation.ai">privacy@waystation.ai</a>
          </p>
        </section>
      </article>
    </main>
  );
}
