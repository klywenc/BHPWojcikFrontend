import React from 'react';

const IncidentList = ({
                          incidents,
                          categories,
                          departments,
                          filters,
                          onFilterChange,
                          onViewDetails,
                          onEdit,
                          onGenerateReport
                      }) => {
    return (
        <div className="card">
            <div className="card-header">
                Przeglądaj zgłoszone incydenty
            </div>
            <div className="card-body">
                {/* SEKCJA FILTRÓW I AKCJI */}
                <div className="row mb-4 align-items-center">
                    <div className="col-md-3">
                        <select name="categoryId" value={filters.categoryId} onChange={onFilterChange}
                                className="form-select">
                            <option value="">Wszystkie kategorie</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select name="departmentId" value={filters.departmentId} onChange={onFilterChange}
                                className="form-select">
                            <option value="">Wszystkie działy</option>
                            {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select name="sortDate" value={filters.sortDate} onChange={onFilterChange}
                                className="form-select">
                            <option value="">Sortuj po dacie</option>
                            <option value="desc">Od najnowszych</option>
                            <option value="asc">Od najstarszych</option>
                        </select>
                    </div>
                    <div className="col-md-3 text-end">
                        <button onClick={onGenerateReport} className="btn btn-success">
                            Generuj Raport (XLSX)
                        </button>
                    </div>
                </div>

                {/* TABELA Z INCYDENTAMI */}
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Opis (fragment)</th>
                            <th>Kategoria</th>
                            <th>Dział</th>
                            <th>Data zgłoszenia</th>
                            <th>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {incidents.length > 0 ? (
                            incidents.map(incident => (
                                <tr key={incident.id}>
                                    <td>{incident.id}</td>
                                    {/* ZMIANA TUTAJ: Bezpieczne obcinanie opisu */}
                                    <td>
                                        {incident.description && incident.description.length > 50
                                            ? `${incident.description.substring(0, 50)}...`
                                            : incident.description}
                                    </td>
                                    {/* ZMIANA TUTAJ: Odwołujemy się do nowych, płaskich pól z DTO */}
                                    <td>{incident.categoryName}</td>
                                    <td>{incident.departmentName}</td>
                                    <td>{new Date(incident.reportedAt).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => onViewDetails(incident)}
                                                className="btn btn-info btn-sm me-2">Szczegóły
                                        </button>
                                        <button onClick={() => onEdit(incident)}
                                                className="btn btn-warning btn-sm">Edytuj
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">Brak incydentów do wyświetlenia.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IncidentList;