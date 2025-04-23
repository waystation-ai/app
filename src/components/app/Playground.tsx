"use client";

import { AssistantCloud, AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";

export default function Playground() {
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
    <div className="h-[60vh] sm:h-[70vh] w-full flex flex-row gap-4 p-4 bg-background rounded-2xl shadow-[0px_2px_16px_0px_rgba(0,0,0,0.08)]">
      <div className="w-1/4">
        <ThreadList/>
      </div>
      <div className="w-3/4">
        <Thread/>
      </div>
    </div>
  </AssistantRuntimeProvider>    
  )
}