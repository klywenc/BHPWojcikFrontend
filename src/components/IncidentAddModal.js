import React, { useState, useEffect } from 'react';
import api from '../services/api';

const IncidentAddModal = ({ categories, departments, onClose, onIncidentAdded }) => {
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [selectedFiles, setSelectedFiles] = useState(null); // ZMIANA: Przechowujemy tu FileList

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Używamy useEffect do bezpiecznego ustawiania wartości domyślnych
    useEffect(() => {
        if (categories.length > 0 && !categoryId) {
            setCategoryId(categories[0].id);
        }
        if (departments.length > 0 && !departmentId) {
            setDepartmentId(departments[0].id);
        }
    }, [categories, departments, categoryId, departmentId]);

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !categoryId || !departmentId) {
            setError('Wszystkie pola (oprócz zdjęć) są wymagane.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        const formData = new FormData();
        // Używamy poprawnych nazw pól, których oczekuje backend (@RequestParam)
        formData.append('description', description);
        formData.append('categoryId', categoryId);
        formData.append('departmentId', departmentId);

        // ZMIANA: Poprawny i niezawodny sposób dodawania plików
        if (selectedFiles && selectedFiles.length > 0) {
            // Iterujemy po FileList jak po tablicy
            for (let i = 0; i < selectedFiles.length; i++) {
                // Używamy klucza 'files', którego oczekuje backend (@RequestPart)
                formData.append('files', selectedFiles[i]);
            }
        }

        try {
            // Upewnij się, że Twój interceptor w 'api.js' dodaje nagłówek Authorization
            await api.post('/incidents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onIncidentAdded(); // Odśwież listę incydentów
            onClose(); // Zamknij modal
        } catch (err) {
            // Lepsza obsługa błędów, aby zobaczyć, co zwraca serwer
            if (err.response && err.response.data) {
                setError(`Błąd serwera: ${err.response.data.message || 'Spróbuj ponownie.'}`);
            } else {
                setError('Wystąpił błąd sieciowy lub błąd podczas dodawania incydentu.');
            }
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
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="add-categoryId" className="form-label">Kategoria</label>
                                    <select id="add-categoryId" className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                                        <option value="" disabled>Wybierz kategorię...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="add-departmentId" className="form-label">Dział</label>
                                    <select id="add-departmentId" className="form-select" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required>
                                        <option value="" disabled>Wybierz dział...</option>
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
                                    onChange={handleFileChange}
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