import React from 'react';
import { listRecords } from '@/marketplace/airtable/list-records';

// TODO: Replace with your actual Airtable base and table IDs
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const AIRTABLE_ORDERS_TABLE_ID = process.env.AIRTABLE_ORDERS_TABLE_ID || '';

export default async function AutomationDashboard() {
  // Provide a dummy getAccessToken for now
  const context = { getAccessToken: async () => '' };
  let orders: any[] = [];
  try {
    const res = await listRecords.handler({
      context,
      params: {
        baseId: AIRTABLE_BASE_ID,
        tableId: AIRTABLE_ORDERS_TABLE_ID,
        pageSize: 50
      }
    });
    orders = res?.records || [];
  } catch (err) {
    console.error('Failed to fetch orders from Airtable:', err);
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Order Automation Dashboard</h1>
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Items</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Invoice</th>
            <th className="p-2 border">Error</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="p-2 border">{order.fields['Order ID']}</td>
              <td className="p-2 border">{order.fields['Customer Name']}</td>
              <td className="p-2 border">{order.fields['Customer Email']}</td>
              <td className="p-2 border">{order.fields['Items']}</td>
              <td className="p-2 border">${order.fields['Total Amount']}</td>
              <td className="p-2 border">{order.fields['Status']}</td>
              <td className="p-2 border">
                {order.fields['Invoice Link'] ? (
                  <a href={order.fields['Invoice Link']} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="p-2 border text-red-600">{order.fields['Error'] || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 