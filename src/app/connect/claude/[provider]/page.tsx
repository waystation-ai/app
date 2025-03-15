import ConnectPage from "@/app/ui/components/connect/ConnectPage";
import { generateConnectMetadata } from "@/app/ui/components/connect/metadata";

export async function generateMetadata({ params }: { params: Promise<{ provider: string }> }) {
  return generateConnectMetadata(params, "claude");
}

export default async function Page({ params }: { params: { provider: string } }) {
  return <ConnectPage params={params} appType="claude" />;
}
