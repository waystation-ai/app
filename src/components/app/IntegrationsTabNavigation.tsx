import Link from 'next/link';

interface IntegrationsTabNavigationProps {
  currentTab: 'all' | 'official' | 'native';
}

export function IntegrationsTabNavigation({ currentTab }: IntegrationsTabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <Link
          href="/app/integrations"
          className={`border-b-2 py-2 px-1 text-sm font-medium ${
            currentTab === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          All
        </Link>
        <Link
          href="/app/integrations/official"
          className={`border-b-2 py-2 px-1 text-sm font-medium ${
            currentTab === 'official'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Official
        </Link>
        <Link
          href="/app/integrations/native"
          className={`border-b-2 py-2 px-1 text-sm font-medium ${
            currentTab === 'native'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Native
        </Link>
      </nav>
    </div>
  );
}
