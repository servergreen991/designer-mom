
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar, { NavItem } from '../components/Sidebar';
import UserProfile from './user/UserProfile';
import DressDesign from './user/DressDesign';
import UserMessages from './user/UserMessages';
import AdvancePay from './user/AdvancePay';
import OrderStatus from './user/OrderStatus';
import Feedback from './user/Feedback';

const UserDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('design');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const navItems: NavItem[] = [
        { label: 'Profile', view: 'profile' },
        { label: 'Dress Design', view: 'design' },
        { label: 'Messages', view: 'messages' },
        { label: 'Advance Pay', view: 'pay' },
        { label: 'My Order Status', view: 'status' },
        { label: 'Feedback', view: 'feedback' },
    ];
    
    const renderContent = () => {
        switch (activeView) {
            case 'profile':
                return <UserProfile />;
            case 'design':
                return <DressDesign />;
            case 'messages':
                return <UserMessages />;
            case 'pay':
                return <AdvancePay />;
            case 'status':
                return <OrderStatus />;
            case 'feedback':
                return <Feedback />;
            default:
                return <DressDesign />;
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

export default UserDashboard;
