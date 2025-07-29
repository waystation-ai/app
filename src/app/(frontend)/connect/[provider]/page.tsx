import { notFound } from 'next/navigation';
import ConnectPage from "@/components/app/connect/ConnectPage";
import { generateConnectMetadata } from "@/components/app/connect/metadata";
import { registry } from "@/marketplace";

export async function generateMetadata({ params }: { params: Promise<{ provider: string }> }) {
  return generateConnectMetadata(params, "generic");
}

export async function generateStaticParams() {
  return registry.getVetoedProviders().map((provider) => ({
    provider: provider.id,
  }));
}

export default async function Page({ params }: { params: Promise<{ provider: string }> }) {
  const { provider}  = await params;
  const config = registry.getProvider(provider);
  
  if (!config) {
    notFound();
  }
  
  return <ConnectPage provider={config} appType="generic" />;
}
