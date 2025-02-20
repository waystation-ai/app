import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { providers } from '@/app/lib/config/oauth-providers';

// Function to get the path to a provider's OpenAPI spec file
const getProviderSpecPath = (provider: string) =>
  path.join(process.cwd(), `src/app/tools/${provider}/${provider}.json`);

// Function to check if a file exists
const fileExists = async (path: string) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

export async function GET() {
  try {
    // Get list of providers and filter to those that have spec files
    const providerChecks = await Promise.all(
      Object.keys(providers).map(async (provider) => ({
        provider,
        exists: await fileExists(getProviderSpecPath(provider))
      }))
    );
    
    const availableProviders = providerChecks
      .filter(({ exists }) => exists)
      .map(({ provider }) => provider);

    // Read all available provider specs concurrently
    const specFiles = await Promise.all(
      availableProviders.map(async (provider) => {
        const filePath = getProviderSpecPath(provider);
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
      })
    );

    // Use the first spec file as a base for common properties
    const baseSpec = specFiles[0];
    
    // Combine all paths from all providers
    const combinedPaths = specFiles.reduce((acc, spec) => ({
      ...acc,
      ...spec.paths
    }), {});

    // Create the combined specification
    const combinedSpec = {
      openapi: baseSpec.openapi,
      info: baseSpec.info,
      servers: baseSpec.servers,
      paths: combinedPaths
    };

    return new NextResponse(JSON.stringify(combinedSpec, null, 2), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error combining OpenAPI specs:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
