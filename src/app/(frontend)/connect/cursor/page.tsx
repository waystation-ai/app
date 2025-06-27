import LandingPage from "@/components/app/connect/LandingPage";
import { getLandingPageMetadata } from "@/components/app/connect/metadata";

export const metadata = getLandingPageMetadata("cursor");

export default function Home() {
  return <LandingPage appType="cursor" />;
}
