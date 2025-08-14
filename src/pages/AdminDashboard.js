import React from 'react';

// Importy komponentów
import PasswordResetGenerator from '../components/PasswordResetGenerator';
import CodeGenerator from '../components/CodeGenerator';
import UserManagement from '../components/UserManagement';
import DictionaryAdder from '../components/DictionaryAdder'; // NOWY IMPORT

const AdminDashboard = () => {
    // UWAGA: Logikę pobierania i usuwania użytkowników przenieśliśmy do UserManagement
    // dla zachowania czystości kodu kontenera.
    // Jeśli jej tam nie masz, możesz ją tu przywrócić.

    return (
        <div>
            <h1>Panel Administratora</h1>
            <p>Zarządzaj użytkownikami, kodami, hasłami oraz danymi słownikowymi systemu.</p>

            <div className="row">
                {/* Dzielimy interfejs na dwie kolumny dla lepszej organizacji */}
                <div className="col-lg-6">
                    {/* NOWE KOMPONENTY DO ZARZĄDZANIA SŁOWNIKAMI */}
                    <DictionaryAdder
                        title="Dodaj nową kategorię incydentu"
                        endpoint="/dictionary/categories"
                    />
                    <DictionaryAdder
                        title="Dodaj nowy dział firmy"
                        endpoint="/dictionary/departments"
                    />
                </div>
                <div className="col-lg-6">
                    <PasswordResetGenerator />
                    <CodeGenerator />
                </div>
            </div>

            {/* Komponent do zarządzania użytkownikami - może wymagać przekazania danych */}
            <div className="mt-4">
                {/* <UserManagement /> */}
                <p><i>Sekcja zarządzania użytkownikami (CRUD) powinna znajdować się poniżej.</i></p>
            </div>
        </div>
    );
};

export default AdminDashboard;