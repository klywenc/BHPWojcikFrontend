import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const DebugPanel = () => {
    const [healthStatus, setHealthStatus] = useState(null);
    const [isHealthLoading, setIsHealthLoading] = useState(false);
    const [healthError, setHealthError] = useState('');

    const [storageStatus, setStorageStatus] = useState(null);
    const [isStorageLoading, setIsStorageLoading] = useState(false);
    const [storageError, setStorageError] = useState('');

    const handleHealthCheck = async () => {
        setIsHealthLoading(true);
        setHealthError('');
        setHealthStatus(null);
        try {
            const response = await api.get('/debug/health');
            setHealthStatus(response.data);
        } catch (err) {
            setHealthError('Nie udało się pobrać statusu serwisów.');
        } finally {
            setIsHealthLoading(false);
        }
    };

    const handleStorageCheck = async () => {
        setIsStorageLoading(true);
        setStorageError('');
        setStorageStatus(null);
        try {
            const response = await api.get('/debug/storage/status');
            setStorageStatus(response.data);
        } catch (err) {
            setStorageError(err.response?.data || 'Nie udało się pobrać statusu storage.');
        } finally {
            setIsStorageLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        if (!status) return null;
        const isUp = status.startsWith('UP');
        return <span className={`badge bg-${isUp ? 'success' : 'danger'}`}>{status}</span>;
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Panel Debugowania</h1>
                <Link to="/panel-admina" className="btn btn-secondary">&larr; Wróć do Panelu Administratora</Link>
            </div>
            <p className="lead">Narzędzia deweloperskie do diagnostyki i testowania aplikacji.</p>

            <div className="row mt-4">
                {/* Karta Dokumentacji */}
                <div className="col-lg-4 mb-4">
                    <div className="card h-100">
                        <div className="card-header fw-bold">Dokumentacja API</div>
                        <div className="card-body d-flex flex-column">
                            <p>Przejdź do Swagger UI, aby przeglądać i testować endpointy API.</p>
                            <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-auto">Otwórz Swagger UI</a>
                        </div>
                    </div>
                </div>

                {/* Karta Zdrowia Serwisów */}
                <div className="col-lg-4 mb-4">
                    <div className="card h-100">
                        <div className="card-header fw-bold">Zdrowie Serwisów</div>
                        <div className="card-body d-flex flex-column">
                            <p>Sprawdź status połączenia z kluczowymi usługami.</p>
                            {isHealthLoading && <div className="text-center my-2"><div className="spinner-border text-info" role="status"><span className="visually-hidden">Loading...</span></div></div>}
                            {healthError && <div className="alert alert-danger">{healthError}</div>}
                            {healthStatus && (
                                <ul className="list-group my-2">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">Baza Danych: {getStatusBadge(healthStatus.database)}</li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">MinIO Storage: {getStatusBadge(healthStatus.minio)}</li>
                                </ul>
                            )}
                            <button className="btn btn-info mt-auto" onClick={handleHealthCheck} disabled={isHealthLoading}>Uruchom Test</button>
                        </div>
                    </div>
                </div>

                {/* Karta Statusu Storage */}
                <div className="col-lg-4 mb-4">
                    <div className="card h-100">
                        <div className="card-header fw-bold">Zapełnienie Storage (MinIO)</div>
                        <div className="card-body d-flex flex-column">
                            <p>Sprawdź całkowitą liczbę i rozmiar plików w magazynie.</p>
                            <div className="alert alert-warning small">Uwaga: Skanowanie może zająć chwilę przy bardzo dużej liczbie plików.</div>
                            {isStorageLoading && <div className="text-center my-2"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>}
                            {storageError && <div className="alert alert-danger">{storageError}</div>}
                            {storageStatus && (
                                <ul className="list-group my-2">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">Liczba plików: <strong>{storageStatus.objectCount}</strong></li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">Całkowity rozmiar: <strong>{formatBytes(storageStatus.totalSizeInBytes)}</strong></li>
                                </ul>
                            )}
                            <button className="btn btn-primary mt-auto" onClick={handleStorageCheck} disabled={isStorageLoading}>Sprawdź Zapełnienie</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugPanel;