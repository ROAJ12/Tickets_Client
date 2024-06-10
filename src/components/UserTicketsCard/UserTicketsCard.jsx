import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getUserTickets from '../../api/getUserTickets';
import { jwtDecode } from 'jwt-decode';

const UserTicketsCard = () => {

    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
    
    useEffect(() => {

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
                    <th>Creation Date</th>
                    <th>Update Date</th>
                </tr>
                </thead>
                <tbody>
                {tickets.map(ticket => (
                    <tr key={ticket._id}>
                        <td>{ticket.title}</td>
                        <td>{ticket.description}</td>
                        <td>Status: {ticket.status}</td>
                        <td> 
                        {ticket.image && (
                            <img src={`data:image;base64,${ticket.image}`} alt="Uploaded" style={{ widtd: '100px', height: '100px' }} />
                       )}
                        </td>
                        <td>{ticket.messages.length}<hr></hr><button>See Messages</button></td>
                        <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                        <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                    </tr>   
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTicketsCard;
