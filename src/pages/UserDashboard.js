import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { saveAs } from 'file-saver';

import IncidentList from '../components/IncidentList';
import IncidentDetailsModal from '../components/IncidentDetailsModal';
import IncidentEditModal from '../components/IncidentEditModal';
import IncidentAddModal from '../components/IncidentAddModal';

const UserDashboard = () => {
    // --- Stany ---
    const [incidents, setIncidents] = useState([]);
    const [filteredIncidents, setFilteredIncidents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [severities, setSeverities] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [filters, setFilters] = useState({ categoryId: '', departmentId: '', sortDate: '' });

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
                severitiesRes
            ] = await Promise.all([
                api.get('/incidents'),
                api.get('/dictionaries/categories'),
                api.get('/dictionaries/departments'),
                api.get('/dictionaries/locations'),
                api.get('/users'),
                api.get('/admin/incidents/statuses'),
                api.get('/admin/incidents/severities')
            ]);

            setIncidents(incidentsRes.data);
            setFilteredIncidents(incidentsRes.data);

            setCategories(categoriesRes.data);
            setDepartments(departmentsRes.data);
            setLocations(locationsRes.data);
            setStatuses(statusesRes.data);
            setSeverities(severitiesRes.data);

            const allUsers = usersRes.data;
            setDirectors(allUsers.filter(u => u.role === 'ROLE_DYREKTOR'));

            // TODO: ustaw zalogowanego użytkownika (jeżeli masz AuthContext)
            // setUser(auth.user);

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

    // --- Filtracja incydentów ---
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
        if (filters.sortDate === 'asc') {
            result.sort((a, b) => new Date(a.reportedAt) - new Date(b.reportedAt));
        }
        if (filters.sortDate === 'desc') {
            result.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
        }
        setFilteredIncidents(result);
    }, [filters, incidents, categories, departments]);

    // --- Handlery ---
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleViewDetails = (incident) => {
        setSelectedIncident(incident);
        setDetailsModalOpen(true);
    };
    const handleEdit = (incident) => {
        setSelectedIncident(incident);
        setEditModalOpen(true);
    };
    const handleUpdate = (updatedIncident) => {
        setIncidents(prev => prev.map(inc => inc.id === updatedIncident.id ? updatedIncident : inc));
    };
    const handleIncidentAdded = () => {
        fetchData();
    };
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

    if (loading) return <div className="text-center p-5">Ładowanie danych...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    // --- Render ---
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Panel Pracownika - Zgłoszenia</h1>
                <button onClick={() => setAddModalOpen(true)} className="btn btn-primary btn-lg">
                    + Dodaj Nowy Incydent
                </button>
            </div>

            <IncidentList
                incidents={filteredIncidents}
                categories={categories}
                departments={departments}
                filters={filters}
                onFilterChange={handleFilterChange}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onGenerateReport={handleGenerateReport}
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

            {isDetailsModalOpen && (
                <IncidentDetailsModal
                    incident={selectedIncident}
                    onClose={() => setDetailsModalOpen(false)}
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
