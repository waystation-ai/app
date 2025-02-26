import { McpKey } from '@/app/ui/components/McpKey';
import Link from 'next/link';

export default async function Page() {
  const claudeConfig = {
    "mcpServers": {
      "waystation": {
        "command": "npx",
        "args": ["-y", "@waystation/mcp"],
        "env": {
          "WAY_KEY": "your-way-key-here"
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Connect WayStation to Claude Desktop</h1>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What is WayStation MCP?</h2>
        <p className="text-gray-700 mb-4">
          WayStation MCP is a Model Context Protocol (MCP) server that enables Claude to interact with your tools and data. By connecting WayStation MCP to Claude, you can extend Claude&apos;s capabilities with custom tools and resources.
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

        {/* Step 2: Configure Claude */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-2">Step 2: Configure Claude</h3>
          <p className="text-gray-700 mb-4">
            Read this <Link href='https://modelcontextprotocol.io/quickstart/user#2-add-the-filesystem-mcp-server' target='_blank' className='text-blue-700'>guide</Link> for the instructions on how to locate and edit Claude&apos;s config. Add the following configuration to your Claude settings, replacing &quot;your-way-key-here&quot; with the key from Step 1:
          </p>
          <pre className="bg-gray-50 p-6 rounded-lg border border-gray-200 overflow-x-auto">
            <code>{JSON.stringify(claudeConfig, null, 2)}</code>
          </pre>
          <p className="text-sm text-gray-600 mt-2">
            This configuration tells Claude how to connect to the WayStation MCP server.
          </p>
        </div>

        {/* Step 3: Test Connection */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-2">Step 3: Test the Connection</h3>
          <p className="text-gray-700 mb-4">
            After configuring Claude with your WAY_KEY:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Restart Claude to apply the new configuration</li>
            <li>Ask Claude to list available MCP tools to verify the connection</li>
            <li>Try using one of the available tools to confirm everything is working</li>
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
            <li>Check that the configuration JSON is properly formatted</li>
            <li>Verify that you&apos;ve restarted Claude after making configuration changes</li>
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
