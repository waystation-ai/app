/**
 * Utility functions for generating RFC 9728 compliant WWW-Authenticate headers
 * for OAuth 2.0 Protected Resource Metadata discovery
 */

export interface WWWAuthenticateOptions {
  realm?: string;
  resourceMetadataUrl?: string;
  scope?: string;
  error?: string;
  errorDescription?: string;
}

/**
 * Generate a WWW-Authenticate header value for Bearer token authentication
 * following RFC 9728 Section 5.1 requirements
 */
export function generateWWWAuthenticateHeader(options: WWWAuthenticateOptions = {}): string {
  const {
    realm = 'mcp',
    resourceMetadataUrl = `${process.env.NEXT_PUBLIC_APP_URL}/.well-known/oauth-protected-resource`,
    scope,
    error,
    errorDescription
  } = options;

  const params: string[] = [];

  // Add realm parameter
  params.push(`realm="${realm}"`);

  // Add resource parameter pointing to Protected Resource Metadata URL (RFC 9728 Section 5.1)
  params.push(`resource="${resourceMetadataUrl}"`);

  // Add scope if provided
  if (scope) {
    params.push(`scope="${scope}"`);
  }

  // Add error parameters if provided (RFC 6750 Section 3.1)
  if (error) {
    params.push(`error="${error}"`);
  }

  if (errorDescription) {
    params.push(`error_description="${errorDescription}"`);
  }

  return `Bearer ${params.join(', ')}`;
}
