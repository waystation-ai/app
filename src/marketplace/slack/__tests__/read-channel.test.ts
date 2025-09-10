import { readSlackChannel } from '../read-channel';
import { ToolContext } from '../../core/types';
import * as utils from '../utils';

// Mock the utils module
const mockFindSlackChannel = jest.spyOn(utils, 'findSlackChannel');
const mockQuerySlackApi = jest.spyOn(utils, 'querySlackApi');

describe('readSlackChannel', () => {
  let mockContext: ToolContext;

  beforeEach(() => {
    mockContext = {
      getAccessToken: jest.fn().mockResolvedValue('mock-token'),
      getConnectionString: jest.fn().mockResolvedValue('mock-connection-string'),
    } as ToolContext;
    
    jest.clearAllMocks();
  });

  describe('channel not found scenarios', () => {
    test('should propagate channel not found error from findSlackChannel', async () => {
      const expectedError = new Error('Channel #nonexistent not found. Use the listSlackChannels tool to see available channels.');
      mockFindSlackChannel.mockRejectedValue(expectedError);

      await expect(
        readSlackChannel.handler({
          context: mockContext,
          params: { channel: '#nonexistent' }
        })
      ).rejects.toThrow('Channel #nonexistent not found. Use the listSlackChannels tool to see available channels.');

      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, '#nonexistent');
    });

    test('should propagate channel not found error for channel name without #', async () => {
      const expectedError = new Error('Channel nonexistent not found. Use the listSlackChannels tool to see available channels.');
      mockFindSlackChannel.mockRejectedValue(expectedError);

      await expect(
        readSlackChannel.handler({
          context: mockContext,
          params: { channel: 'nonexistent' }
        })
      ).rejects.toThrow('Channel nonexistent not found. Use the listSlackChannels tool to see available channels.');

      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, 'nonexistent');
    });

    test('should propagate channel not found error for channel ID', async () => {
      const expectedError = new Error('Channel C9999999999 not found. Use the listSlackChannels tool to see available channels.');
      mockFindSlackChannel.mockRejectedValue(expectedError);

      await expect(
        readSlackChannel.handler({
          context: mockContext,
          params: { channel: 'C9999999999' }
        })
      ).rejects.toThrow('Channel C9999999999 not found. Use the listSlackChannels tool to see available channels.');

      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, 'C9999999999');
    });
  });

  describe('successful channel reading', () => {
    const mockChannel = { id: 'C1234567890', name: 'general' };
    const mockMessages = [
      {
        ts: '1234567890.123',
        text: 'Hello world',
        user: 'U1234567890'
      }
    ];
    const mockUsers = [
      {
        id: 'U1234567890',
        name: 'testuser',
        real_name: 'Test User',
        profile: { display_name: 'Test User' }
      }
    ];

    beforeEach(() => {
      mockFindSlackChannel.mockResolvedValue(mockChannel);
    });

    test('should successfully read channel messages', async () => {
      mockQuerySlackApi
        .mockResolvedValueOnce({ messages: mockMessages }) // conversations.history
        .mockResolvedValueOnce({ members: mockUsers }); // users.list

      const result = await readSlackChannel.handler({
        context: mockContext,
        params: { channel: 'general', limit: 10 }
      });

      expect(result.channel_id).toBe('C1234567890');
      expect(result.channel_name).toBe('general');
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].text).toBe('Hello world');
      expect(result.messages[0].user_name).toBe('Test User');
      
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, 'general');
      expect(mockQuerySlackApi).toHaveBeenCalledWith(
        mockContext,
        expect.stringContaining('conversations.history?channel=C1234567890&limit=10')
      );
    });

    test('should handle channels with special characters in names', async () => {
      const specialChannel = { id: 'C3456789012', name: 'ungodly-bugs' };
      mockFindSlackChannel.mockResolvedValue(specialChannel);
      mockQuerySlackApi
        .mockResolvedValueOnce({ messages: mockMessages })
        .mockResolvedValueOnce({ members: mockUsers });

      const result = await readSlackChannel.handler({
        context: mockContext,
        params: { channel: '#ungodly-bugs' }
      });

      expect(result.channel_id).toBe('C3456789012');
      expect(result.channel_name).toBe('ungodly-bugs');
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, '#ungodly-bugs');
    });
  });

  describe('error handling', () => {
    test('should handle API errors during message fetching', async () => {
      const mockChannel = { id: 'C1234567890', name: 'general' };
      mockFindSlackChannel.mockResolvedValue(mockChannel);
      mockQuerySlackApi.mockRejectedValue(new Error('Slack API error: rate_limited'));

      await expect(
        readSlackChannel.handler({
          context: mockContext,
          params: { channel: 'general' }
        })
      ).rejects.toThrow('Slack API error: rate_limited');
    });

    test('should handle generic errors', async () => {
      const mockChannel = { id: 'C1234567890', name: 'general' };
      mockFindSlackChannel.mockResolvedValue(mockChannel);
      mockQuerySlackApi.mockRejectedValue({ error: 'unknown_error' });

      await expect(
        readSlackChannel.handler({
          context: mockContext,
          params: { channel: 'general' }
        })
      ).rejects.toThrow('Failed to read Slack channel: {"error":"unknown_error"}');
    });
  });
});