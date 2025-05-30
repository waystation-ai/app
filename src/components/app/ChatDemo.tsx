"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
}

interface ChatMessageProps extends ChatMessage {
  displayedContent: string;
  showCursor?: boolean;
  showTypingIndicator?: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex space-x-2 p-2 text-white">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
    </div>
  );
}

function ChatMessage({ role, displayedContent, showCursor, showTypingIndicator }: ChatMessageProps) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[85%] p-3 sm:p-4 rounded-2xl ${
        isUser? 'bg-[#e2ecff]' : 'chat-msg'
      }`}>
        {showTypingIndicator ? (
          <TypingIndicator />
        ) : (
          <p className={`text-base ${isUser ? 'text-gray-800' : 'text-white'} ${
            showCursor ? 'typing-cursor' : ''
          }`}>
            {displayedContent}
          </p>
        )}
      </div>
    </div>
  );
}

interface ChatDemoProps {
  messages: ChatMessage[] | undefined;
  className?: string;
}

export default function ChatDemo({ messages, className }: ChatDemoProps) {

  if (!messages) {
    messages = [
      { role: 'user', content: "Can you please process fresh user feedback using instructions in the Feedback Processing doc?" },
      { role: 'agent', content: "Reading and analyzing the Feedback Processing document in Google Drive..." },
      { role: 'agent', content: "Here is what I'm going to do. I'll process all incoming tickets in Zendesk labeled Feedback. I'll triage them and match them to items on the Stories board on Monday. Please confirm." },
      { role: 'user', content: "Go ahead! Can you also summarize and send a Slack message to the team once it's done so we can review it?" },
      { role: 'agent', content: "On it! We'll get back to you shortly." }
    ];
  }
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedContent, setDisplayedContent] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessageIndex, displayedContent]);

  useEffect(() => {
    // Reset if we've shown all messages
    if (currentMessageIndex >= messages.length) {
      const resetTimer = setTimeout(() => {
        setCurrentMessageIndex(0);
        setDisplayedContent("");
        setShowCursor(false);
        setShowTypingIndicator(false);
      }, 2000);
      return () => clearTimeout(resetTimer);
    }

    const currentMessage = messages[currentMessageIndex];
    const isAgentMessage = currentMessage.role === 'agent';
    let typingTimer: NodeJS.Timeout | null = null;
    let nextMessageTimer: NodeJS.Timeout | null = null;

    // Add initial delay for first message
    if (currentMessageIndex === 0) {
      const initialDelay = setTimeout(() => {
        // Set initial states
        setShowCursor(isAgentMessage);
        setShowTypingIndicator(isAgentMessage);
        setDisplayedContent("");

        // Start message animation after delay
        if (isAgentMessage) {
          typingTimer = setTimeout(() => {
            setShowTypingIndicator(false);
            startTyping();
          }, 1000);
        } else {
          startTyping();
        }
      }, 2000); // 2 second delay for first message

      return () => clearTimeout(initialDelay);
    }

    // For subsequent messages, proceed normally
    setShowCursor(isAgentMessage);
    setShowTypingIndicator(isAgentMessage);
    setDisplayedContent("");

    // Show typing indicator for agent messages
    if (isAgentMessage) {
      typingTimer = setTimeout(() => {
        setShowTypingIndicator(false);
        startTyping();
      }, 1000);
    } else {
      startTyping();
    }

    function startTyping() {
      let currentIndex = 0;
      const messageContent = currentMessage.content;
      
      function typeNextChar() {
        if (currentIndex < messageContent.length) {
          setDisplayedContent(messageContent.slice(0, currentIndex + 1));
          currentIndex++;
          typingTimer = setTimeout(typeNextChar, isAgentMessage ? 30 : 50);
        } else {
          // Message complete, schedule next message
          nextMessageTimer = setTimeout(() => {
            setCurrentMessageIndex(prev => prev + 1);
          }, 2000);
        }
      }

      typeNextChar();
    }

    // Cleanup
    return () => {
      if (typingTimer) clearTimeout(typingTimer);
      if (nextMessageTimer) clearTimeout(nextMessageTimer);
    };
  }, [currentMessageIndex, messages.length]);

  return (
    <div className={" bg-white/80 w-full max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl shadow-[0px_2px_16px_0px_rgba(0,0,0,0.08)] flex flex-col mb-2 " + (className || "sm:h-[70vh] h-[60vh] mt-0 sm:mt-12")}>
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto scrollbar-hide space-y-3 sm:space-y-4 mb-4 px-1 sm:px-2 -webkit-overflow-scrolling-touch">
        {messages.slice(0, currentMessageIndex + 1).map((msg, idx) => (
          <ChatMessage 
            key={idx}
            role={msg.role}
            content={msg.content}
            displayedContent={idx === currentMessageIndex ? displayedContent : msg.content}
            showCursor={idx === currentMessageIndex && showCursor}
            showTypingIndicator={idx === currentMessageIndex && showTypingIndicator}
          />
        ))}
      </div>
      <div className="flex gap-3 border-t pt-4 justify-center sm:justify-start">
        <div className="w-8 h-8 rounded bg-[#E2ECFF] flex items-center justify-center">
          <Image src="/images/chat/file.svg" alt="File" className="w-4 h-4 opacity-80" width={32} height={32} />
        </div>
        <div className="w-8 h-8 rounded bg-[#E2ECFF] flex items-center justify-center">
          <Image src="/images/chat/globe.svg" alt="Web" className="w-4 h-4 opacity-80" width={32} height={32} />
        </div>
        <div className="w-8 h-8 rounded bg-[#E2ECFF] flex items-center justify-center">
          <Image src="/images/chat/window.svg" alt="Apps" className="w-4 h-4 opacity-80" width={32} height={32} />
        </div>
      </div>
    </div>
  );
}
