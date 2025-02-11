"use client"
import AuroraBackground from "@/components/AuroraBackground";
import ChatDemo from "@/components/ChatDemo";

export default function Home() {

  return (
    <div className="h-screen flex flex-col relative">
      <AuroraBackground />
      {/* Header */}
      <header className="bg-white/30 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold aurora-text">WayStation</h1>
        <a 
          href="https://forms.gle/ksX4AVNCJbPFr66F6" 
          className="aurora-btn px-4 sm:px-6 py-2 text-sm font-medium rounded-lg 
                   hover:scale-105 transition-transform duration-300 w-full sm:w-auto text-center"
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
          </div>

          {/* Right Column - Chat Demo */}
          <div className="flex items-center justify-center mt-4 lg:mt-0">
            <ChatDemo />
          </div>
        </div>

        {/* Integration Partners */}
        <div className="mt-auto bg-white/40 backdrop-blur-md py-6 px-4">
          <p className="text-center text-gray-800 text-lg mb-8 sm:mb-10">Seamlessly integrate with your favorite tools</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-8 sm:gap-6 max-w-5xl mx-auto">
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
              alt="Google Docs" 
              className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
            />
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" 
              alt="Slack" 
              className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
            />
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" 
              alt="Jira" 
              className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
            />
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg" 
              alt="Browser" 
              className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
            />
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg" 
              alt="Asana" 
              className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
            />
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg" 
              alt="Monday.com" 
              className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
            />
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" 
              alt="Zendesk" 
              className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
