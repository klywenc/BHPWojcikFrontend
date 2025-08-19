import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import UserDashboard from './pages/UserDashboard';


function App() {
    return (<Router>
            <Navbar/>
            <div className="container my-5">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/reset-password" element={<ResetPasswordPage/>}/>
                    <Route path="/reset-password/:token" element={<ResetPasswordPage/>}/>


                    {/* Protected Routes */}
                    <Route
                        path="/panel-pracownika"
                        element={<ProtectedRoute
                            allowedRoles={['ROLE_PRACOWNIK', 'ROLE_TECHNIK', 'ROLE_ADMINISTRATOR']}>
                            <UserDashboard/>
                        </ProtectedRoute>}
                    />
                    <Route
                        path="/panel-technika"
                        element={<ProtectedRoute allowedRoles={['ROLE_TECHNIK', 'ROLE_ADMINISTRATOR']}>
                            <TechnicianDashboard/>
                        </ProtectedRoute>}
                    />
                    <Route
                        path="/panel-admina"
                        element={<ProtectedRoute allowedRoles={['ROLE_ADMINISTRATOR']}>
                            <AdminDashboard/>
                        </ProtectedRoute>}
                    />
                    <Route path="/password/reset/:token" element={<ResetPasswordPage />} />

                    {/* Unauthorized */}
                    <Route path="/unauthorized" element={<div className="text-center">
                        <h1>403 - Brak dostępu</h1>
                        <p>Nie masz uprawnień do wyświetlenia tej strony.</p>
                    </div>}/>

                    {/* Mainpage redirect */}
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </div>
        </Router>);
}

export default App;