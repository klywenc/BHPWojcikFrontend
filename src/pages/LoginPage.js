import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import styled from 'styled-components';
import { FormContainer, FormGroup, FormLabel, Input, Button } from '../components/Styled';

const StyledLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.danger}1A; // 10% opacity
  color: ${({ theme }) => theme.colors.danger};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.danger}4D; // 30% opacity
`;

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
        <FormContainer>
            <h2 style={{ marginBottom: '2rem' }}>Logowanie</h2>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <FormLabel htmlFor="email">Adres e-mail</FormLabel>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="password">Hasło</FormLabel>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </FormGroup>
                <Button type="submit" style={{ width: '100%' }}>Zaloguj</Button>
                <StyledLink to="/reset-password">Zapomniałem hasła</StyledLink>
            </form>
        </FormContainer>
    );
};

export default LoginPage;