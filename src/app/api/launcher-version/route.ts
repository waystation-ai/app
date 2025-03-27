import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      "https://github.com/waystation-ai/launcher/releases/latest/download/latest.json",
      { cache: 'no-store' } // Ensure we get fresh data
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching launcher version:", error);
    // Return fallback version from the client component
    return NextResponse.json({ version: null }, { status: 500 });
  }
}
