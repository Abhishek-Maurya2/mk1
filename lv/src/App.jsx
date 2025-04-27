import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthenticationPage from './components/AuthenticationPage';
import ResourcesPage from './components/ResourcesPage';
import AddResourcePage from './components/AddResourcePage';
import SettingsPage from './components/SettingsPage'; // Changed from ProfilePage to SettingsPage
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

// Layout component to include Navbar and Sidebar
const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar className="hidden md:block w-72" />
      <div className="flex flex-col flex-1">
        {/* <Navbar /> */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Component to conditionally render layout
const AppContent = () => {
  const location = useLocation();
  const showLayout = location.pathname !== '/authentication'; // Don't show layout on auth page

  return (
    <>
      {showLayout ? (
        <MainLayout>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/resources" element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            } />
            <Route path="/add-resource" element={
              <ProtectedRoute>
                <AddResourcePage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={ // Changed from /profile to /settings
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            {/* Add other protected routes here */}
          </Routes>
        </MainLayout>
      ) : (
        <Routes>
          <Route path="/authentication" element={<AuthenticationPage />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
