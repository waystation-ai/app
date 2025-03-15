import ConnectPage from "@/app/ui/components/connect/ConnectPage";
import { generateConnectMetadata } from "@/app/ui/components/connect/metadata";

export async function generateMetadata({ params }: { params: Promise<{ provider: string }> }) {
  return generateConnectMetadata(params, "chatgpt");
}

export default async function Page({ params }: { params: Promise<{ provider: string }> }) {
  return <ConnectPage params={await params} appType="chatgpt" />;
}
