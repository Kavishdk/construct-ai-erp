import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import api from '../../services/api';

const FinancialDashboard: React.FC = () => {
  const [forecast, setForecast] = useState<string>("");
  const [historyData, setHistoryData] = useState<number[]>([]);
  const [predictedValue, setPredictedValue] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [projectData, setProjectData] = useState<any[]>([]);

  // Mock Data for Cash Flow - ideally this comes from historyData in a real app, 
  // but for chart viz we stick to the mock or map historyData if available.
  const data = [
    { month: 'May', income: 400000, expense: 240000 },
    { month: 'Jun', income: 300000, expense: 139800 },
    { month: 'Jul', income: 200000, expense: 380000 },
    { month: 'Aug', income: 278000, expense: 390800 },
    { month: 'Sep', income: 189000, expense: 480000 },
    { month: 'Oct', income: 239000, expense: 380000 },
  ];

  useEffect(() => {
    // Generate AI Forecast
    const runForecast = async () => {
      try {
        const res = await api.get('/finance/forecast');
        setForecast(res.data.insight);
        setHistoryData(res.data.history || []);
        setPredictedValue(res.data.forecast || 0);
      } catch (e) {
        console.error(e);
        setForecast("Unable to fetch forecast.");
      }
    };
    runForecast();

    // Fetch Projects for Budget/Actual Analysis
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjectData(res.data.map((p: any) => ({
          name: p.name,
          budget: p.budget,
          actual: p.actualCost
        })));
      } catch (e) { console.error("Failed to fetch projects", e); }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Financial Overview</h2>

      {/* Forecast Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-indigo-600"></i> Cash Flow Projections
            </h3>

            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-2">Historical Net Cash Flow (Last 6 Months):</p>
              <div className="flex gap-1">
                {historyData.map((val, idx) => (
                  <div key={idx} className="flex-1 bg-slate-100 rounded p-2 text-center text-xs font-mono">
                    ${(val / 1000).toFixed(1)}k
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-center">
              <p className="text-sm text-indigo-600 uppercase font-semibold tracking-wide">Next Month Prediction</p>
              <p className="text-4xl font-bold text-indigo-900 mt-2">${(predictedValue).toLocaleString()}</p>
              <p className="text-xs text-indigo-400 mt-2">
                Based on linear regression of recent trends.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Cash Flow Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-700">Cash Flow Trend (6 Months)</h3>
            <span className="text-xs text-slate-400">USD ('000)</span>
          </div>
          <div className="h-64" style={{ height: '16rem', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Forecast Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <i className="fa-solid fa-crystal-ball text-indigo-100"></i>
              </div>
              <h3 className="font-bold text-xl">AI Cash Flow Forecast</h3>
            </div>
            <p className="text-indigo-200 text-sm mb-4">
              Predictive analysis based on last 6 months of ledger activity and project milestones.
            </p>
            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
              {forecast ? (
                <p className="text-sm leading-relaxed italic">"{forecast}"</p>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <i className="fa-solid fa-spinner fa-spin"></i> Generating forecast...
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-white text-indigo-900 py-2 px-4 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition"
          >
            View Detailed Projections
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-slate-500 text-sm">Total Receivables</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">$125,000</p>
          <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">65% due within 30 days</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-slate-500 text-sm">Total Payables</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">$85,000</p>
          <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">40% due this week</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-slate-500 text-sm">Net Working Capital</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">$40,000</p>
          <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Low liquidity alert</p>
        </div>
      </div>

      {/* Budget vs Actual Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-700">Project Budget vs Actual Costs</h3>
        </div>
        <div className="h-64" style={{ height: '24rem', minHeight: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="budget" name="Total Budget" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual Cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default FinancialDashboard;
