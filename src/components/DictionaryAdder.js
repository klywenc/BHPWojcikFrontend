import React, { useState } from 'react';
import api from '../services/api';

/**
 * Komponent dodawania pozycji.
 * @param {string} title
 * @param {string} endpoint - Endpoint API -> POST np. /incidents/categories
 * @param {function} [onItemAdded] - callback.
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
            setName(''); 
            
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