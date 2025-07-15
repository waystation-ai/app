import { ToolContext } from '../../core/types';

jest.mock('../utils', () => ({
  querySlackApi: jest.fn(),
  findSlackChannel: jest.fn(),
}));

// Import after mocking
import * as utils from '../utils';

const mockFindSlackChannel = utils.findSlackChannel as jest.MockedFunction<typeof utils.findSlackChannel>;

describe('Slack Utils', () => {
  let mockContext: ToolContext;

  beforeEach(() => {
    mockContext = {
      getAccessToken: jest.fn().mockResolvedValue('mock-token'),
    } as ToolContext;
    
    jest.clearAllMocks();
  });

  describe('findSlackChannel', () => {

    test('should find channel by name', async () => {
      mockFindSlackChannel.mockResolvedValue({ id: 'C1234567890', name: 'general' });
      
      const result = await utils.findSlackChannel(mockContext, 'general');
      
      expect(result).toEqual({ id: 'C1234567890', name: 'general' });
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, 'general');
    });

    test('should find channel by name with # prefix', async () => {
      mockFindSlackChannel.mockResolvedValue({ id: 'C1234567890', name: 'general' });
      
      const result = await utils.findSlackChannel(mockContext, '#general');
      
      expect(result).toEqual({ id: 'C1234567890', name: 'general' });
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, '#general');
    });

    test('should find channel by ID', async () => {
      mockFindSlackChannel.mockResolvedValue({ id: 'C1234567890', name: 'general' });
      
      const result = await utils.findSlackChannel(mockContext, 'C1234567890');
      
      expect(result).toEqual({ id: 'C1234567890', name: 'general' });
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, 'C1234567890');
    });

    test('should throw error when channel not found by name', async () => {
      mockFindSlackChannel.mockRejectedValue(
        new Error('Channel nonexistent not found. Use the listSlackChannels tool to see available channels.')
      );
      
      await expect(utils.findSlackChannel(mockContext, 'nonexistent')).rejects.toThrow(
        'Channel nonexistent not found. Use the listSlackChannels tool to see available channels.'
      );
    });

    test('should throw error when channel not found by name with # prefix', async () => {
      mockFindSlackChannel.mockRejectedValue(
        new Error('Channel #nonexistent not found. Use the listSlackChannels tool to see available channels.')
      );
      
      await expect(utils.findSlackChannel(mockContext, '#nonexistent')).rejects.toThrow(
        'Channel #nonexistent not found. Use the listSlackChannels tool to see available channels.'
      );
    });

    test('should throw error when channel not found by ID', async () => {
      mockFindSlackChannel.mockRejectedValue(
        new Error('Channel C9999999999 not found. Use the listSlackChannels tool to see available channels.')
      );
      
      await expect(utils.findSlackChannel(mockContext, 'C9999999999')).rejects.toThrow(
        'Channel C9999999999 not found. Use the listSlackChannels tool to see available channels.'
      );
    });

    test('should handle special characters in channel names', async () => {
      mockFindSlackChannel.mockResolvedValue({ id: 'C3456789012', name: 'ungodly-bugs' });
      
      const result = await utils.findSlackChannel(mockContext, 'ungodly-bugs');
      
      expect(result).toEqual({ id: 'C3456789012', name: 'ungodly-bugs' });
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, 'ungodly-bugs');
    });

    test('should handle special characters in channel names with # prefix', async () => {
      mockFindSlackChannel.mockResolvedValue({ id: 'C3456789012', name: 'ungodly-bugs' });
      
      const result = await utils.findSlackChannel(mockContext, '#ungodly-bugs');
      
      expect(result).toEqual({ id: 'C3456789012', name: 'ungodly-bugs' });
      expect(mockFindSlackChannel).toHaveBeenCalledWith(mockContext, '#ungodly-bugs');
    });

    test('should handle API errors', async () => {
      mockFindSlackChannel.mockRejectedValue(new Error('Slack API error: invalid_auth'));
      
      await expect(utils.findSlackChannel(mockContext, 'general')).rejects.toThrow(
        'Slack API error: invalid_auth'
      );
    });

    test('should handle empty channels list', async () => {
      mockFindSlackChannel.mockRejectedValue(
        new Error('Channel general not found. Use the listSlackChannels tool to see available channels.')
      );
      
      await expect(utils.findSlackChannel(mockContext, 'general')).rejects.toThrow(
        'Channel general not found. Use the listSlackChannels tool to see available channels.'
      );
    });
  });
});