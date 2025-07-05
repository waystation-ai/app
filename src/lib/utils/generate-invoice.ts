import puppeteer from 'puppeteer';

export interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  createdAt: string;
}

export async function generateInvoicePdf(invoiceData: InvoiceData, htmlTemplate: string): Promise<Buffer> {
  // Replace placeholders in the HTML template
  let html = htmlTemplate
    .replace(/{{orderId}}/g, invoiceData.orderId)
    .replace(/{{customerName}}/g, invoiceData.customerName)
    .replace(/{{customerEmail}}/g, invoiceData.customerEmail)
    .replace(/{{createdAt}}/g, invoiceData.createdAt)
    .replace(/{{totalAmount}}/g, invoiceData.totalAmount.toFixed(2));

  // Render items as table rows
  const itemsHtml = invoiceData.items.map(item =>
    `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price.toFixed(2)}</td><td>$${(item.quantity * item.price).toFixed(2)}</td></tr>`
  ).join('');
  html = html.replace(/{{items}}/g, itemsHtml);

  // Launch Puppeteer and generate PDF
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return pdfBuffer;
}

// Example HTML template (customize as needed)
export const defaultInvoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice {{orderId}}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    .total { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Invoice</h1>
  <p><strong>Order ID:</strong> {{orderId}}</p>
  <p><strong>Date:</strong> {{createdAt}}</p>
  <p><strong>Customer:</strong> {{customerName}} ({{customerEmail}})</p>
  <table>
    <thead>
      <tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th>Subtotal</th></tr>
    </thead>
    <tbody>
      {{items}}
    </tbody>
    <tfoot>
      <tr><td colspan="3" class="total">Total</td><td class="total">$ {{totalAmount}}</td></tr>
    </tfoot>
  </table>
</body>
</html>
`; 