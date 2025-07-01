import { registry } from '@/marketplace';
import SetupPage from './client-page';

interface PageProps {
  params: Promise<{
    provider: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { provider: providerId } = await params;
  const provider = registry.getProvider(providerId);

  if (!provider) {
    return <div>Provider not found</div>;
  }

  const { id, name, description } = provider;
  const plainProvider = { id, name, description };

  return <SetupPage provider={plainProvider} />;
}
