import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { saveAs } from 'file-saver';

import IncidentList from '../components/IncidentList';
import IncidentEditModal from '../components/IncidentEditModal';
import IncidentAddModal from '../components/IncidentAddModal';
import SelectionModal from '../components/SelectionModal';

import { Title, PageHeader, Button } from '../components/Styled';
import LoadingSpinner from '../components/LoadingSpinner';

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
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

    // Pobieranie danych
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [
                incidentsRes,
                categoriesRes,
                departmentsRes,
                locationsRes,
                usersRes,
                statusesRes,
                severitiesRes,
                auditsRes,
            ] = await Promise.all([
                api.get('/incidents'),
                api.get('/dictionaries/categories'),
                api.get('/dictionaries/departments'),
                api.get('/dictionaries/locations'),
                api.get('/users'),
                api.get('/admin/incidents/statuses'),
                api.get('/admin/incidents/severities'),
                api.get('/audits'),
            ]);
            setIncidents(incidentsRes.data);
            setFilteredIncidents(incidentsRes.data);
            setCategories(categoriesRes.data);
            setDepartments(departmentsRes.data);
            setLocations(locationsRes.data);
            setStatuses(statusesRes.data);
            setSeverities(severitiesRes.data);
            setDirectors(usersRes.data.filter((u) => u.role === 'ROLE_DYREKTOR'));
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

    // Filtracja
    useEffect(() => {
        let result = [...incidents];
        if (filters.categoryId) {
            const categoryName = categories.find((c) => c.id === parseInt(filters.categoryId, 10))?.name;
            result = result.filter((inc) => inc.categoryName === categoryName);
        }
        if (filters.departmentId) {
            const departmentName = departments.find((d) => d.id === parseInt(filters.departmentId, 10))?.name;
            result = result.filter((inc) => inc.departmentName === departmentName);
        }
        if (filters.locationId) {
            const locationName = locations.find((l) => l.id === parseInt(filters.locationId, 10))?.name;
            result = result.filter((inc) => inc.locationName === locationName);
        }
        setFilteredIncidents(result);
    }, [filters, incidents, categories, departments, locations]);

    // Handlery
    const handleFilterChange = (e) => setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleEdit = (incident) => {
        setSelectedIncident(incident);
        setEditModalOpen(true);
    };
    const handleUpdate = (updatedIncident) =>
        setIncidents((prev) => prev.map((inc) => (inc.id === updatedIncident.id ? updatedIncident : inc)));
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

    const handlePrintSelected = async () => {
        if (selectedIncidentIds.length === 0) return;

        try {
            const response = await api.post(
                '/reports/incidents/selected-odt',
                { incidentIds: selectedIncidentIds },
                { responseType: 'blob' }
            );

            const contentDisposition = response.headers['content-disposition'];
            let filename = 'wybrane_incydenty.odt';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match && match[1]) filename = match[1];
            }
            saveAs(response.data, filename);
        } catch (err) {
            console.error("Błąd podczas generowania raportu dla wybranych incydentów:", err);
            alert("Nie udało się wygenerować raportu.");
        }
    };

    const handleSelectionChange = (incidentId) => {
        setSelectedIncidentIds((prev) =>
            prev.includes(incidentId) ? prev.filter((id) => id !== incidentId) : [...prev, incidentId]
        );
    };

    const handleAssignToAuditClick = () => {
        if (selectedIncidentIds.length === 0) {
            alert('Zaznacz przynajmniej jeden incydent, aby go przypisać.');
            return;
        }
        setIsAuditModalOpen(true);
    };

    const handleConfirmAuditSelection = async (auditId) => {
        try {
            await api.post('/audits/incidents/assign', {
                auditId: auditId,
                incidentIds: selectedIncidentIds,
            });
            alert('Pomyślnie przypisano incydenty.');
            setSelectedIncidentIds([]);
            fetchData();
        } catch (err) {
            alert('Wystąpił błąd podczas przypisywania incydentów.');
            console.error(err);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <SelectionModal
                isOpen={isAuditModalOpen}
                onClose={() => setIsAuditModalOpen(false)}
                onConfirm={handleConfirmAuditSelection}
                title="Wybierz audyt, do którego chcesz przypisać zaznaczone incydenty"
                items={audits}
                displayField="title"
            />

            <PageHeader>
                <Title>Panel Pracownika</Title>
                <div>
                    <Button
                        onClick={handleAssignToAuditClick}
                        variant="primary"
                        disabled={selectedIncidentIds.length === 0}
                        style={{ marginRight: '1rem' }}
                    >
                        Przypisz do Audytu ({selectedIncidentIds.length})
                    </Button>
                    <Button
                        onClick={handlePrintSelected}
                        variant="primary"
                        disabled={selectedIncidentIds.length === 0}
                        style={{ marginRight: '1rem' }}
                    >
                        Drukuj Zaznaczone ({selectedIncidentIds.length})
                    </Button>
                    <Button onClick={() => setAddModalOpen(true)}>+ Dodaj Incydent</Button>
                </div>
            </PageHeader>

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
                statuses={statuses}
                onUpdate={handleUpdate}
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
