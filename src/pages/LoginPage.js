import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.accessToken);
            navigate('/');
        } catch (err) {
            setError('Nieprawidłowy email lub hasło.');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Logowanie</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Hasło"
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-action w-100 mt-3">Zaloguj</button>

                {/* DODANA SEKCJA */}
                <div className="text-center mt-4">
                    <Link to="/reset-password">Zapomniałem hasła</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;