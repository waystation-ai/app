'use client';

import Link from 'next/link';
import { Settings, CheckCircle } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProviderIcon } from '@/components/app/ProviderIcon';
import { ProviderWithConnectionStatus } from '@/app/app/integrations/utils';

interface ProviderSettingsModalProps {
  provider: ProviderWithConnectionStatus;
}

export function ProviderSettingsModal({ provider }: ProviderSettingsModalProps) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ProviderIcon provider={provider.id} width={32} height={32} />
              <DialogTitle className="text-xl">{provider.name}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Provider Description */}
          <div>
            <p className="text-gray-700 mb-3">{provider.description}</p>
            {provider.bullets && provider.bullets.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">With this tool you can ask WayStation to:</h4>
                <ul className="space-y-1">
                  {provider.bullets.map((bullet: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tools Section - Only for connected providers */}
          {provider.isConnected && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Available Actions</h4>
              {provider.tools.length > 0 ? (
                <div className="space-y-2">
                  {provider.tools.map((tool) => (
                    <div key={tool.id} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{tool.id}</span>
                        {tool.description && (
                          <p className="text-gray-500 mt-1">{tool.summary}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No tools available</p>
              )}
            </div>
          )}

          {/* Connection Status and Actions */}
          <div className="border-t pt-4">
            {provider.isConnected ? (
              <div className="space-y-3">
                <Link
                  href={`/api/connections/${provider.id}/disconnect`}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Disconnect
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  To use this tool you must connect and permission your {provider.name} account.
                </p>
                {provider.providerType !== 'base' ? (
                  <Link
                    href={`/api/auth/${provider.id}/connect`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Connect
                  </Link>
                ) : (
                  <Link
                    href={`/waitlist/${provider.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Connect
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
