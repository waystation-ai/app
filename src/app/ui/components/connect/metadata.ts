import { getProviderConfig } from "@/app/lib/config/oauth-providers";

type AppType = "chatgpt" | "claude" | "mcp-server" | "generic";

interface AppMetadataInfo {
  name: string;
  description: string;
}

const APP_METADATA: Record<AppType, AppMetadataInfo> = {
  "chatgpt": {
    name: "ChatGPT",
    description: "With WayStation plugin for ChatGPT you can"
  },
  "claude": {
    name: "Claude Desktop",
    description: "With WayStation plugin for Claude Desktop you can"
  },
  "mcp-server": {
    name: "any MCP host",
    description: "With universal WayStation MCP Server you can"
  },
  "generic": {
    name: "LLM",
    description: "With WayStation plugin for LLMs you can"
  }
};

export async function generateConnectMetadata(
  params: Promise<{ provider: string }>,
  appType: AppType
) {
  const { provider } = await params;
  const config = getProviderConfig(provider);
  const appInfo = APP_METADATA[appType];

  // For generic app type, use a different URL format
  const url = appType === "generic" 
    ? `/connect/${provider}` 
    : `/connect/${appType}/${provider}`;

  return {
    title: `Integrate ${appInfo.name} with ${config.name}`,
    description: `${appInfo.description} ${config.description}`,
    openGraph: {
      type: 'article',
      title: `Integrate ${appInfo.name} with ${config.name}`,
      description: `${appInfo.description} ${config.description}`,
      siteName: "WayStation",
      url,
      images: {
        url: '/images/promo-wide.png'
      }
    }
  };
}
