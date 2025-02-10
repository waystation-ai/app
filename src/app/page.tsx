"use client"
import { useEffect, useState } from "react";
import AuroraBackground from "@/components/AuroraBackground";

interface ChatMessageProps {
  isAI: boolean;
  content: string;
  isTyping?: boolean;
  showCursor?: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex space-x-2 p-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );
}

function ChatMessage({ isAI, content, isTyping, showCursor }: ChatMessageProps) {
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[85%] p-3 sm:p-4 rounded-2xl ${
        isAI ? 'bg-gray-100' : 'chat-msg'
      }`}>
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <p className={`text-base ${isAI ? 'text-gray-800' : 'text-white'} ${
            showCursor ? 'typing-cursor' : ''
          }`}>
            {content}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const messages = [
    { isAI: true, content: "I need to schedule a team meeting for next week and share the presentation from our last client call." },
    { isAI: false, content: "I'll help you with that. I'll check everyone's calendar availability in Google Calendar and upload the presentation from the shared Drive folder." },
    { isAI: true, content: "Perfect! Can you also send a Slack message to the team once it's done?" },
    { isAI: false, content: "Done! I've scheduled the meeting for Tuesday at 2 PM, uploaded the presentation to the shared folder, and notified the team via Slack. Everyone should have received the calendar invite and meeting details." }
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const cycleMessages = () => {
      if (currentMessageIndex >= messages.length) {
        setTimeout(() => {
          setCurrentMessageIndex(0);
          setShowTyping(false);
          setShowCursor(false);
        }, 2000);
        return;
      }

      const isAIMessage = messages[currentMessageIndex].isAI;
      
      // Show typing indicator
      setShowTyping(true);
      setShowCursor(false);

      const typingDuration = isAIMessage ? 2000 : 1500;
      const displayDuration = 3000;

      // Simulate typing delay
      setTimeout(() => {
        setShowTyping(false);
        if (!isAIMessage) {
          setShowCursor(true);
        }
        
        // Move to next message after showing current one
        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1);
        }, displayDuration);
      }, typingDuration);
    };

    const timer = setTimeout(cycleMessages, 500);
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      setShowTyping(false);
      setShowCursor(false);
    };
  }, [currentMessageIndex, messages.length]);

  return (
    <div className="min-h-screen relative">
      <AuroraBackground />
      {/* Header */}
      <header className="bg-white/30 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold aurora-text">WayStation.AI</h1>
        <a 
          href="https://forms.gle/ksX4AVNCJbPFr66F6" 
          className="aurora-btn px-4 sm:px-6 py-2 text-sm font-medium rounded-lg 
                   hover:scale-105 transition-transform duration-300 w-full sm:w-auto text-center"
        >
          Get Early Access
        </a>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col min-h-screen">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
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
          <div className="flex items-center justify-center mt-8 lg:mt-0">
            <div className="glass-card w-full max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col min-h-[480px] lg:min-h-[480px]">
              <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-4 px-1 sm:px-2">
                {messages.slice(0, currentMessageIndex + 1).map((msg, idx) => (
                  <ChatMessage 
                    key={idx}
                    isAI={msg.isAI}
                    content={msg.content}
                    isTyping={idx === currentMessageIndex && showTyping}
                    showCursor={idx === currentMessageIndex && showCursor}
                  />
                ))}
              </div>
              <div className="flex gap-3 border-t pt-4 justify-center sm:justify-start">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                  <img src="/file.svg" alt="File" className="w-4 h-4 opacity-60" />
                </div>
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                  <img src="/globe.svg" alt="Web" className="w-4 h-4 opacity-60" />
                </div>
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                  <img src="/window.svg" alt="Apps" className="w-4 h-4 opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Partners */}
        <div className="bg-white/40 backdrop-blur-md py-6 px-4">
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
