import React, { useState } from 'react';
import api from '../services/api';

const InvitationSender = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setIsSubmitting(true);

        if (!email) {
            setErrorMessage('Adres e-mail jest wymagany.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.post('/codes/send-invite', { email });

            setSuccessMessage(response.data);
            setEmail('');

        } catch (err) {
            if (err.response && err.response.data) {
                setErrorMessage(err.response.data);
            } else {
                setErrorMessage('Wystąpił nieznany błąd. Spróbuj ponownie.');
            }
            console.error("Błąd podczas wysyłania zaproszenia:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                Przydziel nowego użytkownika
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <p className="card-text">
                        Wpisz adres e-mail pracownika, któremu należy przydzielić dostęp. Otrzyma ona wiadomość z unikalnym kodem potrzebnym do rejestracji.
                    </p>
                    <div className="mb-3">
                        <label htmlFor="invite-email" className="form-label">Adres e-mail</label>
                        <input
                            type="email"
                            className="form-control"
                            id="invite-email"
                            placeholder="x.nazwisko@meblewojcik.pl"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* CALLBACK */}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Wysyłanie...' : 'Wyślij zaproszenie'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InvitationSender;