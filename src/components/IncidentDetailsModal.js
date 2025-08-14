import React from 'react';

const PHOTO_BASE_URL = 'http://localhost:8080/api/incidents/photos/';

const IncidentDetailsModal = ({incident, onClose}) => {
    if (!incident) return null;

    return (<div className="modal show" tabIndex="-1" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Szczegóły Incydentu #{incident.id}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <h6>Opis zdarzenia:</h6>
                        <p>{incident.description}</p>
                        <hr/>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Zgłaszający:</strong> {incident.reporter.name}</p>
                                <p><strong>Email zgłaszającego:</strong> {incident.reporter.email}</p>
                                <p><strong>Data zgłoszenia:</strong> {new Date(incident.reportedAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Kategoria:</strong> {incident.category.name}</p>
                                <p><strong>Dział:</strong> {incident.department.name}</p>
                            </div>
                        </div>
                        <hr/>
                        <h6>Załączone zdjęcia:</h6>
                        {incident.photos.length > 0 ? (<div className="row">
                                {incident.photos.map(photo => (<div key={photo.id} className="col-md-4 mb-3">
                                        <a href={`${PHOTO_BASE_URL}${photo.objectName}`} target="_blank"
                                           rel="noopener noreferrer">
                                            <img src={`${PHOTO_BASE_URL}${photo.objectName}`}
                                                 className="img-fluid rounded" alt="Zdjęcie incydentu"/>
                                        </a>
                                    </div>))}
                            </div>) : (<p>Brak załączonych zdjęć.</p>)}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Zamknij</button>
                    </div>
                </div>
            </div>
        </div>);
};

export default IncidentDetailsModal;