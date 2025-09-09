import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import styled from 'styled-components';
import { FormContainer, FormGroup, FormLabel, Input, Button } from '../components/Styled';

const InfoBox = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2rem;
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  max-width: 600px;
  margin: 2rem auto;
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  // ... (style jak ErrorMessage z LoginPage)
`;

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
        // ... (logika bez zmian)
    };

    if (!codeFromUrl) {
        return (
            <InfoBox>
                <h2>Dostęp tylko z zaproszenia</h2>
                <p>Aby się zarejestrować, musisz użyć unikalnego linku wysłanego na Twój adres e-mail.</p>
                <Link to="/login">Wróć do logowania</Link>
            </InfoBox>
        );
    }

    return (
        <FormContainer>
            <h2>Ukończ rejestrację</h2>
            <p style={{ textAlign: 'center', color: '#666', marginTop: '-1rem', marginBottom: '2rem' }}>
                Twój kod zaproszenia został zaakceptowany. Uzupełnij dane.
            </p>

            {message && <SuccessMessage>{message}</SuccessMessage>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!message && (
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormLabel>Imię i nazwisko</FormLabel>
                        <Input type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Adres e-mail</FormLabel>
                        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Hasło</FormLabel>
                        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </FormGroup>
                    <Button type="submit" style={{ width: '100%' }}>Zarejestruj się</Button>
                </form>
            )}
        </FormContainer>
    );
};

export default RegisterPage;