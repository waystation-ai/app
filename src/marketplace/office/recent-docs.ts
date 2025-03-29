import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryOffice365Api } from './utils';

interface FolderFacet {
  childCount: number;
}

interface FileFacet {
  mimeType: string;
  size: number;
}

interface DriveItem {
  id: string;
  name: string;
  lastModifiedDateTime: string;
  webUrl: string;
  folder?: FolderFacet; // Present if item is a folder
  file?: FileFacet;     // Present if item is a file
}

interface RecentItemsResponse {
  value: DriveItem[];
}

const responseSchema = z.object({
  files: z.array(z.object({
    id: z.string().describe('Unique identifier for the document'),
    name: z.string().describe('Name of the document'),
    modifiedTime: z.string().describe('Last modification timestamp'),
    webViewLink: z.string().describe('URL to view the document in browser'),
    type: z.string().describe('Type of item: "file" or "folder"'),
    mimeType: z.string().optional().describe('MIME type of the file (only for files)')
  }))
});

export type RecentDocsResponse = z.infer<typeof responseSchema>;

export const recentDocs = defineTool({
  id: 'recentOfficeDocs',
  summary: 'List Recently Used Office Documents',
  description: 'Retrieves a list of recently used Office documents by the user.',
  method: 'GET',
  path: '/tools/office/recent_docs',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'Successfully retrieved list of recently used documents',
      schema: responseSchema
    }
  },
  handler: async ({ context }) => {
    const response = await queryOffice365Api<RecentItemsResponse>(
      context,
      'me/drive/recent',
      {
        $select: 'id,name,lastModifiedDateTime,webUrl,folder,file'
      }
    );
    
    return {
      files: response.value.map((item) => ({
        id: item.id,
        name: item.name,
        modifiedTime: item.lastModifiedDateTime,
        webViewLink: item.webUrl,
        type: item.folder ? 'folder' : 'file',
        mimeType: item.file?.mimeType
      }))
    } as RecentDocsResponse;
  }
});
