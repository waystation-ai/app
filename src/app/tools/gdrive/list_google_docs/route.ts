import { NextRequest, NextResponse } from 'next/server';
import { queryGoogleDriveApi } from '../utils';
import { authenticateRequest } from '../../shared/utils';

export async function GET(request: NextRequest) {
  const userId = await authenticateRequest(request);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Query parameters to list only Google Docs
  const params = {
    q: "mimeType='application/vnd.google-apps.document'",
    fields: 'files(id,name,modifiedTime,webViewLink)',
    orderBy: 'modifiedTime desc'
  };

  try {
    const response = await queryGoogleDriveApi(userId, 'files', params);
    
    // Transform the response to include only necessary data
    const data = await response.json();
    if (data.files) {
      return NextResponse.json({
        documents: data.files.map((doc: any) => ({  // eslint-disable-line @typescript-eslint/no-explicit-any
          id: doc.id,
          name: doc.name,
          lastModified: doc.modifiedTime,
          url: doc.webViewLink
        }))
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error listing Google Docs:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
