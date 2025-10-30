import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User, Fabric, Design, Order, Message, AppSettings, Theme, Feedback, Measurements, OrderStatus } from '../types';

// Mock Data Module
const createMockData = () => {
    const initialTheme: Theme = { primary: '#E8B4B8', secondary: '#F5F5DC', accent: '#8B4B8C' };
    const initialAppSettings: AppSettings = {
        appName: 'Designer Mom',
        logo: 'https://picsum.photos/seed/logo/100/100',
        helpline: '+91-9876543210',
        copyright: '© 2024 Designer Mom Inc.',
        upiId: 'designer.mom@bank',
        qrCodeUrl: 'https://picsum.photos/seed/qrcode/200/200',
    };

    const initialUsers: User[] = [
        { id: 'user_admin', email: 'admin', password: 'admin', role: 'admin', name: 'Admin User', approved: true, avatar: 'https://i.pravatar.cc/150?u=admin' },
        { id: 'user_manager', email: 'manager@dm.com', password: 'password', role: 'manager', name: 'Store Manager', approved: true, avatar: 'https://i.pravatar.cc/150?u=manager' },
        { id: 'user_tailor', email: 'tailor@dm.com', password: 'password', role: 'tailor', name: 'Master Tailor', approved: true, avatar: 'https://i.pravatar.cc/150?u=tailor' },
        { id: 'user_approved', email: 'user@dm.com', password: 'password', role: 'user', name: 'Aaradhya Sharma', approved: true, avatar: 'https://i.pravatar.cc/150?u=user' },
        { id: 'user_pending', email: 'pending@dm.com', password: 'password', role: 'user', name: 'Priya Patel', approved: false },
    ];
    
    const initialFabrics: Fabric[] = [];
    
    const initialDesigns: Design[] = [];

    const initialOrders: Order[] = [];

    const initialMessages: Message[] = [
        { id: 'msg_1', senderId: 'user_admin', recipientId: 'all_users', text: 'Welcome to Designer Mom! Our new collection is now live.', timestamp: new Date().toISOString() },
    ];

    return { users: initialUsers, fabrics: initialFabrics, designs: initialDesigns, orders: initialOrders, messages: initialMessages, appSettings: initialAppSettings, theme: initialTheme };
};

export const mockData = createMockData();

// Define the shape of the context
interface AppContextType {
    currentUser: User | null;
    users: User[];
    fabrics: Fabric[];
    designs: Design[];
    orders: Order[];
    messages: Message[];
    feedback: Feedback[];
    appSettings: AppSettings;
    theme: Theme;
    currentView: 'home' | 'auth';
    
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    register: (email: string, pass: string) => boolean;
    
    updateUser: (user: User) => void;
    addUser: (user: User) => void;
    deleteUser: (userId: string) => void;
    
    addFabric: (fabric: Omit<Fabric, 'id'>) => void;
    deleteFabric: (fabricId: string) => void;
    
    addDesign: (design: Omit<Design, 'id'>) => void;
    deleteDesign: (designId: string) => void;
    
    addOrder: (orderData: { measurements: Measurements; selectedFabrics: Fabric[]; selectedDesign: Design; generatedDesigns: string[]; finalChoiceUrl: string; }) => void;
    updateOrder: (order: Order) => void;
    
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    addFeedback: (feedbackText: string) => void;
    
    setAppSettings: (settings: AppSettings) => void;
    setTheme: (theme: Theme) => void;
    setCurrentView: (view: 'home' | 'auth') => void;
    importData: (data: string) => boolean;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useLocalStorage<User[]>('dm_users', mockData.users);
    const [fabrics, setFabrics] = useLocalStorage<Fabric[]>('dm_fabrics', mockData.fabrics);
    const [designs, setDesigns] = useLocalStorage<Design[]>('dm_designs', mockData.designs);
    const [orders, setOrders] = useLocalStorage<Order[]>('dm_orders', mockData.orders);
    const [messages, setMessages] = useLocalStorage<Message[]>('dm_messages', mockData.messages);
    const [feedback, setFeedback] = useLocalStorage<Feedback[]>('dm_feedback', []);
    const [appSettings, setAppSettings] = useLocalStorage<AppSettings>('dm_appSettings', mockData.appSettings);
    const [theme, setTheme] = useLocalStorage<Theme>('dm_theme', mockData.theme);
    
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = sessionStorage.getItem('dm_currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [currentView, setCurrentView] = useState<'home' | 'auth'>('home');
    
    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem('dm_currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.removeItem('dm_currentUser');
        }
    }, [currentUser]);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-secondary', theme.secondary);
        root.style.setProperty('--color-accent', theme.accent);
    }, [theme]);

    const login = (email: string, pass: string): boolean => {
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        setCurrentView('home');
    };

    const register = (email: string, pass: string): boolean => {
        if (users.some(u => u.email === email)) {
            return false;
        }
        const newUser: User = {
            id: `user_${Date.now()}`,
            email,
            password: pass,
            role: 'user',
            approved: false,
        };
        setUsers(prev => [...prev, newUser]);
        return true;
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    };
    
    const addUser = (user: User) => {
        setUsers(prev => [...prev, user]);
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const addFabric = (fabric: Omit<Fabric, 'id'>) => {
        setFabrics(prev => [...prev, { ...fabric, id: `fab_${Date.now()}` }]);
    };
    
    const deleteFabric = (fabricId: string) => {
        setFabrics(prev => prev.filter(f => f.id !== fabricId));
    };

    const addDesign = (design: Omit<Design, 'id'>) => {
        setDesigns(prev => [...prev, { ...design, id: `des_${Date.now()}` }]);
    };
    
    const deleteDesign = (designId: string) => {
        setDesigns(prev => prev.filter(d => d.id !== designId));
    };
    
    const addOrder = (orderData: { measurements: Measurements; selectedFabrics: Fabric[]; selectedDesign: Design; generatedDesigns: string[]; finalChoiceUrl: string; }) => {
        if (!currentUser) return;
        const newOrder: Order = {
            id: `ord_${Date.now()}`,
            userId: currentUser.id,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            statusUpdates: [{ message: 'Order placed by customer.', timestamp: new Date().toISOString() }]
        };
        setOrders(prev => [...prev, newOrder]);
    };

    const updateOrder = (updatedOrder: Order) => {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    };

    const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
        setMessages(prev => [...prev, { ...message, id: `msg_${Date.now()}`, timestamp: new Date().toISOString() }]);
    };

    const addFeedback = (feedbackText: string) => {
        if (!currentUser) return;
        const newFeedback: Feedback = {
            id: `fb_${Date.now()}`,
            userId: currentUser.id,
            text: feedbackText,
            timestamp: new Date().toISOString(),
        };
        setFeedback(prev => [...prev, newFeedback]);
    };

    const importData = (data: string): boolean => {
        try {
            const parsedData = JSON.parse(data);
            if (!parsedData.users || !parsedData.fabrics || !parsedData.designs || !parsedData.orders || !parsedData.messages || !parsedData.feedback || !parsedData.appSettings || !parsedData.theme) {
                throw new Error("Invalid data file format.");
            }
            setUsers(parsedData.users);
            setFabrics(parsedData.fabrics);
            setDesigns(parsedData.designs);
            setOrders(parsedData.orders);
            setMessages(parsedData.messages);
            setFeedback(parsedData.feedback);
            setAppSettings(parsedData.appSettings);
            setTheme(parsedData.theme);
            // Log out current user to prevent inconsistent state
            logout();
            return true;
        } catch (error) {
            console.error("Failed to import data:", error);
            alert(`Failed to import data. Please check the file format. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        }
    };

    const value = {
        currentUser, users, fabrics, designs, orders, messages, feedback, appSettings, theme, currentView,
        login, logout, register,
        updateUser, addUser, deleteUser,
        addFabric, deleteFabric, addDesign, deleteDesign,
        addOrder, updateOrder,
        addMessage, addFeedback,
        setAppSettings, setTheme, setCurrentView,
        importData
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
