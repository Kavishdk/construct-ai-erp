import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 mb-2 rounded-lg transition-colors ${isActive
      ? 'bg-brand-600 text-white shadow-md'
      : 'text-brand-100 hover:bg-brand-800 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-brand-900 text-white h-screen fixed left-0 top-0 flex flex-col z-10">
      <div className="p-6 border-b border-brand-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-helmet-safety text-yellow-400"></i>
          ConstructAI
        </h1>
        <p className="text-xs text-brand-200 mt-1">ERP & Finance System</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold text-brand-400 uppercase mb-2 px-3">Core</p>
          <NavLink to="/" className={linkClass}>
            <i className="fa-solid fa-chart-line w-6"></i>
            Dashboard
          </NavLink>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-brand-400 uppercase mb-2 px-3">Finance Module</p>
          <NavLink to="/finance/dashboard" className={linkClass}>
            <i className="fa-solid fa-coins w-6"></i>
            Financial Overview
          </NavLink>
          <NavLink to="/finance/ledger" className={linkClass}>
            <i className="fa-solid fa-book w-6"></i>
            General Ledger
          </NavLink>
          <NavLink to="/finance/invoices" className={linkClass}>
            <i className="fa-solid fa-file-invoice-dollar w-6"></i>
            AR / AP
          </NavLink>
          <NavLink to="/finance/vendors" className={linkClass}>
            <i className="fa-solid fa-truck-field w-6"></i>
            Vendors
          </NavLink>
          <NavLink to="/finance/customers" className={linkClass}>
            <i className="fa-solid fa-users w-6"></i>
            Customers
          </NavLink>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-brand-400 uppercase mb-2 px-3">Administration</p>
          <NavLink to="/admin/users" className={linkClass}>
            <i className="fa-solid fa-users-gear w-6"></i>
            User Management
          </NavLink>
          <NavLink to="/admin/logs" className={linkClass}>
            <i className="fa-solid fa-shield-halved w-6"></i>
            Audit Logs
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-brand-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center">
            <i className="fa-solid fa-user text-lg"></i>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-brand-300 truncate">{user?.role || 'Guest'}</p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.hash = '/login'; // Using HashRouter
          }}
          className="w-full py-2 px-3 bg-brand-800 hover:bg-brand-700 rounded text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>
    </aside >
  );
};

export default Sidebar;
