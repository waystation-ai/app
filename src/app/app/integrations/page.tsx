import { Metadata } from 'next';

import { getIntegrationsData } from './utils';
import { IntegrationsLayout } from '@/components/app/integrations/IntegrationsLayout';
import { IntegrationsList } from '@/components/app/integrations/IntegrationsList';

export const metadata: Metadata = {
  title: 'Integrations',
};

export default async function IntegrationsPage() {
  const data = await getIntegrationsData();

  if (!data) {
    return null;
  }

  const { providers, connectedProviderIds, connectionsMap } = data;

  return (
    <IntegrationsLayout currentTab="all">
      <IntegrationsList
        providers={providers}
        connectedProviderIds={connectedProviderIds}
        connectionsMap={connectionsMap}
      />
    </IntegrationsLayout>
  );
}
