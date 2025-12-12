import React, { useEffect, useState } from 'react';
import { Account, JournalEntry } from '../../types';
import api from '../../services/api';

interface ExtendedJournalEntry extends JournalEntry {
    lines?: {
        id: number;
        accountId: number;
        debit: number;
        credit: number;
        account: Account;
    }[];
}

const GeneralLedger: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'coa' | 'journal' | 'report'>('coa');
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [entries, setEntries] = useState<ExtendedJournalEntry[]>([]);
    const [balanceSheet, setBalanceSheet] = useState<any>(null);
    const [profitLoss, setProfitLoss] = useState<any>(null);

    // New Entry Form State
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split('T')[0]);
    const [newEntryDesc, setNewEntryDesc] = useState('');
    const [entryLines, setEntryLines] = useState<{ accountId: string, debit: string, credit: string }[]>([
        { accountId: '', debit: '', credit: '' },
        { accountId: '', debit: '', credit: '' }
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            api.get('/finance/accounts').then(res => setAccounts(res.data)).catch(console.error);
            api.get('/finance/journal-entries').then(res => setEntries(res.data)).catch(console.error);
            api.get('/finance/balance-sheet').then(res => setBalanceSheet(res.data)).catch(console.error);
            api.get('/finance/profit-loss').then(res => setProfitLoss(res.data)).catch(console.error);
        } catch (e) {
            console.error("Failed to fetch ledger data", e);
        }
    };

    const handleAddLine = () => {
        setEntryLines([...entryLines, { accountId: '', debit: '', credit: '' }]);
    };

    const handleLineChange = (index: number, field: string, value: string) => {
        const newLines = [...entryLines];
        (newLines[index] as any)[field] = value;
        setEntryLines(newLines);
    };

    const handleSubmitEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validation
        const lines = entryLines
            .filter(l => l.accountId && (Number(l.debit) > 0 || Number(l.credit) > 0))
            .map(l => ({
                accountId: Number(l.accountId),
                debit: Number(l.debit || 0),
                credit: Number(l.credit || 0)
            }));

        if (lines.length === 0) {
            alert("Please add at least one valid line with an account and an amount.");
            return;
        }

        const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
        const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            alert(`Entry is not balanced! Difference: ${Math.abs(totalDebit - totalCredit).toFixed(2)}`);
            return;
        }

        try {
            await api.post('/finance/journal-entries', {
                date: newEntryDate,
                description: newEntryDesc,
                lines
            });
            alert('Journal Entry Created');
            setIsEntryModalOpen(false);
            setNewEntryDesc('');
            setEntryLines([{ accountId: '', debit: '', credit: '' }, { accountId: '', debit: '', credit: '' }]);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to create entry');
        }
    };

    // calculate totals for display
    const getEntryTotals = (entry: ExtendedJournalEntry) => {
        if (!entry.lines) return { debit: 0, credit: 0 };
        return {
            debit: entry.lines.reduce((s, l) => s + l.debit, 0),
            credit: entry.lines.reduce((s, l) => s + l.credit, 0)
        };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">General Ledger</h2>
                <div className="bg-white rounded-lg p-1 border border-slate-200 inline-flex">
                    <button
                        onClick={() => setActiveTab('coa')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'coa' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Chart of Accounts
                    </button>
                    <button
                        onClick={() => setActiveTab('journal')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'journal' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Journal Entries
                    </button>
                    <button
                        onClick={() => setActiveTab('report')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'report' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Financial Reports
                    </button>
                </div>
            </div>

            {activeTab === 'coa' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Code</th>
                                <th className="px-6 py-3">Account Name</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {accounts.map(acc => (
                                <tr key={acc.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-slate-500">{acc.code}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{acc.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs border ${acc.type === 'Asset' ? 'bg-green-50 text-green-700 border-green-200' :
                                            acc.type === 'Liability' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                acc.type === 'Revenue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            {acc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-700">
                                        ${acc.balance.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'journal' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-end">
                        <button
                            onClick={() => setIsEntryModalOpen(!isEntryModalOpen)}
                            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-700"
                        >
                            <i className="fa-solid fa-plus mr-2"></i> {isEntryModalOpen ? 'Close Form' : 'New Entry'}
                        </button>
                    </div>

                    {isEntryModalOpen && (
                        <div className="p-6 bg-slate-50 border-b border-slate-200">
                            <h3 className="font-bold text-lg mb-4">Create Journal Entry</h3>
                            <form onSubmit={handleSubmitEntry}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="date"
                                        value={newEntryDate}
                                        onChange={e => setNewEntryDate(e.target.value)}
                                        className="border p-2 rounded"
                                        required
                                    />
                                    <input
                                        placeholder="Description"
                                        value={newEntryDesc}
                                        onChange={e => setNewEntryDesc(e.target.value)}
                                        className="border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-500">
                                        <div className="col-span-6">Account</div>
                                        <div className="col-span-3">Debit</div>
                                        <div className="col-span-3">Credit</div>
                                    </div>
                                    {entryLines.map((line, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-2">
                                            <div className="col-span-6">
                                                <select
                                                    value={line.accountId}
                                                    onChange={e => handleLineChange(idx, 'accountId', e.target.value)}
                                                    className="w-full border p-2 rounded"
                                                >
                                                    <option value="">Select Account</option>
                                                    {accounts.map(acc => (
                                                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={line.debit}
                                                    onChange={e => handleLineChange(idx, 'debit', e.target.value)}
                                                    className="w-full border p-2 rounded"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={line.credit}
                                                    onChange={e => handleLineChange(idx, 'credit', e.target.value)}
                                                    className="w-full border p-2 rounded"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={handleAddLine} className="text-brand-600 text-sm hover:underline">+ Add Line</button>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded shadow-sm hover:bg-green-700">Post Entry</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3 text-right">Total Debit</th>
                                <th className="px-6 py-3 text-right">Total Credit</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-400">
                                        No journal entries found.
                                    </td>
                                </tr>
                            ) : (
                                entries.map(entry => {
                                    const { debit, credit } = getEntryTotals(entry);
                                    return (
                                        <tr key={entry.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-slate-500">{new Date(entry.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-mono text-slate-500">{entry.id}</td>
                                            <td className="px-6 py-4 text-slate-800 font-medium">
                                                {entry.description}
                                                <div className="text-xs text-slate-400 mt-1">
                                                    {entry.lines?.map(l => (
                                                        <div key={l.id}>{l.account.code} - {l.account.name}: {l.debit > 0 ? `Dr ${l.debit}` : `Cr ${l.credit}`}</div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono">${debit.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-mono">${credit.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-1 text-xs font-medium ${entry.status === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    <i className={`fa-solid ${entry.status === 'Approved' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                                                    {entry.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {activeTab === 'report' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Balance Sheet Card */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Balance Sheet Summary</h2>
                        {balanceSheet ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Assets</span>
                                    <span className="text-green-600 font-semibold">${balanceSheet.assets.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Liabilities</span>
                                    <span className="text-red-500 font-semibold">${balanceSheet.liabilities.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Equity</span>
                                    <span className="text-blue-600 font-semibold">${balanceSheet.equity.toLocaleString()}</span>
                                </div>
                                <div className="pt-2 border-t flex justify-between text-sm">
                                    <span className="text-gray-400">Balance Check (A = L + E)</span>
                                    <span className={balanceSheet.check ? "text-green-500" : "text-red-500"}>
                                        {balanceSheet.check ? "Balanced" : "Unbalanced"}
                                    </span>
                                </div>
                            </div>
                        ) : <p>Loading...</p>}
                    </div>

                    {/* P&L Card */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Profit & Loss</h2>
                        {profitLoss ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Revenue</span>
                                    <span className="text-green-600 font-semibold">${profitLoss.revenue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Expenses</span>
                                    <span className="text-red-500 font-semibold">${profitLoss.expenses.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 mt-2 border-t flex justify-between text-lg font-bold">
                                    <span className="text-gray-800">Net Income</span>
                                    <span className={profitLoss.netIncome >= 0 ? "text-green-600" : "text-red-600"}>
                                        ${profitLoss.netIncome.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ) : <p>Loading...</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneralLedger;
