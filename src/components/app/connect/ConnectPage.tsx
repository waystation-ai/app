import ChatDemo from "@/components/app/ChatDemo";
import Link from "next/link";
import { getProviderConfig } from "@/lib/services/provider-config";
import Providers from "@/components/app/Providers";
import AlternativeApps from "./AlternativeApps";
import { AppType } from "./metadata";

interface AppInfo {
  type: AppType;
  displayName: string;
  className?: string;
  titlePrefix?: string;
}

const APP_INFO: Record<AppType, AppInfo> = {
  "chatgpt": {
    type: "chatgpt",
    displayName: "ChatGPT",
    titlePrefix: "Connect"
  },
  "claude": {
    type: "claude",
    displayName: "Claude Desktop",
    titlePrefix: "Connect"
  },
  "mcp-server": {
    type: "mcp-server",
    displayName: "any MCP host",
    titlePrefix: "Connect",
  },
  "generic": {
    type: "generic",
    displayName: "your LLM",
    titlePrefix: "Integrate"
  }
};

interface ConnectPageProps {
  params: { provider: string };
  appType: AppType;
  redirectUri?: string;
}

export default async function ConnectPage({ params, appType, redirectUri }: ConnectPageProps) {
  const { provider } = params;
  const config = getProviderConfig(provider);
  const appInfo = APP_INFO[appType];

  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {appInfo.titlePrefix || "Connect"} {appInfo.displayName} with <span className="bg-yellow-100">{config.name}</span>
            </h1>
            <h2 className="text-lg lg:text-xl mb-2 leading-snug">
              {config.description}
            </h2>
            {config.bullets && (
              <ul className="my-2">
                {config.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            )}

            <Link
              href={config.authorizationUrl 
                ? `/api/auth/${provider}/connect${redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}` : ''}`
                : `/dashboard?provider=${provider}${redirectUri ? `&redirect_uri=${encodeURIComponent(redirectUri)}` : ''}`
              }
              className="getstarted-btn"
            >
              Connect Now
            </Link>

            <AlternativeApps provider={provider} currentApp={appType} />

            <div className="sm:mt-8">
              <p>And make it even more powerful with other providers we support</p>
              <div>
                <Providers 
                  className="grid grid-cols-9 gap-1 mt-3" 
                  width={30} 
                  height={30} 
                  app={appType !== "generic" ? appType : undefined} 
                />
              </div>
            </div>
          </div>

          {/* Right Column - Chat Demo */}
          <div className="flex items-center justify-center mt-4 lg:mt-0">
            <ChatDemo messages={config.chat} />
          </div>
        </div>
      </main>
    </div>
  );
}
