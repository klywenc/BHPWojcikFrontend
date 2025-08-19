import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPasswordPage = () => {
    // Pobieramy token bezpośrednio z parametru URL, np. /password/reset/:token
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Nie potrzebujemy już useEffect do ustawiania tokena w stanie

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsSubmitting(true);

        if (newPassword !== confirmPassword) {
            setError('Hasła nie są identyczne.');
            setIsSubmitting(false);
            return;
        }
        if (newPassword.length < 6) {
            setError('Hasło musi mieć co najmniej 6 znaków.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Przesyłamy token pobrany z URL
            const response = await api.post('/password/reset', { token, newPassword });
            setMessage(`${response.data} Za chwilę zostaniesz przekierowany na stronę logowania.`);
            setTimeout(() => navigate('/login'), 4000);
        } catch (err) {
            setError(err.response?.data?.message || 'Wystąpił błąd. Sprawdź, czy link jest poprawny i ważny.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Ustaw nowe hasło</h2>
            {message ? (
                <div className="alert alert-success">{message}</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* Pole na token jest już niepotrzebne i ukryte */}

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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                        />
                    </div>
                    <button type="submit" className="btn btn-action w-100 mt-3" disabled={isSubmitting}>
                        {isSubmitting ? 'Zapisywanie...' : 'Zmień hasło'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPasswordPage;