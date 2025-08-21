import React, { useState, useEffect } from 'react';
import api from '../services/api';

const IncidentEditModal = ({
                               userRole,
                               incident,
                               categories,
                               departments,
                               onClose,
                               onUpdate
                           }) => {
    const [formData, setFormData] = useState({
        description: '',
        categoryId: '',
        departmentId: '',
        actualResolutionDate: ''
    });
    const [error, setError] = useState('');

    const isDirector = userRole === 'ROLE_DYREKTOR';

    useEffect(() => {
        if (incident) {
            setFormData({
                description: incident.description || '',
                categoryId: incident.category?.id || '',
                departmentId: incident.department?.id || '',
                actualResolutionDate: incident.actualResolutionDate
                    ? incident.actualResolutionDate.split('T')[0]
                    : ''
            });
        }
    }, [incident]);

    if (!incident) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                description: formData.description,
                categoryId: parseInt(formData.categoryId, 10),
                departmentId: parseInt(formData.departmentId, 10),
                actualResolutionDate: formData.actualResolutionDate || null
            };
            const response = await api.put(`/incidents/${incident.id}`, payload);
            onUpdate(response.data);
            onClose();
        } catch (err) {
            setError('Nie udało się zaktualizować incydentu.');
            console.error(err);
        }
    };

    return (
        <div
            className="modal show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Edytuj Incydent #{incident.id}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    Opis
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows="5"
                                    className="form-control"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isDirector} // Dyrektor nie może edytować
                                ></textarea>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="categoryId" className="form-label">
                                        Kategoria
                                    </label>
                                    <select
                                        name="categoryId"
                                        id="categoryId"
                                        className="form-select"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        disabled={isDirector} // Dyrektor nie może edytować
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="departmentId" className="form-label">
                                        Dział
                                    </label>
                                    <select
                                        name="departmentId"
                                        id="departmentId"
                                        className="form-select"
                                        value={formData.departmentId}
                                        onChange={handleChange}
                                        disabled={isDirector} // Dyrektor nie może edytować
                                    >
                                        {departments.map((dep) => (
                                            <option key={dep.id} value={dep.id}>
                                                {dep.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {isDirector && (
                                <div className="mb-3">
                                    <label htmlFor="actualResolutionDate" className="form-label">
                                        Data faktycznego rozwiązania
                                    </label>
                                    <input
                                        type="date"
                                        id="actualResolutionDate"
                                        name="actualResolutionDate"
                                        className="form-control"
                                        value={formData.actualResolutionDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Anuluj
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Zapisz zmiany
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default IncidentEditModal;
