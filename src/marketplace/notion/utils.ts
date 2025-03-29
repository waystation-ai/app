import { ToolContext, ToolResult } from '../core/types';

export async function queryNotionApi(
  context: ToolContext, 
  endpoint: string, 
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
): Promise<ToolResult> {
  try {
    const accessToken = await context.getAccessToken();
    
    const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: true, content: errorData };
    }

    const data = await response.json();
    return { error: false, content: data };
  } catch (error) {
    if (error instanceof Error) {
      return { error: true, content: error.message };
    }
    return { error: true, content: error };
  }
}

// Helper to format Notion rich text
export function formatRichText(text: string): Array<{ type: 'text', text: { content: string } }> {
  return [{ type: 'text', text: { content: text } }];
}

// Helper to parse Notion rich text to plain text
export function parseRichText(richText: Array<{ text: { content: string } }>): string {
  return richText.map(rt => rt.text.content).join('');
}

// Helper to format database properties
export function formatDatabaseProperties(properties: Record<string, unknown>): Record<string, unknown> {
  const formattedProperties: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === 'string') {
      formattedProperties[key] = { 
        rich_text: formatRichText(value) 
      };
    } else if (typeof value === 'number') {
      formattedProperties[key] = { 
        number: value 
      };
    } else if (typeof value === 'boolean') {
      formattedProperties[key] = { 
        checkbox: value 
      };
    } else {
      formattedProperties[key] = value;
    }
  }
  
  return formattedProperties;
}
