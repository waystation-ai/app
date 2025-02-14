"use client"
import ChatDemo from "@/components/ChatDemo";
import Partners from "@/components/Partners";

export default function Home() {

  return (
    <div className="h-screen flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left space-y-4 lg:space-y-6">
            <p className="text-3xl lg:text-4xl text-gray-900 font-bold">
            Empowering LLMs<br/>to take real-world actions
            </p>
            <p className="text-lg lg:text-xl text-gray-800 leading-relaxed">
              <span className="bg-yellow-100">Connect your AI assistants with the tools</span><br/>professionals use daily through our 
              no-code, secure integration hub.
            </p>
            <Partners />
          </div>

          {/* Right Column - Chat Demo */}
          <div className="flex items-center justify-center mt-4 lg:mt-0">
            <ChatDemo />
          </div>
        </div>
      </main>
    </div>
  );
}
