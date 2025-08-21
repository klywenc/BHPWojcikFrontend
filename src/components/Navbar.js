import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/"><img src="/meblewojcik.png" alt="Meble Wójcik" height="70" /></Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/">Strona Główna</Link></li>
                        {user && <li className="nav-item"><Link className="nav-link" to="/panel-pracownika">Panel Pracownika</Link></li>}
                        {user && (user.role === 'ROLE_TECHNIK' || user.role === 'ROLE_ADMINISTRATOR')}
                        {user && user.role === 'ROLE_ADMINISTRATOR' && (
                            <li className="nav-item"><Link className="nav-link" to="/panel-admina">Panel Administracyjny</Link></li>
                        )}
                    </ul>
                    <div className="d-flex">
                        {user ? (
                            <>
                                <span className="navbar-text me-3">Zalogowany jako: {user.email} ({user.role})</span>
                                <button onClick={handleLogout} className="btn btn-outline-secondary">Wyloguj</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-action">Logowanie</Link>
                                <Link to="/register" className="btn btn-warning">Rejestracja</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;