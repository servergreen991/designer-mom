
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Header from '../components/Header';
import Sidebar, { NavItem } from '../components/Sidebar';
import AdminOrderManagement from './admin/AdminOrderManagement';
import AdminUserManagement from './admin/AdminUserManagement';
import AdminContentManagement from './admin/AdminContentManagement';
import AdminMessaging from './admin/AdminMessaging';
import AdminBranding from './admin/AdminBranding';

const AdminDashboard: React.FC = () => {
    const { currentUser } = useAppContext();
    const [activeView, setActiveView] = useState('orders');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const navItems: NavItem[] = [
        { label: 'Order Management', view: 'orders' },
        { label: 'User Management', view: 'users' },
    ];

    if (currentUser?.role === 'admin' || currentUser?.role === 'manager') {
        navItems.push({ label: 'Content Management', view: 'content' });
        navItems.push({ label: 'Messaging', view: 'messaging' });
    }

    if (currentUser?.role === 'admin') {
        navItems.push({ label: 'Branding & Settings', view: 'branding' });
    }


    const renderContent = () => {
        switch (activeView) {
            case 'orders':
                return <AdminOrderManagement />;
            case 'users':
                return <AdminUserManagement />;
            case 'content':
                return <AdminContentManagement />;
            case 'messaging':
                return <AdminMessaging />;
            case 'branding':
                return <AdminBranding />;
            default:
                return <AdminOrderManagement />;
        }
    };

    return (
        <div className="flex h-screen bg-secondary">
            <Sidebar 
                navItems={navItems} 
                activeView={activeView} 
                setActiveView={setActiveView} 
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
