import { isFullProvider, isNativeProvider, isRemoteProvider } from '../types';
import type { BaseProvider, NativeProvider, RemoteProvider } from '../types';

describe('Provider Type Checks', () => {
  describe('isNativeProvider', () => {
    test('should return true for provider with tools array', () => {
      const provider: NativeProvider = {
        id: 'test',
        name: 'Test Provider',
        description: 'Test description',
        tools: []
      };

      expect(isNativeProvider(provider)).toBe(true);
    });

    test('should return true for provider with populated tools array', () => {
      const provider: NativeProvider = {
        id: 'test',
        name: 'Test Provider', 
        description: 'Test description',
        tools: [{
          id: 'test-tool',
          summary: 'Test tool',
          method: 'GET',
          path: '/test',
          responses: {},
          handler: jest.fn()
        }]
      };

      expect(isNativeProvider(provider)).toBe(true);
    });

    test('should return false for provider without tools property', () => {
      const provider: BaseProvider = {
        id: 'test',
        name: 'Test Provider',
        description: 'Test description'
      };

      expect(isNativeProvider(provider)).toBe(false);
    });

    test('should return false for remote provider', () => {
      const provider: RemoteProvider = {
        id: 'test',
        name: 'Test Provider',
        description: 'Test description',
        serverUrl: 'https://example.com'
      };

      expect(isNativeProvider(provider)).toBe(false);
    });
  });

  describe('isRemoteProvider', () => {
    test('should return true for provider with serverUrl', () => {
      const provider: RemoteProvider = {
        id: 'test',
        name: 'Test Provider',
        description: 'Test description',
        serverUrl: 'https://example.com'
      };

      expect(isRemoteProvider(provider)).toBe(true);
    });

    test('should return false for provider without serverUrl', () => {
      const provider: BaseProvider = {
        id: 'test',
        name: 'Test Provider',
        description: 'Test description'
      };

      expect(isRemoteProvider(provider)).toBe(false);
    });

    test('should return false for native provider', () => {
      const provider: NativeProvider = {
        id: 'test',
        name: 'Test Provider',
        description: 'Test description',
        tools: []
      };

      expect(isRemoteProvider(provider)).toBe(false);
    });
  });

  describe('isFullProvider', () => {
    test('should return true for native provider with empty tools array', () => {
      const provider: NativeProvider = {
        id: 'chrome',
        name: 'Chrome',
        description: 'Chrome integration',
        tools: []
      };

      expect(isFullProvider(provider)).toBe(true);
    });

    test('should return true for native provider with populated tools array', () => {
      const provider: NativeProvider = {
        id: 'slack',
        name: 'Slack',
        description: 'Slack integration',
        tools: [{
          id: 'post-message',
          summary: 'Post message',
          method: 'POST',
          path: '/post-message',
          responses: {},
          handler: jest.fn()
        }]
      };

      expect(isFullProvider(provider)).toBe(true);
    });

    test('should return true for remote provider', () => {
      const provider: RemoteProvider = {
        id: 'linear',
        name: 'Linear',
        description: 'Linear integration',
        serverUrl: 'https://linear.waystation.ai'
      };

      expect(isFullProvider(provider)).toBe(true);
    });

    test('should return false for base provider without tools or serverUrl', () => {
      const provider: BaseProvider = {
        id: 'incomplete',
        name: 'Incomplete Provider',
        description: 'Provider without implementation'
      };

      expect(isFullProvider(provider)).toBe(false);
    });

    test('should handle providers after tools array removal (the bug fix)', () => {
      // This simulates the state after the commit that removed empty tools arrays
      const chromeProvider: BaseProvider = {
        id: 'chrome',
        name: 'Chrome',
        description: 'Automate and enhance your browser workflows with Chrome integration.',
        bullets: [
          "Automate repetitive browser tasks and workflows",
          "Extract and analyze data from web applications", 
          "Synchronize information across browser sessions"
        ],
        chat: [
          { role: 'user', content: "Can you collect pricing data from our competitor's websites?" },
          { role: 'agent', content: "I'll scan their product pages. Would you like to focus on specific product categories?" },
          { role: 'user', content: "Yes, just the enterprise plans" },
          { role: 'agent', content: "I've gathered pricing data for enterprise plans from 5 competitors, created a comparison spreadsheet, and highlighted key differentiators in our offering." }
        ]
      };

      // Before the fix, this would incorrectly return true because 
      // isNativeProvider would check for existence of tools property
      // After the fix, this correctly returns false
      expect(isFullProvider(chromeProvider)).toBe(false);
      expect(isNativeProvider(chromeProvider)).toBe(false);
      expect(isRemoteProvider(chromeProvider)).toBe(false);
    });
  });
});