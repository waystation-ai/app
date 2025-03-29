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

interface SearchResponse {
  value: DriveItem[];
}

const parametersSchema = z.object({
  query: z.string().describe('Search query to find matching Office documents')
});

export type SearchDocsParams = z.infer<typeof parametersSchema>;

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

export type SearchDocsResponse = z.infer<typeof responseSchema>;

export const searchDocs = defineTool({
  id: 'searchOfficeDocs',
  summary: 'Search Office Documents',
  description: 'Searches for Office documents matching a specific query string.',
  method: 'GET',
  path: '/tools/office/search_docs',
  parameters: parametersSchema,
  responses: {
    '200': {
      description: 'Successfully retrieved matching documents',
      schema: responseSchema
    }
  },
  handler: async ({ context, params }) => {
    const response = await queryOffice365Api<SearchResponse>(
      context,
      `me/drive/root/search(q='${encodeURIComponent(params.query)}')`,
      {
        $select: 'id,name,lastModifiedDateTime,webUrl,folder,file',
        $orderby: 'lastModifiedDateTime desc'
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
    } as SearchDocsResponse;
  }
});
