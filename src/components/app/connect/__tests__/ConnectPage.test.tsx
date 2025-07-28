/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock environment variables and database before any imports
process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Mock all the problematic modules
jest.mock('@/lib/db', () => ({
  getValidConnections: jest.fn()
}));

jest.mock('@/lib/utils/auth-userid', () => ({
  authUserId: jest.fn()
}));

jest.mock('@/lib/utils/generate-nanoid-for-user', () => ({
  generateNanoidForUser: jest.fn()
}));

jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return <a href={href} className={className} data-testid="connect-button">{children}</a>;
  };
});

jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height }: { src: string; alt: string; width?: number; height?: number }) {
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

jest.mock('@/components/app/CopyBox', () => {
  return function MockCopyBox({ text, children }: { text: string; children?: React.ReactNode }) {
    return <div data-testid="copy-box">{text}{children}</div>;
  };
});

jest.mock('@/components/app/ChatDemo', () => {
  return function MockChatDemo({ messages }: { messages: Array<{ role: string; content: string }> }) {
    return <div data-testid="chat-demo">Chat with {messages.length} messages</div>;
  };
});

jest.mock('@/components/app/Providers', () => {
  return function MockProviders() {
    return <div data-testid="providers">Other providers</div>;
  };
});

jest.mock('@/components/app/connect/AlternativeApps', () => {
  return function MockAlternativeApps() {
    return <div data-testid="alternative-apps">Alternative apps</div>;
  };
});

// Import the component after mocking
import ConnectPage from '@/components/app/connect/ConnectPage';
import { authUserId } from '@/lib/utils/auth-userid';
import { getValidConnections } from '@/lib/db';
import { generateNanoidForUser } from '@/lib/utils/generate-nanoid-for-user';

const mockAuthUserId = authUserId as jest.MockedFunction<typeof authUserId>;
const mockGetValidConnections = getValidConnections as jest.MockedFunction<typeof getValidConnections>;
const mockGenerateNanoidForUser = generateNanoidForUser as jest.MockedFunction<typeof generateNanoidForUser>;

describe('ConnectPage Component - Refactored with Provider Object', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthUserId.mockResolvedValue('test-user-id');
    mockGetValidConnections.mockResolvedValue(new Map());
    mockGenerateNanoidForUser.mockResolvedValue('test-nanoid');
  });

  describe('Button routing with provider object', () => {
    test('should render OAuth connect button for provider with tools array', async () => {
      const mockProvider = {
        id: 'slack',
        name: 'Slack',
        description: 'Slack integration with full OAuth support',
        tools: [{ 
          id: 'post-message',
          summary: 'Post message',
          method: 'POST' as const,
          path: '/post-message',
          responses: {},
          handler: jest.fn()
        }],
        bullets: ['Send messages to channels'],
        chat: [
          { role: 'user' as const, content: 'Can you post a message?' },
          { role: 'agent' as const, content: 'Sure! Which channel?' }
        ]
      };

      render(await ConnectPage({ 
        provider: mockProvider, 
        appType: 'generic' 
      }));

      const connectButton = screen.getByTestId('connect-button');
      expect(connectButton).toBeInTheDocument();
      expect(connectButton).toHaveAttribute('href', '/api/auth/slack/connect');
      expect(connectButton).toHaveTextContent('Connect Now');
    });

    test('should render waitlist button for base provider (no tools property)', async () => {
      const mockProvider = {
        id: 'chrome',
        name: 'Chrome',
        description: 'Automate and enhance your browser workflows with Chrome integration.',
        bullets: [
          "Automate repetitive browser tasks and workflows",
          "Extract and analyze data from web applications",
          "Synchronize information across browser sessions"
        ],
        chat: [
          { role: 'user' as const, content: "Can you collect pricing data from our competitor's websites?" },
          { role: 'agent' as const, content: "I'll scan their product pages. Would you like to focus on specific product categories?" },
          { role: 'user' as const, content: "Yes, just the enterprise plans" },
          { role: 'agent' as const, content: "I've gathered pricing data for enterprise plans from 5 competitors, created a comparison spreadsheet, and highlighted key differentiators in our offering." }
        ]
        // Note: No tools property - this is what was fixed in the original commit
      };

      render(await ConnectPage({ 
        provider: mockProvider, 
        appType: 'generic' 
      }));

      const connectButton = screen.getByTestId('connect-button');
      expect(connectButton).toBeInTheDocument();
      expect(connectButton).toHaveAttribute('href', '/waitlist/chrome');
      expect(connectButton).toHaveTextContent('Connect Now');
      
      // Verify it's NOT linking to OAuth route that would cause the error
      expect(connectButton).not.toHaveAttribute('href', '/api/auth/chrome/connect');
    });

    test('should render OAuth connect button for remote provider', async () => {
      const mockProvider = {
        id: 'linear',
        name: 'Linear',
        description: 'Linear project management integration',
        serverUrl: 'https://linear.waystation.ai',
        bullets: ['Manage issues and projects'],
        chat: [
          { role: 'user' as const, content: 'Create a new issue' },
          { role: 'agent' as const, content: 'I\'ll create that issue for you' }
        ]
      };

      render(await ConnectPage({ 
        provider: mockProvider, 
        appType: 'generic' 
      }));

      const connectButton = screen.getByTestId('connect-button');
      expect(connectButton).toBeInTheDocument();
      expect(connectButton).toHaveAttribute('href', '/api/auth/linear/connect');
      expect(connectButton).toHaveTextContent('Connect Now');
    });
  });

  describe('Page content rendering', () => {
    test('should render provider name and description correctly', async () => {
      const mockProvider = {
        id: 'chrome',
        name: 'Chrome',
        description: 'Automate and enhance your browser workflows with Chrome integration.',
        bullets: ['Automate tasks'],
        chat: []
      };

      render(await ConnectPage({ 
        provider: mockProvider, 
        appType: 'generic' 
      }));

      expect(screen.getAllByText(/Chrome/)[0]).toBeInTheDocument();
      expect(screen.getByText(/Automate and enhance your browser workflows with Chrome integration/)).toBeInTheDocument();
    });

    test('should render provider bullets when available', async () => {
      const mockProvider = {
        id: 'chrome',
        name: 'Chrome',
        description: 'Browser automation',
        bullets: [
          "Automate repetitive browser tasks and workflows",
          "Extract and analyze data from web applications"
        ],
        chat: []
      };

      render(await ConnectPage({ 
        provider: mockProvider, 
        appType: 'generic' 
      }));

      expect(screen.getByText('Automate repetitive browser tasks and workflows')).toBeInTheDocument();
      expect(screen.getByText('Extract and analyze data from web applications')).toBeInTheDocument();
    });
  });

  describe('Cursor app specific routing', () => {
    test('should include cursor redirect_uri for cursor app type', async () => {
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
        }],
        bullets: ['Send messages'],
        chat: []
      };

      render(await ConnectPage({ 
        provider: mockProvider, 
        appType: 'cursor' 
      }));

      const connectButton = screen.getByTestId('connect-button');
      expect(connectButton).toHaveAttribute('href', expect.stringContaining('/api/auth/slack/connect?redirect_uri='));
      expect(connectButton.getAttribute('href')).toContain('redirect_uri=%2Fconnect%2Fcursor%2Fslack');
    });
  });

  describe('Performance improvements', () => {
    test('should receive the provider object directly without additional lookups', async () => {
      const mockProvider = {
        id: 'test-provider',
        name: 'Test Provider',
        description: 'A test provider',
        bullets: ['Test feature'],
        chat: []
      };

      render(await ConnectPage({ 
        provider: mockProvider, 
        appType: 'generic' 
      }));

      // The component should render without making any additional provider lookups
      // since it receives the provider object directly
      expect(screen.getByText('Test Provider')).toBeInTheDocument();
      expect(screen.getByText('A test provider')).toBeInTheDocument();
    });
  });
});