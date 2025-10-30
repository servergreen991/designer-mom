import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Measurements, Fabric, Design, Sex, SleeveType } from '../../types';
import { generateDesignViews, editDressDesign } from '../../services/geminiService';
import SpinnerIcon from '../../components/icons/SpinnerIcon';
import EditIcon from '../../components/icons/EditIcon';

type Step = 1 | 2 | 3 | 4;

const DressDesign: React.FC = () => {
    const { fabrics, designs, addOrder } = useAppContext();
    const [step, setStep] = useState<Step>(1);
    const [measurements, setMeasurements] = useState<Measurements>({
        designFor: 'Self', age: 30, sex: 'female', height: 165, shoulder: 40,
        chest: 88, waist: 72, dressLength: 120, sleeveType: 'full', handRound: 25, handLength: 58
    });
    const [selectedFabrics, setSelectedFabrics] = useState<Fabric[]>([]);
    const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
    const [generatedDesigns, setGeneratedDesigns] = useState<string[]>([]);
    const [finalChoice, setFinalChoice] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editPrompt, setEditPrompt] = useState('');

    const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMeasurements(prev => ({ ...prev, [name]: name === 'age' || name.includes('Length') || name.includes('Round') || name.includes('height') || name.includes('shoulder') || name.includes('chest') || name.includes('waist') ? parseFloat(value) : value }));
    };

    const toggleFabric = (fabric: Fabric) => {
        setSelectedFabrics(prev => {
            if (prev.find(f => f.id === fabric.id)) {
                return prev.filter(f => f.id !== fabric.id);
            }
            return prev.length < 3 ? [...prev, fabric] : prev;
        });
    };
    
    const handleGenerate = async () => {
        if (!selectedDesign || selectedFabrics.length === 0) {
            alert("Please select a design and at least one fabric.");
            return;
        }
        setIsLoading(true);
        setGeneratedDesigns([]);
        try {
            const results = await generateDesignViews(measurements, selectedFabrics, selectedDesign);
            setGeneratedDesigns(results);
            setStep(3);
        } catch (error) {
            alert("Failed to generate designs. Please check your API key and try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleEditDesign = async (index: number) => {
        if (!editPrompt.trim()) return;
        setIsLoading(true);
        const originalImage = generatedDesigns[index];
        try {
            const newImage = await editDressDesign(originalImage, editPrompt);
            setGeneratedDesigns(prev => {
                const newDesigns = [...prev];
                newDesigns[index] = newImage;
                return newDesigns;
            });
            setEditingIndex(null);
            setEditPrompt('');
        } catch(error) {
            alert("Failed to edit design.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitOrder = () => {
        if (!finalChoice || !selectedDesign) return;
        addOrder({
            measurements,
            selectedFabrics,
            selectedDesign,
            generatedDesigns,
            finalChoiceUrl: finalChoice
        });
        alert('Your design has been submitted successfully! You can check its status in "My Order Status".');
        // Reset state
        setStep(1);
        setMeasurements({
            designFor: 'Self', age: 30, sex: 'female', height: 165, shoulder: 40,
            chest: 88, waist: 72, dressLength: 120, sleeveType: 'full', handRound: 25, handLength: 58
        });
        setSelectedFabrics([]);
        setSelectedDesign(null);
        setGeneratedDesigns([]);
        setFinalChoice(null);
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Measurements
                return (
                    <div>
                        <h3 className="text-xl font-serif text-text-main mb-4">Step 1: Your Measurements</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(measurements).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-text-light capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    {key === 'sex' ? (
                                        <select name={key} value={value} onChange={handleMeasurementChange} className="mt-1 w-full p-2 border rounded-md">
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                            <option value="other">Other</option>
                                        </select>
                                    ) : key === 'sleeveType' ? (
                                         <select name={key} value={value} onChange={handleMeasurementChange} className="mt-1 w-full p-2 border rounded-md">
                                            <option value="full">Full</option>
                                            <option value="half">Half</option>
                                            <option value="none">None</option>
                                        </select>
                                    ) : (
                                        <input type={typeof value === 'number' ? 'number' : 'text'} name={key} value={value} onChange={handleMeasurementChange} className="mt-1 w-full p-2 border rounded-md" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 2: // Selection
                return (
                    <div>
                        <h3 className="text-xl font-serif text-text-main mb-4">Step 2: Select Fabrics & Design Style</h3>
                        <div className="mb-8">
                            <h4 className="font-semibold mb-2">Choose up to 3 Fabrics:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {fabrics.map(fabric => (
                                    <div key={fabric.id} onClick={() => toggleFabric(fabric)} className={`cursor-pointer border-4 rounded-lg overflow-hidden ${selectedFabrics.find(f => f.id === fabric.id) ? 'border-accent' : 'border-transparent'}`}>
                                        <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-24 object-cover" />
                                        <p className="p-2 text-center text-sm font-medium bg-gray-50">{fabric.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                             <h4 className="font-semibold mb-2">Choose 1 Design Style:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {designs.map(design => (
                                    <div key={design.id} onClick={() => setSelectedDesign(design)} className={`cursor-pointer border-4 rounded-lg overflow-hidden ${selectedDesign?.id === design.id ? 'border-accent' : 'border-transparent'}`}>
                                        <img src={design.imageUrl} alt={design.name} className="w-full h-32 object-cover" />
                                        <p className="p-2 text-center text-sm font-medium bg-gray-50">{design.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 3: // AI Generation
                 const viewLabels = ["Front View", "Back View", "Detail Shot", "Lifestyle View"];
                 return (
                    <div>
                        <h3 className="text-xl font-serif text-text-main mb-4">Step 3: Review Your Design From Every Angle</h3>
                        <p className="text-text-light mb-4">Our AI has generated these views of your design. Select your favorite as the final version, or edit any of them to perfection.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {generatedDesigns.map((src, index) => (
                                <div key={index} className={`border-4 rounded-lg p-2 ${finalChoice === src ? 'border-accent' : 'border-transparent'}`}>
                                    <div className="relative">
                                        <img src={src} alt={`Generated Design ${index + 1}`} className="w-full rounded-md shadow-lg" />
                                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                            {viewLabels[index]}
                                        </div>
                                        {isLoading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><SpinnerIcon className="w-12 h-12 text-accent"/></div>}
                                    </div>
                                    <div className="mt-2 space-y-2">
                                        <div className="flex gap-2">
                                            <button onClick={() => setFinalChoice(src)} className="flex-1 bg-accent text-white py-2 rounded-md hover:bg-opacity-90">Select This</button>
                                            <button onClick={() => setEditingIndex(editingIndex === index ? null : index)} className={`p-2 rounded-md ${editingIndex === index ? 'bg-primary text-accent' : 'bg-gray-200'}`}><EditIcon className="w-5 h-5"/></button>
                                        </div>
                                        {editingIndex === index && (
                                            <div className="flex gap-2">
                                                <input type="text" value={editPrompt} onChange={e => setEditPrompt(e.target.value)} placeholder="e.g., make the sleeves shorter" className="flex-grow p-2 border rounded-md" />
                                                <button onClick={() => handleEditDesign(index)} className="bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600">Edit</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 4: // Submission
                return null;
        }
    };

    return (
        <div className="p-6 bg-secondary min-h-full">
            <h2 className="text-3xl font-serif text-accent mb-6">Create Your Custom Dress</h2>
            <div className="bg-white p-8 rounded-lg shadow-md">
                {isLoading && step !== 3 ? (
                    <div className="text-center p-12">
                        <SpinnerIcon className="w-16 h-16 text-accent mx-auto mb-4"/>
                        <p className="text-lg text-text-main font-semibold animate-pulse">Our AI is rendering your design from every angle...</p>
                        <p className="text-text-light">This might take a moment.</p>
                    </div>
                ) : (
                    renderStep()
                )}
                
                <div className="mt-8 pt-6 border-t flex justify-between items-center">
                    {step > 1 && (
                        <button onClick={() => setStep(prev => prev - 1 as Step)} className="bg-gray-300 text-text-main font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Back</button>
                    )}
                    <div className="flex-grow"></div>
                    {step < 3 && (
                        <button onClick={() => {
                            if (step === 2) handleGenerate();
                            else setStep(prev => prev + 1 as Step);
                        }} className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90"
                        disabled={(step === 2 && (!selectedDesign || selectedFabrics.length === 0))}>
                           {step === 1 ? 'Next' : 'Create Dress'}
                        </button>
                    )}
                    {step === 3 && (
                        <button onClick={handleSubmitOrder} disabled={!finalChoice} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Submit Final Design
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DressDesign;