import Link from 'next/link';
import NanoIdDisplay from '@/components/app/NanoIdDisplay'; // Import the new client component
import { CopyBox } from '@/components/app/CopyBox';

export default function Page() {
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
        <h2 className="text-2xl font-semibold mb-4">Option A. Remote server</h2>
        <p className="text-gray-700 mb-4">
            Apps like Cline, WindSurf, and Cursor support remote MCP servers. You can connect to WayStation MCP from these apps using unique URL specific to your account.
        </p>
        <NanoIdDisplay /> 

      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Option B. Local server</h2>

        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Run the WayStation MCP server using the command below:
          </p>
          <CopyBox text="npx -y mcp-remote@latest https://waystation.ai/mcp" />
        </div>

        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            The typical config will look like the one below:
          </p>
          <CopyBox text={JSON.stringify({
            mcpServers: {
              WayStation: {
                command: "npx",
                args: ["-y", "mcp-remote@latest", "https://waystation.ai/mcp"]
              }
            }
          }, null, 2)} />
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-2">Verify the Connection</h3>
          <p className="text-gray-700 mb-4">
            After starting the MCP server:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>You will be redirected to the browser to log in</li>
            <li>The server will be ready to accept connections</li>
            <li>Your AI assistant can now use the available tools and resources</li>
          </ol>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-2">Troubleshooting</h3>
        <div className="space-y-4 text-gray-700">
          <p>If you encounter any issues:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Ensure your chosen authentication method (unique URL) is correctly copied and valid</li>
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
