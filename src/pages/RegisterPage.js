import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationCode, setRegistrationCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await api.post('/auth/register', { name, email, password, registrationCode });
            setMessage(response.data);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data || 'Wystąpił błąd podczas rejestracji.');
        }
    };

    return (
        <div>
            <h2>Rejestracja</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3"><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Imię i nazwisko" required className="form-control" /></div>
                <div className="mb-3"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="form-control" /></div>
                <div className="mb-3"><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Hasło" required className="form-control" /></div>
                <div className="mb-3"><input type="text" value={registrationCode} onChange={e => setRegistrationCode(e.target.value)} placeholder="Kod rejestracyjny" required className="form-control" /></div>
                <button type="submit" className="btn btn-primary">Zarejestruj</button>
            </form>
        </div>
    );
};

export default RegisterPage;