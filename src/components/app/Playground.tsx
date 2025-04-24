"use client";

import { AssistantCloud, AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Menu, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

export default function Playground() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleClickOutside = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };
  const cloud = new AssistantCloud({
    baseUrl: process.env["NEXT_PUBLIC_ASSISTANT_BASE_URL"]!,
    authToken: async () => {
      const response = await fetch("/api/auth/assistant-ui", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        return data.token;
      }
    }
  });

  const runtime = useChatRuntime({
    api: "/api/chat",
    maxSteps: 10,
    cloud: cloud,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className={`${isFullScreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[60vh] sm:h-[70vh] relative rounded-2xl'} w-full flex flex-row gap-4 p-4 bg-background shadow-[0px_2px_16px_0px_rgba(0,0,0,0.08)] transition-all duration-300`}>
        <button onClick={() => setIsFullScreen(!isFullScreen)} className="absolute top-4 right-4 z-20 p-1.5 hover:bg-accent rounded-lg transition-colors">
          {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden absolute top-4 left-4 z-20 p-2 hover:bg-accent rounded-lg transition-colors">
          <Menu className="h-6 w-6" />
        </button>
        <div className={`absolute md:relative inset-0 md:inset-auto bg-background/95 md:bg-transparent w-full md:w-1/4 transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} md:opacity-100 md:translate-y-0 md:pointer-events-auto z-10 p-4 md:p-0`}>
          <div className="pt-12 md:pt-0">
            <ThreadList/>
          </div>
        </div>
        <div className="w-full md:w-3/4 pt-9 sm:pt-0" onClick={handleClickOutside}>
          <Thread/>
        </div>
      </div>
    </AssistantRuntimeProvider>
  )
}
