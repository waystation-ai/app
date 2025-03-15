import LandingPage from "@/app/ui/components/connect/LandingPage";
import { getLandingPageMetadata } from "@/app/ui/components/connect/metadata";

export const metadata = getLandingPageMetadata("mcp-server");

export default async function Home() {
  return <LandingPage appType="mcp-server" />;
}
