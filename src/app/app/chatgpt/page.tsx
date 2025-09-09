import { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Info } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Connect ChatGPT to your apps',
};

export default function ChatGPTPage() {
  return (
    <div className="mt-4 px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl text-gray-900 font-bold mb-4">
          Connect ChatGPT to your apps via WayStation
        </h1>
        <p className="text-lg text-gray-600">
          Access your WayStation tools directly within ChatGPT Plus using Custom Connectors
        </p>
      </div>

      {/* Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Requirements</h2>
        <ul className="space-y-1 text-blue-800">
          <li>ChatGPT Plus subscription required</li>
        </ul>
      </div>

      {/* Important Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6 mb-8">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-amber-800 mb-1">Limited Availability</h3>
            <p className="text-sm text-amber-700">
              Custom Connectors are currently only available in ChatGPT&apos;s &quot;Deep Research Mode&quot;. 
              They cannot be used in regular chat conversations yet.
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Setup Instructions</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-3 sm:mb-0">
                1
              </div>
              <div className="sm:ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Open ChatGPT Settings</h3>
                <p className="text-gray-600 mb-3">
                  In ChatGPT, click on your profile or settings icon to access the Settings menu.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-3 sm:mb-0">
                2
              </div>
              <div className="sm:ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Navigate to Connectors</h3>
                <p className="text-gray-600 mb-3">
                  In the Settings sidebar, look for and click on &quot;Connectors&quot; (marked as BETA). This will show you available connectors and a &quot;Create&quot; button.
                </p>
                <div className="mt-4">
                  <Image 
                    src="/images/apps/chatgpt-connectors-settings.png"
                    alt="ChatGPT Connectors settings page showing available connectors"
                    width={800}
                    height={600}
                    className="w-full max-w-full sm:max-w-2xl rounded-lg border shadow-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2 italic">Connectors page showing various app integrations and Create button</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-3 sm:mb-0">
                3
              </div>
              <div className="sm:ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Connector</h3>
                <p className="text-gray-600 mb-3">
                  Click the &quot;Create&quot; button in the top-right corner of the Connectors page. This will open the &quot;New connector&quot; dialog.
                </p>
                <div className="mt-4">
                  <Image 
                    src="/images/apps/chatgpt-add-connector.png"
                    alt="New connector dialog with form fields for configuration"
                    width={600}
                    height={400}
                    className="w-full max-w-full sm:max-w-lg rounded-lg border shadow-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2 italic">New connector creation form</p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col sm:flex-row">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-3 sm:mb-0">
                4
              </div>
              <div className="sm:ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Configure WayStation Connection</h3>
                <p className="text-gray-600 mb-3">
                  Fill out the connector form with your WayStation details:
                </p>
                <div className="bg-gray-50 p-4 rounded-md mb-3">
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Name:</strong> WayStation
                    </div>
                    <div>
                      <strong>URL:</strong> 
                      <code className="ml-2 bg-white px-2 py-1 rounded border text-xs sm:text-sm break-all">https://waystation.ai/mcp</code>
                    </div>
                    <div>
                      <strong>Description (optional):</strong> Access your WayStation integrations
                    </div>
                    <div>
                      <strong>Icon (optional):</strong> You can upload a custom icon or leave blank
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  After filling in the required fields, click &quot;Create&quot; to add the connector.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col sm:flex-row">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-3 sm:mb-0">
                ✓
              </div>
              <div className="sm:ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Connector Created Successfully</h3>
                <p className="text-gray-600 mb-3">
                  Your WayStation connector is now created and ready to use! Remember that Custom Connectors are currently only available in Deep Research Mode.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Deep Research Mode */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Using Deep Research Mode</h2>
          <p className="text-gray-600 mb-4">
            To access your WayStation tools, you&apos;ll need to use ChatGPT&apos;s Deep Research Mode:
          </p>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 mb-2 sm:mb-0">
                1
              </div>
              <p className="sm:ml-3 text-gray-600">Start a new conversation in ChatGPT</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 mb-2 sm:mb-0">
                2
              </div>
              <p className="sm:ml-3 text-gray-600">Switch to &quot;Deep Research Mode&quot; (look for the mode selector)</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 mb-2 sm:mb-0">
                3
              </div>
              <p className="sm:ml-3 text-gray-600">Your WayStation connector will now be available for use</p>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Example Research Queries</h2>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-md">
              <code className="text-xs sm:text-sm break-words">&quot;Research the latest marketing trends and create action items in my Asana project&quot;</code>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <code className="text-xs sm:text-sm break-words">&quot;Analyze my Google Drive documents for Q4 insights and summarize findings&quot;</code>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <code className="text-xs sm:text-sm break-words">&quot;Research competitor pricing and update my team via Slack with key findings&quot;</code>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            Having trouble connecting? Check out these resources:
          </p>
          <div className="space-y-2">
            <Link href="/app/integrations" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ExternalLink className="h-4 w-4 mr-2" />  Manage your integrations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}