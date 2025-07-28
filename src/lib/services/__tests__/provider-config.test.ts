import { getProviderConfig } from '../provider-config';
import { registry } from '@/marketplace';

// Mock the registry
jest.mock('@/marketplace', () => ({
  registry: {
    getProvider: jest.fn()
  }
}));

const mockRegistry = registry as jest.Mocked<typeof registry>;

describe('Provider Config Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProviderConfig', () => {
    test('should return provider config for existing provider', () => {
      const mockProvider = {
        id: 'slack',
        name: 'Slack', 
        description: 'Slack integration',
        tools: [{
          id: 'post-message',
          summary: 'Post message',
          method: 'POST' as const,
          path: '/post-message',
          responses: {},
          handler: jest.fn()
        }]
      };

      mockRegistry.getProvider.mockReturnValue(mockProvider);

      const result = getProviderConfig('slack');
      expect(result).toBe(mockProvider);
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('slack');
    });

    test('should throw error for non-existing provider', () => {
      mockRegistry.getProvider.mockReturnValue(undefined);

      expect(() => getProviderConfig('asana-official')).toThrow('Unknown provider: asana-official');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('asana-official');
    });

    test('should throw error for removed provider that was deleted', () => {
      mockRegistry.getProvider.mockReturnValue(undefined);

      expect(() => getProviderConfig('asana-official')).toThrow('Unknown provider: asana-official');
      expect(mockRegistry.getProvider).toHaveBeenCalledWith('asana-official');
    });

    test('should preserve original behavior for existing callers', () => {
      // This test ensures we didn't break existing functionality
      const mockProvider = {
        id: 'linear',
        name: 'Linear',
        description: 'Linear integration',
        serverUrl: 'https://linear.waystation.ai'
      };

      mockRegistry.getProvider.mockReturnValue(mockProvider);

      const result = getProviderConfig('linear');
      expect(result).toBe(mockProvider);
      expect(result.id).toBe('linear');
      expect(result.name).toBe('Linear');
    });
  });

  describe('404 handling scenarios', () => {
    test('should handle the asana-official removal case', () => {
      // This specifically tests the case mentioned in the issue
      mockRegistry.getProvider.mockReturnValue(undefined);

      expect(() => getProviderConfig('asana-official')).toThrow('Unknown provider: asana-official');
    });

    test('should handle various non-existent provider names', () => {
      const nonExistentProviders = [
        'asana-official',
        'deleted-provider', 
        'non-existent',
        'invalid-provider',
        'removed-integration'
      ];

      nonExistentProviders.forEach(providerId => {
        mockRegistry.getProvider.mockReturnValue(undefined);
        
        expect(() => getProviderConfig(providerId)).toThrow(`Unknown provider: ${providerId}`);
      });
    });
  });
});