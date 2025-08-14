import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

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
    const [selectedIncident, setSelectedIncident] = useState(null); // Przechowuje incydent dla modali
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

        if (filters.categoryId) {
            result = result.filter(inc => inc.category.id === parseInt(filters.categoryId, 10));
        }
        if (filters.departmentId) {
            result = result.filter(inc => inc.department.id === parseInt(filters.departmentId, 10));
        }
        if (filters.sortDate === 'asc') {
            result.sort((a, b) => new Date(a.reportedAt) - new Date(b.reportedAt));
        }
        if (filters.sortDate === 'desc') {
            result.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
        }

        setFilteredIncidents(result);
    }, [filters, incidents]);


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

    // Placeholder dla generowania raportu
    const handleGenerateReport = () => {
        alert("Generowanie raportu... (Funkcjonalność do zaimplementowania)");
    };

    // === RENDEROWANIE KOMPONENTU ===

    // Wyświetlanie stanu ładowania
    if (loading) {
        return <div className="text-center p-5">Ładowanie danych...</div>;
    }

    // Wyświetlanie błędu
    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div>
            {/* Nagłówek z przyciskiem do dodawania */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Panel Pracownika - Zgłoszenia</h1>
                <button onClick={() => setAddModalOpen(true)} className="btn btn-primary btn-lg">
                    + Dodaj Nowy Incydent
                </button>
            </div>

            {/* Komponent listy, któremu przekazujemy wszystkie potrzebne dane i funkcje */}
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

            {/* Warunkowe renderowanie modali */}
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