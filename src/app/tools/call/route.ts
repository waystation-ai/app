import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '../shared/utils';
import { registry } from '../core/registry';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import '@/app/tools/main';
import { oauthService } from '@/lib/services/oauth-service';

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const userId = await authenticateRequest(request);
    if (!userId) {
      const result: CallToolResult = {error: true, content: [{type: "text", text: 'Unauthorized' }]};
      return NextResponse.json(result, { status: 401 });
    }

    // Parse and validate request
    const { params } = await request.json();
    console.log(params);
    if (!params.name || !params.arguments) {
      return new NextResponse('Invalid request format', { status: 400 });
    }

    // Find the tool
    const tool = registry.getTool(params.name);
    if (!tool) {
      const result: CallToolResult = {
        error: true, 
        content: [{type: "text", text: `Tool '${params.name}' not found`}]
      };
      return NextResponse.json(result, { status: 404 });
    }

    // Execute the tool
    try {
      const result = await tool.tool.handler({
        context: { 
          userId,  
          getAccessToken: () => { 
            return oauthService.getValidAccessToken(tool.provider.id, userId);
          }
        },
        params: params.arguments
      });
      
      return NextResponse.json({
        content: [{type: "text", text: JSON.stringify(result)}]
      });
    } catch (error) {
      console.error(`Error executing tool ${params.name}:`, error);
      const result: CallToolResult = {
        error: true,
        content: [{type: "text", text: error instanceof Error ? error.message : 'Unknown error occurred'}]
      };
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error in tool call:', error);
    const result: CallToolResult = {
      error: true, 
      content: [{type: "text", text: error instanceof Error ? error.message : 'Internal server error'}]
    };
    return NextResponse.json(result, { status: 500 });
  }
}
