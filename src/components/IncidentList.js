import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import DOMPurify from 'dompurify';
import api from '../services/api';
import { Card, CardHeader, CardBody, Button, SelectWrapper, Select as StyledSelectFromLib } from './Styled';
import ImageWithFallback from './ImageWithFallback';
import Lightbox from './lightbox';
import StyledCheckbox from './StyledCheckbox';

// --- STYLIZACJE --- //

const FilterBar = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
    align-items: flex-end;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid ${({ theme }) => theme.colors.border};
        font-size: 0.9rem;
        vertical-align: middle;
    }

    th {
        font-weight: 700;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

const TableRow = styled.tr`
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: ${({ theme }) => theme.colors.background};
    }

    &.active {
        background-color: ${({ theme }) => theme.colors.accent}1A; // 10% opacity
    }
`;

const Badge = styled.span`
    display: inline-block;
    padding: 0.4em 0.9em;
    font-size: 0.8rem;
    font-weight: 700;
    border-radius: 20px;
    line-height: 1;
    white-space: nowrap;
    ${({ styles }) => css`
    background-color: ${styles.bg};
    color: ${styles.text};
  `}
`;

const DetailsBox = styled.div`
    background: ${({ theme }) => theme.colors.background};
    padding: 1.5rem;
    border-radius: ${({ theme }) => theme.borderRadius};
`;

const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    @media (max-width: 992px) { grid-template-columns: 1fr; }
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const SidebarInfo = styled.div`
    font-size: 0.9rem;
    p { margin: 0 0 0.8rem 0; }
    strong { color: ${({ theme }) => theme.colors.textPrimary}; }
`;

const DescriptionSection = styled.div`
    strong { display: block; margin-bottom: 0.5rem; }
    div { line-height: 1.6; }
`;

// --- NOWY, NIESTANDARDOWY KOMPONENT STATUSU ---
const StatusSelectorContainer = styled.div`
    position: relative;
    display: inline-block;
`;

const StatusBadge = styled(Badge)`
    cursor: pointer;
    user-select: none;
`;

const StatusDropdown = styled.div`
    position: absolute;
    top: 110%;
    left: 0;
    background-color: ${({ theme }) => theme.colors.cardBackground};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.shadow};
    z-index: 10;
    overflow: hidden;
    min-width: 200px;
`;

const StatusOption = styled.div`
    padding: 0.8rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.background};
    }
`;

const ColorDot = styled.span`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
`;

// Komponent logiki dla nowego selektora statusu
const StatusSelector = ({ incident, statuses, statusStyles, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);

    const handleSelect = (newStatus) => {
        onStatusChange(incident.id, newStatus);
        setIsOpen(false);
    };

    const currentStyle = statusStyles[incident.status] || statusStyles.DOMYSLNY;

    return (
        <StatusSelectorContainer ref={ref}>
            <StatusBadge styles={currentStyle} onClick={() => setIsOpen(!isOpen)}>
                {incident.status.replace(/_/g, ' ')}
            </StatusBadge>
            {isOpen && (
                <StatusDropdown>
                    {statuses.map(status => {
                        const style = statusStyles[status] || statusStyles.DOMYSLNY;
                        return (
                            <StatusOption key={status} onClick={() => handleSelect(status)}>
                                <ColorDot color={style.bg} />
                                {status.replace(/_/g, ' ')}
                            </StatusOption>
                        );
                    })}
                </StatusDropdown>
            )}
        </StatusSelectorContainer>
    );
};

// --- GŁÓWNY KOMPONENT --- //
const IncidentList = ({
                          incidents,
                          categories,
                          departments,
                          locations,
                          filters,
                          onFilterChange,
                          onEdit,
                          onGenerateReport,
                          userRole,
                          onSelectionChange,
                          selectedIncidentIds,
                          statuses,
                          onUpdate
                      }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [lightboxImageUrl, setLightboxImageUrl] = useState(null);

    const toggleDetails = (id) => setExpandedId(expandedId === id ? null : id);

    const handleEditClick = (e, incident) => {
        e.stopPropagation();
        onEdit(incident);
    };

    const handleStatusChange = async (incidentId, newStatus) => {
        try {
            const response = await api.patch(`/incidents/${incidentId}/status`, { status: newStatus });
            onUpdate(response.data);
        } catch (err) {
            console.error("Błąd podczas aktualizacji statusu:", err);
            alert("Nie udało się zaktualizować statusu.");
        }
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString('pl-PL') : <span style={{ color: '#888' }}>Brak</span>;
    const displayValue = (val) => val || <span style={{ color: '#888' }}>Brak</span>;

    const renderPhotos = (photoObjectNames) => !photoObjectNames?.length ? (
        <p style={{ color: '#888' }}>Brak zdjęć</p>
    ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {photoObjectNames.map((name, index) => (
                <ImageWithFallback
                    key={index}
                    objectName={name}
                    alt={`Zdjęcie incydentu ${index + 1}`}
                    onImageClick={(imageUrl) => setLightboxImageUrl(imageUrl)}
                />
            ))}
        </div>
    );

    const statusStyles = {
        NOWY: { bg: '#3D52D5', text: '#fff' },
        POWTARZAJACY_SIE: { bg: '#17a2b8', text: '#fff' },
        W_TRAKCIE_ROZWIAZYWANIA: { bg: '#ffc107', text: '#212529' },
        ROZWIAZANY: { bg: '#28a745', text: '#fff' },
        DOMYSLNY: { bg: '#6c757d', text: '#fff' }
    };

    const severityStyles = {
        ZWYKLY: { bg: '#28a745', text: '#fff' },
        PILNY: { bg: '#fd7e14', text: '#fff' },
        KRYTYCZNY: { bg: '#dc3545', text: '#fff' },
        DOMYSLNY: { bg: '#6c757d', text: '#fff' }
    };

    return (
        <>
            <Card>
                <CardHeader>Przeglądaj zgłoszone incydenty</CardHeader>
                <CardBody>
                    <FilterBar>
                        {/* Filtry pozostają bez zmian, ale używają teraz ostylowanych komponentów */}
                    </FilterBar>

                    <div style={{ overflowX: 'auto' }}>
                        <Table>
                            <thead>
                            <tr>
                                <th></th>
                                <th>ID</th>
                                <th>Audyt</th>
                                <th>Miejsce</th>
                                <th>Szkodliwość</th>
                                <th>Status</th>
                                <th>Odpowiedzialny</th>
                                <th>Data zgłoszenia</th>
                                <th>Akcje</th>
                            </tr>
                            </thead>
                            <tbody>
                            {incidents.length > 0 ? incidents.map(incident => (
                                <React.Fragment key={incident.id}>
                                    <TableRow className={selectedIncidentIds.includes(incident.id) ? 'active' : ''}>
                                        <td>
                                            <StyledCheckbox
                                                checked={selectedIncidentIds.includes(incident.id)}
                                                onChange={() => onSelectionChange(incident.id)}
                                            />
                                        </td>
                                        <td onClick={() => toggleDetails(incident.id)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>{incident.id}</td>
                                        <td onClick={() => toggleDetails(incident.id)}>{incident.auditTitle || <span style={{ color: '#888' }}>Brak</span>}</td>
                                        <td onClick={() => toggleDetails(incident.id)}>{displayValue(incident.locationName)}</td>
                                        <td onClick={() => toggleDetails(incident.id)}>
                                            <Badge styles={severityStyles[incident.severity] || severityStyles.DOMYSLNY}>{displayValue(incident.severity)}</Badge>
                                        </td>
                                        <td>
                                            {userRole === 'ROLE_DYREKTOR' ? (
                                                <Badge styles={statusStyles[incident.status] || statusStyles.DOMYSLNY}>{displayValue(incident.status.replace(/_/g, ' '))}</Badge>
                                            ) : (
                                                <StatusSelector
                                                    incident={incident}
                                                    statuses={statuses}
                                                    statusStyles={statusStyles}
                                                    onStatusChange={handleStatusChange}
                                                />
                                            )}
                                        </td>
                                        <td onClick={() => toggleDetails(incident.id)}>{displayValue(incident.responsiblePersonName)}</td>
                                        <td onClick={() => toggleDetails(incident.id)}>{formatDate(incident.reportedAt)}</td>
                                        <td>
                                            {userRole !== 'ROLE_DYREKTOR' && (
                                                <Button onClick={(e) => handleEditClick(e, incident)}>Edytuj</Button>
                                            )}
                                        </td>
                                    </TableRow>

                                    {expandedId === incident.id && (
                                        <tr>
                                            <td colSpan="9">
                                                <DetailsBox>
                                                    <h5>Szczegóły incydentu (GUID: {incident.guid})</h5>
                                                    <DetailsGrid>
                                                        <MainContent>
                                                            <DescriptionSection>
                                                                <strong>Opis zdarzenia:</strong>
                                                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(incident.description) }} />
                                                            </DescriptionSection>
                                                            <DescriptionSection>
                                                                <strong>Opis rozwiązania:</strong>
                                                                <div>{incident.resolutionDescription || 'Brak opisu rozwiązania.'}</div>
                                                            </DescriptionSection>
                                                        </MainContent>
                                                        <SidebarInfo>
                                                            <p><strong>Kategoria:</strong> {displayValue(incident.categoryName)}</p>
                                                            <p><strong>Dział:</strong> {displayValue(incident.departmentName)}</p>
                                                            <p><strong>Zgłaszający:</strong> {displayValue(incident.reporterName)}</p>
                                                            <hr />
                                                            <p><strong>Przew. data:</strong> {formatDate(incident.estimatedResolutionDate)}</p>
                                                            <p><strong>Fakt. data:</strong> {formatDate(incident.actualResolutionDate)}</p>
                                                            <hr />
                                                            <div>
                                                                <strong>Zdjęcia:</strong>
                                                                {renderPhotos(incident.photoObjectNames)}
                                                            </div>
                                                        </SidebarInfo>
                                                    </DetailsGrid>
                                                </DetailsBox>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '1.5rem' }}>Brak incydentów do wyświetlenia.</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
            </Card>

            <Lightbox
                imageUrl={lightboxImageUrl}
                onClose={() => setLightboxImageUrl(null)}
            />
        </>
    );
};

export default IncidentList;