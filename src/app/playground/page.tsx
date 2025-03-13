"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import Link from "next/link";
import Image from "next/image";

export default function Playground() {
  const runtime = useChatRuntime({
    api: "/api/chat",
    maxSteps: 10
  });
  
  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left space-y-4 lg:space-y-6 lg:col-span-1">
            <h1 className="text-3xl lg:text-4xl font-bold">Playground</h1>
            <h2 className="text-lg lg:text-xl leading-snug">
              <span className="bg-yellow-100">Safely and securely try our product</span><br/>in the sandboxed environment.<br/><br/>It provides same experience as ChatGPT.
            </h2>
          </div>

          {/* Right Column - Chat Demo */}
          <div className="flex items-center justify-center mt-4 lg:mt-0 lg:col-span-2 w-full">
            <div className="w-full">
              <AssistantRuntimeProvider runtime={runtime}>
                <div className="h-[60vh] sm:h-[70vh] w-full flex flex-col py-4">
                  <Thread/>
                </div>
              </AssistantRuntimeProvider>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className="text-sm font-medium text-gray-500">Also works with</span>
                <Link href='/connect/chatgpt' className="app-link">
                  <Image src='/images/apps/chatgpt.svg' width={20} height={20} alt="ChatGPT"/>
                  <span>ChatGPT</span>
                </Link>
                <Link href='/connect/claude' className="app-link">
                  <Image src='/images/apps/claude.svg' width={20} height={20} alt="Claude"/>
                  <span>Claude</span>
                </Link>
                <Link href='/connect/mcp-server' className="app-link">
                  <Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP Host" />
                  <span>Any MCP host</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
