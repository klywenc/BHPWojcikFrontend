import React from 'react';

const UserManagement = ({ users, onDeleteUser }) => {
    return (
        <div className="card">
            <div className="card-header">Zarządzanie Użytkownikami (CRUD)</div>
            <div className="card-body">
                <p><strong>Uwaga:</strong> Backend nie dostarcza endpointów do edycji użytkowników.</p>
                <table className="table">
                    <thead>
                    <tr><th>ID</th><th>Imię</th><th>Email</th><th>Rola</th><th>Akcje</th></tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => onDeleteUser(user.id)}>Usuń</button>
                                <button className="btn btn-warning btn-sm ms-2" disabled>Edytuj</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;