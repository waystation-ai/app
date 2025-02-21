export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose prose-lg">
        <header className="mb-8">
          <h1>Privacy Policy</h1>
          <p className="text-gray-600 italic">Last Updated: <time dateTime="2024-02-21">February 21, 2024</time></p>
        </header>

        <section>
          <h2>Introduction</h2>
          <p>Welcome to WayStation (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.</p>
        </section>

        <section>
          <h2>Information Collection and Use</h2>
          <p>WayStation is designed to connect Large Language Models (LLMs) such as ChatGPT or Claude with productivity apps like Monday, Google Drive, or Slack. We prioritize your privacy and data security in the following ways:</p>
          <ul>
            <li>We do not store any of the data that is passed between apps and LLM providers such as OpenAI and Anthropic</li>
            <li>User authentication is handled through Clerk, a third-party authentication service</li>
            <li>The only information we retain are access tokens necessary for connecting to your productivity apps</li>
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
        </section>

        <section>
          <h2>Security</h2>
          <p>We implement appropriate technical and organizational measures to maintain the security of your information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.</p>
        </section>

        <section>
          <h2>Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Changes are effective when posted.</p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>
            43D<br />
            395 S Gordon Way<br />
            Los Altos, CA 94022<br />
            Email: <a href="mailto:privacy@waystation.ai">privacy@waystation.ai</a>
          </p>
        </section>
      </article>
    </main>
  );
}
