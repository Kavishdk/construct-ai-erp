import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

const Customers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });

    const fetchCustomers = () => {
        api.get('/finance/customers')
            .then(res => setCustomers(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/finance/customers', newCustomer);
            setNewCustomer({ name: '', email: '', phone: '' });
            fetchCustomers();
        } catch (error) {
            console.error('Failed to add customer', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Customer Management</h1>

            {/* Add Customer Form */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New Customer</h2>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={newCustomer.name}
                            onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={newCustomer.email}
                            onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            value={newCustomer.phone}
                            onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 h-10">
                        Add Customer
                    </button>
                </form>
            </div>

            {/* Customer List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {customers.map(c => (
                            <tr key={c.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{c.email || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{c.phone || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
