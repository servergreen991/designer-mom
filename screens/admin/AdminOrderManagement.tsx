
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Order, OrderStatus, Message } from '../../types';
import CloseIcon from '../../components/icons/CloseIcon';
import SuccessPopup from '../../components/SuccessPopup';

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'approved': return 'bg-blue-100 text-blue-800';
        case 'in_progress': return 'bg-indigo-100 text-indigo-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'denied': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const AdminOrderManagement: React.FC = () => {
    const { orders, users, messages, updateOrder, addMessage } = useAppContext();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleUpdateStatus = (status: OrderStatus, statusMessage: string) => {
        if (selectedOrder) {
            const updatedOrder = {
                ...selectedOrder,
                status,
                statusUpdates: [...selectedOrder.statusUpdates, { message: statusMessage, timestamp: new Date().toISOString() }]
            };
            updateOrder(updatedOrder);
            setSelectedOrder(updatedOrder);
            setSuccessMessage(`Order status updated to ${status.replace('_', ' ')}!`);
        }
    };

    const handleSendMessage = () => {
        if (selectedOrder && newMessage.trim()) {
            addMessage({
                senderId: 'user_admin',
                recipientId: selectedOrder.userId,
                orderId: selectedOrder.id,
                text: newMessage,
            });
            setNewMessage('');
            setSuccessMessage('Message sent!');
        }
    };

    const orderMessages = selectedOrder ? messages.filter(m => m.orderId === selectedOrder.id) : [];

    return (
        <div className="p-6 bg-secondary min-h-full">
             {successMessage && <SuccessPopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            <h2 className="text-3xl font-serif text-accent mb-6">Order Management</h2>
            
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => {
                            const customer = users.find(u => u.id === order.userId);
                            return (
                                <tr key={order.id} className="border-b hover:bg-secondary/50">
                                    <td className="p-3 font-mono text-sm">{order.id.slice(-8)}</td>
                                    <td className="p-3">{customer?.name || customer?.email}</td>
                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(order.status)}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button onClick={() => setSelectedOrder(order)} className="text-accent font-semibold hover:underline">View Details</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal for Order Details */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-2xl font-serif text-accent">Order Details: {selectedOrder.id.slice(-8)}</h3>
                            <button onClick={() => setSelectedOrder(null)}><CloseIcon /></button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Image and Actions */}
                            <div className="lg:col-span-1 space-y-6">
                                <div>
                                    <h4 className="font-semibold text-text-main mb-2">Final Design</h4>
                                    <img src={selectedOrder.finalChoiceUrl} alt="Final Design" className="w-full rounded-lg shadow-md" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-main mb-2">Update Status</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => handleUpdateStatus('approved', 'Order approved by admin.')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Approve</button>
                                        <button onClick={() => handleUpdateStatus('denied', 'Order denied by admin.')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Deny</button>
                                        <button onClick={() => handleUpdateStatus('in_progress', 'Work has started on the order.')} className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600">In Progress</button>
                                        <button onClick={() => handleUpdateStatus('completed', 'Order completed and ready for dispatch.')} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Complete</button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Middle Column: Details and Messages */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><strong className="text-text-light">Design:</strong> {selectedOrder.selectedDesign.name}</div>
                                    <div><strong className="text-text-light">Fabrics:</strong> {selectedOrder.selectedFabrics.map(f => f.name).join(', ')}</div>
                                    <div className="col-span-2"><strong className="text-text-light">Measurements:</strong> 
                                        {Object.entries(selectedOrder.measurements).map(([key, value]) => `${key}: ${value}`).join(' | ')}
                                    </div>
                                </div>
                                
                                {/* Status Timeline */}
                                <div>
                                    <h4 className="font-semibold text-text-main mb-3">Status Timeline</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.statusUpdates.map((update, index) => (
                                            <div key={index} className="flex items-start text-sm">
                                                <div className="w-4 h-4 bg-primary rounded-full mt-1 mr-3 flex-shrink-0"></div>
                                                <div>
                                                    <p className="font-medium text-text-main">{update.message}</p>
                                                    <p className="text-xs text-text-light">{new Date(update.timestamp).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Messaging */}
                                <div>
                                    <h4 className="font-semibold text-text-main mb-2">Communication</h4>
                                    <div className="h-40 overflow-y-auto bg-secondary/50 p-3 rounded-md space-y-2 mb-2">
                                        {orderMessages.map((msg: Message) => (
                                            <div key={msg.id} className={`p-2 rounded-lg text-sm ${msg.senderId === 'user_admin' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                                                {msg.text}
                                            </div>
                                        ))}
                                        {orderMessages.length === 0 && <p className="text-center text-text-light text-sm">No messages for this order yet.</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-grow px-3 py-2 border rounded-md" />
                                        <button onClick={handleSendMessage} className="bg-accent text-white px-4 rounded-md hover:bg-opacity-90">Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderManagement;
