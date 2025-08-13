import React, {useCallback, useEffect, useState} from 'react';
import api from '../services/api';
import PasswordResetGenerator from '../components/PasswordResetGenerator';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newCode, setNewCode] = useState('');
    const [message, setMessage] = useState('');
    const fetchUsers = useCallback(async () => {
        try {
            const response = await api.get('/users'); // Poprawiony endpoint
            setUsers(response.data);
        } catch (error) {
            console.error("Błąd pobierania użytkowników:", error);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
            try {
                await api.delete(`/users/${userId}`); // Poprawiony endpoint
                setMessage('Użytkownik został usunięty.');
                await fetchUsers();
            } catch (error) {
                console.error("Błąd usuwania użytkownika:", error);
                setMessage('Błąd podczas usuwania.');
            }
        }
    };

    const handleGenerateCode = async () => {
        try {
            const response = await api.post('/codes/generate');
            setNewCode(response.data);
        } catch (error) {
            console.error("Błąd generowania kodu:", error);
            setNewCode('Błąd podczas generowania kodu.');
        }
    };

    return (<div>
            <h1>Panel Administratora</h1>
            {message && <div className="alert alert-info">{message}</div>}

            {/* Zintegrowany komponent do resetowania hasła */}
            <PasswordResetGenerator/>

            {/* Istniejąca funkcjonalność generowania kodów */}
            <div className="card mb-4">
                <div className="card-header">Zarządzanie kodami rejestracyjnymi</div>
                <div className="card-body">
                    <button className="btn btn-primary" onClick={handleGenerateCode}>Wygeneruj nowy kod</button>
                    {newCode && <p className="mt-3">Nowy kod: <strong>{newCode}</strong></p>}
                </div>
            </div>

            {/* Istniejąca funkcjonalność zarządzania użytkownikami */}
            <div className="card">
                <div className="card-header">Zarządzanie Użytkownikami</div>
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imię</th>
                            <th>Email</th>
                            <th>Rola</th>
                            <th>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (<tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteUser(user.id)}>Usuń
                                    </button>
                                </td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
};
export default AdminDashboard;