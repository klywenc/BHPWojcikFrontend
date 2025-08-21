import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import UserEditModal from './UserEditModal';

// Komponent teraz oczekuje propsa 'availableDepartments'
const UserManagement = ({ availableDepartments }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [availableRoles, setAvailableRoles] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const [usersResponse, rolesResponse] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/users/roles')
            ]);

            setUsers(usersResponse.data);
            setAvailableRoles(rolesResponse.data);

        } catch (err) {
            setError('Nie udało się załadować danych. Sprawdź połączenie i uprawnienia.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm(`Czy na pewno chcesz usunąć użytkownika o ID ${userId}? Tej operacji nie można cofnąć.`)) {
            try {
                await api.delete(`/admin/users/${userId}`);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            } catch (err) {
                setError('Nie udało się usunąć użytkownika. Spróbuj ponownie.');
                console.error(err);
            }
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleUserUpdated = (updatedUser) => {
        setUsers(prevUsers => prevUsers.map(user =>
            user.id === updatedUser.id ? updatedUser : user
        ));
    };

    if (loading) return <p className="text-center">Ładowanie użytkowników...</p>;

    return (
        <div className="card">
            <div className="card-header">
                <h2>Zarządzanie Użytkownikami</h2>
            </div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imię i Nazwisko</th>
                            <th>Email</th>
                            <th>Rola</th>
                            <th>Dział</th> {/* NOWA KOLUMNA */}
                            <th>Status</th>
                            <th>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role.replace('ROLE_', '')}</td>
                                {/* NOWA KOMÓRKA WYŚWIETLAJĄCA DZIAŁ */}
                                <td>{user.department ? user.department.name : <span className="text-muted">Brak</span>}</td>
                                <td>
                                    {user.enabled
                                        ? <span className="badge bg-success">Aktywny</span>
                                        : <span className="badge bg-secondary">Nieaktywny</span>
                                    }
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        Edytuj
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Usuń
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isEditModalOpen && (
                <UserEditModal
                    user={selectedUser}
                    availableRoles={availableRoles}
                    availableDepartments={availableDepartments} // Przekazujemy listę działów do modala
                    onClose={handleCloseModal}
                    onUserUpdated={handleUserUpdated}
                />
            )}
        </div>
    );
};

export default UserManagement;