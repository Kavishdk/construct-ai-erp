import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FinancialDashboard from './pages/finance/FinancialDashboard';
import GeneralLedger from './pages/finance/GeneralLedger';
import Invoices from './pages/finance/Invoices';
import Vendors from './pages/finance/Vendors';
import Customers from './pages/finance/Customers';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';

import { MockDb } from './services/mockDb';
import api from './services/api';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="finance">
            <Route path="dashboard" element={<FinancialDashboard />} />
            <Route path="ledger" element={<GeneralLedger />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="customers" element={<Customers />} />
          </Route>
          <Route path="admin">
            <Route path="users" element={<UserManagement />} />
            <Route path="logs" element={<AuditLogs />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
