import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h1>Panel Pracownika</h1>
            <p>Witaj, {user?.email}!</p>

            <div className="alert alert-warning">
                <strong>Uwaga:</strong> Nie zaimplementowane.
            </div>

            {/* Tutaj znajdowałaby się logika do obsługi incydentów, np. */}
            {/* <button className="btn btn-primary">Zgłoś nowy incydent</button> */}
            {/* <h3 className="mt-4">Twoje zgłoszenia</h3> */}
            {/* <p>Lista incydentów...</p> */}
        </div>
    );
};

export default UserDashboard;