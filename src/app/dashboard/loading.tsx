import ProviderCard from '@/app/ui/components/ProviderCard';
import { registry } from '@/app/tools/core/registry';

// Import the main entry point to ensure all providers are registered
import '@/app/tools/main';

export default async function Page() {
  const connectedProviders: Record<string, boolean> = {};

  // Get all providers from registry
  const allProviders = registry.getAllProviders();
  
  // Get providers with authorization URLs for "Connect your apps" section
  const providersToDisplay = allProviders
    .filter(provider => provider.authorizationUrl)
    .slice(0, 4)
    .map(provider => [provider.id, provider] as [string, typeof provider]);
  
  // Get providers without authorization URLs for "More integrations" section
  const moreIntegrationsProviders = allProviders
    .filter(provider => !provider.authorizationUrl)
    .slice(0, 8)
    .map(provider => [provider.id, provider] as [string, typeof provider]);

  return (
    <div className="mt-4 sm:mt-8 px-4 sm:px-6 lg:px-8 mx-auto">
      {/* Top section - Two columns */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Left Column - Connect your apps */}
        <div className="flex flex-col lg:w-2/3">
          <p className="text-3xl lg:text-4xl text-gray-900 font-bold">
                Connect your apps...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full my-3 sm:my-9">
            {providersToDisplay.map(([provider, config]) => (
              <ProviderCard
                key={provider}
                provider={provider}
                name={config.name}
                description={config.description}
                isConnected={!!connectedProviders[provider]}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Launch section placeholder */}
        <div className="flex flex-col lg:w-1/3 items-center justify-center h-full">
          <p className="my-4 text-3xl lg:text-4xl text-gray-900 font-bold w-full text-center">
                ...and launch!
          </p>
          {/* LaunchPad placeholder */}
          <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          {/* LaunchPadBasement placeholder */}
          <div className="w-full max-w-md h-16 mt-4 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
      
      {/* Bottom section - Full width */}
      <div className="w-full">
        <p className="text-xl lg:text-2xl text-gray-900 font-bold">
          More Integrations
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-6 w-full my-6">
          {moreIntegrationsProviders.map(([provider]) => (
            <div key={provider} className="provider-card flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-full animate-pulse"></div>
              <div className="mt-2 w-16 h-4 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
