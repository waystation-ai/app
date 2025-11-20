import { NextResponse } from 'next/server';
import { ListToolsResult } from '@modelcontextprotocol/sdk/types.js';
import { registry } from '@/marketplace';

export async function GET() {
  const tools = [];
  
  for (const {tool} of await registry.getAllTools()) {
    const schema = tool.inputSchema;
    const schemaObj = schema as Record<string, object>;
    
    // Ensure we have a valid properties object that satisfies { [x: string]: unknown }
    const properties = schemaObj.properties as Record<string, object> || {};
    
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
