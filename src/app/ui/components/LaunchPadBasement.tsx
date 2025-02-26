'use client';

import Link from 'next/link';
import Image from "next/image";

import { usePostHog } from 'posthog-js/react';

export  function LaunchPadBasement() {
  const posthog = usePostHog();

  return (
    <div className="flex items-center gap-4 mt-4 md:mt-0 md:ml-8">
    <span className="text-sm font-medium text-gray-500">Alternatively</span>
    <Link href='/connect/claude/guide' className="app-link" onClick={() => posthog.capture('launchClaude')}>
      <Image src='/images/apps/claude.svg' width={20} height={20} alt="Claude"/>
      <span>Connect to Claude Desktop</span>
    </Link>
    <span className="text-sm font-medium text-gray-500">or</span>
    <Link href='/connect/mcp-server/guide' className="app-link" onClick={() => posthog.capture('launchMCP')}>
      <Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP Host" />
      <span>Connect to Any MCP host</span>
    </Link>
  </div>
)
}