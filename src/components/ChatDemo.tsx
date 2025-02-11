"use client"
import { useEffect, useRef, useState } from "react";

interface ChatMessageProps {
  isAI: boolean;
  content: string;
  displayedContent: string;
  showCursor?: boolean;
  showTypingIndicator?: boolean;
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

function ChatMessage({ isAI, displayedContent, showCursor, showTypingIndicator }: ChatMessageProps) {
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[85%] p-3 sm:p-4 rounded-2xl ${
        isAI ? 'bg-gray-100' : 'chat-msg'
      }`}>
        {showTypingIndicator ? (
          <TypingIndicator />
        ) : (
          <p className={`text-base ${isAI ? 'text-gray-800' : 'text-white'} ${
            showCursor ? 'typing-cursor' : ''
          }`}>
            {displayedContent}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ChatDemo() {
  const messages = [
    { isAI: true, content: "Can you please process fresh user feedback using instructions in the Feedback Processing doc?" },
    { isAI: false, content: "Reading and analyzing the Feedback Processing document in Google Drive..." },
    { isAI: false, content: "Here is what I'm going to do. I'll process all incoming tickets in Zendesk labeled Feedback. I'll triage them and match them to items on the Stories board on Monday. Please confirm." },
    { isAI: true, content: "Go ahead! Can you also summarize and send a Slack message to the team once it's done so we can review it?" },
    { isAI: false, content: "On it! We'll get back to you shortly." }
  ];

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
    const isAIMessage = currentMessage.isAI;
    let typingTimer: NodeJS.Timeout | null = null;
    let nextMessageTimer: NodeJS.Timeout | null = null;

    // Set initial states
    setShowCursor(!isAIMessage);
    setShowTypingIndicator(!isAIMessage);
    setDisplayedContent("");

    // Show typing indicator for user messages
    if (!isAIMessage) {
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
          typingTimer = setTimeout(typeNextChar, isAIMessage ? 50 : 30);
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
    <div className="glass-card w-full max-w-2xl mx-auto mt-0 sm:mt-12 p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col h-[60vh] sm:h-[50vh]">
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-4 px-1 sm:px-2 -webkit-overflow-scrolling-touch">
        {messages.slice(0, currentMessageIndex + 1).map((msg, idx) => (
          <ChatMessage 
            key={idx}
            isAI={msg.isAI}
            content={msg.content}
            displayedContent={idx === currentMessageIndex ? displayedContent : msg.content}
            showCursor={idx === currentMessageIndex && showCursor}
            showTypingIndicator={idx === currentMessageIndex && showTypingIndicator}
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
