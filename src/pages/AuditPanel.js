import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { saveAs } from 'file-saver';
import SelectionModal from '../components/SelectionModal';

// Importuj swoje podstawowe stylizowane komponenty
import { Title, PageHeader, Button, Card, CardHeader, CardBody, CardFooter } from '../components/Styled';

// --- STYLIZOWANE KOMPONENTY SPECYFICZNE DLA TEGO WIDOKU ---

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const AuditList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  max-height: 500px; // Ograniczenie wysokości na wypadek wielu audytów
`;

const AuditListItem = styled.li`
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color ${({ theme }) => theme.transitionSpeed} ease, color ${({ theme }) => theme.transitionSpeed} ease;
  font-size: 0.9rem;

  &.active {
    background-color: ${({ theme }) => theme.colors.accent}20; // Subtelniejsze tło
    font-weight: 600;
    color: ${({ theme }) => theme.colors.accent};
    border-left: 3px solid ${({ theme }) => theme.colors.accent}; // Akcent wizualny
    padding-left: calc(1.5rem - 3px);
  }

  &:hover:not(.active) {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const DetailsSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    margin: 0.5rem 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.9rem;
    strong {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 600;
    }
  }
`;

const DescriptionBox = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    padding: 0.8rem 1rem;
    white-space: pre-wrap;
    font-size: 0.9rem;
    margin-top: 0.5rem;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h5 {
      margin: 0;
      font-size: 1.1rem;
    }
`;

const MemberList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const MemberListItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    margin-bottom: 0.5rem;
    background-color: ${({ theme }) => theme.colors.background};
`;

const IncidentTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    th, td {
        padding: 0.6rem 0.8rem;
        text-align: left;
        border-bottom: 1px solid ${({ theme }) => theme.colors.border};
        font-size: 0.85rem;
        vertical-align: middle;
    }
    th {
        font-weight: 700;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.textSecondary};
    }
    tbody tr {
        cursor: pointer;
        transition: background-color 0.2s ease;
        &:hover {
            background-color: ${({ theme }) => theme.colors.backgroundHover};
        }
    }
`;

const DetailsCell = styled.td`
    padding: 1rem 1.5rem !important;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
`;

const Badge = styled.span`
    display: inline-block;
    padding: 0.3em 0.7em;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 12px;
    background-color: ${({ color }) => color.bg};
    color: ${({ color }) => color.text};
`;

// --- GŁÓWNY KOMPONENT ---

const AuditPanel = () => {
    const [allAudits, setAllAudits] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [expandedIncidentId, setExpandedIncidentId] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [auditsResponse, usersResponse] = await Promise.all([
                api.get('/audits'),
                api.get('/users')
            ]);
            setAllAudits(auditsResponse.data);
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

    const { latestAudits, archivedAudits } = useMemo(() => {
        const sorted = [...allAudits].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return {
            latestAudits: sorted.slice(0, 10),
            archivedAudits: sorted.slice(10)
        };
    }, [allAudits]);

    const handleSelectAudit = async (auditId) => {
        // Zoptymalizowane - nie pobieraj jeśli już jest wybrany
        if (selectedAudit?.id === auditId) return;

        try {
            const response = await api.get(`/audits/${auditId}`);
            setSelectedAudit(response.data);
            setExpandedIncidentId(null);
        } catch (error) {
            console.error("Błąd podczas pobierania szczegółów audytu:", error);
            setSelectedAudit(null);
        }
    };

    // Funkcje pomocnicze
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString('pl-PL') : 'Brak';
    const displayValue = (value) => value || <span style={{ color: '#888' }}>Brak</span>;

    const severityStyles = {
        ZWYKLY: { bg: '#28a745', text: '#ffffff' },
        PILNY: { bg: '#fd7e14', text: '#ffffff' },
        KRYTYCZNY: { bg: '#dc3545', text: '#ffffff' },
        DOMYSLNY: { bg: '#6c757d', text: '#ffffff' }
    };
    const getSeverityColor = (severity) => severityStyles[severity] || severityStyles.DOMYSLNY;

    // Handlery
    const handleCreateAudit = async () => {
        const title = prompt("Wprowadź tytuł nowego audytu:");
        if (title) { try { await api.post('/audits', { title }); fetchData(); } catch (err) { alert("Nie udało się utworzyć audytu."); } }
    };
    const handleGenerateReport = async (auditId) => {
        // ... (bez zmian)
    };
    const handleAddMemberClick = () => { if (!selectedAudit) return; setIsUserModalOpen(true); };
    const handleConfirmUserSelection = async (userId) => {
        // ... (bez zmian)
    };
    const handleRemoveMember = async (userId) => {
        // ... (bez zmian)
    };

    if (isLoading) return <p>Ładowanie audytów...</p>;

    return (
        <div>
            <SelectionModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onConfirm={handleConfirmUserSelection} title="Wybierz użytkownika do dodania" items={allUsers.filter(u => !selectedAudit?.members.some(m => m.id === u.id))} displayField="name" subDisplayField="email" />

            <PageHeader>
                <Title>Panel Audytów</Title>
                <Button onClick={handleCreateAudit}>+ Stwórz Nowy Audyt</Button>
            </PageHeader>

            <TwoColumnLayout>
                <Card>
                    <CardHeader>Najnowsze Audyty (max 10)</CardHeader>
                    <AuditList>
                        {latestAudits.length > 0 ? latestAudits.map(audit => (
                            <AuditListItem key={audit.id} className={selectedAudit?.id === audit.id ? 'active' : ''} onClick={() => handleSelectAudit(audit.id)}>
                                {audit.title}
                            </AuditListItem>
                        )) : (
                            <li style={{padding: '1rem 1.5rem', color: '#888'}}>Brak audytów do wyświetlenia.</li>
                        )}
                    </AuditList>
                    <CardFooter style={{ textAlign: 'center' }}>
                        <Link to="/audits-archive">
                            Przejdź do Archiwum ({archivedAudits.length} starszych audytów)
                        </Link>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>Szczegóły Audytu</CardHeader>
                    <CardBody>
                        {selectedAudit ? (
                            <>
                                <DetailsSection>
                                    <h3>{selectedAudit.title}</h3>
                                    <p><strong>Właściciel:</strong> {selectedAudit.owner?.name} ({selectedAudit.owner?.email})</p>
                                    <p><strong>Data utworzenia:</strong> {formatDate(selectedAudit.createdAt)}</p>
                                    {selectedAudit.description && (
                                        <>
                                            <p><strong>Opis:</strong></p>
                                            <DescriptionBox>{selectedAudit.description}</DescriptionBox>
                                        </>
                                    )}
                                </DetailsSection>

                                <SectionHeader>
                                    <h5>Członkowie Audytu ({selectedAudit.members.length})</h5>
                                    <Button variant="outline" onClick={handleAddMemberClick}>Dodaj Członka</Button>
                                </SectionHeader>
                                <MemberList>
                                    {selectedAudit.members.map(member => (
                                        <MemberListItem key={member.id}>
                                            <span>{member.name} ({member.email})</span>
                                            <Button variant="danger-outline" size="sm" onClick={() => handleRemoveMember(member.id)}>Usuń</Button>
                                        </MemberListItem>
                                    ))}
                                </MemberList>

                                <hr style={{margin: '2rem 0'}}/>

                                <SectionHeader>
                                    <h5>Przypisane incydenty ({selectedAudit.incidents.length})</h5>
                                </SectionHeader>
                                <div style={{ maxHeight: '400px', overflowY: 'auto', border: `1px solid #ddd`, borderRadius: '6px' }}>
                                    <IncidentTable>
                                        <thead><tr><th>ID</th><th>Tytuł (fragment opisu)</th><th>Szkodliwość</th></tr></thead>
                                        <tbody>
                                        {selectedAudit.incidents.map(incident => (
                                            <React.Fragment key={incident.id}>
                                                <tr onClick={() => setExpandedIncidentId(expandedIncidentId === incident.id ? null : incident.id)}>
                                                    <td><strong>{incident.id}</strong></td>
                                                    <td>{(incident.description || '').substring(0, 50)}{incident.description && incident.description.length > 50 ? '...' : ''}</td>
                                                    <td><Badge color={getSeverityColor(incident.severity)}>{displayValue(incident.severity)}</Badge></td>
                                                </tr>
                                                {expandedIncidentId === incident.id && (
                                                    <tr>
                                                        <DetailsCell colSpan="3">
                                                            <strong>Pełny opis:</strong>
                                                            <DescriptionBox>{incident.description || 'Brak opisu.'}</DescriptionBox>
                                                        </DetailsCell>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        </tbody>
                                    </IncidentTable>
                                </div>
                                <Button style={{marginTop: '1.5rem'}} onClick={() => handleGenerateReport(selectedAudit.id)}>Generuj Raport (ODT)</Button>
                            </>
                        ) : (
                            <p style={{textAlign: 'center', color: '#888', padding: '3rem 0'}}>Wybierz audyt z listy, aby zobaczyć szczegóły.</p>
                        )}
                    </CardBody>
                </Card>
            </TwoColumnLayout>
        </div>
    );
};

export default AuditPanel;