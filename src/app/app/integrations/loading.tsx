import { Skeleton } from '@/components/ui/skeleton';
import { IntegrationsLayout } from '@/components/app/integrations/IntegrationsLayout';

export default function IntegrationsLoading() {
  return (
    <IntegrationsLayout currentTab="none">
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
            {Array.from({ length: 12 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                {/* TOOL column */}
                <td className="py-4 px-6 w-full">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-6 w-6 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </td>
                
                {/* STATUS column */}
                <td className="py-4 px-6 text-left whitespace-nowrap">
                  <Skeleton className="h-6 w-16" />
                </td>
                
                {/* SETTINGS column */}
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <Skeleton className="h-6 w-6 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </IntegrationsLayout>
  );
}