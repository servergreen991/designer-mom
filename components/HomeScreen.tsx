
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const HomeScreen: React.FC = () => {
    const { appSettings, setCurrentView } = useAppContext();

    return (
        <div 
            className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 text-center"
            style={{ backgroundImage: "url('https://picsum.photos/seed/fashionbg/1920/1080')" }}
        >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 bg-white/20 backdrop-blur-sm p-8 md:p-16 rounded-xl shadow-2xl">
                <img src={appSettings.logo} alt="Logo" className="mx-auto h-24 w-24 rounded-full mb-4 border-4 border-white shadow-lg" />
                <h1 className="text-5xl md:text-7xl font-serif text-white mb-2 drop-shadow-md">{appSettings.appName}</h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-sm">
                    Where your dream dress comes to life with a touch of AI magic.
                    Personalized, perfect, and uniquely yours.
                </p>
                <button
                    onClick={() => setCurrentView('auth')}
                    className="bg-accent text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg"
                >
                    Start Designing
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
