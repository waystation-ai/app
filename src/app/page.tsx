export default function Home() {
  return (
    <div className="min-h-screen text-center">
      <header className="bg-white border-b border-gray-100 p-5">
        <h1 className="text-3xl font-bold aurora-text">WayStation.AI</h1>
      </header>

      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <h1 className="text-5xl font-bold mb-6 aurora-text">
          Empowering LLMs to Take Real-World Actions
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          WayStation is a no-code, secure hub that connects large language models 
          with the tools professionals use daily.
        </p>
        <a 
          href="#" 
          className="mt-8 inline-block aurora-btn px-8 py-4 text-lg font-medium rounded-lg 
                   hover:scale-105 transition-transform duration-300"
        >
          Get Early Access
        </a>
      </section>

      <section className="py-20 px-4 bg-white">
        <h2 className="text-3xl font-semibold mb-12 aurora-text">What We Offer</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          <Feature 
            title="Seamless Integrations" 
            description="Connect AI to Google Drive, Slack, Microsoft 365, Salesforce, and more." 
          />
          <Feature 
            title="No-Code Simplicity" 
            description="Set up AI-powered automation without technical expertise." 
          />
          <Feature 
            title="Enterprise-Ready" 
            description="Built with security, compliance, and enterprise-grade scalability." 
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <h2 className="text-3xl font-semibold aurora-text">
          Join the Future of AI-Driven Productivity
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4 leading-relaxed">
          Sign up today and be among the first to experience AI automation at its best.
        </p>
        <a 
          href="#" 
          className="mt-8 inline-block aurora-btn px-8 py-4 text-lg font-medium rounded-lg 
                   hover:scale-105 transition-transform duration-300"
        >
          Request Access
        </a>
      </section>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass-card p-8 rounded-xl w-[350px] transform hover:scale-105 transition-transform duration-300">
      <h3 className="text-xl font-semibold mb-4 aurora-text">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
