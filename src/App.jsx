import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Attendance } from './pages/Attendance';
import { Candidates } from './pages/Candidates';
import { MyFinances } from './pages/MyFinances';
import { Users } from './pages/Users';
import { Assets } from './pages/Assets';
import { Calendar } from './pages/Calendar';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="finances" element={<MyFinances />} />
            <Route path="users" element={<Users />} />
            <Route path="assets" element={<Assets />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

