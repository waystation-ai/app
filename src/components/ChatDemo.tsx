"use client"
import { useEffect, useState } from "react";

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

export default function ChatDemo() {
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
  );
}
