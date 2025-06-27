import ConnectPage from "@/components/app/connect/ConnectPage";
import { generateConnectMetadata } from "@/components/app/connect/metadata";

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
