import React, { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { saveAs } from 'file-saver';
import SelectionModal from '../components/SelectionModal'; // Importujemy nowy komponent

const AuditPanel = () => {
    const [audits, setAudits] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Stan do zarządzania widocznością modala wyboru użytkownika
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [auditsResponse, usersResponse] = await Promise.all([
                api.get('/audits'),
                api.get('/users') // Pobieramy listę wszystkich użytkowników do wyboru
            ]);
            setAudits(auditsResponse.data);
            setAllUsers(usersResponse.data);
        } catch (error) {
            console.error("Błąd podczas pobierania danych:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                await api.post('/audits', { title });
                fetchData(); // Odśwież listę audytów
            } catch (err) {
                alert("Nie udało się utworzyć audytu.");
            }
        }
    };

    const handleGenerateReport = async (auditId) => {
        try {
            const response = await api.get(`/audits/${auditId}/report`, { responseType: 'blob' });
            const contentDisposition = response.headers['content-disposition'];
            let filename = `raport_audytu_${auditId}.odt`;
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

    // Ta funkcja jest wywoływana, gdy użytkownik kliknie przycisk "Dodaj członka"
    const handleAddMemberClick = () => {
        if (!selectedAudit) return;
        setIsUserModalOpen(true); // Otwiera modal
    };

    // Ta funkcja jest wywoływana przez modal po potwierdzeniu wyboru
    const handleConfirmUserSelection = async (userId) => {
        try {
            const response = await api.post(`/audits/${selectedAudit.id}/members/${userId}`);
            setSelectedAudit(response.data); // Zaktualizuj widok o nowego członka
        } catch (error) {
            alert("Nie udało się dodać członka. Sprawdź, czy użytkownik nie jest już w audycie.");
        }
    };

    const handleRemoveMember = async (userId) => {
        if (window.confirm(`Czy na pewno chcesz usunąć użytkownika o ID ${userId} z audytu?`) && selectedAudit) {
            try {
                const response = await api.delete(`/audits/${selectedAudit.id}/members/${userId}`);
                setSelectedAudit(response.data);
            } catch (error) {
                alert("Nie udało się usunąć członka.");
            }
        }
    };

    if (isLoading) return <p>Ładowanie audytów...</p>;

    return (
        <div className="container mt-4">
            {/* Renderujemy modal - jest niewidoczny, dopóki isUserModalOpen nie jest true */}
            <SelectionModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onConfirm={handleConfirmUserSelection}
                title="Wybierz użytkownika, aby dodać go do audytu"
                items={allUsers.filter(u => !selectedAudit?.members.some(m => m.id === u.id))} // Pokaż tylko użytkowników, którzy nie są jeszcze członkami
                displayField="name"
                subDisplayField="email"
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Panel Audytów</h1>
                <button onClick={handleCreateAudit} className="btn btn-success btn-lg">+ Stwórz Nowy Audyt</button>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">Lista Audytów</div>
                        <ul className="list-group list-group-flush">
                            {audits.map(audit => (
                                <li key={audit.id}
                                    className={`list-group-item list-group-item-action ${selectedAudit?.id === audit.id ? 'active' : ''}`}
                                    onClick={() => handleSelectAudit(audit.id)}
                                    style={{ cursor: 'pointer' }}>
                                    {audit.title}
                                </li>
                            ))}
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
                                    <p><strong>Właściciel:</strong> {selectedAudit.owner?.name} ({selectedAudit.owner?.email})</p>
                                    <p><strong>Data utworzenia:</strong> {new Date(selectedAudit.createdAt).toLocaleString()}</p>
                                    {selectedAudit.description && (
                                        <>
                                            <strong>Opis:</strong>
                                            <div className="p-2 border rounded bg-light" style={{ whiteSpace: 'pre-wrap' }}>
                                                {selectedAudit.description}
                                            </div>
                                        </>
                                    )}
                                    <hr />

                                    <h5>Członkowie Audytu ({selectedAudit.members.length})</h5>
                                    <ul className="list-group mb-3">
                                        {selectedAudit.members.map(member => (
                                            <li key={member.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                {member.name} ({member.email})
                                                <button onClick={() => handleRemoveMember(member.id)} className="btn btn-danger btn-sm">Usuń</button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={handleAddMemberClick} className="btn btn-outline-primary btn-sm">Dodaj Członka</button>

                                    <hr />

                                    <h5>Przypisane incydenty ({selectedAudit.incidents.length})</h5>
                                    <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <table className="table table-sm table-striped">
                                            <thead>
                                            <tr><th>ID</th><th>Status</th><th>Miejsce</th></tr>
                                            </thead>
                                            <tbody>
                                            {selectedAudit.incidents.map(inc => (
                                                <tr key={inc.id}>
                                                    <td>{inc.id}</td>
                                                    <td><span className="badge bg-info">{inc.status}</span></td>
                                                    <td>{inc.locationName || 'Brak'}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <button className="btn btn-primary mt-3" onClick={() => handleGenerateReport(selectedAudit.id)}>
                                        Generuj Raport (ODT)
                                    </button>
                                </>
                            ) : (
                                <p>Wybierz audyt z listy, aby zobaczyć szczegóły.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditPanel;