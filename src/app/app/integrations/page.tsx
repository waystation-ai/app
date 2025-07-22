import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import Link from 'next/link';

import { getValidConnections } from '@/lib/db';
import { registry } from '@/marketplace';
import { isFullProvider, isNativeProvider, Provider } from '@/marketplace/core/types';
import { ProviderIcon } from '@/components/app/ProviderIcon';
import { ProviderSettingsModal } from '@/components/app/ProviderSettingsModal';

interface ProviderTool {
  id: string;
  summary: string;
  description?: string;
}

interface ProviderModalData {
  id: string;
  name: string;
  description: string;
  bullets?: string[];
  tools: ProviderTool[];
  hasAuth: boolean;
  scopes?: string[];
}

export const metadata: Metadata = {
  title: 'Tools and Integrations',
};

interface ProviderRowProps {
  providerData: ProviderModalData;
  isConnected: boolean;
  connectionInfo?: any;
}

function ProviderRow({ providerData, isConnected, connectionInfo }: ProviderRowProps) {
  const hasAuth = providerData.hasAuth;
  
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      {/* TOOL column */}
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <ProviderIcon provider={providerData.id} width={24} height={24} />
          <span className="font-medium text-gray-900">{providerData.name}</span>
        </div>
      </td>
      
      {/* CONNECTED AS column */}
      <td className="py-4 px-6">
        {isConnected ? (
          <span className="text-sm text-gray-600">
            {connectionInfo?.metadata?.email || connectionInfo?.metadata?.username || 'Connected'}
          </span>
        ) : (
          hasAuth ? (
            <Link 
              href={`/connect/${providerData.id}`}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Connect
            </Link>
          ) : (
            <Link 
              href={`/waitlist/${providerData.id}`}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-50 cursor-not-allowed"
            >
              Coming Soon
            </Link>
          )
        )}
      </td>
      
      {/* ON/OFF column */}
      <td className="py-4 px-6">
        <div className="flex items-center">
          {/* Toggle switch */}
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isConnected ? 'bg-blue-600' : 'bg-gray-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isConnected ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
        </div>
      </td>
      
      {/* SETTINGS column */}
      <td className="py-4 px-6">
        <ProviderSettingsModal
          providerData={providerData}
          isConnected={isConnected}
          connectionInfo={connectionInfo}
        />
      </td>
    </tr>
  );
}

export default async function IntegrationsPage() {
  const session = await auth();

  if (!session.userId) {
    session.redirectToSignIn();
    return null;
  }

  // Get connected providers
  let connectedProviderIds = new Set<string>();
  let connectionsMap = new Map();
  try {
    connectionsMap = await getValidConnections(session.userId);
    connectedProviderIds = new Set(connectionsMap.keys());
  } catch (error) {
    console.error('Error fetching connections:', error);
  }

  // Get all providers from registry
  const allProviders = registry.getAllProviders();
  
  // Sort providers alphabetically by name
  const sortedProviders = allProviders.sort((a, b) => a.name.localeCompare(b.name));

  // Create provider data with tools for each provider
  const providerDataList: ProviderModalData[] = await Promise.all(
    sortedProviders.map(async (provider) => {
      const isConnected = connectedProviderIds.has(provider.id);
      let tools: ProviderTool[] = [];
      
      // Fetch tools only for connected providers
      if (isConnected) {
        try {
          const providerTools = await registry.getProviderTools(provider, session.userId);
          tools = providerTools.map(tool => ({
            id: tool.id,
            summary: tool.summary,
            description: tool.description
          }));
        } catch (error) {
          console.error(`Error fetching tools for ${provider.id}:`, error);
        }
      }

      return {
        id: provider.id,
        name: provider.name,
        description: provider.description,
        bullets: provider.bullets,
        tools,
        hasAuth: isFullProvider(provider),
        scopes: isNativeProvider(provider) ? provider.scopes : undefined
      };
    })
  );

  return (
    <div className="mt-4 sm:mt-8 px-4 sm:px-6 lg:px-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl text-gray-900 font-bold mb-6">
          Tools and Integrations
        </h1>
        
        {/* Tab navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
              All
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Custom Integrations
            </button>
          </nav>
        </div>
      </div>

      {/* Add MCP button */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            + Add MCP
          </button>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002-2M9 7a2 2 0 012 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 002-2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TOOL
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CONNECTED AS
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ON/OFF
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SETTINGS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providerDataList.map(providerData => {
              const isConnected = connectedProviderIds.has(providerData.id);
              const connectionInfo = connectionsMap.get(providerData.id);
              
              return (
                <ProviderRow
                  key={providerData.id}
                  providerData={providerData}
                  isConnected={isConnected}
                  connectionInfo={connectionInfo}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
