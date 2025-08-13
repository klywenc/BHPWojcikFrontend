import React, { useState } from 'react';
import api from '../../../services/api';

const CodeGenerator = () => {
    const [newCode, setNewCode] = useState('');
    const [error, setError] = useState('');

    const handleGenerateCode = async () => {
        setError('');
        setNewCode('');
        try {
            const response = await api.post('/codes/generate');
            setNewCode(response.data);
        } catch (err) {
            console.error("Błąd generowania kodu:", err);
            setError('Błąd podczas generowania kodu.');
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">Zarządzanie kodami rejestracyjnymi</div>
            <div className="card-body">
                <button className="btn btn-success" onClick={handleGenerateCode}>Wygeneruj nowy kod</button>
                {newCode && <p className="mt-3">Nowy kod: <strong>{newCode}</strong></p>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
};

export default CodeGenerator;