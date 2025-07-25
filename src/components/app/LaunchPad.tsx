'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useTrackEvent } from '@/lib/utils/track-event';

export function LaunchPad() {
  const trackEvent = useTrackEvent();

  const aiTools = [
    {
      id: 'chatgpt',
      name: 'ChatGPT Pro',
      description: 'Get context from your apps in your Deep Research queries in ChatGPT',
      icon: '/images/apps/chatgpt.svg',
      href: '/app/chatgpt',
    },
    {
      id: 'claude',
      name: 'Claude',
      description: 'Turn Claude into your productivity collaborator',
      icon: '/images/apps/claude.svg',
      href: '/app/claude',
    },
    {
      id: 'cursor',
      name: 'Cursor',
      description: 'Search and reference tasks, docs and conversations from your apps while you code',
      icon: '/images/apps/cursor.svg',
      href: '/app/cursor',
    },
    {
      id: 'mcp',
      name: 'Other AI tools',
      description: 'Connect your AI agent or tool to your apps using authenticated MCP',
      icon: '/images/apps/mcp.svg',
      href: '/app/mcp',
    }
  ];

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Connect your favorite AI agents and tools to your apps to search, write, and keep everything up to date.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {aiTools.map((tool) => (
          <div key={tool.id} className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-lg rounded-xl p-6 flex flex-col space-y-4 hover:from-white/100 hover:to-white/70 transition-all shadow-xl hover:scale-105 duration-500 relative">
            {/* Icon and Title */}
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10 shrink-0">
                <Image src={tool.icon} alt={tool.name} fill className="object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{tool.name}</h3>
              </div>
            </div>
            
            {/* Description */}
            <p className="flex-grow leading-relaxed">{tool.description}</p>
            
            {/* Button */}
            <Link href={tool.href} onClick={() => trackEvent('launch', {'app': tool.id})} className="connect-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 text-center bg-blue-600 hover:bg-blue-700 text-white">
              Connect
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
