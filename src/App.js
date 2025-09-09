import React, { useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AuditPanel from './pages/AuditPanel';
import DebugPanel from "./pages/DebugPanel";
import ArchivedAuditsPage from "./pages/ArchivedAuditsPage";

import { lightTheme, darkTheme } from './theme/theme';
import { GlobalStyles } from './theme/GlobalStyles';

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDarkTheme = theme === 'dark';

    const toggleTheme = () => {
        const updatedTheme = isDarkTheme ? 'light' : 'dark';
        setTheme(updatedTheme);
        localStorage.setItem('theme', updatedTheme);
    };

    return (
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
            <>
                <GlobalStyles />
                <Router>
                    {/* Navbar z możliwością zmiany motywu */}
                    <Navbar toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />

                    <div className="container my-5">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/register/:registrationCode" element={<RegisterPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                            <Route path="/password/reset/:token" element={<ResetPasswordPage />} />

                            <Route
                                path="/audits"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_ADMINISTRATOR', 'ROLE_TECHNIK']}>
                                        <AuditPanel />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/panel-pracownika"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_PRACOWNIK', 'ROLE_DYREKTOR', 'ROLE_ADMINISTRATOR']}>
                                        <UserDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/panel-admina"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_ADMINISTRATOR']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/audits-archive"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_ADMINISTRATOR', 'ROLE_TECHNIK']}>
                                        <ArchivedAuditsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/debug-panel"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_ADMINISTRATOR']}>
                                        <DebugPanel />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/unauthorized"
                                element={
                                    <div className="text-center">
                                        <h1>403 - Brak dostępu</h1>
                                        <p>Nie masz uprawnień do wyświetlenia tej strony.</p>
                                    </div>
                                }
                            />

                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </Router>
            </>
        </ThemeProvider>
    );
}

export default App;
