import { NextRequest, NextResponse } from 'next/server';
import { queryGoogleDriveApi } from '../utils';
import { authenticateRequest } from '../../shared/utils';

export async function GET(request: NextRequest) {
  const userId = await authenticateRequest(request);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Get the document ID from the URL
  const docId = request.nextUrl.searchParams.get('docId');
  if (!docId) {
    return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
  }

  try {
    // First, verify the file exists and is a Google Doc
    const metadataResponse = await queryGoogleDriveApi(userId, `files/${docId}`, {
      fields: 'mimeType,name'
    });
    
    const metadata = await metadataResponse.json();
    if (metadata.mimeType !== 'application/vnd.google-apps.document') {
      return NextResponse.json({ error: 'File is not a Google Doc' }, { status: 400 });
    }

    // Export the document as plain text
    const response = await queryGoogleDriveApi(
      userId,
      `files/${docId}/export`,
      undefined,
      'text/plain'
    );

    const { content } = await response.json();
    return NextResponse.json({
      name: metadata.name,
      content: content
    });
  } catch (error) {
    console.error('Error reading Google Doc:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
