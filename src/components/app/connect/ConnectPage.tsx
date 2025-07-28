import Link from "next/link";
import Image from 'next/image';

import { isFullProvider, type Provider } from "@/marketplace/core/types";

import { CopyBox } from "@/components/app/CopyBox";
import ChatDemo from "@/components/app/ChatDemo";
import Providers from "@/components/app/Providers";
import AlternativeApps from "./AlternativeApps";

import { AppType } from "./metadata";
import { authUserId } from "@/lib/utils/auth-userid";
import { getValidConnections } from "@/lib/db";
import { generateNanoidForUser } from "@/lib/utils/generate-nanoid-for-user";

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
  "cursor": {
    type: "cursor",
    displayName: "Cursor",
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
  provider: Provider;
  appType: AppType;
  redirectUri?: string;
}

export default async function ConnectPage({ provider, appType, redirectUri }: ConnectPageProps) {
  const appInfo = APP_INFO[appType];

  const userId = await authUserId();

  const connected = userId ?  (await getValidConnections(userId)).has(provider.id) : false;

  const nanoId = userId ? await generateNanoidForUser(userId) : undefined;

  const cursorConfig = {
      "url": `${process.env.NEXT_PUBLIC_APP_URL}/mcp` + (nanoId ? `/${nanoId}` : ""),
  };  
  
  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        { (appType === "mcp-server") &&
          <CopyBox text={"https://waystation.ai/mcp"} className="text-lg my-8 max-w-7xl mx-auto font-bold" icon={<Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP Host"  />}></CopyBox>
        }
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {appInfo.titlePrefix || "Connect"} {appInfo.displayName} to <span className="bg-yellow-100">{provider.name}</span>
            </h1>
            <h2 className="text-lg lg:text-xl mb-2 leading-snug">
              {provider.description}
            </h2>
            {provider.bullets && (
              <ul className="my-2">
                {provider.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            )}

            { (connected && appType =="cursor") && 
              <Link href={`cursor://anysphere.cursor-deeplink/mcp/install?name=WayStation&config=${Buffer.from(JSON.stringify(cursorConfig)).toString('base64')}`} 
                className="cursor-btn flex items-center justify-center gap-2">
                <Image src="/images/apps/cursor.svg" width={26} height={26} alt="Cursor Logo"></Image> Add to Cursor
              </Link>
            }
            { !(connected && (appType == "cursor")) && 
            <Link
              href={isFullProvider(provider) 
                ? `/api/auth/${provider.id}/connect${redirectUri ? 
                    `?redirect_uri=${encodeURIComponent(redirectUri)}` 
                    : (appType == "cursor"? `?redirect_uri=${encodeURIComponent('/connect/cursor/' + provider.id)}` : '')}`
                : `/waitlist/${provider.id}` 
              }
              className="getstarted-btn"
            >
              Connect Now
            </Link>
        }

            <AlternativeApps provider={provider.id} currentApp={appType} />

            <div className="sm:mt-4">
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
            <ChatDemo messages={provider.chat}  className={appType === "mcp-server" ? "h-[100vh] sm:h-[60vh] mt-0" : undefined}/>
          </div>
        </div>
      </main>
    </div>
  );
}
