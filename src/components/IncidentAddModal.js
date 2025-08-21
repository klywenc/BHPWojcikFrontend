import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Komponent przyjmuje teraz nowe propsy: locations i directors
const IncidentAddModal = ({ categories, departments, locations, directors, onClose, onIncidentAdded }) => {
    // Stany dla nowych pól
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [severity, setSeverity] = useState('ZWYKLY'); // Domyślna wartość
    const [responsiblePersonId, setResponsiblePersonId] = useState('');
    const [selectedFiles, setSelectedFiles] = useState(null);

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Ustawianie domyślnych wartości dla list rozwijanych
    useEffect(() => {
        if (categories.length > 0 && !categoryId) setCategoryId(categories[0].id);
        if (departments.length > 0 && !departmentId) setDepartmentId(departments[0].id);
        if (locations.length > 0 && !locationId) setLocationId(locations[0].id);
    }, [categories, departments, locations, categoryId, departmentId, locationId]);

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Walidacja wszystkich wymaganych pól
        if (!description || !categoryId || !departmentId || !locationId || !severity) {
            setError('Wszystkie pola (oprócz zdjęć i osoby odpowiedzialnej) są wymagane.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        const formData = new FormData();

        // Zamiast DTO, używamy @RequestParam, więc backend oczekuje tych pól
        formData.append('description', description);
        formData.append('categoryId', categoryId);
        formData.append('departmentId', departmentId);
        formData.append('locationId', locationId);
        formData.append('severity', severity);
        if (responsiblePersonId) {
            formData.append('responsiblePersonId', responsiblePersonId);
        }

        if (selectedFiles && selectedFiles.length > 0) {
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append('files', selectedFiles[i]);
            }
        }

        try {
            // Zakładamy, że backend createIncident został zaktualizowany, aby przyjmować nowe pola
            await api.post('/incidents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
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
                                <textarea id="add-description" rows="4" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
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
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="add-locationId" className="form-label">Miejsce</label>
                                    <select id="add-locationId" className="form-select" value={locationId} onChange={(e) => setLocationId(e.target.value)} required>
                                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="add-severity" className="form-label">Szkodliwość</label>
                                    <select id="add-severity" className="form-select" value={severity} onChange={(e) => setSeverity(e.target.value)} required>
                                        <option value="ZWYKLY">Zwykły</option>
                                        <option value="PILNY">Pilny</option>
                                        <option value="KRYTYCZNY">Krytyczny</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="add-responsiblePersonId" className="form-label">Osoba odpowiedzialna (Dyrektor)</label>
                                <select id="add-responsiblePersonId" className="form-select" value={responsiblePersonId} onChange={(e) => setResponsiblePersonId(e.target.value)}>
                                    <option value="">-- Brak --</option>
                                    {directors.map(dir => <option key={dir.id} value={dir.id}>{dir.name} ({dir.email})</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="photos" className="form-label">Dodaj zdjęcia (opcjonalnie)</label>
                                <input type="file" id="photos" className="form-control" multiple onChange={handleFileChange} />
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