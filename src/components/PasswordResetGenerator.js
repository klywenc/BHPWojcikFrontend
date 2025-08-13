import React, { useState } from 'react';
import api from '../services/api';

const PasswordResetGenerator = () => {
    const [email, setEmail] = useState('');
    const [generatedToken, setGeneratedToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setGeneratedToken('');

        try {
            const response = await api.post('/password/generate-reset-token', { email });
            setGeneratedToken(response.data);
            setMessage('Token został wygenerowany pomyślnie. Skopiuj go i przekaż użytkownikowi.');
        } catch (err) {
            setError(err.response?.data?.message || 'Nie udało się wygenerować tokenu. Sprawdź, czy email jest poprawny.');
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                Wygeneruj token do resetu hasła
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3">
                        <label htmlFor="emailForReset" className="form-label">Email użytkownika</label>
                        <input
                            type="email"
                            id="emailForReset"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="np. uzytkownik@bhp.pl"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Wygeneruj Token</button>
                </form>

                {generatedToken && (
                    <div className="mt-4 p-3 bg-light border rounded">
                        <strong>Wygenerowany Token:</strong>
                        <p className="text-break" style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                            {generatedToken}
                        </p>
                        <small>Token jest ważny przez 3 dni.</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordResetGenerator;