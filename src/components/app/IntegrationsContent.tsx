import Link from 'next/link';
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

interface IntegrationsContentProps {
  providers: ProviderModalData[];
  connectedProviderIds: Set<string>;
  connectionsMap: Map<string, any>;
}

function ProviderRow({ providerData, isConnected, connectionInfo }: {
  providerData: ProviderModalData;
  isConnected: boolean;
  connectionInfo?: any;
}) {
  const hasAuth = providerData.hasAuth;
  
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      {/* TOOL column */}
      <td className="py-4 px-6 w-full">
        <div className="flex items-center space-x-3">
          <ProviderIcon provider={providerData.id} width={24} height={24} />
          <span className="font-medium text-gray-900">{providerData.name}</span>
        </div>
      </td>
      
      {/* CONNECTED AS column */}
      <td className="py-4 px-6 text-left whitespace-nowrap">
        {isConnected ? (
          <span className="text-sm text-gray-600">
            {connectionInfo?.metadata?.email || connectionInfo?.metadata?.username || 'Connected'}
          </span>
        ) : (
          hasAuth ? (
            <Link 
              href={`/api/auth/${providerData.id}/connect`}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Connect
            </Link>
          ) : (
            <Link 
              href={`/waitlist/${providerData.id}`}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Connect
            </Link>
          )
        )}
      </td>
      
      {/* SETTINGS column */}
      <td className="py-4 px-6 text-right whitespace-nowrap">
        <ProviderSettingsModal
          providerData={providerData}
          isConnected={isConnected}
          connectionInfo={connectionInfo}
        />
      </td>
    </tr>
  );
}

export function IntegrationsContent({ providers, connectedProviderIds, connectionsMap }: IntegrationsContentProps) {
  return (
    <>
      {/* Add MCP button */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            + Add MCP
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-full">
                TOOL
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                STATUS
              </th>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map(providerData => {
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
    </>
  );
}
