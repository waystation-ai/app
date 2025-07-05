import { ToolContext } from '../core/types';

export async function uploadPdfToGDrive(context: ToolContext, pdfBuffer: Buffer, filename: string): Promise<{ id: string; webViewLink: string }> {
  const accessToken = await context.getAccessToken();

  // Metadata for the file
  const metadata = {
    name: filename,
    mimeType: 'application/pdf',
  };

  // Create multipart body
  const boundary = 'foo_bar_baz';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;
  const body = Buffer.concat([
    Buffer.from(
      delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/pdf\r\n\r\n'
    ),
    pdfBuffer,
    Buffer.from(closeDelimiter)
  ]);

  // Upload file
  const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!uploadRes.ok) {
    const error = await uploadRes.text();
    throw new Error(`Failed to upload PDF to Google Drive: ${error}`);
  }

  const file = await uploadRes.json();

  // Set file to be readable by link
  const permRes = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}/permissions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });
  if (!permRes.ok) {
    const error = await permRes.text();
    throw new Error(`Failed to set file permissions: ${error}`);
  }

  // Get file info with webViewLink
  const infoRes = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?fields=webViewLink`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!infoRes.ok) {
    const error = await infoRes.text();
    throw new Error(`Failed to get file info: ${error}`);
  }
  const info = await infoRes.json();
  return { id: file.id, webViewLink: info.webViewLink };
} 