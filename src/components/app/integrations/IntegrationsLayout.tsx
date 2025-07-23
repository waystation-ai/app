import { IntegrationsTabs } from '@/components/app/integrations/IntegrationsTabs';

interface IntegrationsLayoutProps {
  currentTab: 'all' | 'official' | 'native' | 'none';
  children: React.ReactNode;
}

export function IntegrationsLayout({ currentTab, children }: IntegrationsLayoutProps) {
  return (
    <div className="mt-4 px-4 sm:px-6 lg:px-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl text-gray-900 font-bold mb-6">
          Integrations
        </h1>
        
        {/* Tab navigation */}
        <IntegrationsTabs currentTab={currentTab} />
      </div>

      {children}
    </div>
  );
}