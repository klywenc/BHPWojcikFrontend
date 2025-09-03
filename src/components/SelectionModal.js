import React, { useState } from 'react';

/**
 * Generyczny modal do wybierania jednego elementu z listy.
 * @param {boolean} isOpen - Czy modal ma być widoczny.
 * @param {function} onClose - Funkcja do zamknięcia modala.
 * @param {function} onConfirm - Funkcja wywoływana po potwierdzeniu wyboru, z ID wybranego elementu.
 * @param {string} title - Tytuł modala.
 * @param {Array} items - Tablica obiektów do wyświetlenia. Każdy obiekt musi mieć 'id'.
 * @param {string} displayField - Klucz obiektu, którego wartość ma być wyświetlona jako główny tekst (np. 'title' lub 'name').
 * @param {string} [subDisplayField] - Opcjonalny klucz do wyświetlenia dodatkowych informacji (np. 'email').
 */
const SelectionModal = ({ isOpen, onClose, onConfirm, title, items, displayField, subDisplayField }) => {
    const [selectedId, setSelectedId] = useState(null);

    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (selectedId) {
            onConfirm(selectedId);
            onClose(); // Automatycznie zamknij modal po potwierdzeniu
        }
    };

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: '60vh' }}>
                        {items && items.length > 0 ? (
                            <ul className="list-group">
                                {items.map(item => (
                                    <li
                                        key={item.id}
                                        className={`list-group-item list-group-item-action ${selectedId === item.id ? 'active' : ''}`}
                                        onClick={() => setSelectedId(item.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <strong>{item[displayField]}</strong>
                                        {subDisplayField && <small className="d-block text-muted">{item[subDisplayField]}</small>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Brak dostępnych opcji do wyboru.</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Anuluj</button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleConfirm}
                            disabled={!selectedId}
                        >
                            Potwierdź wybór
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectionModal;