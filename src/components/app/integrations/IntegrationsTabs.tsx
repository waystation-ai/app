import clsx from 'clsx';
import Link from 'next/link';

interface IntegrationsTabsProps {
  currentTab: 'all' | 'official' | 'native' | 'none';
}

export function IntegrationsTabs({ currentTab }: IntegrationsTabsProps) {
  function tabStyle(tabName: string) {
    return clsx("border-b-2 py-2 px-1 text-sm font-medium", {
                  "border-blue-500 text-blue-600": currentTab === tabName,
                  "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300": currentTab !== tabName,
                })
  }

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <Link href="/app/integrations" className={tabStyle('all')}>All</Link>
        <Link href="/app/integrations/official" className={tabStyle('official')}>Official</Link>
        <Link href="/app/integrations/native" className={tabStyle('native')}>Native</Link>
      </nav>
    </div>
  );
}
