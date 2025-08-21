import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

import PasswordResetGenerator from '../components/PasswordResetGenerator';
import InvitationSender from '../components/InvitationSender';
import UserManagement from '../components/UserManagement';
import DictionaryAdder from '../components/DictionaryAdder';
import {Link} from "react-router-dom";

const AdminDashboard = () => {
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchDictionaries = useCallback(async () => {
        try {
            const [departmentsRes, categoriesRes] = await Promise.all([
                api.get('/dictionaries/departments'),
                api.get('/dictionaries/categories')
            ]);
            setDepartments(departmentsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error("Nie udało się załadować danych słownikowych", error);
        }
    }, []);

    useEffect(() => {
        fetchDictionaries();
    }, [fetchDictionaries]);

    return (
        <div className="container mt-4">
            <h1>Panel Administratora</h1>
            <p>Zarządzaj użytkownikami, zaproszeniami, hasłami oraz danymi słownikowymi systemu.</p>
            <div className="card text-white bg-dark my-4">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title">Narzędzia Diagnostyczne</h5>
                    </div>
                    <Link to="/debug-panel" className="btn btn-warning fw-bold">
                        Przejdź do Panelu Debugowania &rarr;
                    </Link>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-lg-6">
                    <InvitationSender />
                    <PasswordResetGenerator />
                </div>

                <div className="col-lg-6">
                    <DictionaryAdder
                        title="Dodaj nową kategorię incydentu"
                        endpoint="/dictionaries/categories"
                        onAdded={fetchDictionaries}
                    />
                    <DictionaryAdder
                        title="Dodaj nowy dział firmy"
                        endpoint="/dictionaries/departments"
                        onAdded={fetchDictionaries}
                    />
                    <DictionaryAdder
                        title="Dodaj nowe miejsce"
                        endpoint="/dictionaries/locations"
                        onAdded={fetchDictionaries}
                    />
                </div>
            </div>

            <hr className="my-5" />
            <div className="row">
                <div className="col-12">
                    <UserManagement availableDepartments={departments} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;