import UseCaseGrid from '@/components/app/use-cases/UseCaseGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Use Cases | WayStation',
  description: 'Discover powerful AI use cases for project management, task automation, workflow optimization, and more. Transform your productivity with intelligent automation.',
  openGraph: {
    type: 'article',
    title: 'AI Use Cases | WayStation',
    description: 'Discover powerful AI use cases for project management, task automation, workflow optimization, and more. Transform your productivity with intelligent automation.',
    siteName: "WayStation",
    url: '/ai',
    images: {
      url: '/images/promo-wide.png'
    }
  }
};

export default async function AIUseCasesPage() {
  return (
    <div className="flex flex-col relative">
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="text-center px-4 sm:px-8 py-12 max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-6">
            AI Use Cases for <span className="bg-yellow-100">Modern Teams</span>
          </h1>
          <p className="text-lg lg:text-xl leading-relaxed text-gray-700 mb-8">
            Discover how AI can transform your workflow with intelligent automation, 
            smart insights, and seamless integrations across your favorite tools.
          </p>
          <div className="text-sm text-gray-600">
            Explore powerful use cases designed to boost productivity and streamline operations
          </div>
        </div>

        {/* Use Cases Grid */}
        <UseCaseGrid />
      </main>
    </div>
  );
}
