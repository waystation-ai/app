import ConnectPage from "@/app/ui/components/connect/ConnectPage";
import { generateConnectMetadata } from "@/app/ui/components/connect/metadata";

export async function generateMetadata({ params }: { params: Promise<{ provider: string }> }) {
  return generateConnectMetadata(params, "claude");
}

export default async function Page({ params, searchParams }: { 
  params: Promise<{ provider: string }>;
  searchParams?: Promise<{ redirect_uri?: string }>;
}) {
  return <ConnectPage 
    params={await params} 
    appType="claude" 
    redirectUri={(await searchParams)?.redirect_uri} 
  />;
}
