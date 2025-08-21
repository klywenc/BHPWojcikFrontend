import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import DebugPanel from "./pages/DebugPanel";


function App() {
    return (<Router>
        <Navbar/>
        <div className="container my-5">
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/reset-password" element={<ResetPasswordPage/>}/>
                <Route path="/reset-password/:token" element={<ResetPasswordPage/>}/>


                <Route
                    path="/panel-pracownika"
                    element={<ProtectedRoute
                        allowedRoles={['ROLE_PRACOWNIK', 'ROLE_DYREKTOR', 'ROLE_ADMINISTRATOR']}>
                        <UserDashboard/>
                    </ProtectedRoute>}
                />
                <Route
                    path="/panel-admina"
                    element={<ProtectedRoute allowedRoles={['ROLE_ADMINISTRATOR']}>
                        <AdminDashboard/>
                    </ProtectedRoute>}
                />
                <Route path="/debug-panel" element={<ProtectedRoute allowedRoles={['ROLE_ADMINISTRATOR']}>
                    <DebugPanel/>
                </ProtectedRoute>}/>

                <Route path="/password/reset/:token" element={<ResetPasswordPage/>}/>

                <Route path="/unauthorized" element={<div className="text-center">
                    <h1>403 - Brak dostępu</h1>
                    <p>Nie masz uprawnień do wyświetlenia tej strony.</p>
                </div>}/>

                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </div>
    </Router>);
}

export default App;