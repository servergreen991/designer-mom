
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const PendingApprovalScreen: React.FC = () => {
    const { currentUser, logout, appSettings } = useAppContext();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 text-center">
            <div className="bg-white p-10 rounded-xl shadow-lg max-w-lg">
                <img src={appSettings.logo} alt="Logo" className="mx-auto h-20 w-20 rounded-full mb-4"/>
                <h1 className="text-3xl font-serif text-accent mb-4">Account Pending Approval</h1>
                <p className="text-text-main mb-2">
                    Hello, <span className="font-semibold">{currentUser?.name || currentUser?.email}</span>!
                </p>
                <p className="text-text-light mb-6">
                    Thank you for registering. Your account is currently awaiting approval from an administrator.
                    You will be able to access your dashboard once your account is approved.
                </p>
                <p className="text-text-light mb-6">
                    If you have any questions, please contact our support at <span className="font-semibold text-accent">{appSettings.helpline}</span>.
                </p>
                <button
                    onClick={logout}
                    className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default PendingApprovalScreen;
