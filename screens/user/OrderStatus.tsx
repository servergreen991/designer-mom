
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Order, OrderStatus } from '../../types';

const getStatusPill = (status: OrderStatus) => {
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full capitalize";
    switch (status) {
        case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'approved': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'in_progress': return `${baseClasses} bg-indigo-100 text-indigo-800`;
        case 'completed': return `${baseClasses} bg-green-100 text-green-800`;
        case 'denied': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
};

const OrderStatus: React.FC = () => {
    const { orders, currentUser } = useAppContext();
    const userOrders = orders.filter(o => o.userId === currentUser?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="p-6 bg-secondary min-h-full">
            <h2 className="text-3xl font-serif text-accent mb-6">My Order Status</h2>
            
            {userOrders.length > 0 ? (
                <div className="space-y-6">
                    {userOrders.map((order: Order) => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-text-main">Order #{order.id.slice(-8)}</h3>
                                    <p className="text-sm text-text-light">
                                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className={getStatusPill(order.status)}>{order.status.replace('_', ' ')}</div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <img src={order.finalChoiceUrl} alt="Final Dress Design" className="w-full h-auto rounded-lg shadow"/>
                                </div>
                                <div className="md:col-span-2">
                                    <h4 className="font-semibold text-text-main mb-3">Order Progress</h4>
                                    <div className="relative pl-4">
                                        {/* Timeline line */}
                                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/50"></div>
                                        
                                        {order.statusUpdates.slice().reverse().map((update, index) => (
                                            <div key={index} className="relative mb-4">
                                                <div className="absolute left-[-9px] top-1.5 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                                                <div className="ml-6">
                                                    <p className="font-medium text-text-main">{update.message}</p>
                                                    <p className="text-xs text-text-light">{new Date(update.timestamp).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-12 rounded-lg shadow-md">
                    <p className="text-xl text-text-light">You haven't placed any orders yet.</p>
                    <p className="mt-2 text-text-light">Start creating your dream dress today!</p>
                </div>
            )}
        </div>
    );
};

export default OrderStatus;
