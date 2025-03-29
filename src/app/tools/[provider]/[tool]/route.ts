import { NextRequest, NextResponse } from 'next/server';
import { oauthService } from '@/lib/services/oauth-service';
import { authenticateRequest } from '@/lib/utils/authenticate-request';
import { registry } from '@/marketplace';

type RequestParams = Promise<{ provider: string; tool: string }>;
type HttpMethod = 'GET' | 'POST' | 'PUT';
type QueryParams = Record<string, string>;
type JsonBody = Record<string, unknown>;
type ToolParams = QueryParams | JsonBody;

async function handleToolRequest({ request, params, method, getParams}: {
  request: NextRequest;
  params: RequestParams;
  method: HttpMethod;
  getParams: (request: NextRequest) => Promise<ToolParams>;
}) {
  // Common authentication
  const userId = await authenticateRequest(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { provider, tool } = await params;

  // Common provider lookup
  const providerObj = registry.getProvider(provider);
  if (!providerObj) {
    return NextResponse.json(
      { error: true, content: `Provider '${provider}' not found` },
      { status: 404 }
    );
  }

  // Common tool lookup with method validation
  const toolObj = providerObj.tools.find(t => t.id === tool || t.path.endsWith(`/${provider}/${tool}`));
  if (!toolObj || toolObj.method !== method) {
    return NextResponse.json(
      { error: true, content: `Tool '${tool}' not found or method not allowed` },
      { status: 404 }
    );
  }

  try {
    // Get parameters using provided function
    const params = await getParams(request);
    
    // Execute tool with common error handling
    const result = await toolObj.handler({
      context: { 
        getAccessToken: () => { 
          return oauthService.getValidAccessToken(providerObj.id, userId);
        }
      },
      params
    });
    
    // Handle binary responses (ArrayBuffer)
    if (result instanceof ArrayBuffer) {
      return new Response(result, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="document.pdf"'
        }
      });
    }
    
    // Handle regular JSON responses
    if (typeof result === 'object' && result !== null) {
      return NextResponse.json(result);
    }
    
    // Handle other response types
    return NextResponse.json({ content: result });
  } catch (error) {
    console.error(`Error executing tool ${tool}:`, error);
    return NextResponse.json(
      { error: true, content: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: RequestParams }) {
  return handleToolRequest({
    request,
    params,
    method: 'GET',
    getParams: async (req) => Object.fromEntries(req.nextUrl.searchParams.entries())
  });
}

export async function POST(request: NextRequest, { params }: { params: RequestParams }) {
  return handleToolRequest({
    request,
    params,
    method: 'POST',
    getParams: (req) => req.json()
  });
}

export async function PUT(request: NextRequest, { params }: { params: RequestParams }) {
  return handleToolRequest({
    request,
    params,
    method: 'PUT',
    getParams: (req) => req.json()
  });
}

