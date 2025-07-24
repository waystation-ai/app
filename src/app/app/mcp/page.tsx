import { Metadata } from 'next';
import NanoIdDisplay from '@/components/app/NanoIdDisplay';

export const metadata: Metadata = {
  title: 'Connect any MCP client to your apps',
};

export default function MCPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl text-gray-900 font-bold mb-4">
            Connect any MCP client to your apps
          </h1>
          <p className="text-lg text-gray-600">
            Use this personal MCP server URL to connect WayStation to any MCP-compatible client
          </p>
        </div>

        {/* MCP URL Display */}
        <NanoIdDisplay />
      </div>
    </div>
  );
}