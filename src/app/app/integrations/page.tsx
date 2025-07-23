import { Metadata } from 'next';

import { getIntegrationsData } from './utils';
import { IntegrationsLayout } from '@/components/app/integrations/IntegrationsLayout';
import { IntegrationsList } from '@/components/app/integrations/IntegrationsList';

export const metadata: Metadata = {
  title: 'Integrations',
};

export default async function IntegrationsPage() {
  const allProviders = await getIntegrationsData();

  if (!allProviders) {
    return null;
  }

  return (
    <IntegrationsLayout currentTab="all">
      <IntegrationsList providers={allProviders} />
    </IntegrationsLayout>
  );
}
