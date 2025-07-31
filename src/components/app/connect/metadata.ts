import { Metadata } from 'next';
import { registry } from '@/marketplace';

export type AppType = "chatgpt" | "claude" | "mcp-server" | "cursor" | "generic";

export interface AppMetadata {
  // Basic info
  name: string;
  displayName: string;
  
  // Landing page content
  displayTitle: string;
  displayDescription: string;
  
  // Provider connection content
  connectDescription: string;
}

// Single source of truth for app metadata
const APP_METADATA: Record<AppType, AppMetadata> = {
  "chatgpt": {
    name: "ChatGPT",
    displayName: "ChatGPT",
    displayTitle: "The only ChatGPT connector you need",
    displayDescription: "Connect ChatGPT to the tools you use daily",
    connectDescription: "With WayStation connector for ChatGPT you can"
  },
  "claude": {
    name: "Claude Desktop",
    displayName: "Claude Desktop",
    displayTitle: "The only Claude Desktop integration you need",
    displayDescription: "Connect Claude Desktop to the tools you use daily",
    connectDescription: "With WayStation integration for Claude Desktop you can"
  },
  "cursor": {
    name: "Cursor",
    displayName: "Cursor",
    displayTitle: "The only Cursor MCP you need",
    displayDescription: "Connect Cursor to the tools you use daily",
    connectDescription: "With WayStation MCP for Cursor you can"
  },
  "mcp-server": {
    name: "MCP Server",
    displayName: "any MCP host",
    displayTitle: "The only MCP Server you need",
    displayDescription: "Connect any MCP host with the tools you use daily",
    connectDescription: "With universal WayStation MCP Server you can"
  },
  "generic": {
    name: "LLM",
    displayName: "LLM",
    displayTitle: "The only LLM integration you need",
    displayDescription: "Connect AI models with the tools you use daily",
    connectDescription: "With WayStation plugin for LLMs you can"
  }
};

/**
 * Get app metadata for a specific app type
 */
export function getAppMetadata(appType: AppType): AppMetadata {
  return APP_METADATA[appType];
}

/**
 * Generate metadata for landing pages
 */
export function getLandingPageMetadata(appType: AppType): Metadata {
  const metadata = getAppMetadata(appType);
  
  return {
    title: `Integrate ${metadata.displayName} with the productivity apps`,
    description: `The only ${metadata.name} action you need. ${metadata.displayDescription} through our no-code, secure integration hub.`,
    openGraph: {
      type: 'article',
      title: `Integrate ${metadata.displayName} with the productivity apps`,
      description: `The only ${metadata.name} action you need. ${metadata.displayDescription} through our no-code, secure integration hub.`,
      siteName: "WayStation",
      url: `/connect/${appType}`,
      images: {
        url: '/images/promo-wide.png'
      }
    }
  };
}

/**
 * Generate metadata for provider-specific connect pages
 */
export async function generateConnectMetadata(params: Promise<{ provider: string }>, appType: AppType): Promise<Metadata> {
  const { provider } = await params;
  const config = registry.getProvider(provider);

  if (!config) 
    return {};

  const appInfo = getAppMetadata(appType);

  // For generic app type, use a different URL format
  const url = appType === "generic" ? `/connect/${provider}` : `/connect/${appType}/${provider}`;

  return {
    title: `Integrate ${appInfo.displayName} with ${config.name}`,
    description: `${appInfo.connectDescription} ${config.description}`,
    openGraph: {
      type: 'article',
      title: `Integrate ${appInfo.displayName} with ${config.name}`,
      description: `${appInfo.connectDescription} ${config.description}`,
      siteName: "WayStation",
      url,
      images: {
        url: '/images/promo-wide.png'
      }
    }
  };
}
