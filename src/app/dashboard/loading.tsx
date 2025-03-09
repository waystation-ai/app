import ProviderCard from '@/app/ui/components/ProviderCard';
import { providers } from '@/app/lib/config/oauth-providers';

export default async function Page() {
  const connectedProviders: Record<string, boolean> = {};

  return (
    <div className="flex flex-col mt-4 sm:mt-8 justify-center items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <p className="mt-8 text-3xl lg:text-4xl text-gray-900 font-bold">
            Connect your apps...
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full my-9">
        {Object.entries(providers)
          .filter(([, config]) => config.authorizationUrl)
          .map(([provider, config]) => (
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
  );
}
