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
    const { 
        appSettings, theme, setAppSettings, setTheme, 
        importData, users, fabrics, designs, orders, messages, feedback 
    } = useAppContext();
    const [localSettings, setLocalSettings] = useState<AppSettings>(appSettings);
    const [localTheme, setLocalTheme] = useState<Theme>(theme);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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
        setSuccessMessage('Settings saved successfully!');
        setShowSuccess(true);
    };

    const handleExport = () => {
        const exportData = { users, fabrics, designs, orders, messages, feedback, appSettings, theme };
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `designer_mom_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    if (window.confirm("Importing data will overwrite all current settings and content. This action cannot be undone. Are you sure you want to proceed?")) {
                       if (importData(text)) {
                           setSuccessMessage('Data imported successfully! The page will now reload.');
                           setShowSuccess(true);
                           setTimeout(() => window.location.reload(), 2000);
                       }
                    }
                }
            };
            reader.readAsText(file);
        }
        event.target.value = ''; // Reset file input
    };


    return (
        <div className="p-6 bg-secondary min-h-full">
             {showSuccess && <SuccessPopup message={successMessage} onClose={() => setShowSuccess(false)} />}
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
                
                 {/* Data Management Section */}
                 <div>
                    <h3 className="text-xl font-serif text-text-main border-b border-primary pb-2 mb-4">Data Management</h3>
                    <p className="text-sm text-text-light mb-4">
                        Export all application data (users, orders, content, settings) to a JSON file for backup. 
                        You can store this file securely, for example, in a private GitHub repository. 
                        Importing a backup file will overwrite all existing data.
                    </p>
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={handleExport} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                            Export Data
                        </button>
                        <label className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                            <span>Import Data</span>
                            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                        </label>
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