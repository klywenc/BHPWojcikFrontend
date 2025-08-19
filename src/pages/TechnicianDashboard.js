import React from 'react';
import PasswordResetGenerator from '../components/PasswordResetGenerator';
import InvitationSender from '../components/InvitationSender'; // 1. Importujemy nowy komponent

const TechnicianDashboard = () => {
    // 2. Cała logika generowania kodu (useState, handleGenerateCode) jest już niepotrzebna
    // i została przeniesiona do InvitationSender.

    return (
        <div className="container mt-4">
            <h1>Panel Technika</h1>
            <p>Zarządzaj zaproszeniami do systemu oraz hasłami użytkowników.</p>

            <div className="row mt-4">
                <div className="col-lg-6">
                    {/* 3. Wstawiamy nasz nowy komponent do wysyłania zaproszeń */}
                    <InvitationSender />
                </div>
                <div className="col-lg-6">
                    <PasswordResetGenerator />
                </div>
            </div>
        </div>
    );
};

export default TechnicianDashboard;