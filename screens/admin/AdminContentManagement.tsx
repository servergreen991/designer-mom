import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Design, Fabric } from '../../types';
import DeleteIcon from '../../components/icons/DeleteIcon';
import SuccessPopup from '../../components/SuccessPopup';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const AdminContentManagement: React.FC = () => {
    const { fabrics, designs, orders, addFabric, deleteFabric, addDesign, deleteDesign } = useAppContext();
    
    const [newFabricName, setNewFabricName] = useState('');
    const [newFabricImage, setNewFabricImage] = useState<File | null>(null);
    const [newDesignName, setNewDesignName] = useState('');
    const [newDesignImage, setNewDesignImage] = useState<File | null>(null);
    const [successMessage, setSuccessMessage] = useState('');


    const handleAddFabric = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newFabricName && newFabricImage) {
            const imageUrl = await fileToBase64(newFabricImage);
            addFabric({ name: newFabricName, imageUrl });
            setNewFabricName('');
            setNewFabricImage(null);
            (e.target as HTMLFormElement).reset();
            setSuccessMessage('Fabric added successfully!');
        }
    };

    const handleAddDesign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newDesignName && newDesignImage) {
            const imageUrl = await fileToBase64(newDesignImage);
            addDesign({ name: newDesignName, imageUrl });
            setNewDesignName('');
            setNewDesignImage(null);
            (e.target as HTMLFormElement).reset();
            setSuccessMessage('Design added successfully!');
        }
    };

    const handleDeleteFabric = (id: string) => {
        const fabricInUse = orders.some(order => order.selectedFabrics.some(f => f.id === id));
        const confirmationMessage = fabricInUse 
            ? 'This fabric is used in existing orders. Deleting it will not affect those orders, but it will be unavailable for new ones. Are you sure?'
            : 'Are you sure you want to delete this fabric?';

        if(window.confirm(confirmationMessage)) {
            deleteFabric(id);
            setSuccessMessage('Fabric deleted successfully!');
        }
    };

    const handleDeleteDesign = (id: string) => {
        const designInUse = orders.some(order => order.selectedDesign.id === id);
        const confirmationMessage = designInUse
            ? 'This design style is used in existing orders. Deleting it will not affect those orders, but it will be unavailable for new ones. Are you sure?'
            : 'Are you sure you want to delete this design?';

        if(window.confirm(confirmationMessage)) {
            deleteDesign(id);
            setSuccessMessage('Design deleted successfully!');
        }
    };

    return (
        <div className="p-6 bg-secondary min-h-full space-y-8">
            {successMessage && <SuccessPopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            <h2 className="text-3xl font-serif text-accent mb-6">Content Management</h2>

            {/* Fabrics Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-serif text-text-main border-b border-primary pb-2 mb-4">Manage Fabrics</h3>
                <form onSubmit={handleAddFabric} className="mb-6 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow">
                        <label htmlFor="fabricName" className="block text-sm font-medium text-text-light">Fabric Name</label>
                        <input id="fabricName" type="text" value={newFabricName} onChange={e => setNewFabricName(e.target.value)} placeholder="e.g., Silk Brocade" className="mt-1 w-full px-3 py-2 bg-secondary/50 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="flex-grow">
                        <label htmlFor="fabricImage" className="block text-sm font-medium text-text-light">Fabric Image</label>
                        <input id="fabricImage" type="file" onChange={e => setNewFabricImage(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm" accept="image/*" required />
                    </div>
                    <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors whitespace-nowrap">Add Fabric</button>
                </form>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {fabrics.length === 0 && <p className="col-span-full text-center text-text-light">No fabrics uploaded yet.</p>}
                    {fabrics.map((fabric: Fabric) => (
                        <div key={fabric.id} className="relative group border rounded-lg overflow-hidden shadow">
                            <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDeleteFabric(fabric.id)} className="text-white p-2 bg-red-500 rounded-full hover:bg-red-600">
                                    <DeleteIcon className="w-5 h-5"/>
                                </button>
                            </div>
                            <p className="p-2 text-center text-sm font-medium bg-gray-50">{fabric.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Designs Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-serif text-text-main border-b border-primary pb-2 mb-4">Manage Designs</h3>
                <form onSubmit={handleAddDesign} className="mb-6 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow">
                        <label htmlFor="designName" className="block text-sm font-medium text-text-light">Design Name</label>
                        <input id="designName" type="text" value={newDesignName} onChange={e => setNewDesignName(e.target.value)} placeholder="e.g., Anarkali Suit" className="mt-1 w-full px-3 py-2 bg-secondary/50 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="flex-grow">
                        <label htmlFor="designImage" className="block text-sm font-medium text-text-light">Design Image</label>
                        <input id="designImage" type="file" onChange={e => setNewDesignImage(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm" accept="image/*" required />
                    </div>
                    <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors whitespace-nowrap">Add Design</button>
                </form>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {designs.length === 0 && <p className="col-span-full text-center text-text-light">No designs uploaded yet.</p>}
                    {designs.map((design: Design) => (
                         <div key={design.id} className="relative group border rounded-lg overflow-hidden shadow">
                            <img src={design.imageUrl} alt={design.name} className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDeleteDesign(design.id)} className="text-white p-2 bg-red-500 rounded-full hover:bg-red-600">
                                    <DeleteIcon className="w-5 h-5"/>
                                </button>
                            </div>
                            <p className="p-2 text-center text-sm font-medium bg-gray-50">{design.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminContentManagement;