
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { User, UserRole } from '../../types';
import CloseIcon from '../../components/icons/CloseIcon';
import DeleteIcon from '../../components/icons/DeleteIcon';
import SuccessPopup from '../../components/SuccessPopup';

const AdminUserManagement: React.FC = () => {
    const { users, currentUser, updateUser, addUser, deleteUser, orders } = useAppContext();
    const [showAddStaffForm, setShowAddStaffForm] = useState(false);
    const [newStaff, setNewStaff] = useState({ email: '', password: '', role: 'tailor' as UserRole, name: '' });
    const [successMessage, setSuccessMessage] = useState('');

    const handleApproveUser = (user: User) => {
        updateUser({ ...user, approved: true });
        setSuccessMessage('User approved successfully!');
    };
    
    const handleDeleteUser = (userId: string) => {
        const userHasOrders = orders.some(order => order.userId === userId);
        if (userHasOrders) {
            alert("This user cannot be deleted because they have existing orders. Please resolve their orders first.");
            return;
        }

        if(window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            deleteUser(userId);
            setSuccessMessage('User deleted successfully!');
        }
    };
    
    const handleAddStaffSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({
            ...newStaff,
            id: `user_${Date.now()}`,
            approved: true,
        });
        setShowAddStaffForm(false);
        setNewStaff({ email: '', password: '', role: 'tailor', name: '' });
        setSuccessMessage('Staff member added successfully!');
    };

    const roles: UserRole[] = ['manager', 'tailor', 'sales man'];

    return (
        <div className="p-6 bg-secondary min-h-full">
            {successMessage && <SuccessPopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-serif text-accent">User Management</h2>
                {currentUser?.role === 'admin' && (
                    <button onClick={() => setShowAddStaffForm(true)} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                        Add Staff User
                    </button>
                )}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email / Mobile</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b hover:bg-secondary/50">
                                <td className="p-3 font-semibold">{user.name || 'N/A'}</td>
                                <td className="p-3">{user.email}{user.mobile && ` / ${user.mobile}`}</td>
                                <td className="p-3 capitalize">{user.role.replace('_', ' ')}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {user.approved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="p-3 flex items-center gap-2">
                                    {!user.approved && (
                                        <button onClick={() => handleApproveUser(user)} className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600">Approve</button>
                                    )}
                                    {currentUser?.role === 'admin' && user.role !== 'admin' && (
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 p-1 rounded-full hover:bg-red-100">
                                            <DeleteIcon className="w-5 h-5"/>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add Staff Form */}
            {showAddStaffForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleAddStaffSubmit} className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-serif text-accent">Add New Staff Member</h3>
                            <button type="button" onClick={() => setShowAddStaffForm(false)}><CloseIcon /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <input type="text" placeholder="Full Name" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} className="w-full p-2 border rounded" required />
                            <input type="email" placeholder="Email Address" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} className="w-full p-2 border rounded" required />
                            <input type="password" placeholder="Password" value={newStaff.password} onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} className="w-full p-2 border rounded" required />
                            <select value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value as UserRole})} className="w-full p-2 border rounded">
                                {roles.map(role => <option key={role} value={role} className="capitalize">{role.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end">
                            <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90">Add Staff</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagement;
