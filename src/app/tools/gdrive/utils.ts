import { ToolContext } from '../core/types';

export async function queryGdriveApi(context: ToolContext, endpoint: string, params?: Record<string, string>, exportFormat?: string) {
  try {
    const accessToken = await context.getAccessToken();
    
    let url = `https://www.googleapis.com/drive/v3/${endpoint}`;
    
    // Add query parameters
    if (params) {
      const queryParams = new URLSearchParams(params);
      url += `?${queryParams.toString()}`;
    }

    // For export endpoints, add the mimeType
    if (exportFormat) {
      url += url.includes('?') ? '&' : '?';
      url += `mimeType=${exportFormat}`;
    }

    console.log(`Querying Google Drive API: ${url}`);

    const isTextResponse = exportFormat === 'text/plain';
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': isTextResponse ? 'text/plain' : 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => response.text());
      console.error('Google Drive API error:', error);
      throw new Error(error.error?.message || 'Failed to query Google Drive API');
    }

    const data = await (isTextResponse ? response.text() : response.json());
    console.log('Google Drive API response:', data);

    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
