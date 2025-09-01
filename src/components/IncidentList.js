import React, {useState} from 'react';
import DOMPurify from 'dompurify';

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
                          selectedIncidentIds
                      }) => {
    const [expandedId, setExpandedId] = useState(null);

    const toggleDetails = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEditClick = (e, incident) => {
        e.stopPropagation();
        onEdit(incident);
    };

    const formatDate = (dateString) => {
        if (!dateString) return <span className="text-muted">Brak danych</span>;
        try {
            const date = new Date(dateString);
            return dateString.includes('T') ? date.toLocaleString('pl-PL') : date.toLocaleDateString('pl-PL');
        } catch {
            return 'Nieprawidłowa data';
        }
    };

    const displayValue = (value) => value || <span className="text-muted">Brak</span>;

    const renderPhotos = (photoNames) => {
        if (!photoNames || photoNames.length === 0) return <p className="text-muted">Brak zdjęć</p>;
        return (<div className="d-flex flex-wrap align-items-start">
                {photoNames.map((name, index) => (
                    <a href={`http://localhost:8080/api/incidents/photos/${encodeURIComponent(name)}`} target="_blank"
                       rel="noopener noreferrer" key={name + index}>
                        <img
                            src={`http://localhost:8080/api/incidents/photos/${encodeURIComponent(name)}`}
                            alt={`Zdjęcie incydentu ${index + 1}`}
                            style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                margin: '5px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </a>))}
            </div>);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'NOWY':
                return 'primary';
            case 'POWTARZAJACY_SIE':
                return 'info';
            case 'W_TRAKCIE_ROZWIAZYWANIA':
                return 'warning';
            case 'ROZWIAZANY':
                return 'success';
            default:
                return 'secondary';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'ZWYKLY':
                return 'success';
            case 'PILNY':
                return 'warning';
            case 'KRYTYCZNY':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    return (<div className="card">
            <div className="card-header"><h4 className="mb-0">Przeglądaj zgłoszone incydenty</h4></div>
            <div className="card-body">
                <div className="row mb-4 align-items-center">
                    <div className="col-md-3"><label className="form-label">Kategoria</label><select name="categoryId"
                                                                                                     value={filters.categoryId || ''}
                                                                                                     onChange={onFilterChange}
                                                                                                     className="form-select">
                        <option value="">Wszystkie kategorie</option>
                        {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <div className="col-md-3"><label className="form-label">Dział</label><select name="departmentId"
                                                                                                 value={filters.departmentId || ''}
                                                                                                 onChange={onFilterChange}
                                                                                                 className="form-select">
                        <option value="">Wszystkie działy</option>
                        {departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                    <div className="col-md-3"><label className="form-label">Miejsce</label><select name="locationId"
                                                                                                   value={filters.locationId || ''}
                                                                                                   onChange={onFilterChange}
                                                                                                   className="form-select">
                        <option value="">Wszystkie miejsca</option>
                        {locations?.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                    <div className="col-md-3 text-end">
                        <button onClick={onGenerateReport} className="btn btn-success mt-3">Generuj Raport (XLSX)
                        </button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>Audyt</th>
                            <th>Miejsce</th>
                            <th>Szkodliwość</th>
                            <th>Status</th>
                            <th>Osoba Odpowiedzialna</th>
                            <th>Data Zgłoszenia</th>
                            <th>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {incidents.length > 0 ? (incidents.map(incident => (<React.Fragment key={incident.id}>
                                    <tr className={selectedIncidentIds.includes(incident.id) ? 'table-active' : ''}>
                                        <td><input type="checkbox" className="form-check-input"
                                                   checked={selectedIncidentIds.includes(incident.id)}
                                                   onChange={() => onSelectionChange(incident.id)}/></td>
                                        <td onClick={() => toggleDetails(incident.id)} style={{cursor: 'pointer'}}>
                                            <strong>{incident.id}</strong></td>
                                        <td onClick={() => toggleDetails(incident.id)}
                                            style={{cursor: 'pointer'}}>{incident.auditTitle ||
                                            <span className="text-muted">Brak</span>}</td>
                                        <td onClick={() => toggleDetails(incident.id)}
                                            style={{cursor: 'pointer'}}>{displayValue(incident.locationName)}</td>
                                        <td onClick={() => toggleDetails(incident.id)} style={{cursor: 'pointer'}}><span
                                            className={`badge fs-6 bg-${getSeverityColor(incident.severity)}`}>{displayValue(incident.severity)}</span>
                                        </td>
                                        <td onClick={() => toggleDetails(incident.id)} style={{cursor: 'pointer'}}><span
                                            className={`badge fs-6 bg-${getStatusColor(incident.status)}`}>{displayValue(incident.status)}</span>
                                        </td>
                                        <td onClick={() => toggleDetails(incident.id)}
                                            style={{cursor: 'pointer'}}>{displayValue(incident.responsiblePersonName)}</td>
                                        <td onClick={() => toggleDetails(incident.id)}
                                            style={{cursor: 'pointer'}}>{formatDate(incident.reportedAt)}</td>
                                        <td>{userRole !== 'ROLE_DYREKTOR' && (
                                            <button onClick={(e) => handleEditClick(e, incident)}
                                                    className="btn btn-warning btn-sm">Edytuj</button>)}</td>
                                    </tr>
                                    {expandedId === incident.id && (<tr>
                                            <td colSpan="9" className="p-0">
                                                <div className="p-3 bg-light border">
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <h5 className="mb-3">Szczegóły incydentu
                                                                (GUID: {incident.guid})</h5>
                                                            <hr/>
                                                            <strong>Opis zdarzenia:</strong>
                                                            <div className="bg-white p-2 border rounded"
                                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(incident.description)}}/>
                                                            <strong>Opis rozwiązania:</strong>
                                                            <p className="bg-white p-2 border rounded"
                                                               style={{whiteSpace: 'pre-wrap'}}>{incident.resolutionDescription || 'Brak opisu rozwiązania.'}</p>
                                                            <div className="row mt-3">
                                                                <div className="col-sm-6"><p>
                                                                    <strong>Kategoria:</strong> {displayValue(incident.categoryName)}
                                                                </p><p>
                                                                    <strong>Dział:</strong> {displayValue(incident.departmentName)}
                                                                </p><p>
                                                                    <strong>Zgłaszający:</strong> {displayValue(incident.reporterName)}
                                                                </p></div>
                                                                <div className="col-sm-6"><p><strong>Przewidywana data
                                                                    rozwiązania:</strong> {formatDate(incident.estimatedResolutionDate)}
                                                                </p><p><strong>Faktyczna data
                                                                    rozwiązania:</strong> {formatDate(incident.actualResolutionDate)}
                                                                </p></div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <strong>Zdjęcia:</strong>{renderPhotos(incident.photoObjectNames)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>)}
                                </React.Fragment>))) : (<tr>
                                <td colSpan="9" className="text-center p-4">Brak incydentów do wyświetlenia.</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
};

export default IncidentList;