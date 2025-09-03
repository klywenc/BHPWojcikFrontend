import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { saveAs } from 'file-saver';
import IncidentList from '../components/IncidentList';
import IncidentEditModal from '../components/IncidentEditModal';
import IncidentAddModal from '../components/IncidentAddModal';
import SelectionModal from '../components/SelectionModal'; // Importujemy nowy komponent

const UserDashboard = () => {
    const { user } = useContext(AuthContext);

    // Stany
    const [incidents, setIncidents] = useState([]);
    const [filteredIncidents, setFilteredIncidents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [severities, setSeverities] = useState([]);
    const [audits, setAudits] = useState([]);
    const [selectedIncidentIds, setSelectedIncidentIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [filters, setFilters] = useState({ categoryId: '', departmentId: '', locationId: '' });

    // Stan do zarządzania widocznością modala wyboru audytu
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

    // Pobieranie danych
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [incidentsRes, categoriesRes, departmentsRes, locationsRes, usersRes, statusesRes, severitiesRes, auditsRes] = await Promise.all([
                api.get('/incidents'),
                api.get('/dictionaries/categories'),
                api.get('/dictionaries/departments'),
                api.get('/dictionaries/locations'),
                api.get('/users'),
                api.get('/admin/incidents/statuses'),
                api.get('/admin/incidents/severities'),
                api.get('/audits')
            ]);
            setIncidents(incidentsRes.data);
            setFilteredIncidents(incidentsRes.data);
            setCategories(categoriesRes.data);
            setDepartments(departmentsRes.data);
            setLocations(locationsRes.data);
            setStatuses(statusesRes.data);
            setSeverities(severitiesRes.data);
            setDirectors(usersRes.data.filter(u => u.role === 'ROLE_DYREKTOR'));
            setAudits(auditsRes.data);
        } catch (err) {
            console.error(err);
            setError('Nie udało się załadować danych. Sprawdź połączenie z serwerem i swoje uprawnienia.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Filtracja incydentów
    useEffect(() => {
        let result = [...incidents];
        if (filters.categoryId) {
            const categoryName = categories.find(c => c.id === parseInt(filters.categoryId, 10))?.name;
            result = result.filter(inc => inc.categoryName === categoryName);
        }
        if (filters.departmentId) {
            const departmentName = departments.find(d => d.id === parseInt(filters.departmentId, 10))?.name;
            result = result.filter(inc => inc.departmentName === departmentName);
        }
        if (filters.locationId) {
            const locationName = locations.find(l => l.id === parseInt(filters.locationId, 10))?.name;
            result = result.filter(inc => inc.locationName === locationName);
        }
        setFilteredIncidents(result);
    }, [filters, incidents, categories, departments, locations]);

    // Handlery
    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleEdit = (incident) => {
        setSelectedIncident(incident);
        setEditModalOpen(true);
    };
    const handleUpdate = (updatedIncident) => setIncidents(prev => prev.map(inc => inc.id === updatedIncident.id ? updatedIncident : inc));
    const handleIncidentAdded = () => fetchData();
    const handleGenerateReport = async () => {
        try {
            const response = await api.get('/reports/incidents/xlsx', { responseType: 'blob' });
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'raport_incydentow.xlsx';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match && match[1]) filename = match[1];
            }
            saveAs(response.data, filename);
        } catch (err) {
            console.error(err);
            setError('Nie udało się wygenerować raportu.');
        }
    };
    const handleSelectionChange = (incidentId) => {
        setSelectedIncidentIds(prev =>
            prev.includes(incidentId)
                ? prev.filter(id => id !== incidentId)
                : [...prev, incidentId]
        );
    };

    // Ta funkcja jest wywoływana, gdy użytkownik kliknie przycisk "Przypisz do audytu"
    const handleAssignToAuditClick = () => {
        if (selectedIncidentIds.length === 0) {
            alert("Zaznacz przynajmniej jeden incydent, aby go przypisać.");
            return;
        }
        setIsAuditModalOpen(true); // Otwiera modal wyboru audytu
    };

    // Ta funkcja jest wywoływana przez modal po potwierdzeniu wyboru audytu
    const handleConfirmAuditSelection = async (auditId) => {
        try {
            await api.post('/audits/incidents/assign', {
                auditId: auditId,
                incidentIds: selectedIncidentIds
            });
            alert("Pomyślnie przypisano incydenty.");
            setSelectedIncidentIds([]); // Wyczyść zaznaczenie
            fetchData(); // Odśwież dane, aby zobaczyć zmiany
        } catch (err) {
            alert("Wystąpił błąd podczas przypisywania incydentów.");
            console.error(err);
        }
    };

    if (loading) return <div className="text-center p-5">Ładowanie danych...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    // Render
    return (
        <div className="container mt-5">
            {/* Renderujemy modal - jest niewidoczny, dopóki isAuditModalOpen nie jest true */}
            <SelectionModal
                isOpen={isAuditModalOpen}
                onClose={() => setIsAuditModalOpen(false)}
                onConfirm={handleConfirmAuditSelection}
                title="Wybierz audyt, do którego chcesz przypisać zaznaczone incydenty"
                items={audits}
                displayField="title"
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <button onClick={handleAssignToAuditClick} className="btn btn-info me-2" disabled={selectedIncidentIds.length === 0}>
                        Przypisz do Audytu ({selectedIncidentIds.length})
                    </button>
                    <button onClick={() => setAddModalOpen(true)} className="btn btn-primary btn-lg">
                        + Dodaj Nowy Incydent
                    </button>
                </div>
            </div>

            <IncidentList
                incidents={filteredIncidents}
                categories={categories}
                departments={departments}
                locations={locations}
                filters={filters}
                onFilterChange={handleFilterChange}
                onEdit={handleEdit}
                onGenerateReport={handleGenerateReport}
                onSelectionChange={handleSelectionChange}
                selectedIncidentIds={selectedIncidentIds}
            />

            {isAddModalOpen && (
                <IncidentAddModal
                    categories={categories}
                    departments={departments}
                    locations={locations}
                    directors={directors}
                    onClose={() => setAddModalOpen(false)}
                    onIncidentAdded={handleIncidentAdded}
                />
            )}

            {isEditModalOpen && (
                <IncidentEditModal
                    incident={selectedIncident}
                    userRole={user?.role}
                    categories={categories}
                    departments={departments}
                    locations={locations}
                    directors={directors}
                    statuses={statuses}
                    severities={severities}
                    onClose={() => setEditModalOpen(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default UserDashboard;