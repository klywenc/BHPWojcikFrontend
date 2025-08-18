import React from 'react';

import PasswordResetGenerator from '../components/PasswordResetGenerator';
import CodeGenerator from '../components/CodeGenerator';
import UserManagement from '../components/UserManagement';
import DictionaryAdder from '../components/DictionaryAdder';

const AdminDashboard = () => {

    return (
        <div>
            <h1>Panel Administratora</h1>
            <p>Zarządzaj użytkownikami, kodami, hasłami oraz danymi słownikowymi systemu.</p>

            <div className="row">
                <div className="col-lg-6">
                    <DictionaryAdder
                        title="Dodaj nową kategorię incydentu"
                        endpoint="/dictionaries/categories"
                    />
                    <DictionaryAdder
                        title="Dodaj nowy dział firmy"
                        endpoint="/dictionaries/departments"
                    />
                </div>
                <div className="col-lg-6">
                    <PasswordResetGenerator />
                    <CodeGenerator />
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;