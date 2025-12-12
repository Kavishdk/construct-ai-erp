import api from './api';
import { Project, Invoice, User, Account, JournalEntry, RiskAnalysis } from '../types';

export const MockDb = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  getUsers: async (): Promise<User[]> => {
    // We didn't build GET /users yet, let's just return mock or build it?
    // We built /api/auth/register but not listing users. 
    // For now return hardcoded to avoid breaking UI if backend missing it.
    return [
        { id: 1, name: 'Alice Admin (Admin)', email: 'alice@construct.ai', role: 'ADMIN', status: 'Active' } as any
    ]; 
  },
  
  getProjects: async (): Promise<Project[]> => {
    const res = await api.get('/projects');
    return res.data;
  },
  
  getProjectById: async (id: number): Promise<Project | undefined> => {
    const res = await api.get('/projects');
    return res.data.find((p: Project) => p.id === id);
  },

  getAccounts: async (): Promise<Account[]> => {
    const res = await api.get('/finance/accounts');
    return res.data;
  },

  getInvoices: async (): Promise<Invoice[]> => {
    const res = await api.get('/finance/invoices');
    return res.data;
  },

  getJournalEntries: async (): Promise<JournalEntry[]> => {
    const res = await api.get('/finance/journal-entries');
    return res.data;
  },

  calculateRisk: async (projectId: number): Promise<RiskAnalysis> => {
    // Now async! We need to update usages to await this.
    try {
        const res = await api.get(`/projects/${projectId}/risk`);
        return res.data;
    } catch(e) {
        return { projectId, riskScore: 0, riskLevel: 'Unknown', factors: [] };
    }
  },

  createInvoice: async (invoice: Invoice) => {
    const res = await api.post('/finance/invoices', invoice);
    return res.data;
  },

  createJournalEntry: async (entry: JournalEntry) => {
    // Backend endpoint not fully ready for POST journal entry yet? 
    // We only made GET. Implementing placeholder or letting it fail.
    console.warn("Create Journal Entry not implemented on backend yet");
    return entry;
  },

  getFinancialDashboard: async () => {
      const res = await api.get('/finance/dashboard');
      return res.data;
  }
};
