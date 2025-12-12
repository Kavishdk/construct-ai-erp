import React, { useEffect, useState } from 'react';
import { User, UserRole } from '../../types';
import api from '../../services/api';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const openEdit = (user: User) => {
    setEditingUser(user);
    const formDiv = document.getElementById('addUserForm');
    formDiv?.classList.remove('hidden');

    // Pre-fill form (simple approach, React Hook Form is better but this works for vanilla JS logic in React)
    setTimeout(() => {
      const form = formDiv?.querySelector('form') as HTMLFormElement;
      if (form) {
        (form.elements.namedItem('name') as HTMLInputElement).value = user.name;
        (form.elements.namedItem('email') as HTMLInputElement).value = user.email;
        (form.elements.namedItem('role') as HTMLSelectElement).value = user.role;
        // Password left blank as placeholder
      }
    }, 0);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500 text-sm">Manage system access and roles.</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            document.getElementById('addUserForm')?.classList.toggle('hidden');
            (document.querySelector('#addUserForm form') as HTMLFormElement)?.reset();
          }}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700"
        >
          <i className="fa-solid fa-user-plus mr-2"></i> Add User
        </button>
      </div>

      <div id="addUserForm" className="hidden bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
        <h3 className="text-lg font-bold mb-4">{editingUser ? 'Edit User' : 'Create New User'}</h3>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const data = new FormData(form);
          const body = Object.fromEntries(data.entries());

          // Remove empty password if editing so it doesn't overwrite with blank
          if (editingUser && !body.password) delete body.password;

          try {
            if (editingUser) {
              await api.put(`/admin/users/${editingUser.id}`, body);
              alert("User updated successfully");
            } else {
              await api.post('/admin/users', body);
              alert("User created successfully");
            }
            form.reset();
            setEditingUser(null);
            form.closest('div')?.classList.add('hidden');
            api.get('/admin/users').then(res => setUsers(res.data));
          } catch (err) { console.error(err); alert("Failed to save user"); }
        }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" required className="border p-2 rounded" />
          <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />
          <input name="password" type="password" placeholder={editingUser ? "Password (leave blank to keep)" : "Password"} required={!editingUser} className="border p-2 rounded" />
          <select name="role" className="border p-2 rounded">
            <option value="ADMIN">Admin</option>
            <option value="FINANCE_MANAGER">Finance Manager</option>
            <option value="PROJECT_MANAGER">Project Manager</option>
          </select>
          <div className="col-span-1 md:col-span-2 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editingUser ? 'Update User' : 'Create User'}</button>
            <button type="button" onClick={() => {
              setEditingUser(null);
              document.getElementById('addUserForm')?.classList.add('hidden');
            }} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs border border-slate-200">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(user)} className="text-brand-600 hover:text-brand-800 text-sm font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default UserManagement;
