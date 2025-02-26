import { McpKey } from '@/app/ui/components/McpKey';
import Link from 'next/link';

export default async function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Connect WayStation to any MCP host</h1>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What is WayStation MCP?</h2>
        <p className="text-gray-700 mb-4">
          WayStation MCP is a Model Context Protocol (MCP) server that enables AI models to interact with your tools and data. By running the WayStation MCP server, you can extend AI capabilities with custom tools and resources.
        </p>
      </section>

      {/* Instructions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Step-by-Step Instructions</h2>

        {/* Step 1: Get WAY_KEY */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-2">Step 1: Get your WAY_KEY</h3>
          <p className="text-gray-700 mb-4">
            Your WAY_KEY is required to authenticate with the WayStation MCP server. Here&apos;s your key:
          </p>
          <McpKey />
          <p className="text-sm text-gray-600 mt-2">
            Copy this key as you&apos;ll need it in the next step.
          </p>
        </div>

        {/* Step 2: Run MCP Server */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-2">Step 2: Run the MCP Server</h3>
          <p className="text-gray-700 mb-4">
            Run the WayStation MCP server using one of these methods:
          </p>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Option 1: Single command</p>
              <pre className="bg-gray-50 p-6 rounded-lg border border-gray-200 overflow-x-auto">
                <code>WAY_KEY=&lt;your_way_key&gt; npx -y @waystation/mcp</code>
              </pre>
            </div>
            <div>
              <p className="font-medium mb-2">Option 2: Set environment variable</p>
              <pre className="bg-gray-50 p-6 rounded-lg border border-gray-200 overflow-x-auto">
                <code>export WAY_KEY=&lt;your_way_key&gt;
npx -y @waystation/mcp</code>
              </pre>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Replace &lt;your_way_key&gt; with the key from Step 1.
          </p>
        </div>

        {/* Step 3: Verify Connection */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-2">Step 3: Verify the Connection</h3>
          <p className="text-gray-700 mb-4">
            After starting the MCP server:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>You should see a success message in the terminal</li>
            <li>The server will be ready to accept connections</li>
            <li>Your AI assistant can now use the available tools and resources</li>
          </ol>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        <div className="space-y-4 text-gray-700">
          <p>If you encounter any issues:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Ensure your WAY_KEY is correctly copied and not expired</li>
            <li>Check that the command was run from a terminal with internet access</li>
            <li>Verify that no other MCP server is running on the same port</li>
          </ul>
        </div>
      </section>

      {/* More Resources */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">More Resources</h2>
        <p className="text-gray-700">
          For more detailed instructions and advanced configuration options, visit the{' '}
          <Link href="https://modelcontextprotocol.io/quickstart/user" className="text-blue-600 hover:underline">
            official MCP quickstart guide
          </Link>.
        </p>
      </section>
    </div>
  );
}
