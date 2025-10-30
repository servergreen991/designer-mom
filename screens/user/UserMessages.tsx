
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Message } from '../../types';

type Tab = 'orders' | 'announcements';

const UserMessages: React.FC = () => {
    const { currentUser, messages, orders, addMessage } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('orders');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');

    const userOrders = orders.filter(o => o.userId === currentUser?.id);

    const announcements = messages.filter(m => m.recipientId === 'all_users');
    const orderMessages = selectedOrderId ? messages.filter(m => m.orderId === selectedOrderId) : [];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedOrderId && currentUser) {
            addMessage({
                senderId: currentUser.id,
                recipientId: 'user_admin',
                orderId: selectedOrderId,
                text: newMessage,
            });
            setNewMessage('');
        }
    };
    
    return (
        <div className="p-6 bg-secondary min-h-full">
            <h2 className="text-3xl font-serif text-accent mb-6">Messages</h2>
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b">
                    <nav className="flex space-x-4 p-4">
                        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 font-semibold rounded-md ${activeTab === 'orders' ? 'bg-primary text-accent' : 'text-text-light'}`}>Order Messages</button>
                        <button onClick={() => setActiveTab('announcements')} className={`px-4 py-2 font-semibold rounded-md ${activeTab === 'announcements' ? 'bg-primary text-accent' : 'text-text-light'}`}>Announcements</button>
                    </nav>
                </div>
                
                <div className="p-6">
                    {activeTab === 'announcements' && (
                        <div className="space-y-4">
                            {announcements.map((msg: Message) => (
                                <div key={msg.id} className="bg-secondary/70 p-4 rounded-lg">
                                    <p className="text-text-main">{msg.text}</p>
                                    <p className="text-xs text-text-light text-right mt-2">{new Date(msg.timestamp).toLocaleString()}</p>
                                </div>
                            ))}
                            {announcements.length === 0 && <p className="text-text-light">No announcements yet.</p>}
                        </div>
                    )}
                    
                    {activeTab === 'orders' && (
                        <div>
                            <label htmlFor="order-select" className="block text-sm font-medium text-text-light mb-2">Select an order to view messages:</label>
                            <select
                                id="order-select"
                                value={selectedOrderId || ''}
                                onChange={(e) => setSelectedOrderId(e.target.value)}
                                className="w-full p-2 border rounded-md mb-4"
                            >
                                <option value="" disabled>-- Select an Order --</option>
                                {userOrders.map(order => (
                                    <option key={order.id} value={order.id}>Order #{order.id.slice(-8)} - {order.selectedDesign.name}</option>
                                ))}
                            </select>

                            {selectedOrderId && (
                                <div>
                                    <div className="h-80 overflow-y-auto bg-secondary/50 p-4 rounded-lg space-y-4 mb-4">
                                        {orderMessages.map((msg: Message) => (
                                            <div key={msg.id} className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.senderId === currentUser?.id ? 'bg-accent text-white' : 'bg-gray-200 text-text-main'}`}>
                                                    <p>{msg.text}</p>
                                                    <p className="text-xs opacity-70 text-right mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {orderMessages.length === 0 && <p className="text-center text-text-light">No messages for this order yet. Start the conversation!</p>}
                                    </div>
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-grow p-2 border rounded-md"/>
                                        <button type="submit" className="bg-accent text-white px-6 rounded-md hover:bg-opacity-90">Send</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserMessages;
