import LandingPage from "@/components/app/connect/LandingPage";
import { getLandingPageMetadata } from "@/components/app/connect/metadata";

export const metadata = getLandingPageMetadata("mcp-server");

export default async function Home() {
  return <LandingPage appType="mcp-server" />;
}
