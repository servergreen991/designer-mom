
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { AppSettings, Theme } from '../../types';
import SuccessPopup from '../../components/SuccessPopup';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const AdminBranding: React.FC = () => {
    const { appSettings, theme, setAppSettings, setTheme } = useAppContext();
    const [localSettings, setLocalSettings] = useState<AppSettings>(appSettings);
    const [localTheme, setLocalTheme] = useState<Theme>(theme);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSettings({ ...localSettings, [e.target.name]: e.target.value });
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalTheme({ ...localTheme, [e.target.name]: e.target.value });
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const base64 = await fileToBase64(files[0]);
            setLocalSettings({ ...localSettings, [name]: base64 });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAppSettings(localSettings);
        setTheme(localTheme);
        setShowSuccess(true);
    };

    return (
        <div className="p-6 bg-secondary min-h-full">
             {showSuccess && <SuccessPopup message="Settings saved successfully!" onClose={() => setShowSuccess(false)} />}
            <h2 className="text-3xl font-serif text-accent mb-6">Branding & Settings</h2>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-8">
                
                {/* Theme Colors Section */}
                <div>
                    <h3 className="text-xl font-serif text-text-main border-b border-primary pb-2 mb-4">Theme Colors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ColorPicker label="Primary Color" name="primary" value={localTheme.primary} onChange={handleThemeChange} />
                        <ColorPicker label="Secondary Color" name="secondary" value={localTheme.secondary} onChange={handleThemeChange} />
                        <ColorPicker label="Accent Color" name="accent" value={localTheme.accent} onChange={handleThemeChange} />
                    </div>
                </div>

                {/* App Settings Section */}
                <div>
                    <h3 className="text-xl font-serif text-text-main border-b border-primary pb-2 mb-4">Application Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="App Name" name="appName" value={localSettings.appName} onChange={handleSettingsChange} />
                        <Input label="Helpline Number" name="helpline" value={localSettings.helpline} onChange={handleSettingsChange} />
                        <Input label="Copyright Text" name="copyright" value={localSettings.copyright} onChange={handleSettingsChange} />
                        <Input label="UPI ID" name="upiId" value={localSettings.upiId} onChange={handleSettingsChange} />
                    </div>
                </div>

                {/* File Uploads Section */}
                <div>
                    <h3 className="text-xl font-serif text-text-main border-b border-primary pb-2 mb-4">Assets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <FileInput label="Application Logo" name="logo" currentImage={localSettings.logo} onChange={handleFileChange} />
                        <FileInput label="UPI QR Code" name="qrCodeUrl" currentImage={localSettings.qrCodeUrl} onChange={handleFileChange} />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-accent text-white font-bold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

// Helper components for form fields
const Input: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-light mb-1">{label}</label>
        <input type="text" id={name} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 bg-secondary/50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent" />
    </div>
);

const ColorPicker: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-light mb-1">{label}</label>
        <div className="flex items-center space-x-2">
            <input type="color" id={name} name={name} value={value} onChange={onChange} className="w-10 h-10 border-none rounded-md" />
            <span className="font-mono text-sm">{value}</span>
        </div>
    </div>
);

const FileInput: React.FC<{ label: string; name: string; currentImage: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, currentImage, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-text-light mb-2">{label}</label>
        <div className="flex items-center gap-4">
            <img src={currentImage} alt={label} className="w-20 h-20 rounded-md object-cover border border-gray-300" />
            <input type="file" name={name} onChange={onChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/50 file:text-accent hover:file:bg-primary" />
        </div>
    </div>
);

export default AdminBranding;
