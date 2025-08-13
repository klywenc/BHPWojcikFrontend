import React, { useState } from 'react';
import api from '../services/api';

// Import komponentu do resetowania hasła
import PasswordResetGenerator from '../components/PasswordResetGenerator';

const TechnicianDashboard = () => {
    const [newCode, setNewCode] = useState('');

    const handleGenerateCode = async () => {
        try {
            const response = await api.post('/codes/generate');
            setNewCode(response.data);
        } catch (error) {
            console.error("Błąd generowania kodu:", error);
            setNewCode('Błąd podczas generowania kodu.');
        }
    };

    return (
        <div>
            <h1>Panel Technika</h1>

            {/* Zintegrowany komponent do resetowania hasła */}
            <PasswordResetGenerator />

            {/* Istniejąca funkcjonalność generowania kodów */}
            <div className="card mb-4">
                <div className="card-header">Generowanie kodu rejestracyjnego</div>
                <div className="card-body">
                    <button className="btn btn-primary" onClick={handleGenerateCode}>Wygeneruj nowy kod</button>
                    {newCode && <p className="mt-3">Nowy kod: <strong>{newCode}</strong></p>}
                </div>
            </div>
        </div>
    );
};

export default TechnicianDashboard;