import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { saveAs } from 'file-saver'; // Krok 1: Importujemy zainstalowaną bibliotekę

import IncidentList from '../components/IncidentList';
import IncidentDetailsModal from '../components/IncidentDetailsModal';
import IncidentEditModal from '../components/IncidentEditModal';
import IncidentAddModal from '../components/IncidentAddModal';

const UserDashboard = () => {
    const [incidents, setIncidents] = useState([]);
    const [filteredIncidents, setFilteredIncidents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);

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
            const [incidentsRes, categoriesRes, departmentsRes] = await Promise.all([
                api.get('/incidents'),
                api.get('/dictionaries/categories'),
                api.get('/dictionaries/departments')
            ]);
            setIncidents(incidentsRes.data);
            setFilteredIncidents(incidentsRes.data);
            setCategories(categoriesRes.data);
            setDepartments(departmentsRes.data);
        } catch (err) {
            setError('Nie udało się załadować danych. Sprawdź połączenie z serwerem.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        let result = [...incidents];
        // WAŻNA POPRAWKA: Filtrowanie musi używać płaskich pól z DTO
        if (filters.categoryId) {
            // Zakładając, że Twoje DTO ma pole `categoryId` lub podobne
            result = result.filter(inc => inc.categoryName === categories.find(c => c.id === parseInt(filters.categoryId, 10))?.name);
        }
        if (filters.departmentId) {
            result = result.filter(inc => inc.departmentName === departments.find(d => d.id === parseInt(filters.departmentId, 10))?.name);
        }
        if (filters.sortDate === 'asc') {
            result.sort((a, b) => new Date(a.reportedAt) - new Date(b.reportedAt));
        }
        if (filters.sortDate === 'desc') {
            result.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
        }
        setFilteredIncidents(result);
    }, [filters, incidents, categories, departments]);


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

    // Krok 2: Zastępujemy starą funkcję nową, w pełni działającą implementacją
    const handleGenerateReport = async () => {
        try {
            const response = await api.get('/reports/incidents/xlsx', {
                responseType: 'blob', // Kluczowe: traktuj odpowiedź jako plik
            });

            // Próba odczytania nazwy pliku z nagłówka odpowiedzi
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'raport_incydentow.xlsx'; // Nazwa domyślna
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch.length > 1) {
                    filename = filenameMatch[1];
                }
            }

            // Użyj biblioteki file-saver do zapisania pliku
            saveAs(response.data, filename);

        } catch (error) {
            console.error("Błąd podczas pobierania raportu:", error);
            setError("Nie udało się wygenerować raportu. Sprawdź konsolę, aby uzyskać więcej informacji.");
        }
    };

    // === RENDEROWANIE KOMPONENTU ===

    if (loading) return <div className="text-center p-5">Ładowanie danych...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

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
                onGenerateReport={handleGenerateReport} // Przekazujemy zaktualizowaną funkcję
            />

            {isAddModalOpen && (
                <IncidentAddModal
                    categories={categories}
                    departments={departments}
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
                    categories={categories}
                    departments={departments}
                    onClose={() => setEditModalOpen(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default UserDashboard;