import Link from "next/link";
import Image from "next/image";
import { AppType } from "./metadata";

interface AlternativeAppsProps {
  provider?: string;
  currentApp: AppType;
}

interface AppInfo {
  type: AppType;
  name: string;
  imagePath: string;
  displayName: string;
}

// Reusable component for app links
function AppLink({ app, provider }: { app: AppInfo; provider?: string }) {
  return (
    <Link href={provider? `/connect/${app.type}/${provider}`:`/connect/${app.type}`} className="app-link">
      <Image src={app.imagePath} width={20} height={20} alt={app.name} />
      <span>{app.displayName}</span>
    </Link>
  );
}

const APPS: AppInfo[] = [
  {
    type: "chatgpt",
    name: "ChatGPT",
    imagePath: "/images/apps/chatgpt.svg",
    displayName: "ChatGPT"
  },
  {
    type: "claude",
    name: "Claude Desktop",
    imagePath: "/images/apps/claude.svg",
    displayName: "Claude Desktop"
  },
  {
    type: "mcp-server",
    name: "Any MCP host",
    imagePath: "/images/apps/mcp.svg",
    displayName: "Any MCP host"
  }
];

export default function AlternativeApps({ provider, currentApp }: AlternativeAppsProps) {
  // For generic app type, show all apps
  if (currentApp === "generic") {
    return (
      <div className="flex items-center gap-4 mt-4 mb-8">
        <span className="text-sm font-medium text-gray-500">Works with</span>
        <AppLink app={APPS[0]} provider={provider} />
        <span className="text-sm font-medium text-gray-500">or</span>
        <AppLink app={APPS[1]} provider={provider} />
        <span className="text-sm font-medium text-gray-500">or</span>
        <AppLink app={APPS[2]} provider={provider} />
      </div>
    );
  }

  // For specific app types, filter out the current app and show alternatives
  const alternativeApps = APPS.filter(app => app.type !== currentApp);

  return (
    <div className="flex items-center gap-4 mt-4 mb-8">
      <span className="text-sm font-medium text-gray-500">Also connects to</span>
      <AppLink app={alternativeApps[0]} provider={provider} />
      <span className="text-sm font-medium text-gray-500">or</span>
      <AppLink app={alternativeApps[1]} provider={provider} />
    </div>
  );
}
