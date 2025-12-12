export enum UserRole {
  ADMIN = 'Admin',
  FINANCE_MANAGER = 'Finance Manager',
  PROJECT_MANAGER = 'Project Manager'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
}

export interface Project {
  id: number;
  name: string;
  budget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  status: 'On Track' | 'At Risk' | 'Completed' | 'Delayed';
}

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  vendorName: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  projectId: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  accountId: string;
  status: 'Approved' | 'Pending';
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface RiskAnalysis {
  projectId: number;
  riskScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High';
  factors: string[];
}
