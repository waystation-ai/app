import { oauthService } from '@/app/lib/services/oauth-service';

export async function queryOffice365Api<T>(userId: string, endpoint: string, params?: Record<string, string>, format?: string): Promise<T> {
  try {
    const accessToken = await oauthService.getValidAccessToken('office', userId);
    
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

    console.log(`Querying Microsoft Graph API: ${url}`);

    const isPdfResponse = format === 'pdf';
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': isPdfResponse ? 'application/pdf' : 
                 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => response.text());
      console.error('Microsoft Graph API error:', error);
      throw new Error(error.error?.message || 'Failed to query Microsoft Graph API');
    }

    const data = await (isPdfResponse ? response.arrayBuffer() : response.json());

    return data as T;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
