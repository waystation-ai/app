import { ToolContext, ToolResult } from '../core/types';

export async function callMiroApi(
  context: ToolContext,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>,
  queryParams?: Record<string, string>
): Promise<ToolResult> {
  try {
    const accessToken = await context.getAccessToken();
    const baseUrl = 'https://api.miro.com/v2';
    
    // Build URL with query parameters
    let url = `${baseUrl}${endpoint}`;
    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString();
      url = `${url}?${queryString}`;
    }

    console.log(`Miro API ${method} request to: ${url}`);
    if (body) {
      console.log(`Request body: ${JSON.stringify(body)}`);
    }

    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    };

    if (method !== 'GET' && body) {
      headers['Content-Type'] = 'application/json';
    }

    const requestOptions: RequestInit = {
      method,
      headers
    };

    if (method !== 'GET' && body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.error('Miro API error:', data);
      return { error: true, content: data };
    }

    console.log('Miro API response:', data);
    return { error: false, content: data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Miro API error:', error.message);
      return { error: true, content: error.message };
    }
    console.error('Miro API unknown error:', error);
    return { error: true, content: error };
  }
}
