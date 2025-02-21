import { styles } from '../shared-styles';

export default function Terms() {
  return (
    <main className={styles.container}>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>Terms of Use</h1>
          <p className={styles.date}>Last Updated: <time dateTime="2024-02-21">February 21, 2024</time></p>
        </header>

        <section>
          <h2 className={styles.sectionTitle}>Agreement to Terms</h2>
          <p className={styles.text}>These Terms of Use constitute a legally binding agreement made between you and 43D Corporation (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) concerning your use of the WayStation service. By accessing or using WayStation, you agree to be bound by these Terms of Use. If you disagree with any part of these terms, you may not access the service.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Service Description</h2>
          <p className={styles.text}>WayStation is a service that connects Large Language Models (LLMs) such as ChatGPT or Claude with productivity apps like Monday, Google Drive, or Slack. The service is currently provided free of charge, though paid features may be introduced in the future.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>User Accounts</h2>
          <p className={styles.text}>To use WayStation, you must create an account through our authentication provider, Clerk. You are responsible for:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Maintaining the confidentiality of your account credentials</li>
            <li className={styles.listItem}>All activities that occur under your account</li>
            <li className={styles.listItem}>Notifying us immediately of any unauthorized use of your account</li>
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Acceptable Use</h2>
          <p className={styles.text}>You agree not to use WayStation:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>In any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li className={styles.listItem}>To transmit any material that is unlawful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
            <li className={styles.listItem}>To attempt to gain unauthorized access to any part of the service</li>
            <li className={styles.listItem}>To interfere with or disrupt the service or servers or networks connected to the service</li>
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Third-Party Services</h2>
          <p className={styles.text}>WayStation integrates with various third-party services including:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Language models (OpenAI, Anthropic)</li>
            <li className={styles.listItem}>Productivity applications (Monday, Google Drive, Slack, etc.)</li>
            <li className={styles.listItem}>Authentication services (Clerk)</li>
          </ul>
          <p className={styles.text}>Your use of these third-party services is subject to their respective terms of service and privacy policies.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Intellectual Property</h2>
          <p className={styles.text}>The service and its original content, features, and functionality are owned by 43D and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Disclaimer of Warranties</h2>
          <p className={styles.text}>WayStation is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranty of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, timely, secure, or error-free.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
          <p className={styles.text}>In no event shall 43D, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Changes to Terms</h2>
          <p className={styles.text}>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Governing Law</h2>
          <p className={styles.text}>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          <p className={styles.text}>Questions about the Terms of Use should be sent to us at:</p>
          <p className={styles.text}>
            43D Corporation<br />
            395 S Gordon Way<br />
            Los Altos, CA 94022<br />
            Email: <a href="mailto:privacy@waystation.ai" className={styles.link}>privacy@waystation.ai</a>
          </p>
        </section>
      </article>
    </main>
  );
}
