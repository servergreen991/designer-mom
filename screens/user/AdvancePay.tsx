
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

const AdvancePay: React.FC = () => {
    const { appSettings } = useAppContext();

    return (
        <div className="p-6 bg-secondary min-h-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm w-full">
                <h2 className="text-3xl font-serif text-accent mb-4">Advance Payment</h2>
                <p className="text-text-light mb-6">
                    To confirm your order, please make an advance payment using the details below.
                </p>
                <div className="mb-6">
                    <img
                        src={appSettings.qrCodeUrl}
                        alt="UPI QR Code"
                        className="w-48 h-48 mx-auto rounded-lg border-4 border-primary shadow-lg"
                    />
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-text-light text-sm">UPI ID</p>
                    <p className="text-xl font-semibold font-mono text-accent">{appSettings.upiId}</p>
                </div>
                <p className="text-xs text-text-light mt-6">
                    After payment, please share the transaction details with us via the order messaging system.
                </p>
            </div>
        </div>
    );
};

export default AdvancePay;
