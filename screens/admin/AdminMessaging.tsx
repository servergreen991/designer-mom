
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import SuccessPopup from '../../components/SuccessPopup';

const AdminMessaging: React.FC = () => {
    const { users, addMessage } = useAppContext();
    const [recipient, setRecipient] = useState('all_users');
    const [messageText, setMessageText] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.trim()) {
            addMessage({
                senderId: 'user_admin',
                recipientId: recipient,
                text: messageText,
            });
            setMessageText('');
            setShowSuccess(true);
        }
    };

    return (
        <div className="p-6 bg-secondary min-h-full">
            {showSuccess && <SuccessPopup message="Message sent successfully!" onClose={() => setShowSuccess(false)} />}
            <h2 className="text-3xl font-serif text-accent mb-6">Send Message</h2>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto space-y-6">
                <div>
                    <label htmlFor="recipient" className="block text-sm font-medium text-text-light mb-1">Recipient</label>
                    <select
                        id="recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-3 py-2 bg-secondary/50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                    >
                        <option value="all_users">Broadcast to All Users</option>
                        {users.filter(u => u.role === 'user').map(user => (
                            <option key={user.id} value={user.id}>{user.name || user.email}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="messageText" className="block text-sm font-medium text-text-light mb-1">Message</label>
                    <textarea
                        id="messageText"
                        rows={6}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full px-3 py-2 bg-secondary/50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                        required
                    />
                </div>
                
                <div className="flex justify-end">
                    <button type="submit" className="bg-accent text-white font-bold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors">
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminMessaging;
