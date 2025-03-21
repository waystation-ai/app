import ChatDemo, { ChatMessage } from "@/components/app/ChatDemo";
import Providers from "@/components/app/Providers";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import AlternativeApps from "./AlternativeApps";
import { AppType, getAppMetadata } from "./metadata";

interface LandingPageProps {
  appType: AppType;
}

export default function LandingPage({ appType }: LandingPageProps) {
  // Get metadata for this app type
  const metadata = getAppMetadata(appType);
  
  // Default chat messages
  const messages: ChatMessage[] = [
    { role: 'user', content: "Can you please process fresh user feedback using instructions in the Feedback Processing doc?" },
    { role: 'agent', content: "Reading and analyzing the Feedback Processing document in Google Drive..." },
    { role: 'agent', content: "Here is what I'm going to do. I'll process all incoming tickets in Zendesk labeled Feedback. I'll triage them and match them to items on the Stories board on Monday. Please confirm." },
    { role: 'user', content: "Go ahead! Can you also summarize and send a Slack message to the team once it's done so we can review it?" },
    { role: 'agent', content: "On it! We'll get back to you shortly." }
  ];

  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left space-y-4 lg:space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold">{metadata.displayTitle}</h1>
            <h2 className="text-lg lg:text-xl leading-snug">
              <span className="bg-yellow-100">{metadata.displayDescription}</span><br/>through our 
              no-code, secure integration hub.
            </h2>
            <div className="mt-6">
              <Providers app={appType === "chatgpt" ? undefined : appType} className="grid grid-cols-8 gap-4 lg:gap-3" />
            </div>
            <SignedIn>
              <Link href="/dashboard" className="getstarted-btn">
                Get Started
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="getstarted-btn">
                Get Started
              </Link>
            </SignedOut>
            
            {/* Alternative Apps Section */}
            <AlternativeApps currentApp={appType} />
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
