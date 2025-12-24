import { NextApiResponse } from 'next';

const SSE_DEPRECATION_MESSAGE = {
  error: 'SSE transport is deprecated',
  message: 'SSE server-side support has been deprecated. Please use StreamableHTTP transport instead.',
  streamableEndpoint: '/api/mcp',
};

export function isSSEEnabled(): boolean {
  return process.env.ENABLE_SSE_SERVER === 'true';
}

export function handleDeprecatedSSE(res: NextApiResponse, endpoint: string): void {
  console.warn(`[SSE Deprecation] Access attempted to deprecated endpoint: ${endpoint}`);
  res.status(410).json(SSE_DEPRECATION_MESSAGE);
}

export function handleNonPostRequest(res: NextApiResponse, method: string): void {
  res.status(405).json({
    error: 'Method Not Allowed',
    message: `The MCP endpoint only accepts POST requests. Received: ${method}`,
    allowedMethods: ['POST'],
  });
}
