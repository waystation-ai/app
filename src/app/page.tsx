export default function Home() {
  return (
    <div className="bg-gray-100 text-center min-h-screen">

      <header className="bg-gray-800 text-white p-5 text-2xl font-bold">WayStation.AI</header>

      <section className="py-16">
        <h1 className="text-4xl font-bold text-gray-900">Empowering LLMs to Take Real-World Actions</h1>
        <p className="text-lg text-gray-800 mt-4">
          WayStation is a no-code, secure hub that connects large language models with the tools professionals use daily.
        </p>
        <a href="#" className="mt-6 inline-block bg-blue-600 text-white py-3 px-6 text-lg rounded-lg hover:bg-blue-700 transition">
          Get Early Access
        </a>
      </section>

      <section className="py-16 bg-white">
        <h2 className="text-3xl font-semibold text-gray-900">What We Offer</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <Feature title="Seamless Integrations" description="Connect AI to Google Drive, Slack, Microsoft 365, Salesforce, and more." />
          <Feature title="No-Code Simplicity" description="Set up AI-powered automation without technical expertise." />
          <Feature title="Enterprise-Ready" description="Built with security, compliance, and enterprise-grade scalability." />
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-semibold text-gray-900">Join the Future of AI-Driven Productivity</h2>
        <p className="text-lg text-gray-800 mt-4">
          Sign up today and be among the first to experience AI automation at its best.
        </p>
        <a href="#" className="mt-6 inline-block bg-blue-600 text-white py-3 px-6 text-lg rounded-lg hover:bg-blue-700 transition">
          Request Access
        </a>
      </section>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="w-80 bg-gray-50 p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-700 mt-2">{description}</p>
    </div>
  );
}
