import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext'; // Upewnij się, że ścieżka jest poprawna
import { ButtonLink } from './Styled'; // Importujemy nasz stylizowany przycisk-link

// --- Definicje stylizowanych komponentów ---

const NavWrapper = styled.header`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 0.8rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background-color ${({ theme }) => theme.transitionSpeed} ease;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
`;

const NavBrand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  
  img {
    height: 50px; // Dostosuj wysokość logo
    width: auto;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
  text-decoration: none;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: all ${({ theme }) => theme.transitionSpeed} ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    border-bottom-color: ${({ theme }) => theme.colors.accent};
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 600;

  @media (max-width: 768px) {
    display: none; // Ukryj tekst na mniejszych ekranach
  }
`;

const ThemeToggleButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  line-height: 1;
  transition: all ${({ theme }) => theme.transitionSpeed} ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;
  text-transform: uppercase;
  
  &:hover {
    text-decoration: underline;
  }
`;

// --- Główny komponent Navbar ---

const Navbar = ({ toggleTheme, isDarkTheme }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <NavWrapper>
            <NavContainer>
                <NavLinks>
                    <NavBrand to="/">
                        <img src="/meblewojcik.png" alt="Meble Wójcik Logo" />
                    </NavBrand>
                    <NavLink to="/"></NavLink>
                    {user && <NavLink to="/panel-pracownika">Incydenty</NavLink>}
                    {user && (user.role === 'ROLE_TECHNIK' || user.role === 'ROLE_ADMINISTRATOR') && (
                        <NavLink to="/audits">Audyty</NavLink>
                    )}
                    {user && user.role === 'ROLE_ADMINISTRATOR' && (
                        <NavLink to="/panel-admina">Admin</NavLink>
                    )}
                </NavLinks>

                <UserActions>
                    {user ? (
                        <>
                            <UserInfo>
                                {user.email} ({user.role.replace('ROLE_', '')})
                            </UserInfo>
                            <LogoutButton onClick={handleLogout}>Wyloguj</LogoutButton>
                        </>
                    ) : (
                        <>
                            <ButtonLink to="/login" variant="primary">Logowanie</ButtonLink>
                            <ButtonLink to="/register">Rejestracja</ButtonLink>
                        </>
                    )}
                    <ThemeToggleButton onClick={toggleTheme} title="Zmień motyw">
                        {isDarkTheme ? '☀️' : '🌙'}
                    </ThemeToggleButton>
                </UserActions>
            </NavContainer>
        </NavWrapper>
    );
};

export default Navbar;