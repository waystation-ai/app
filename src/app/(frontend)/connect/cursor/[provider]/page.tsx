import ConnectPage from "@/components/app/connect/ConnectPage";
import { generateConnectMetadata } from "@/components/app/connect/metadata";

export async function generateMetadata({ params }: { params: Promise<{ provider: string }> }) {
  return generateConnectMetadata(params, "cursor");
}

export default async function Page({ params }: { params: Promise<{ provider: string }> }) {
  return <ConnectPage params={await params} appType="cursor" />;
}
