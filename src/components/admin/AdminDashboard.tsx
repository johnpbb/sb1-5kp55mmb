import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import EventsManager from './EventsManager';
import TicketsManager from './TicketsManager';
import PaymentSettings from './PaymentSettings';
import { useAdmin } from '../../contexts/AdminContext';

export default function AdminDashboard() {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="events" element={<EventsManager />} />
          <Route path="tickets" element={<TicketsManager />} />
          <Route path="settings" element={<PaymentSettings />} />
          <Route path="/" element={<Navigate to="events" replace />} />
        </Routes>
      </main>
    </div>
  );
}