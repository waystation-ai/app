import { NextRequest, NextResponse } from 'next/server';
import { createRecord } from '@/marketplace/airtable/create-record';
import { readSlackChannel } from '@/marketplace/slack/read-channel';
import { generateInvoicePdf, defaultInvoiceHtml, InvoiceData } from '@/lib/utils/generate-invoice';
// import { sendEmailWithAttachment } from '@/lib/utils/send-email'; // To be implemented
import { v4 as uuidv4 } from 'uuid';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { uploadPdfToGDrive } from '@/marketplace/gdrive/upload-file';

// TODO: Replace with your actual Airtable base and table IDs
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const AIRTABLE_ORDERS_TABLE_ID = process.env.AIRTABLE_ORDERS_TABLE_ID || '';
const SLACK_CHANNEL = '#incoming';
const SENDER_EMAIL = 'vlad@waystation.ai';

const orderSchema = z.object({
  customerName: z.string(),
  customerEmail: z.string().email(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    price: z.number()
  })),
  totalAmount: z.number()
});

const systemPrompt = `Extract order details from the following message. If there is no order, respond with null. 
Return a JSON object with: customerName, customerEmail, items (array of {name, quantity, price}), and totalAmount. 
If the message does not contain an order, return null.`;

// Helper: Call ChatGPT to extract order details
async function extractOrderDetailsWithGPT(message: string) {
  const { object } = await generateObject({
    model: openai('gpt-4.1'),
    schema: orderSchema,
    prompt: `${systemPrompt}\nMessage: ${message}`,
    maxTokens: 512
  });
  return object;
}

export async function POST(req: NextRequest) {
  try {
    // Provide a dummy getAccessToken for now
    const context = { getAccessToken: async () => '' };
    // 1. Fetch recent messages from Slack
    const slackResult = await readSlackChannel.handler({
      context,
      params: { channel: SLACK_CHANNEL, limit: 20 }
    });
    const messages = slackResult.messages || [];

    const processedOrders = [];
    for (const msg of messages) {
      // 2. Extract order details using ChatGPT
      const order = await extractOrderDetailsWithGPT(msg.text);
      if (!order) continue;

      // 3. Generate order ID and prepare Airtable fields
      const orderId = uuidv4();
      const createdAt = new Date().toISOString();

      // 5. Generate PDF invoice
      const invoiceData: InvoiceData = {
        orderId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items,
        totalAmount: order.totalAmount,
        createdAt
      };
      const pdfBuffer = await generateInvoicePdf(invoiceData, defaultInvoiceHtml);

      // Upload PDF to Google Drive and get shareable link
      let invoiceLink = '';
      try {
        const uploadRes = await uploadPdfToGDrive(context, pdfBuffer, `Invoice-${orderId}.pdf`);
        invoiceLink = uploadRes.webViewLink;
      } catch (err) {
        console.error('Failed to upload invoice to Google Drive:', err);
      }

      const airtableFields = {
        'Order ID': orderId,
        'Customer Name': order.customerName,
        'Customer Email': order.customerEmail,
        'Order Details': msg.text,
        'Items': order.items.map((i: { name: string; quantity: number; price: number }) => `${i.name} x${i.quantity} @ $${i.price}`).join(', '),
        'Total Amount': order.totalAmount,
        'Status': 'Pending',
        'Slack Message ID': msg.id,
        'Created At': createdAt,
        'Invoice Link': invoiceLink
      };

      // 4. Create record in Airtable
      const airtableRes = await createRecord.handler({
        context,
        params: {
          baseId: AIRTABLE_BASE_ID,
          tableId: AIRTABLE_ORDERS_TABLE_ID,
          fields: airtableFields
        }
      });

      // 6. Send invoice via email (to customer)
      // await sendEmailWithAttachment({
      //   to: order.customerEmail,
      //   from: SENDER_EMAIL,
      //   subject: `Your Invoice for Order ${orderId}`,
      //   text: 'Thank you for your order! Please find your invoice attached.',
      //   attachment: { filename: `Invoice-${orderId}.pdf`, content: pdfBuffer }
      // });

      processedOrders.push({ orderId, airtableId: airtableRes.id, customer: order.customerEmail, invoiceLink });
    }

    return NextResponse.json({ ok: true, processedOrders });
  } catch (error) {
    console.error('Automation error:', error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 