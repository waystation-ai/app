import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getIntegrationsData } from '../utils';
import { IntegrationsLayout } from '@/components/app/integrations/IntegrationsLayout';
import { IntegrationsList } from '@/components/app/integrations/IntegrationsList';

export const metadata: Metadata = {
  title: 'Tools and Integrations',
};

interface PageProps {
  params: {
    tab: string;
  };
}

export default async function IntegrationsTabPage({ params }: PageProps) {
  const { tab } = params;

  // Validate tab parameter
  if (tab !== 'official' && tab !== 'native') {
    redirect('/app/integrations');
  }

  const allProviders = await getIntegrationsData();

  if (!allProviders) {
    return null;
  }

  // Filter providers based on tab
  const filteredProviders = allProviders.filter(provider => {
    if (tab === 'official') {
      return provider.providerType === 'remote';
    } else if (tab === 'native') {
      return provider.providerType === 'native';
    }
    return true;
  });

  return (
    <IntegrationsLayout currentTab={tab as 'official' | 'native'}>
      <IntegrationsList providers={filteredProviders} />
    </IntegrationsLayout>
  );
}
