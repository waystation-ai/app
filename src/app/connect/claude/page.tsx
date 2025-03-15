import LandingPage from "@/app/ui/components/connect/LandingPage";
import { getLandingPageMetadata } from "@/app/ui/components/connect/metadata";

export const metadata = getLandingPageMetadata("claude");

export default function Home() {
  return <LandingPage appType="claude" />;
}
