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

// Mock ConnectPage component
jest.mock('@/components/app/connect/ConnectPage', () => {
  return function MockConnectPage() {
    return <div data-testid="connect-page">Connect Page</div>;
  };
});

const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;
const mockRegistry = registry as jest.Mocked<typeof registry>;

describe('Connect Pages 404 Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Generic Connect Page', () => {
    test('should call notFound() for non-existent provider', async () => {
      mockRegistry.getProvider.mockReturnValue(undefined);
      mockNotFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND');
      });

      // Import the page component
      const Page = (await import('@/app/(frontend)/connect/[provider]/page')).default;

      const params = Promise.resolve({ provider: 'asana-official' });

      await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('asana-official');
      expect(mockNotFound).toHaveBeenCalled();
    });

    test('should render ConnectPage for existing provider', async () => {
      mockRegistry.getProvider.mockReturnValue({ id: 'slack', name: 'Slack', description: 'Slack integration' });

      const Page = (await import('@/app/(frontend)/connect/[provider]/page')).default;

      const params = Promise.resolve({ provider: 'slack' });

      // This should not throw
      const result = await Page({ params });
      expect(result).toBeDefined();
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('slack');
      expect(mockNotFound).not.toHaveBeenCalled();
    });
  });

  describe('ChatGPT Connect Page', () => {
    test('should call notFound() for non-existent provider', async () => {
      mockRegistry.getProvider.mockReturnValue(undefined);
      mockNotFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND');
      });

      const Page = (await import('@/app/(frontend)/connect/chatgpt/[provider]/page')).default;

      const params = Promise.resolve({ provider: 'asana-official' });

      await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('asana-official');
      expect(mockNotFound).toHaveBeenCalled();
    });

    test('should render ConnectPage for existing provider', async () => {
      mockRegistry.getProvider.mockReturnValue({ id: 'slack', name: 'Slack', description: 'Slack integration' });

      const Page = (await import('@/app/(frontend)/connect/chatgpt/[provider]/page')).default;

      const params = Promise.resolve({ provider: 'slack' });

      const result = await Page({ params });
      expect(result).toBeDefined();
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('slack');
      expect(mockNotFound).not.toHaveBeenCalled();
    });
  });

  describe('Claude Connect Page', () => {
    test('should call notFound() for non-existent provider', async () => {
      mockRegistry.getProvider.mockReturnValue(undefined);
      mockNotFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND');
      });

      const Page = (await import('@/app/(frontend)/connect/claude/[provider]/page')).default;

      const params = Promise.resolve({ provider: 'asana-official' });
      const searchParams = Promise.resolve({ redirect_uri: undefined });

      await expect(Page({ params, searchParams })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('asana-official');
      expect(mockNotFound).toHaveBeenCalled();
    });

    test('should render ConnectPage for existing provider with redirect URI', async () => {
      mockRegistry.getProvider.mockReturnValue({ id: 'slack', name: 'Slack', description: 'Slack integration' });

      const Page = (await import('@/app/(frontend)/connect/claude/[provider]/page')).default;

      const params = Promise.resolve({ provider: 'slack' });
      const searchParams = Promise.resolve({ redirect_uri: '/callback' });

      const result = await Page({ params, searchParams });
      expect(result).toBeDefined();
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('slack');
      expect(mockNotFound).not.toHaveBeenCalled();
    });
  });

  describe('Cursor Connect Page', () => {
    test('should call notFound() for non-existent provider', async () => {
      mockRegistry.getProvider.mockReturnValue(undefined);
      mockNotFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND');
      });

      const Page = (await import('@/app/(frontend)/connect/cursor/[provider]/page')).default;

      const params = Promise.resolve({ provider: 'asana-official' });

      await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('asana-official');
      expect(mockNotFound).toHaveBeenCalled();
    });
  });

  describe('MCP Server Connect Page', () => {
    test('should call notFound() for non-existent provider', async () => {
      mockRegistry.getProvider.mockReturnValue(undefined);
      mockNotFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND');
      });

      const Page = (await import('@/app/(frontend)/connect/mcp-server/[provider]/page')).default;

      const params = Promise.resolve({ provider: 'asana-official' });

      await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('asana-official');
      expect(mockNotFound).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    test('should handle empty provider name', async () => {
      mockRegistry.getProvider.mockReturnValue(undefined);
      mockNotFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND');
      });

      const Page = (await import('@/app/(frontend)/connect/[provider]/page')).default;

      const params = Promise.resolve({ provider: '' });

      await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('');
      expect(mockNotFound).toHaveBeenCalled();
    });

    test('should handle special characters in provider name', async () => {
      mockRegistry.getProvider.mockReturnValue(undefined);
      mockNotFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND');
      });

      const Page = (await import('@/app/(frontend)/connect/[provider]/page')).default;

      const params = Promise.resolve({ provider: 'provider-with-special-chars!' });

      await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('provider-with-special-chars!');
      expect(mockNotFound).toHaveBeenCalled();
    });

    test('should handle the specific asana-official case that was reported', async () => {
      mockRegistry.getProvider.mockReturnValue(undefined);
      mockNotFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND');
      });

      // Test all app types with asana-official
      const appTypes = [
        { page: '@/app/(frontend)/connect/[provider]/page', params: { provider: 'asana-official' } },
        { page: '@/app/(frontend)/connect/chatgpt/[provider]/page', params: { provider: 'asana-official' } },
        { page: '@/app/(frontend)/connect/cursor/[provider]/page', params: { provider: 'asana-official' } },
        { page: '@/app/(frontend)/connect/mcp-server/[provider]/page', params: { provider: 'asana-official' } }
      ];

      for (const { page, params } of appTypes) {
        const Page = (await import(page)).default;
        const paramsPromise = Promise.resolve(params);

        await expect(Page({ params: paramsPromise })).rejects.toThrow('NEXT_NOT_FOUND');
        expect(mockRegistry.getProvider).toHaveBeenCalledWith('asana-official');
        expect(mockNotFound).toHaveBeenCalled();

        // Reset mocks for next iteration
        jest.clearAllMocks();
        mockRegistry.getProvider.mockReturnValue(undefined);
        mockNotFound.mockImplementation(() => {
          throw new Error('NEXT_NOT_FOUND');
        });
      }
    });
  });
});