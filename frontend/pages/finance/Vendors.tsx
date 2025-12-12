import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Vendor {
    id: number;
    name: string;
    email: string;
    phone: string;
}

const Vendors = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [newVendor, setNewVendor] = useState({ name: '', email: '', phone: '' });

    const fetchVendors = () => {
        api.get('/finance/vendors')
            .then(res => setVendors(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/finance/vendors', newVendor);
            setNewVendor({ name: '', email: '', phone: '' });
            fetchVendors();
        } catch (error) {
            console.error('Failed to add vendor', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Vendor Management</h1>

            {/* Add Vendor Form */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New Vendor</h2>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={newVendor.name}
                            onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={newVendor.email}
                            onChange={e => setNewVendor({ ...newVendor, email: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            value={newVendor.phone}
                            onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 h-10">
                        Add Vendor
                    </button>
                </form>
            </div>

            {/* Vendor List */}
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
                        {vendors.map(v => (
                            <tr key={v.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{v.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{v.email || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{v.phone || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Vendors;
