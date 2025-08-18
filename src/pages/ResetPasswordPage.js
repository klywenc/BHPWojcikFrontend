import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPasswordPage = () => {
    const { token: urlToken } = useParams();
    const navigate = useNavigate();

    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (urlToken) {
            setToken(urlToken);
        }
    }, [urlToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Hasła nie są identyczne.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Hasło musi mieć co najmniej 6 znaków.');
            return;
        }

        try {
            const response = await api.post('/password/reset', { token, newPassword });
            setMessage(`${response.data} Za chwilę zostaniesz przekierowany na stronę logowania.`);
            setTimeout(() => navigate('/login'), 4000);
        } catch (err) {
            setError(err.response?.data?.message || 'Wystąpił błąd. Sprawdź, czy token jest poprawny i ważny.');
        }
    };

    return (
        <div className="form-container">
            <h2>Resetowanie hasła</h2>
            {message ? (
                <div className="alert alert-success">{message}</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                        <label htmlFor="token" className="form-label">Token resetujący</label>
                        <input
                            type="text"
                            id="token"
                            className="form-control"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Wklej tutaj token otrzymany od administratora"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPassword">Nowe hasło</label>
                        <input
                            type="password"
                            id="newPassword"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Wpisz nowe hasło"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword">Potwierdź nowe hasło</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Potwierdź nowe hasło"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-action w-100 mt-3">
                        Zmień hasło
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPasswordPage;