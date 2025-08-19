import React from 'react';

import PasswordResetGenerator from '../components/PasswordResetGenerator';
import InvitationSender from '../components/InvitationSender'; // 1. Importujemy nowy komponent
import UserManagement from '../components/UserManagement';
import DictionaryAdder from '../components/DictionaryAdder';

const AdminDashboard = () => {

    return (
        <div className="container mt-4">
            <h1>Panel Administratora</h1>
            <p>Zarządzaj użytkownikami, zaproszeniami, hasłami oraz danymi słownikowymi systemu.</p>

            <div className="row mt-4">
                {/* Kolumna lewa: Zaproszenia i reset hasła */}
                <div className="col-lg-6">
                    {/* 2. Zastępujemy CodeGenerator naszym nowym komponentem */}
                    <InvitationSender />
                    <PasswordResetGenerator />
                </div>

                {/* Kolumna prawa: Zarządzanie słownikami */}
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
            </div>

            {/* Osobna sekcja do zarządzania użytkownikami */}
            <hr className="my-5" />
            <div className="row">
                <div className="col-12">
                    {/* Tutaj możesz umieścić komponent UserManagement */}
                    {/* <UserManagement /> */}
                    <h2>Zarządzanie użytkownikami (tylko Admin)</h2>
                    <p>Funkcjonalność w budowie.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;