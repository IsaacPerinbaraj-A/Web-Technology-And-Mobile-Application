import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ParkingProvider } from './context/ParkingContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import SlotsPage from './pages/SlotsPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminLotsPage from './pages/AdminLotsPage';
import AdminEditLotPage from './pages/AdminEditLotPage';
import AttendantPage from './pages/AttendantPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ParkingProvider>
          <div className="min-h-screen relative">
            <Navbar />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected User Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredRole="user">
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/slots/:lotId"
                  element={
                    <ProtectedRoute requiredRole="user">
                      <SlotsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking-confirmation/:bookingId"
                  element={
                    <ProtectedRoute requiredRole="user">
                      <BookingConfirmationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute requiredRole="user">
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/lots"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLotsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/lots/edit/:lotId"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminEditLotPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/attendant"
                  element={
                    <ProtectedRoute requiredRole="attendant">
                      <AttendantPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </ParkingProvider>
      </AuthProvider>
    </Router>
  );
}
