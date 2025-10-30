
import React, { useEffect } from 'react';
import CheckIcon from './icons/CheckIcon';

interface SuccessPopupProps {
    message: string;
    onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Popup disappears after 3 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-3 px-6 rounded-lg shadow-xl flex items-center animate-bounce">
            <CheckIcon className="w-5 h-5 mr-2" />
            <span>{message}</span>
        </div>
    );
};

export default SuccessPopup;
