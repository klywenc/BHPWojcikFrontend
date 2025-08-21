import React from 'react';
import PasswordResetGenerator from '../components/PasswordResetGenerator';
import InvitationSender from '../components/InvitationSender'; 

const TechnicianDashboard = () => {

    return (<div className="container mt-4">
            <h1>Panel Technika</h1>
            <p>Zarządzaj zaproszeniami do systemu oraz hasłami użytkowników.</p>

            <div className="row mt-4">
                <div className="col-lg-6">
                    <InvitationSender/>
                </div>
                <div className="col-lg-6">
                    <PasswordResetGenerator/>
                </div>
            </div>
        </div>);
};

export default TechnicianDashboard;