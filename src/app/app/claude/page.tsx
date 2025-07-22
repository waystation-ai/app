import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Connect to Claude - WayStation',
};

export default function ClaudePage() {
  return (
    <div className="mt-4 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl text-gray-900 font-bold mb-4">
          Connect WayStation to Claude
        </h1>
        <p className="text-lg text-gray-600">
          Access your WayStation tools directly within Claude Pro using Custom Integrations
        </p>
      </div>

      {/* Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Requirements</h2>
        <ul className="space-y-1 text-blue-800">
          <li>Claude Pro subscription required</li>
        </ul>
      </div>

      {/* Instructions */}
      <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Setup Instructions</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Access Claude Menu</h3>
                <p className="text-gray-600 mb-3">
                  In Claude, look for the menu on the left side of your chat interface. Click on "Connect apps" or scroll down to find "Add integrations" at the bottom of the menu.
                </p>
                <div className="mt-4">
                  <img 
                    src="/images/apps/claude-integration-settings.png"
                    alt="Claude menu showing Connect apps and Add integrations options"
                    className="w-full max-w-2xl rounded-lg border shadow-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2 italic">Claude menu with integration options visible</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Open Integrations Page</h3>
                <p className="text-gray-600 mb-3">
                  Click on "Add integrations" from the menu. This will open the Integrations page where you can see existing connected services and add new ones.
                </p>
                <div className="mt-4">
                  <img 
                    src="/images/apps/claude-add-integration.png"
                    alt="Claude Integrations page showing connected services and Add integration button"
                    className="w-full max-w-2xl rounded-lg border shadow-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2 italic">Integrations page with existing connections and "Add integration" button</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Integration</h3>
                <p className="text-gray-600 mb-3">
                  Click the "Add integration" button at the bottom of the integrations list. This will open a form where you can configure a custom integration.
                </p>
                <div className="mt-4">
                  <img 
                    src="/images/apps/claude-oauth-flow.png"
                    alt="Add integration form with Integration name and URL fields"
                    className="w-full max-w-2xl rounded-lg border shadow-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2 italic">Add integration form with name and URL fields</p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Configure WayStation Connection</h3>
                <p className="text-gray-600 mb-3">
                  Fill out the integration form with your WayStation details:
                </p>
                <div className="bg-gray-50 p-4 rounded-md mb-3">
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Integration name:</strong> WayStation
                    </div>
                    <div>
                      <strong>Integration URL:</strong> 
                      <code className="ml-2 bg-white px-2 py-1 rounded border">https://waystation.app/mcp</code>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  After filling in the fields, click the "Add" button to create the integration.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                5
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Connect and Authenticate</h3>
                <p className="text-gray-600 mb-3">
                  After adding the integration, you'll see "WayStation" appear in your integrations list with a "Connect" button next to it. 
                  Click the "Connect" button to authenticate your WayStation account and activate the integration.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700">
                    💡 This step will redirect you to WayStation for authentication, then return you to Claude once complete.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Using Your Tools</h3>
                <p className="text-gray-600">
                  Once authenticated, WayStation will show a "Connected" status in your integrations list. 
                  You can now access all your WayStation integrations directly within Claude conversations!
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Example Commands</h2>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-md">
              <code className="text-sm">"Create a new task in my Asana project for the marketing campaign"</code>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <code className="text-sm">"Send a Slack message to the #team channel about today's standup"</code>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <code className="text-sm">"Search my Google Drive for documents related to Q4 planning"</code>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            Having trouble connecting? Check out these resources:
          </p>
          <div className="space-y-2">
            <Link 
              href="/app/integrations"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage your integrations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}