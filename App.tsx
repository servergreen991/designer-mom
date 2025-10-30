import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import HomeScreen from './components/HomeScreen';
import AuthScreen from './components/AuthScreen';
import PendingApprovalScreen from './components/PendingApprovalScreen';
import UserDashboard from './screens/UserDashboard';
import AdminDashboard from './screens/AdminDashboard';

const AppContent = () => {
  const { currentUser, currentView } = useAppContext();

  if (!currentUser) {
    return currentView === 'home' ? <HomeScreen /> : <AuthScreen />;
  }

  if (currentUser.role === 'user' && !currentUser.approved) {
    return <PendingApprovalScreen />;
  }
  
  if (currentUser.role === 'user' && currentUser.approved) {
    return <UserDashboard />;
  }

  if (currentUser.role !== 'user' && currentUser.approved) {
      return <AdminDashboard />;
  }

  // Fallback, though should not be reached with proper logic
  return <HomeScreen />;
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
