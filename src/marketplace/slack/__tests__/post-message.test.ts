import { postSlackMessage } from '../post-message';
import { ToolContext } from '../../core/types';
import * as utils from '../utils';

// Mock the utils module
const mockFindSlackChannel = jest.spyOn(utils, 'findSlackChannel');
const mockQuerySlackApi = jest.spyOn(utils, 'querySlackApi');

describe('postSlackMessage', () => {
  let mockContext: ToolContext;

  beforeEach(() => {
    mockContext = {
      getAccessToken: jest.fn().mockResolvedValue('mock-token'),
    } as ToolContext;
    
    jest.clearAllMocks();
  });

  describe('channel not found scenarios', () => {
    test('should propagate channel not found error from findSlackChannel', async () => {
      const expectedError = new Error('Channel #nonexistent not found. Use the listSlackChannels tool to see available channels.');
      mockFindSlackChannel.mockRejectedValue(expectedError);

      await expect(
        postSlackMessage.handler({
          context: mockContext,
          params: { 
            channel: '#nonexistent',
            message: 'Test message'
          }
        })
      ).rejects.toThrow('Channel #nonexistent not found. Use the listSlackChannels tool to see available channels.');

      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, '#nonexistent');
    });

    test('should propagate channel not found error for channel name without #', async () => {
      const expectedError = new Error('Channel nonexistent not found. Use the listSlackChannels tool to see available channels.');
      mockFindSlackChannel.mockRejectedValue(expectedError);

      await expect(
        postSlackMessage.handler({
          context: mockContext,
          params: { 
            channel: 'nonexistent',
            message: 'Test message'
          }
        })
      ).rejects.toThrow('Channel nonexistent not found. Use the listSlackChannels tool to see available channels.');

      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, 'nonexistent');
    });

    test('should propagate channel not found error for channel ID', async () => {
      const expectedError = new Error('Channel C9999999999 not found. Use the listSlackChannels tool to see available channels.');
      mockFindSlackChannel.mockRejectedValue(expectedError);

      await expect(
        postSlackMessage.handler({
          context: mockContext,
          params: { 
            channel: 'C9999999999',
            message: 'Test message'
          }
        })
      ).rejects.toThrow('Channel C9999999999 not found. Use the listSlackChannels tool to see available channels.');

      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, 'C9999999999');
    });

    test('should handle special characters in channel names', async () => {
      const expectedError = new Error('Channel #ungodly-bugs not found. Use the listSlackChannels tool to see available channels.');
      mockFindSlackChannel.mockRejectedValue(expectedError);

      await expect(
        postSlackMessage.handler({
          context: mockContext,
          params: { 
            channel: '#ungodly-bugs',
            message: 'Bug report message'
          }
        })
      ).rejects.toThrow('Channel #ungodly-bugs not found. Use the listSlackChannels tool to see available channels.');

      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, '#ungodly-bugs');
    });
  });

  describe('successful message posting', () => {
    const mockChannel = { id: 'C1234567890', name: 'general' };
    const mockPostResult = {
      channel: 'C1234567890',
      ts: '1234567890.123'
    };

    beforeEach(() => {
      mockFindSlackChannel.mockResolvedValue(mockChannel);
    });

    test('should successfully post message to channel', async () => {
      mockQuerySlackApi.mockResolvedValue(mockPostResult);

      const result = await postSlackMessage.handler({
        context: mockContext,
        params: { 
          channel: 'general',
          message: 'Hello world!'
        }
      });

      expect(result.channel).toBe('C1234567890');
      expect(result.ts).toBe('1234567890.123');
      expect(result.message_id).toBe('1234567890.123');
      
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, 'general');
      expect(mockQuerySlackApi).toHaveBeenCalledWith(
        mockContext,
        'chat.postMessage',
        'POST',
        {
          channel: 'C1234567890',
          text: 'Hello world!'
        }
      );
    });

    test('should handle channel names with # prefix', async () => {
      mockQuerySlackApi.mockResolvedValue(mockPostResult);

      const result = await postSlackMessage.handler({
        context: mockContext,
        params: { 
          channel: '#general',
          message: 'Hello world!'
        }
      });

      expect(result.channel).toBe('C1234567890');
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, '#general');
    });

    test('should handle channel IDs directly', async () => {
      mockQuerySlackApi.mockResolvedValue(mockPostResult);

      const result = await postSlackMessage.handler({
        context: mockContext,
        params: { 
          channel: 'C1234567890',
          message: 'Direct channel ID message'
        }
      });

      expect(result.channel).toBe('C1234567890');
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, 'C1234567890');
    });

    test('should handle special characters in channel names', async () => {
      const specialChannel = { id: 'C3456789012', name: 'ungodly-bugs' };
      mockFindSlackChannel.mockResolvedValue(specialChannel);
      
      const specialResult = {
        channel: 'C3456789012',
        ts: '1234567890.456'
      };
      mockQuerySlackApi.mockResolvedValue(specialResult);

      const result = await postSlackMessage.handler({
        context: mockContext,
        params: { 
          channel: '#ungodly-bugs',
          message: 'Bug found in the ungodly system!'
        }
      });

      expect(result.channel).toBe('C3456789012');
      expect(result.ts).toBe('1234567890.456');
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, '#ungodly-bugs');
      expect(mockQuerySlackApi).toHaveBeenCalledWith(
        mockContext,
        'chat.postMessage',
        'POST',
        {
          channel: 'C3456789012',
          text: 'Bug found in the ungodly system!'
        }
      );
    });
  });

  describe('error handling', () => {
    test('should handle API errors during message posting', async () => {
      const mockChannel = { id: 'C1234567890', name: 'general' };
      mockFindSlackChannel.mockResolvedValue(mockChannel);
      mockQuerySlackApi.mockRejectedValue(new Error('Slack API error: rate_limited'));

      await expect(
        postSlackMessage.handler({
          context: mockContext,
          params: { 
            channel: 'general',
            message: 'Test message'
          }
        })
      ).rejects.toThrow('Slack API error: rate_limited');
    });

    test('should handle generic errors', async () => {
      const mockChannel = { id: 'C1234567890', name: 'general' };
      mockFindSlackChannel.mockResolvedValue(mockChannel);
      mockQuerySlackApi.mockRejectedValue({ error: 'unknown_error' });

      await expect(
        postSlackMessage.handler({
          context: mockContext,
          params: { 
            channel: 'general',
            message: 'Test message'
          }
        })
      ).rejects.toThrow('Failed to post Slack message: {"error":"unknown_error"}');
    });
  });
});