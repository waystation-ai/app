import { Metadata } from 'next';
import { registry } from '@/marketplace';
import { isFullProvider, isNativeProvider, isRemoteProvider, Provider } from '@/marketplace/core/types';
import MarketplaceProviderCard from '@/components/app/MarketplaceProviderCard';

// Provider section component to avoid code duplication
function ProviderSection({ title, providers }: { 
  title: string; 
  providers: Provider[]; 
}) {
  return (
    <>
      <h1 className={`text-xl lg:text-2xl text-gray-900 font-bold mt-8 mb-4`}>
        {title}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full mb-4">
        {providers.map(provider => (
          <MarketplaceProviderCard
            key={provider.id}
            provider={provider.id}
            name={provider.name}
            description={provider.description}
          />
        ))}
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: 'Marketplace',
};

export default function MarketplacePage() {
  // Get all remote providers from registry
  const remoteProviders = registry.getAllProviders().filter(provider => isRemoteProvider(provider));
  const nativeProviders = registry.getAllProviders().filter(provider => isNativeProvider(provider));
  const comingSoon = registry.getAllProviders().filter(provider => !isFullProvider(provider));
  
  return (
    <div className="mt-4 sm:mt-8 px-4 sm:px-6 lg:px-8 mx-auto">
      <h1 className="text-3xl lg:text-4xl text-gray-900 font-bold mb-8">
        Marketplace
      </h1>
      
      <ProviderSection 
        title="Official Providers" 
        providers={remoteProviders} 
      />

      <ProviderSection 
        title="Native Providers" 
        providers={nativeProviders} 
      />

      <ProviderSection 
        title="Coming Soon" 
        providers={comingSoon} 
      />

    </div>
  );
}
