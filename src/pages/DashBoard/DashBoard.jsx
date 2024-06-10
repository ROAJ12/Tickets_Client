import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import './DashBoard.css';

import SideBar from "../../components/SideBar/SideBar";
import TicketFormCard from "../../components/TicketsFormCard/TicketFormCard";
import AdminAllTickets from "../../components/AdminAllTickets/AdminAllTickets";

const DashBoard = () => {

    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null) {
            navigate('/error');
        }
        const payload = jwtDecode(token);
        const role = payload.role;

        if (role === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);

    return (
        <>
            {isAdmin ? (
                <>
                    <h1>Administrador</h1>
                    <AdminAllTickets />
                </>
            ) : (
                <div style={{ display: 'flex' }}>
                    <SideBar/>
                    <div>
                        <h1>Sistema de Tickets</h1>
                        <TicketFormCard />
                    </div>
                </div>
            )}
        </>    
    );
};

export default DashBoard;