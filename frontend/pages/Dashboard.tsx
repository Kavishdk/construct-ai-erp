import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Project, RiskAnalysis } from '../types';
import { GeminiService } from '../services/geminiService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [risks, setRisks] = useState<Record<number, RiskAnalysis>>({});
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/projects');
        const projs = res.data;
        setProjects(projs);

        const riskDefinitions = await Promise.all(
          projs.map(async (p: Project) => {
            const r = await api.get(`/projects/${p.id}/risk`);
            return { id: p.id, risk: r.data };
          })
        );

        const riskMap: Record<number, RiskAnalysis> = {};
        riskDefinitions.forEach(item => {
          riskMap[item.id] = item.risk;
        });
        setRisks(riskMap);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAiAnalyze = async (project: Project) => {
    setAnalyzingId(project.id);
    const risk = risks[project.id];
    const insight = await GeminiService.analyzeProjectHealth(project, risk);
    setAiInsight(insight);
    setAnalyzingId(null);
  };

  const projectStatusData = [
    { name: 'On Track', value: projects.filter(p => p.status === 'On Track').length },
    { name: 'At Risk', value: projects.filter(p => p.status === 'At Risk').length },
    { name: 'Delayed', value: projects.filter(p => p.status === 'Delayed').length },
  ];
  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  if (loading) return <div className="flex h-96 items-center justify-center">Loading Dashboard...</div>;

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Executive Dashboard</h2>
          <p className="text-slate-500">Welcome back, Admin. Here is today's overview.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              // Convert data to CSV format
              const headers = ['Project Name', 'Budget', 'Progress', 'Status', 'Risk Score', 'Risk Level'];
              const rows = projects.map(p => {
                const r = risks[p.id];
                return [
                  `"${p.name.replace(/"/g, '""')}"`, // Escape quotes
                  p.budget,
                  `${p.progress}%`,
                  p.status,
                  r ? r.riskScore : 'N/A',
                  r ? r.riskLevel : 'N/A'
                ];
              });

              const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
              ].join('\n');

              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);

              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute("href", url);
              downloadAnchorNode.setAttribute("download", "dashboard_report.csv");
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg shadow transition">
            <i className="fa-solid fa-file-csv mr-2"></i> Export CSV
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-medium uppercase">Active Projects</h3>
            <div className="p-2 bg-blue-100 rounded-full text-blue-600"><i className="fa-solid fa-building"></i></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{projects.length}</p>
          <p className="text-xs text-green-600 mt-1"><i className="fa-solid fa-arrow-up"></i> 1 new this month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-medium uppercase">Total Budget</h3>
            <div className="p-2 bg-green-100 rounded-full text-green-600"><i className="fa-solid fa-sack-dollar"></i></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            ${(projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-slate-400 mt-1">Across all active sites</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-medium uppercase">High Risk Sites</h3>
            <div className="p-2 bg-red-100 rounded-full text-red-600"><i className="fa-solid fa-triangle-exclamation"></i></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {Object.values(risks).filter((r: RiskAnalysis) => r.riskLevel === 'High').length}
          </p>
          <p className="text-xs text-red-500 mt-1">Action required immediately</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-medium uppercase">Pending Invoices</h3>
            <div className="p-2 bg-yellow-100 rounded-full text-yellow-600"><i className="fa-solid fa-file-invoice"></i></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">5</p>
          <p className="text-xs text-slate-400 mt-1">Total val: $32k</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Project Health Table & AI Analysis */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Project Health & Risk AI</h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-200">
              <i className="fa-solid fa-wand-magic-sparkles mr-1"></i> AI Enabled
            </span>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Progress</th>
                  <th className="px-6 py-3">Risk Score</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map(project => {
                  const risk = risks[project.id];
                  return (
                    <tr key={project.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">{project.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2.5">
                            <div className="bg-brand-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                          </div>
                          <span>{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${risk.riskLevel === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                            risk.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-green-100 text-green-800 border-green-200'}`}>
                          {risk.riskScore} - {risk.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleAiAnalyze(project)}
                          className="text-brand-600 hover:text-brand-800 font-medium text-xs flex items-center gap-1"
                          disabled={analyzingId === project.id}
                        >
                          {analyzingId === project.id ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-magnifying-glass-chart"></i>
                          )}
                          Analyze
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {aiInsight && (
            <div className="bg-indigo-50 p-4 m-4 rounded-lg border border-indigo-100">
              <h4 className="text-indigo-800 font-bold mb-2 flex items-center gap-2">
                <i className="fa-solid fa-robot"></i> Gemini Insight
              </h4>
              <p className="text-indigo-900 text-sm leading-relaxed">{aiInsight}</p>
              <button
                onClick={() => setAiInsight(null)}
                className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Status Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Project Status Distribution</h3>
          <div className="flex-1 min-h-[250px]" style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;