import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
    const { registrationCode: codeFromUrl } = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationCode, setRegistrationCode] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (codeFromUrl) {
            setRegistrationCode(codeFromUrl);
        }
    }, [codeFromUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await api.post('/auth/register', { name, email, password, registrationCode });
            setMessage(response.data + " Za chwilę zostaniesz przekierowany na stronę logowania.");
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data || 'Wystąpił błąd podczas rejestracji. Upewnij się, że link jest poprawny.');
        }
    };

    if (!codeFromUrl) {
        return (
            <div className="text-center">
                <h2>Rejestracja</h2>
                <div className="alert alert-warning mt-4">
                    <h4>Dostęp tylko z zaproszenia</h4>
                    <p>Aby się zarejestrować, musisz użyć unikalnego linku wysłanego na Twój adres e-mail.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h2>Ukończ rejestrację</h2>
            <p>Twój kod zaproszenia został zaakceptowany. Uzupełnij poniższe dane.</p>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!message && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Imię i nazwisko</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jan Kowalski" required className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Adres e-mail</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="j.kowalski@meblewojcik.pl" required className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Hasło</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 znaków" required className="form-control" />
                    </div>

                    {/* Pole z kodem jest już niepotrzebne dla użytkownika, więc je usuwamy */}

                    <button type="submit" className="btn btn-primary w-100 mt-3">Zarejestruj się i zaloguj</button>
                </form>
            )}
        </div>
    );
};

export default RegisterPage;