import React, { useEffect, useState } from 'react';
import { Invoice } from '../../types';
import api from '../../services/api';

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projects, setProjects] = useState<{ id: number, name: string }[]>([]);
  const [rates, setRates] = useState<{ currency: string }[]>([]);

  const fetchInvoices = () => {
    api.get('/finance/invoices').then(res => setInvoices(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchInvoices();
    api.get('/projects').then(res => setProjects(res.data)).catch(console.error);
    api.get('/finance/exchange-rates').then(res => setRates(res.data)).catch(console.error);
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    try {
      await api.post('/finance/invoices', {
        vendorName: data.get('vendorName'),
        amount: Number(data.get('amount')),
        currency: data.get('currency'),
        issueDate: data.get('issueDate'),
        dueDate: data.get('dueDate'),
        projectId: data.get('projectId'),
        status: 'Pending'
      });
      alert('Invoice Created Successfully');
      setIsCreateModalOpen(false);
      fetchInvoices();
    } catch (err) {
      console.error(err);
      alert('Failed to create invoice');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Invoices (AR / AP)</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-brand-700 transition"
        >
          <i className="fa-solid fa-plus mr-2"></i> Create Invoice
        </button>
      </div>

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Create New Invoice</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name</label>
                <input name="vendorName" required className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Acme Concrete Supply" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input name="amount" type="number" step="0.01" required className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                  <select name="currency" className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none">
                    <option value="USD">USD ($)</option>
                    {rates.map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
                  <input name="issueDate" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input name="dueDate" type="date" required defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project (Optional)</label>
                <select name="projectId" className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none">
                  <option value="">-- General / Admin --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="border-t pt-4 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 shadow-sm font-medium">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Invoice Details</h3>
                <p className="text-sm text-slate-500 font-mono">{selectedInvoice.invoiceNumber || selectedInvoice.id}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <div className="p-8">
              <div className="flex justify-between mb-8">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To</p>
                  <p className="font-bold text-lg text-slate-800">ConstructAI Inc.</p>
                  <p className="text-slate-500 text-sm">123 Innovation Dr.<br />Tech City, TC 90210</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vendor / Payee</p>
                  <p className="font-bold text-lg text-slate-800">{selectedInvoice.vendorName}</p>
                  <p className="text-slate-500 text-sm">vendor@example.com</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-6 rounded-lg border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Issue Date</p>
                  <p className="font-medium">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Due Date</p>
                  <p className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-md text-xs border ${selectedInvoice.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                    selectedInvoice.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {selectedInvoice.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Amount Due</p>
                  <p className="font-bold text-xl text-slate-800">{selectedInvoice.amount.toLocaleString()} {selectedInvoice.currency}</p>
                </div>
              </div>

              <div className="border-t pt-6 flex justify-end gap-3">
                <button onClick={() => window.print()} className="px-4 py-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-50">
                  <i className="fa-solid fa-print mr-2"></i> Print
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Invoice ID</th>
              <th className="px-6 py-3">Vendor / Customer</th>
              <th className="px-6 py-3">Issue Date</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-mono text-brand-600 font-medium">{inv.invoiceNumber || inv.id}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{inv.vendorName}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(inv.issueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right font-mono font-medium">
                  {inv.amount.toLocaleString()} {inv.currency}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs border ${inv.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                    inv.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {inv.status !== 'Paid' && (
                    <button
                      onClick={async () => {
                        if (confirm(`Record full payment for ${inv.invoiceNumber}?`)) {
                          try {
                            await api.post('/finance/payments', {
                              invoiceId: inv.id,
                              amount: inv.amount,
                              date: new Date().toISOString(),
                              method: 'Bank Transfer'
                            });
                            alert('Payment Recorded');
                            fetchInvoices();
                          } catch (e) { console.error(e); alert("Failed"); }
                        }
                      }}
                      className="text-green-600 hover:text-green-800 text-sm font-medium mr-2"
                    >
                      Pay
                    </button>
                  )}
                  <button onClick={() => setSelectedInvoice(inv)} className="text-brand-600 hover:text-brand-800 text-sm font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No invoices found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
