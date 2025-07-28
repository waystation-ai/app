/**
 * @jest-environment jsdom
 */
import { notFound } from 'next/navigation';
import { registry } from '@/marketplace';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}));

// Mock the registry
jest.mock('@/marketplace', () => ({
  registry: {
    getProvider: jest.fn()
  }
}));

// Mock the server action
jest.mock('@/app/actions', () => ({
  storeConnectionString: jest.fn()
}));

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height }: { src: string; alt: string; width?: number; height?: number }) {
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;
const mockRegistry = registry as jest.Mocked<typeof registry>;

describe('Setup Page 404 Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call notFound() for non-existent provider', async () => {
    mockRegistry.getProvider.mockReturnValue(undefined);
    mockNotFound.mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND');
    });

    const Page = (await import('@/app/(frontend)/connect/[provider]/setup/page')).default;

    const params = Promise.resolve({ provider: 'asana-official' });

    await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockRegistry.getProvider).toHaveBeenCalledWith('asana-official');
    expect(mockNotFound).toHaveBeenCalled();
  });

  test('should render setup form for existing provider', async () => {
    const mockProvider = {
      id: 'postgres',
      name: 'PostgreSQL',
      description: 'PostgreSQL database connection'
    };

    mockRegistry.getProvider.mockReturnValue(mockProvider);

    const Page = (await import('@/app/(frontend)/connect/[provider]/setup/page')).default;

    const params = Promise.resolve({ provider: 'postgres' });

    const result = await Page({ params });
    
    expect(result).toBeDefined();
    expect(mockRegistry.getProvider).toHaveBeenCalledWith('postgres');
    expect(mockNotFound).not.toHaveBeenCalled();
  });

  test('should handle the asana-official removal case in setup page', async () => {
    mockRegistry.getProvider.mockReturnValue(undefined);
    mockNotFound.mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND');
    });

    const Page = (await import('@/app/(frontend)/connect/[provider]/setup/page')).default;

    const params = Promise.resolve({ provider: 'asana-official' });

    await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockRegistry.getProvider).toHaveBeenCalledWith('asana-official');
    expect(mockNotFound).toHaveBeenCalled();
  });

  test('should handle various removed providers', async () => {
    const removedProviders = ['asana-official', 'deleted-integration', 'removed-provider'];

    for (const providerId of removedProviders) {
      mockRegistry.getProvider.mockReturnValue(undefined);
      mockNotFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND');
      });

      const Page = (await import('@/app/(frontend)/connect/[provider]/setup/page')).default;

      const params = Promise.resolve({ provider: providerId });

      await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith(providerId);
      expect(mockNotFound).toHaveBeenCalled();

      // Clear mocks for next iteration
      jest.clearAllMocks();
    }
  });

  test('should handle edge cases in setup page', async () => {
    const edgeCases = ['', 'invalid!@#', 'very-long-provider-name-that-does-not-exist'];

    for (const providerId of edgeCases) {
      mockRegistry.getProvider.mockReturnValue(undefined);
      mockNotFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND');
      });

      const Page = (await import('@/app/(frontend)/connect/[provider]/setup/page')).default;

      const params = Promise.resolve({ provider: providerId });

      await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith(providerId);
      expect(mockNotFound).toHaveBeenCalled();

      // Clear mocks for next iteration
      jest.clearAllMocks();
    }
  });
});