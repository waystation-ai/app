import { oauthService } from '@/app/lib/services/oauth-service';

export async function queryMicrosoftGraphApi<T>(
  userId: string, 
  endpoint: string, 
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    params?: Record<string, string>,
    body?: Record<string, unknown>,
    format?: string,
    providerName?: string // Default to 'office' for backward compatibility
  } = {}
): Promise<T> {
  try {
    const { 
      method = 'GET', 
      params, 
      body, 
      format,
      providerName = 'office'
    } = options;
    
    const accessToken = await oauthService.getValidAccessToken(providerName, userId);
    
    let url = `https://graph.microsoft.com/v1.0/${endpoint}`;
    
    // Add query parameters
    if (params) {
      const queryParams = new URLSearchParams(params);
      url += `?${queryParams.toString()}`;
    }

    // For content endpoints, add format if specified
    if (format) {
      url += url.includes('?') ? '&' : '?';
      url += `format=${format}`;
    }

    console.log(`Querying Microsoft Graph API: ${url} (${method})`);

    const isPdfResponse = format === 'pdf';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': isPdfResponse ? 'application/pdf' : 'application/json',
        ...(body && { 'Content-Type': 'application/json' })
      },
      ...(body && { body: JSON.stringify(body) })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => response.text());
      console.error('Microsoft Graph API error:', error);
      throw new Error(error.error?.message || `Failed to ${method} to Microsoft Graph API`);
    }

    if (isPdfResponse) {
      return response.arrayBuffer() as unknown as T;
    }
    
    if (method === 'DELETE' && response.status === 204) {
      return {} as T; // DELETE operations often return no content
    }

    return await response.json() as T;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
