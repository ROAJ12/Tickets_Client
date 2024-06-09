import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getUserTickets from '../../api/getUserTickets';
import { jwtDecode } from 'jwt-decode';

const UserTicketsCard = () => {

    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchUserTicketsData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/error');
                }
                const payload = jwtDecode(token);
                const userId = payload._id;
                const userTickets = await getUserTickets(userId);
                setTickets(userTickets);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        };

        fetchUserTicketsData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Your Tickets</h2>
            <table border="1">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Messages</th>
                </tr>
                </thead>
                <tbody>
                {tickets.map(ticket => (
                    <tr key={ticket._id}>
                        <th>{ticket.title}</th>
                        <th>{ticket.description}</th>
                        <th>Status: {ticket.status}</th>
                        <th> 
                        {ticket.image && (
                            <img src={`data:image;base64,${ticket.image}`} alt="Uploaded" style={{ width: '100px', height: '100px' }} />
                       )}
                        </th>
                        <th>{ticket.messages.length}<hr></hr><button>See Messages</button></th>
                    </tr>   
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTicketsCard;
