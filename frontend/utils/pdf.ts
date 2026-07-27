export type PdfDocumentData = {
  title: string;
  companyName: string;
  documentNumber: string;
  date: string;
  clientName: string;
  items: Array<{ description: string; quantity: number; unitRate: number; total: number }>;
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  version: number;
};

export function formatPdfDocumentHTML(data: PdfDocumentData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #334155;">${item.description}</td>
      <td style="padding: 10px; border-bottom: 1px solid #334155; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #334155; text-align: right;">$${item.unitRate.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #334155; text-align: right;">$${item.total.toLocaleString()}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; }
    .title { font-size: 24px; font-weight: bold; color: #f59e0b; }
    .meta { font-size: 12px; color: #94a3b8; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 30px; }
    th { background: #1e293b; color: #f59e0b; text-align: left; padding: 10px; font-size: 12px; }
    .totals { margin-top: 30px; text-align: right; font-size: 14px; }
    .grand-total { font-size: 18px; font-weight: bold; color: #f59e0b; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">${data.title}</div>
      <div class="meta">${data.companyName} | Immutable Document ${data.documentNumber} (v${data.version})</div>
    </div>
    <div style="text-align: right;">
      <div style="font-weight: bold;">Client: ${data.clientName}</div>
      <div class="meta">Date: ${data.date}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Rate</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <div class="totals">
    <div>Subtotal: $${data.subtotal.toLocaleString()}</div>
    <div>GST Tax: $${data.taxAmount.toLocaleString()}</div>
    <div>Discount: -$${data.discount.toLocaleString()}</div>
    <div class="grand-total">Total Amount: $${data.totalAmount.toLocaleString()}</div>
  </div>
</body>
</html>
  `.trim();
}
