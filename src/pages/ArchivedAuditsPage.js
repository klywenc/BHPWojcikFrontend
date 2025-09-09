import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Import Link do nawigacji
import api from '../services/api';


const ArchivedAuditsPage = () => {
    const [allAudits, setAllAudits] = useState([]);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedIncidentId, setExpandedIncidentId] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const auditsResponse = await api.get('/audits');
            setAllAudits(auditsResponse.data);
        } catch (error) {
            console.error("Błąd podczas pobierania danych:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const archivedAudits = useMemo(() => {
        const sorted = [...allAudits].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return sorted.slice(10);
    }, [allAudits]);

    const handleSelectAudit = async (auditId) => {
        try {
            const response = await api.get(`/audits/${auditId}`);
            setSelectedAudit(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania szczegółów audytu:", error);
            setSelectedAudit(null);
        }
    };

    // Helpery do formatowania (skopiowane dla spójności)
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString('pl-PL') : 'Brak';
    const displayValue = (value) => value || <span className="text-muted">Brak</span>;
    const getSeverityColor = (severity) => ({ 'ZWYKLY': 'success', 'PILNY': 'warning', 'KRYTYCZNY': 'danger' }[severity] || 'secondary');

    if (isLoading) return <p>Ładowanie archiwum audytów...</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Archiwum Audytów</h1>
                <Link to="/audits" className="btn btn-secondary">&larr; Wróć do najnowszych audytów</Link>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">Audyty Archiwalne</div>
                        <ul className="list-group list-group-flush">
                            {archivedAudits.length > 0 ? archivedAudits.map(audit => (
                                <li key={audit.id}
                                    className={`list-group-item list-group-item-action ${selectedAudit?.id === audit.id ? 'active' : ''}`}
                                    onClick={() => handleSelectAudit(audit.id)}
                                    style={{ cursor: 'pointer' }}>
                                    {audit.title}
                                </li>
                            )) : <li className="list-group-item">Brak audytów w archiwum.</li>}
                        </ul>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Szczegóły Audytu</div>
                        <div className="card-body">
                            {selectedAudit ? (
                                <>
                                    <h3>{selectedAudit.title}</h3>
                                    <p><strong>Data utworzenia:</strong> {formatDate(selectedAudit.createdAt)}</p>
                                    <hr />
                                    <h5>Przypisane incydenty ({selectedAudit.incidents.length})</h5>
                                    <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        <table className="table table-sm table-hover align-middle">
                                            <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tytuł (fragment opisu)</th>
                                                <th>Szkodliwość</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {selectedAudit.incidents.map(incident => (
                                                <React.Fragment key={incident.id}>
                                                    <tr onClick={() => setExpandedIncidentId(expandedIncidentId === incident.id ? null : incident.id)} style={{ cursor: 'pointer' }}>
                                                        <td><strong>{incident.id}</strong></td>
                                                        <td>{(incident.description || '').substring(0, 30)}{incident.description.length > 30 ? '...' : ''}</td>
                                                        <td><span className={`badge fs-6 bg-${getSeverityColor(incident.severity)}`}>{displayValue(incident.severity)}</span></td>
                                                    </tr>
                                                    {expandedIncidentId === incident.id && (
                                                        <tr>
                                                            <td colSpan="3" className="p-3 bg-light">
                                                                <strong>Pełny opis:</strong>
                                                                <pre className="bg-white p-2 border rounded">{incident.description}</pre>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <p>Wybierz audyt z archiwum, aby zobaczyć szczegóły.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArchivedAuditsPage;