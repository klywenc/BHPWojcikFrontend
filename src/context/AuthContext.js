import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                const role = decodedToken.authorities && decodedToken.authorities[0];

                setUser({ email: decodedToken.sub, role: role, token: token });

            } catch (error) {
                console.error("Błąd dekodowania tokenu:", error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        try {
            const decodedToken = jwtDecode(token);

            const role = decodedToken.authorities && decodedToken.authorities[0];

            setUser({ email: decodedToken.sub, role: role, token: token });

        } catch (error) {
            console.error("Błąd dekodowania tokenu po zalogowaniu:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};