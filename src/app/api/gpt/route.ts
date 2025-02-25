import { NextResponse } from 'next/server';
import { registry } from '@/app/tools/core/registry';
import { generateOpenApiSpec } from '@/app/tools/core/openapi';

// Import the main entry point to ensure all providers are registered
import '@/app/tools/main';

export async function GET() {
  try {
    // Generate the combined OpenAPI spec using the registry
    const combinedSpec = generateOpenApiSpec(registry);

    return NextResponse.json(combinedSpec);
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error'}, {status: 500})
  }
}
