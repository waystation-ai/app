"use client"
import AuroraBackground from "@/components/AuroraBackground";
import ChatDemo from "@/components/ChatDemo";
import Partners from "@/components/Partners";

export default function Home() {

  return (
    <div className="h-screen flex flex-col relative">
      <AuroraBackground />
      {/* Header */}
      <header className="bg-white/30 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-4 flex flex-row justify-between items-center sticky top-0 z-50 gap-4 sm:gap-0">
        <div className="flex items-center gap-2">
          <img src="/aurora-circles.svg" alt="WayStation" className="h-8 w-8" />
          <h1 className="text-2xl font-bold aurora-text">WayStation</h1>
        </div>
        <a 
          href="https://forms.gle/ksX4AVNCJbPFr66F6" 
          className="aurora-btn px-4 py-2 text-sm font-medium rounded-lg 
                   hover:scale-105 transition-transform duration-300 w-auto text-center"
        >
          Get Early Access
        </a>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left space-y-4 lg:space-y-6">
            <p className="text-3xl lg:text-4xl text-gray-900 font-bold">
            Empowering LLMs to take real-world actions
            </p>
            <p className="text-lg lg:text-xl text-gray-800 leading-relaxed">
              Connect your AI assistants with the tools professionals use daily through our 
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
