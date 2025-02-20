import { NextResponse } from 'next/server';
import { oauthService } from '@/app/lib/services/oauth-service';

export async function queryGoogleDriveApi(
  userId: string,
  endpoint: string,
  params?: Record<string, string>,
  exportFormat?: string
): Promise<NextResponse> {
  try {
    const accessToken = await oauthService.getValidAccessToken('gdrive', userId);
    
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
      return NextResponse.json(error, { status: response.status });
    }

    const data = await (isTextResponse ? response.text() : response.json());
    console.log('Google Drive API response:', data);

    return isTextResponse
      ? NextResponse.json({ content: data })
      : NextResponse.json(data);
  } catch (error) {
    console.error('Error querying Google Drive API:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
