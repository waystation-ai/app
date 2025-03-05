import ChatDemo from "@/app/ui/components/ChatDemo";
import Providers from "@/app/ui/components/Providers";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link"; 
import Image from "next/image";

import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Integrate any MCP host with the productivity apps',
  description: "The only MCP Server you need. Connect any MCP host with the tools you use daily through our no-code, secure integration hub.",
};

export default async function Home() {
  const messages = [
    { isAI: true, content: "Can you please process fresh user feedback using instructions in the Feedback Processing doc?" },
    { isAI: false, content: "Reading and analyzing the Feedback Processing document in Google Drive..." },
    { isAI: false, content: "Here is what I'm going to do. I'll process all incoming tickets in Zendesk labeled Feedback. I'll triage them and match them to items on the Stories board on Monday. Please confirm." },
    { isAI: true, content: "Go ahead! Can you also summarize and send a Slack message to the team once it's done so we can review it?" },
    { isAI: false, content: "On it! We'll get back to you shortly." }
  ];

  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left space-y-4 lg:space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold">The only MCP Server<br/>you need</h1>
            <h2 className="text-lg lg:text-xl leading-snug">
              <span className="bg-yellow-100">Connect any MCP host with the tools you use daily</span><br/>through our 
              no-code, secure integration hub.
            </h2>
            <div className="mt-6">
              <Providers app={"mcp-server"} className="grid grid-cols-6 lg:grid-cols-8 gap-4 lg:gap-3" />
            </div>
            <SignedIn>
              <Link href="/dashboard" className="aurora-btn hidden lg:block px-4 py-2 text-sm font-bold rounded hover:scale-105 transition-transform duration-300 w-1/2 text-center">
                Get Started
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="aurora-btn hidden lg:block px-4 py-2 text-sm font-bold rounded hover:scale-105 transition-transform duration-300 w-1/2 text-center">
                Get Started
              </Link>
            </SignedOut>
            <div className="flex items-center gap-4 mt-4 mb-8">
              <span className="text-sm font-medium text-gray-500">Also connects to</span>
              <Link href={`/connect/chatgpt`} className="app-link">
                <Image src='/images/apps/chatgpt.svg' width={20} height={20} alt="ChatGPT"/>
                <span>ChatGPT</span>
              </Link>
              <span className="text-sm font-medium text-gray-500">or</span>
              <Link href={`/connect/claude`} className="app-link">
                <Image src="/images/apps/claude.svg" width={20} height={20} alt="Claude" />
                <span>Claude Desktop</span>
              </Link>
            </div>

          </div>

          {/* Right Column - Chat Demo */}
          <div className="flex items-center justify-center mt-4 lg:mt-0">
            <ChatDemo messages={messages}/>
          </div>
        </div>
      </main>
    </div>
  );
}
