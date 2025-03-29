import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryNotionApi } from './utils';

/**
 * Interface for Notion rich text
 */
interface NotionRichText {
  type: string;
  plain_text?: string;
  text?: {
    content: string;
    link?: { url: string } | null;
  };
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
}

/**
 * Interface for Notion block types
 */
interface NotionBlock {
  type: string;
  paragraph?: {
    rich_text: NotionRichText[];
  };
  heading_1?: {
    rich_text: NotionRichText[];
  };
  heading_2?: {
    rich_text: NotionRichText[];
  };
  heading_3?: {
    rich_text: NotionRichText[];
  };
  bulleted_list_item?: {
    rich_text: NotionRichText[];
  };
  numbered_list_item?: {
    rich_text: NotionRichText[];
  };
  to_do?: {
    rich_text: NotionRichText[];
    checked: boolean;
  };
  code?: {
    rich_text: NotionRichText[];
    language: string;
  };
  quote?: {
    rich_text: NotionRichText[];
  };
  [key: string]: unknown;
}

/**
 * Extract text from rich text array
 */
function extractText(richText: NotionRichText[]): string {
  return richText.map(rt => rt.plain_text || '').join('');
}

/**
 * Safely get rich text from a block by type
 */
function getRichTextFromBlock(block: NotionBlock, blockType: string): NotionRichText[] | null {
  if (!block[blockType]) {
    return null;
  }
  
  const typedBlock = block[blockType] as Record<string, unknown>;
  if (!typedBlock.rich_text || !Array.isArray(typedBlock.rich_text)) {
    return null;
  }
  
  return typedBlock.rich_text as NotionRichText[];
}

/**
 * Converts Notion blocks to plain text
 */
function blocksToPlainText(blocks: NotionBlock[]): string {
  let text = '';
  
  for (const block of blocks) {
    // Handle different block types
    switch (block.type) {
      case 'paragraph':
        if (block.paragraph?.rich_text) {
          const paragraphText = extractText(block.paragraph.rich_text);
          if (paragraphText) {
            text += paragraphText + '\n\n';
          }
        }
        break;
        
      case 'heading_1':
        if (block.heading_1?.rich_text) {
          const headingText = extractText(block.heading_1.rich_text);
          if (headingText) {
            text += headingText + '\n\n';
          }
        }
        break;
        
      case 'heading_2':
        if (block.heading_2?.rich_text) {
          const headingText = extractText(block.heading_2.rich_text);
          if (headingText) {
            text += headingText + '\n\n';
          }
        }
        break;
        
      case 'heading_3':
        if (block.heading_3?.rich_text) {
          const headingText = extractText(block.heading_3.rich_text);
          if (headingText) {
            text += headingText + '\n\n';
          }
        }
        break;
        
      case 'bulleted_list_item':
        if (block.bulleted_list_item?.rich_text) {
          const listItemText = extractText(block.bulleted_list_item.rich_text);
          if (listItemText) {
            text += '• ' + listItemText + '\n';
          }
        }
        break;
        
      case 'numbered_list_item':
        if (block.numbered_list_item?.rich_text) {
          const listItemText = extractText(block.numbered_list_item.rich_text);
          if (listItemText) {
            text += '• ' + listItemText + '\n';
          }
        }
        break;
        
      case 'to_do':
        if (block.to_do?.rich_text) {
          const todoText = extractText(block.to_do.rich_text);
          const checked = block.to_do.checked ? '[x]' : '[ ]';
          if (todoText) {
            text += checked + ' ' + todoText + '\n';
          }
        }
        break;
        
      case 'code':
        if (block.code?.rich_text) {
          const codeText = extractText(block.code.rich_text);
          if (codeText) {
            text += codeText + '\n\n';
          }
        }
        break;
        
      case 'quote':
        if (block.quote?.rich_text) {
          const quoteText = extractText(block.quote.rich_text);
          if (quoteText) {
            text += quoteText + '\n\n';
          }
        }
        break;
        
      case 'divider':
        text += '---\n\n';
        break;
        
      default:
        // For unsupported block types, try to extract text if possible
        const richText = getRichTextFromBlock(block, block.type);
        if (richText) {
          const blockText = extractText(richText);
          if (blockText) {
            text += blockText + '\n\n';
          }
        }
        break;
    }
  }
  
  return text.trim();
}

/**
 * Converts Notion blocks to markdown
 */
function blocksToMarkdown(blocks: NotionBlock[]): string {
  let markdown = '';
  
  for (const block of blocks) {
    // Handle different block types
    switch (block.type) {
      case 'paragraph':
        if (block.paragraph?.rich_text) {
          const paragraphText = extractText(block.paragraph.rich_text);
          if (paragraphText) {
            markdown += paragraphText + '\n\n';
          }
        }
        break;
        
      case 'heading_1':
        if (block.heading_1?.rich_text) {
          const headingText = extractText(block.heading_1.rich_text);
          if (headingText) {
            markdown += '# ' + headingText + '\n\n';
          }
        }
        break;
        
      case 'heading_2':
        if (block.heading_2?.rich_text) {
          const headingText = extractText(block.heading_2.rich_text);
          if (headingText) {
            markdown += '## ' + headingText + '\n\n';
          }
        }
        break;
        
      case 'heading_3':
        if (block.heading_3?.rich_text) {
          const headingText = extractText(block.heading_3.rich_text);
          if (headingText) {
            markdown += '### ' + headingText + '\n\n';
          }
        }
        break;
        
      case 'bulleted_list_item':
        if (block.bulleted_list_item?.rich_text) {
          const listItemText = extractText(block.bulleted_list_item.rich_text);
          if (listItemText) {
            markdown += '- ' + listItemText + '\n';
          }
        }
        break;
        
      case 'numbered_list_item':
        if (block.numbered_list_item?.rich_text) {
          const listItemText = extractText(block.numbered_list_item.rich_text);
          if (listItemText) {
            markdown += '1. ' + listItemText + '\n';
          }
        }
        break;
        
      case 'to_do':
        if (block.to_do?.rich_text) {
          const todoText = extractText(block.to_do.rich_text);
          const checked = block.to_do.checked ? '[x]' : '[ ]';
          if (todoText) {
            markdown += '- ' + checked + ' ' + todoText + '\n';
          }
        }
        break;
        
      case 'code':
        if (block.code?.rich_text) {
          const codeText = extractText(block.code.rich_text);
          const language = block.code.language || '';
          if (codeText) {
            markdown += '```' + language + '\n' + codeText + '\n```\n\n';
          }
        }
        break;
        
      case 'quote':
        if (block.quote?.rich_text) {
          const quoteText = extractText(block.quote.rich_text);
          if (quoteText) {
            markdown += '> ' + quoteText + '\n\n';
          }
        }
        break;
        
      case 'divider':
        markdown += '---\n\n';
        break;
        
      default:
        // For unsupported block types, try to extract text if possible
        const richText = getRichTextFromBlock(block, block.type);
        if (richText) {
          const blockText = extractText(richText);
          if (blockText) {
            markdown += blockText + '\n\n';
          }
        }
        break;
    }
  }
  
  return markdown.trim();
}

/**
 * Extract basic metadata from a Notion page
 */
function extractBasicPageMetadata(page: unknown): Record<string, unknown> {
  const typedPage = page as Record<string, unknown>;
  
  // Extract page title if available
  let title = '';
  if (typedPage.properties && typeof typedPage.properties === 'object') {
    const properties = typedPage.properties as Record<string, unknown>;
    if (properties.title && typeof properties.title === 'object') {
      const titleProp = properties.title as Record<string, unknown>;
      if (titleProp.title && Array.isArray(titleProp.title)) {
        title = (titleProp.title as Array<{ plain_text?: string }>)
          .map(t => t.plain_text || '')
          .join('');
      }
    }
  }
  
  return {
    id: typedPage.id,
    url: typedPage.url,
    created_time: typedPage.created_time,
    last_edited_time: typedPage.last_edited_time,
    title
  };
}

export const readNotionPage = defineTool({
  id: 'readNotionPage',
  summary: 'Read a Notion page',
  description: 'Retrieves the content of a Notion page in the specified format.',
  method: 'GET',
  path: '/tools/notion/read_page',
  parameters: z.object({
    pageId: z.string().describe('ID of the page to read'),
    format: z.enum(['text', 'markdown', 'blocks']).optional().default('text')
      .describe('Format to return the page content in: text, markdown, or blocks')
  }),
  responses: {
    '200': {
      description: 'The page content',
      schema: z.object({
        page: z.unknown().describe('Page metadata'),
        blocks: z.array(z.unknown()).optional().describe('Page content blocks (only included in blocks format)'),
        content: z.string().optional().describe('Formatted page content (only included in text and markdown formats)')
      })
    }
  },
  handler: async ({ context, params }) => {
    // Get page metadata
    const pageResult = await queryNotionApi(context, `/pages/${params.pageId}`);
    
    if (pageResult.error) {
      throw new Error(JSON.stringify(pageResult.content));
    }
    
    // Get page blocks
    const blocksResult = await queryNotionApi(context, `/blocks/${params.pageId}/children`);
    
    if (blocksResult.error) {
      throw new Error(JSON.stringify(blocksResult.content));
    }
    
    const blocks = (blocksResult.content as { results: NotionBlock[] }).results;
    
    // Return different response structure based on format
    if (params.format === 'blocks') {
      // For blocks format, return full structure with raw blocks
      return {
        page: pageResult.content,
        blocks
      };
    } else {
      // For text or markdown formats, return simplified structure with formatted content
      const content = params.format === 'text' 
        ? blocksToPlainText(blocks) 
        : blocksToMarkdown(blocks);
      
      return {
        page: extractBasicPageMetadata(pageResult.content),
        content
      };
    }
  }
});
