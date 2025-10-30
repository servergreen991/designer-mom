
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import LogoutIcon from './icons/LogoutIcon';

interface HeaderProps {
    toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const { appSettings, currentUser, logout } = useAppContext();

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                         <button
                            onClick={toggleSidebar}
                            className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden mr-4"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <img src={appSettings.logo} alt="Logo" className="h-10 w-10 rounded-full" />
                        <h1 className="ml-3 text-2xl font-serif text-accent">{appSettings.appName}</h1>
                    </div>
                    <div className="flex items-center">
                        <div className="text-right mr-4">
                            <p className="font-semibold text-text-main">{currentUser?.name || currentUser?.email}</p>
                            <p className="text-sm text-text-light capitalize">{currentUser?.role}</p>
                        </div>
                        {currentUser?.avatar && <img src={currentUser.avatar} alt="Avatar" className="h-10 w-10 rounded-full mr-4" />}
                        <button
                            onClick={logout}
                            className="p-2 rounded-full text-text-light hover:bg-secondary hover:text-accent transition-colors"
                            title="Logout"
                        >
                            <LogoutIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
