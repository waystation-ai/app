import { notFound } from 'next/navigation';
import { registry } from '@/marketplace';
import Image from 'next/image';
import { storeConnectionString } from '@/app/actions';

interface PageProps {
  params: Promise<{
    provider: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { provider } = await params;
  const config = registry.getProvider(provider);

  if (!config) {
    notFound();
  }

  const { id, name } = config;
  const storeConnectionStringWithProvider = storeConnectionString.bind(null, id, `${name} Connection`);

  return (
    <div className="flex flex-col  mt-4 sm:mt-20 justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <Image
            src={`/images/tools/${config.id}.svg`}
            alt={config.name}
            width={64}
            height={64}
            className="object-contain"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Connect to {config.name}
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={storeConnectionStringWithProvider}>
          <div>
            <label htmlFor="connection-string" className="sr-only">Connection String</label>
            <input
              id="connection-string"
              name="connectionString"
              type="text"
              required
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your connection string"
            />
          </div>
          <div>
            <button
              type="submit"
              className="connect-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 flex-grow text-center bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
