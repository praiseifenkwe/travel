import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/shared/Navbar';
import { Landing } from './pages/Landing';
import { ClientPortal } from './pages/ClientPortal';
import { StaffDashboard } from './pages/StaffDashboard';
import { LiveDemoSimulator } from './pages/LiveDemoSimulator';
import { useSocket } from './hooks/useSocket';

export default function App() {
  const { isConnected } = useSocket();

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar isConnected={isConnected} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/client" element={<ClientPortal />} />
            <Route path="/dashboard" element={<StaffDashboard />} />
            <Route path="/demo" element={<LiveDemoSimulator />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
