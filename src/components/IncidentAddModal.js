import React, { useState } from 'react';
import api from '../services/api';

const IncidentAddModal = ({ categories, departments, onClose, onIncidentAdded }) => {
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [photos, setPhotos] = useState([]);

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (categories.length > 0 && !categoryId) {
        setCategoryId(categories[0].id);
    }
    if (departments.length > 0 && !departmentId) {
        setDepartmentId(departments[0].id);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !categoryId || !departmentId) {
            setError('Wszystkie pola (oprócz zdjęć) są wymagane.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('description', description);
        formData.append('categoryId', categoryId);
        formData.append('departmentId', departmentId);

        for (const photo of photos) {
            formData.append('photos', photo);
        }

        try {
            await api.post('/incidents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onIncidentAdded();
            onClose();
        } catch (err) {
            setError('Wystąpił błąd podczas dodawania incydentu.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Dodaj nowy incydent</h5>
                            <button type="button" className="btn-close" onClick={onClose} disabled={isSubmitting}></button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label htmlFor="add-description" className="form-label">Opis zdarzenia</label>
                                <textarea
                                    id="add-description"
                                    rows="4"
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="add-categoryId" className="form-label">Kategoria</label>
                                    <select id="add-categoryId" className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="add-departmentId" className="form-label">Dział</label>
                                    <select id="add-departmentId" className="form-select" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required>
                                        {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="photos" className="form-label">Dodaj zdjęcia (opcjonalnie)</label>
                                <input
                                    type="file"
                                    id="photos"
                                    className="form-control"
                                    multiple
                                    onChange={(e) => setPhotos(e.target.files)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Anuluj</button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Dodawanie...' : 'Dodaj Incydent'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default IncidentAddModal;