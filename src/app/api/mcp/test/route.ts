import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the test client HTML file
    const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'mcp', 'test-client.html');
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Return the HTML content
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('[MCP Test] Error serving test client:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
