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

interface DriveItemsResponse {
  value: DriveItem[];
}

const parametersSchema = z.object({
  folderId: z.string().optional().describe('ID of the folder to list items from. If not provided, lists items from the root folder.')
});

export type ListDocsParams = z.infer<typeof parametersSchema>;

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

export type ListDocsResponse = z.infer<typeof responseSchema>;

export const listDocs = defineTool({
  id: 'listOfficeDocs',
  summary: 'List Office Documents',
  description: 'Retrieves a list of Office documents and folders from OneDrive, ordered by last modified date.',
  method: 'GET',
  path: '/tools/office/list_docs',
  parameters: parametersSchema,
  responses: {
    '200': {
      description: 'Successfully retrieved list of documents',
      schema: responseSchema
    }
  },
  handler: async ({ context, params }) => {
    // Determine the endpoint based on whether a folderId is provided
    const endpoint = params.folderId 
      ? `me/drive/items/${params.folderId}/children`
      : 'me/drive/root/children';
      
    const response = await queryOffice365Api<DriveItemsResponse>(
      context,
      endpoint,
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
    } as ListDocsResponse;
  }
});
