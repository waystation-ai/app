import Link from "next/link";
import Image from "next/image";

type AppType = "chatgpt" | "claude" | "mcp-server";

interface AlternativeAppsProps {
  provider: string;
  currentApp: AppType;
}

interface AppInfo {
  type: AppType;
  name: string;
  imagePath: string;
  displayName: string;
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
  // Filter out the current app
  const alternativeApps = APPS.filter(app => app.type !== currentApp);

  return (
    <div className="flex items-center gap-4 mt-4 mb-8">
      <span className="text-sm font-medium text-gray-500">Also connects to</span>
      <Link href={`/connect/${alternativeApps[0].type}/${provider}`} className="app-link">
        <Image src={alternativeApps[0].imagePath} width={20} height={20} alt={alternativeApps[0].name} />
        <span>{alternativeApps[0].displayName}</span>
      </Link>
      <span className="text-sm font-medium text-gray-500">or</span>
      <Link href={`/connect/${alternativeApps[1].type}/${provider}`} className="app-link">
        <Image src={alternativeApps[1].imagePath} width={20} height={20} alt={alternativeApps[1].name} />
        <span>{alternativeApps[1].displayName}</span>
      </Link>
    </div>
  );
}
