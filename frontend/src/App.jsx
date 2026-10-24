import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/shared/Navbar';
import { Landing } from './pages/Landing';
import { ClientPortal } from './pages/ClientPortal';
import { StaffDashboard } from './pages/StaffDashboard';
import { LiveDemoSimulator } from './pages/LiveDemoSimulator';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-brand-500 selection:text-white">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/client" element={<ClientPortal />} />
              <Route path="/dashboard" element={<StaffDashboard />} />
              <Route path="/demo" element={<LiveDemoSimulator />} />
            </Routes>
          </main>
          <AuthModal />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
