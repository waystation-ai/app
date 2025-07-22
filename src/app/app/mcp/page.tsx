import { Metadata } from 'next';
import NanoIdDisplay from '@/components/app/NanoIdDisplay';

export const metadata: Metadata = {
  title: 'Your MCP Server URL - WayStation',
};

export default function MCPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl text-gray-900 font-bold mb-4">
            Your Personal MCP Server
          </h1>
          <p className="text-lg text-gray-600">
            Use this URL to connect WayStation to any MCP-compatible client
          </p>
        </div>

        {/* MCP URL Display */}
        <NanoIdDisplay />
      </div>
    </div>
  );
}