import React, {useCallback, useEffect, useState} from 'react';
import api from '../services/api';
import {saveAs} from 'file-saver';
import DOMPurify from 'dompurify';

const AuditPanel = () => {
    const [audits, setAudits] = useState([]);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAudits = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/audits');
            setAudits(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania audytów:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAudits();
    }, [fetchAudits]);

    const handleSelectAudit = async (auditId) => {
        try {
            const response = await api.get(`/audits/${auditId}`);
            setSelectedAudit(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania szczegółów audytu:", error);
            setSelectedAudit(null);
        }
    };

    const handleCreateAudit = async () => {
        const title = prompt("Wprowadź tytuł nowego audytu:");
        if (title) {
            try {
                await api.post('/audits', {title});
                fetchAudits();
            } catch (err) {
                alert("Nie udało się utworzyć audytu.");
            }
        }
    };

    const handleGenerateReport = async (auditId) => {
        try {
            const response = await api.get(`/audits/${auditId}/report`, {responseType: 'blob'});
            const contentDisposition = response.headers['content-disposition'];
            let filename = `raport_audytu_${auditId}.docx`;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match && match[1]) filename = match[1];
            }
            saveAs(response.data, filename);
        } catch (error) {
            console.error("Błąd podczas generowania raportu:", error);
            alert("Nie udało się wygenerować raportu.");
        }
    };

    if (isLoading) return <p>Ładowanie audytów...</p>;

    return (<div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Panel Audytów</h1>
                <button onClick={handleCreateAudit} className="btn btn-success btn-lg">+ Stwórz Nowy Audyt</button>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">Lista Audytów</div>
                        <ul className="list-group list-group-flush">
                            {audits.map(audit => (<li key={audit.id}
                                                      className={`list-group-item list-group-item-action ${selectedAudit?.id === audit.id ? 'active' : ''}`}
                                                      onClick={() => handleSelectAudit(audit.id)}
                                                      style={{cursor: 'pointer'}}>
                                    {audit.title}
                                </li>))}
                        </ul>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Szczegóły Audytu</div>
                        <div className="card-body">
                            {selectedAudit ? (<>
                                    <h3>{selectedAudit.title}</h3>
                                    <p><strong>Data
                                        utworzenia:</strong> {new Date(selectedAudit.createdAt).toLocaleString()}</p>
                                    {selectedAudit.description && (<>
                                            <strong>Opis:</strong>
                                            <div className="p-2 border rounded bg-light"
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(selectedAudit.description)}}/>
                                        </>)}
                                    <hr/>
                                    <h5>Przypisane incydenty ({selectedAudit.incidents.length})</h5>
                                    <div className="table-responsive" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                        <table className="table table-sm table-striped">
                                            <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Status</th>
                                                <th>Miejsce</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {selectedAudit.incidents.map(inc => (<tr key={inc.id}>
                                                    <td>{inc.id}</td>
                                                    <td><span className="badge bg-info">{inc.status}</span></td>
                                                    <td>{inc.locationName || 'Brak'}</td>
                                                </tr>))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button className="btn btn-primary mt-3"
                                            onClick={() => handleGenerateReport(selectedAudit.id)}>Generuj Raport (DOCX)
                                    </button>
                                </>) : (<p>Wybierz audyt z listy, aby zobaczyć szczegóły.</p>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};

export default AuditPanel;