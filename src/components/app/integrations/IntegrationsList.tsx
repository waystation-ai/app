import Link from 'next/link';
import { ProviderIcon } from '@/components/app/ProviderIcon';
import { ProviderSettingsModal } from '@/components/app/ProviderSettingsModal';
import { ProviderWithConnectionStatus } from '@/app/app/integrations/utils';

interface IntegrationsListProps {
  providers: ProviderWithConnectionStatus[];
}

function ProviderRow({ provider }: {
  provider: ProviderWithConnectionStatus;
}) {
  const hasAuth = provider.providerType !== 'base';
  
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      {/* TOOL column */}
      <td className="py-4 px-6 w-full">
        <div className="flex items-center space-x-3">
          <ProviderIcon provider={provider.id} width={24} height={24} />
          <span className="font-medium text-gray-900">{provider.name}</span>
        </div>
      </td>
      
      {/* CONNECTED AS column */}
      <td className="py-4 px-6 text-left whitespace-nowrap">
        {provider.isConnected ? (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-green-700 bg-green-50 border border-green-200">
            {provider.connectionInfo?.metadata?.email || provider.connectionInfo?.metadata?.username || 'Connected'}
          </span>
        ) : (
          hasAuth ? (
            <Link 
              href={`/api/auth/${provider.id}/connect`}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Connect
            </Link>
          ) : (
            <Link 
              href={`/waitlist/${provider.id}`}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Connect
            </Link>
          )
        )}
      </td>
      
      {/* SETTINGS column */}
      <td className="py-4 px-6 text-right whitespace-nowrap">
        <ProviderSettingsModal provider={provider}/>
      </td>
    </tr>
  );
}

export function IntegrationsList({ providers }: IntegrationsListProps) {
  return (
    <>
      {/* Add MCP button 
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            + Add MCP
          </button>
        </div>
      </div>
      */}

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-full">
                APPLICATION
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                STATUS
              </th>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map(provider => (
              <ProviderRow
                key={provider.id}
                provider={provider}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
