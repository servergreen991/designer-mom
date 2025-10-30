
import React from 'react';

export interface NavItem {
    label: string;
    view: string;
    icon?: React.ReactNode;
}

interface SidebarProps {
    navItems: NavItem[];
    activeView: string;
    setActiveView: (view: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activeView, setActiveView, isOpen, setIsOpen }) => {
    const handleItemClick = (view: string) => {
        setActiveView(view);
        if (window.innerWidth < 768) { // md breakpoint
            setIsOpen(false);
        }
    }
    return (
        <>
            <aside className={`fixed md:relative z-30 inset-y-0 left-0 w-64 bg-primary text-white/90 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="p-4">
                    <h2 className="text-2xl font-semibold font-serif text-white">Dashboard</h2>
                </div>
                <nav className="mt-6">
                    {navItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => handleItemClick(item.view)}
                            className={`w-full text-left flex items-center py-3 px-6 transition-colors duration-200 ${
                                activeView === item.view
                                    ? 'bg-accent text-white'
                                    : 'hover:bg-primary/50 hover:text-white'
                            }`}
                        >
                            {item.icon && <span className="mr-3">{item.icon}</span>}
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Sidebar;
