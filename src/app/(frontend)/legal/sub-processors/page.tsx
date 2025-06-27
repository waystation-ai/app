export default function SubProcessors() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose prose-lg">
        <header className="mb-8">
          <h1>Sub-Processors Guidelines</h1>
          <p className="text-gray-600 italic">Last Updated: <time dateTime="2025-02-26">February 26, 2025</time></p>
        </header>

        <section>
          <h2>Introduction</h2>
          <p>43D Corporation is committed to transparency regarding our use of third-party service providers (&ldquo;sub-processors&rdquo;) that may process Customer Data on our behalf. This document outlines our guidelines for selecting, managing, and overseeing sub-processors to ensure the security and privacy of your data.</p>
        </section>

        <section>
          <h2>What is a Sub-Processor?</h2>
          <p>A sub-processor is a third-party service provider that 43D Corporation engages to process Customer Data on our behalf. These service providers help us deliver our services and may have access to Customer Data in the course of providing these services.</p>
        </section>

        <section>
          <h2>Our Commitments</h2>
          <p>43D Corporation commits to:</p>
          <ul>
            <li>Maintaining an up-to-date list of all sub-processors with access to Customer Data</li>
            <li>Ensuring all sub-processors maintain appropriate security measures consistent with our own security standards and contractual obligations</li>
            <li>Requiring sub-processors to comply with applicable data protection laws and regulations</li>
            <li>Conducting thorough security and privacy assessments before engaging new sub-processors</li>
            <li>Regularly reviewing sub-processor practices and compliance</li>
          </ul>
        </section>

        <section>
          <h2>Sub-Processor Management</h2>
          <h3>Selection Process</h3>
          <p>When selecting new sub-processors, 43D Corporation conducts a comprehensive evaluation that includes:</p>
          <ul>
            <li>Security and compliance certifications (e.g., SOC 2, ISO 27001)</li>
            <li>Data protection practices and policies</li>
            <li>Technical and organizational security measures</li>
            <li>Reputation and industry standing</li>
            <li>Geographic location of data processing</li>
          </ul>

          <h3>Contractual Requirements</h3>
          <p>43D Corporation requires all sub-processors to:</p>
          <ul>
            <li>Process data only according to our documented instructions</li>
            <li>Implement appropriate technical and organizational security measures</li>
            <li>Ensure confidentiality commitments from personnel with access to Customer Data</li>
            <li>Delete or return all Customer Data upon termination of services</li>
            <li>Submit to security assessments and audits</li>
            <li>Provide prompt notification of any security incidents</li>
          </ul>

          <h3>Change Management</h3>
          <p>43D Corporation will notify customers of any changes to our sub-processor list according to the terms of our customer agreements. Enterprise customers may have additional notification rights as specified in their service agreements.</p>
        </section>

        <section>
          <h2>Current Sub-Processors</h2>
          <p>As of February 2025, 43D Corporation engages the following sub-processors:</p>
          <table>
            <thead>
              <tr>
                <th>Sub-Processor</th>
                <th>Purpose</th>
                <th>Data Processing Location</th>
                <th>Security Certifications</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vercel, Inc.</td>
                <td>Application hosting and infrastructure services</td>
                <td>United States and global edge locations</td>
                <td>SOC 2 Type 2, ISO 27001</td>
              </tr>
              <tr>
                <td>Neon, Inc.</td>
                <td>Database hosting and management</td>
                <td>United States</td>
                <td>SOC 2 Type 2</td>
              </tr>
              <tr>
                <td>Clerk, Inc.</td>
                <td>Authentication and user identity management</td>
                <td>United States</td>
                <td>SOC 2 Type 2</td>
              </tr>
              <tr>
                <td>Posthog, Inc.</td>
                <td>Product and web analytics</td>
                <td>United States</td>
                <td>SOC 2 Type 2</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Monitoring and Compliance</h2>
          <p>43D Corporation maintains an ongoing sub-processor management program that includes:</p>
          <ul>
            <li>Annual security reassessments</li>
            <li>Regular review of compliance certifications</li>
            <li>Monitoring of service level commitments</li>
            <li>Evaluation of security incident response capabilities</li>
          </ul>
        </section>

        <section>
          <h2>Customer Controls</h2>
          <p>Enterprise customers with specific compliance requirements may contact us to discuss:</p>
          <ul>
            <li>Custom data residency requirements</li>
            <li>Additional contractual protections</li>
            <li>Enhanced security measures</li>
            <li>Custom notification procedures for sub-processor changes</li>
          </ul>
        </section>

        <section>
          <h2>Updates to this Document</h2>
          <p>43D Corporation will update this document as we engage new sub-processors or make changes to our existing relationships. The most current version will always be available at this URL.</p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>If you have questions about our sub-processors or would like more information about our data processing activities, please contact:</p>
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
