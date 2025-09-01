import React, { useState, useEffect } from 'react';
import api from '../services/api';
//TODO OGARNIJ TO
/**
 * - Komponent modala do edycji incydentu z logiką dostosowaną do roli użytkownika.
 * - Administrator: Może edytować wszystko.
 * - Dyrektor: Widzi i edytuje sekcję rozwiązania oraz status. Inne pola są zablokowane.
 * - Pracownik/Technik: Może edytować tylko status. Sekcja rozwiązania jest ukryta.
 */
const IncidentEditModal = ({
                               userRole,
                               incident,
                               categories,
                               departments,
                               locations,
                               directors,
                               statuses,
                               severities,
                               onClose,
                               onUpdate
                           }) => {

    const [formData, setFormData] = useState({
        description: '',
        categoryId: '',
        departmentId: '',
        locationId: '',
        severity: '',
        status: '',
        responsiblePersonId: '',
        estimatedResolutionDate: '',
        actualResolutionDate: '',
        resolutionDescription: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAdmin = userRole === 'ROLE_ADMINISTRATOR';
    const isDirector = userRole === 'ROLE_DYREKTOR';

    useEffect(() => {
        if (incident) {
            const formatDate = (dateStr) => dateStr ? dateStr.split('T')[0] : '';
            setFormData({
                description: incident.description || '',
                categoryId: categories.find(c => c.name === incident.categoryName)?.id || '',
                departmentId: departments.find(d => d.name === incident.departmentName)?.id || '',
                locationId: locations.find(l => l.name === incident.locationName)?.id || '',
                severity: incident.severity || '',
                status: incident.status || '',
                responsiblePersonId: directors.find(d => d.name === incident.responsiblePersonName)?.id || '',
                estimatedResolutionDate: formatDate(incident.estimatedResolutionDate),
                actualResolutionDate: formatDate(incident.actualResolutionDate),
                resolutionDescription: incident.resolutionDescription || ''
            });
        }
    }, [incident, categories, departments, locations, directors]);

    if (!incident) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            let response;
            if (isAdmin) {
                const payload = {
                    ...formData,
                    categoryId: parseInt(formData.categoryId, 10),
                    departmentId: parseInt(formData.departmentId, 10),
                    locationId: parseInt(formData.locationId, 10),
                    responsiblePersonId: formData.responsiblePersonId ? parseInt(formData.responsiblePersonId, 10) : null,
                    estimatedResolutionDate: formData.estimatedResolutionDate || null,
                    actualResolutionDate: formData.actualResolutionDate || null,
                };
                response = await api.put(`/incidents/${incident.id}`, payload);
            } else if (isDirector) {
                const payload = {
                    estimatedResolutionDate: formData.estimatedResolutionDate || null,
                    actualResolutionDate: formData.actualResolutionDate || null,
                    resolutionDescription: formData.resolutionDescription,
                    status: formData.status
                };
                response = await api.patch(`/incidents/${incident.id}/resolution`, payload);
            } else {
                const payload = { status: formData.status };
                response = await api.patch(`/incidents/${incident.id}/status`, payload);
            }
            onUpdate(response.data);
            onClose();
        } catch (err) {
            setError('Nie udało się zaktualizować incydentu.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Edytuj Incydent #{incident.id}</h5>
                            <button type="button" className="btn-close" onClick={onClose} disabled={isSubmitting}></button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            {/* ----- SEKCJA OGÓLNA ----- */}
                            {/* Ta sekcja jest WIDOCZNA dla wszystkich, ale EDYTOWALNA tylko dla Admina */}
                            <fieldset disabled={!isAdmin}>
                                <div className="mb-3">
                                    <label className="form-label">Opis</label>
                                    <textarea name="description" rows="3" className="form-control" value={formData.description} onChange={handleChange}></textarea>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Kategoria</label>
                                        <select name="categoryId" className="form-select" value={formData.categoryId} onChange={handleChange}>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Dział</label>
                                        <select name="departmentId" className="form-select" value={formData.departmentId} onChange={handleChange}>
                                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Szkodliwość</label>
                                        <select name="severity" className="form-select" value={formData.severity} onChange={handleChange}>
                                            {severities.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Osoba odpowiedzialna (Dyrektor)</label>
                                        <select name="responsiblePersonId" className="form-select" value={formData.responsiblePersonId} onChange={handleChange}>
                                            <option value="">-- Brak --</option>
                                            {directors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </fieldset>

                            <hr />

                            {/* ----- SEKCJA STATUSU ----- */}
                            {/* To pole jest zawsze edytowalne dla wszystkich, którzy mają dostęp do modala */}
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label fw-bold">Status Incydentu</label>
                                <select name="status" id="status" className="form-select" value={formData.status} onChange={handleChange}>
                                    {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                </select>
                            </div>

                            {/* ----- SEKCJA ROZWIĄZANIA (DLA DYREKTORA I ADMINA) ----- */}
                            {/* UPROSZCZONY WARUNEK: Ta sekcja jest renderowana TYLKO jeśli użytkownik jest Dyrektorem lub Administratorem */}
                            {(isDirector || isAdmin) && (
                                <fieldset disabled={!isDirector && !isAdmin}>
                                    <div className="card bg-light p-3">
                                        <h6 className="card-title">Sekcja rozwiązania (Dyrektor/Admin)</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Przewidywana data rozwiązania</label>
                                                <input type="date" name="estimatedResolutionDate" className="form-control" value={formData.estimatedResolutionDate} onChange={handleChange} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Faktyczna data rozwiązania</label>
                                                <input type="date" name="actualResolutionDate" className="form-control" value={formData.actualResolutionDate} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Opis rozwiązania</label>
                                            <textarea name="resolutionDescription" rows="3" className="form-control" value={formData.resolutionDescription} onChange={handleChange}></textarea>
                                        </div>
                                    </div>
                                </fieldset>
                            )}
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

export default IncidentEditModal;