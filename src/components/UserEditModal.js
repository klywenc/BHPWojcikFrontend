import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Komponent teraz oczekuje propsa 'availableDepartments'
const UserEditModal = ({ user, availableRoles, availableDepartments, onClose, onUserUpdated }) => {
    // Dodajemy departmentId do stanu formularza
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        enabled: false,
        departmentId: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                role: user.role,
                enabled: user.enabled,
                // Ustawiamy ID działu, jeśli jest przypisany, w przeciwnym razie pusty string
                departmentId: user.department ? user.department.id : ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // DTO w backendzie oczekuje `departmentId`, więc wysyłamy je w ciele żądania
            const response = await api.put(`/admin/users/${user.id}`, formData);
            onUserUpdated(response.data);
            onClose();
        } catch (err) {
            setError('Nie udało się zaktualizować użytkownika. Spróbuj ponownie.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Edytuj użytkownika: {user.email}</h5>
                            <button type="button" className="btn-close" onClick={onClose} disabled={isSubmitting}></button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            {/* Pole Imię i Nazwisko */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Imię i Nazwisko</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Pole Rola */}
                            <div className="mb-3">
                                <label htmlFor="role" className="form-label">Rola</label>
                                <select
                                    id="role"
                                    name="role"
                                    className="form-select"
                                    value={formData.role}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                >
                                    {availableRoles.map(role => (
                                        <option key={role} value={role}>{role.replace('ROLE_', '')}</option>
                                    ))}
                                </select>
                            </div>

                            {/* NOWE POLE: Lista rozwijana z Działami */}
                            <div className="mb-3">
                                <label htmlFor="departmentId" className="form-label">Dział</label>
                                <select
                                    id="departmentId"
                                    name="departmentId"
                                    className="form-select"
                                    value={formData.departmentId}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                >
                                    <option value="">-- Brak przypisanego działu --</option>
                                    {availableDepartments.map(dep => (
                                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Pole Status */}
                            <div className="form-check form-switch mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="enabled"
                                    name="enabled"
                                    checked={formData.enabled}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                <label className="form-check-label" htmlFor="enabled">Konto aktywne</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Anuluj</button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserEditModal;