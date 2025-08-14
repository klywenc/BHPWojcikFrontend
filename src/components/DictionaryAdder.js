import React, { useState } from 'react';
import api from '../services/api';

/**
 * Reużywalny komponent do dodawania nowych pozycji do słownika (np. kategorii, działów).
 * @param {string} title - Tytuł wyświetlany na karcie, np. "Dodaj nową kategorię".
 * @param {string} endpoint - Endpoint API, na który zostanie wysłane żądanie POST, np. "/incidents/categories".
 * @param {function} [onItemAdded] - Opcjonalna funkcja zwrotna wywoływana po pomyślnym dodaniu elementu.
 */
const DictionaryAdder = ({ title, endpoint, onItemAdded }) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsSubmitting(true);

        try {
            await api.post(endpoint, { name });
            setMessage(`Pozycja "${name}" została pomyślnie dodana.`);
            setName(''); // Wyczyść pole po sukcesie

            // Jeśli przekazano funkcję zwrotną, wywołaj ją
            if (onItemAdded) {
                onItemAdded();
            }
        } catch (err) {
            if (err.response?.status === 409) {
                setError('Pozycja o tej nazwie już istnieje.');
            } else {
                setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
            }
            console.error(`Błąd podczas dodawania do ${endpoint}:`, err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">{title}</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Wpisz nową nazwę..."
                            required
                            disabled={isSubmitting}
                        />
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Dodawanie...' : '+ Dodaj'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DictionaryAdder;