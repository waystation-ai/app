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

  const data = await getIntegrationsData(tab as 'official' | 'native');

  if (!data) {
    return null;
  }

  const { providers, connectedProviderIds, connectionsMap } = data;

  return (
    <IntegrationsLayout currentTab={tab as 'official' | 'native'}>
      <IntegrationsList
        providers={providers}
        connectedProviderIds={connectedProviderIds}
        connectionsMap={connectionsMap}
      />
    </IntegrationsLayout>
  );
}
