import { NextResponse } from 'next/server';
import { ListToolsResult } from '@modelcontextprotocol/sdk/types.js';
import { registry } from '../core/registry';
import { zodToJsonSchema } from 'zod-to-json-schema';

import '@/app/tools/main';

export async function GET() {
  const tools = [];
  
  for (const tool of registry.getAllTools()) {
    const schema = zodToJsonSchema(tool.parameters);
    const schemaObj = schema as Record<string, unknown>;
    
    // Ensure we have a valid properties object that satisfies { [x: string]: unknown }
    const properties = schemaObj.properties as Record<string, unknown> || {};
    
    tools.push({
      name: tool.id,
      description: tool.description || tool.summary,
      inputSchema: {
        type: "object" as const,
        properties,
        ...(Array.isArray(schemaObj.required) && {
          required: schemaObj.required as string[]
        })
      }
    });
  }

  const result: ListToolsResult = { tools };
  return NextResponse.json(result);
}
