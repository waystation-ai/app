import { Metadata } from 'next';

import { getIntegrationsData } from './utils';
import { IntegrationsLayout } from '@/components/app/IntegrationsLayout';
import { IntegrationsContent } from '@/components/app/IntegrationsContent';

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
      <IntegrationsContent
        providers={providers}
        connectedProviderIds={connectedProviderIds}
        connectionsMap={connectionsMap}
      />
    </IntegrationsLayout>
  );
}
