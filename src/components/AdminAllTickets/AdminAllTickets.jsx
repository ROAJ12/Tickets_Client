import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import { API_URL } from '../../utils/constants';

const AdminAllTickets = () => {

    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usersData, setUsersData] = useState([]);
    const [error, setError] = useState('');
    const [uniqueIdsArray , setUniqueIdsArray] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');

    const fetchAllTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/error');
            }
            const payload = jwtDecode(token);
            const userId = payload._id;
            const allTickets = await axios.get(API_URL + '/tickets', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setTickets(allTickets.data);

            const uniqueIdsSet = new Set();

            allTickets.data.forEach((ticket) => {
                uniqueIdsSet.add(ticket.creator);
            });

            const uniqueIdsArray = Array.from(uniqueIdsSet);

            setUniqueIdsArray(uniqueIdsArray);

            const usersDataObj = {};

            await Promise.all(uniqueIdsArray.map(async (id) => {
                const response = await axios.get(`${API_URL}/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                usersDataObj[id] = response.data;
            }));
            setUsersData(usersDataObj);
            setLoading(false);
        
        } catch (error) {
            setLoading(false);
            setError(error.message);

        }
    };

    useEffect(() => {
        
        fetchAllTickets();
        
    }, []);

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/tickets/${ticketId}`, { status: newStatus }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setTickets(tickets.map(ticket => 
                ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
            ));

            fetchAllTickets();

        } catch (error) {
            console.error('Failed to update ticket status', error);
            setError('Failed to update ticket status');
        }
    };

    const filteredTickets = searchStatus 
        ? tickets.filter(ticket => ticket.status === searchStatus)
        : tickets;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>All Tickets</h2>
            <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
            >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="closed">Closed</option>
            </select>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Creator ID</th>
                        <th>Creator Name</th>
                        <th>Image</th>
                        <th>Status</th> 
                        <th>Creation Date</th>
                        <th>Last Update</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTickets.map(ticket => (
                        <tr key={ticket._id}>
                            <td>{ticket._id}</td>
                            <td>{ticket.title}</td>
                            <td>{ticket.description}</td>
                            <td>{usersData[ticket.creator].firstname + ' ' + usersData[ticket.creator].lastname}</td>
                            <td>{usersData[ticket.creator].email}</td>
                            <td> 
                                {ticket.image && (
                                    <img src={`data:image;base64,${ticket.image}`} alt="Uploaded" style={{ width: '100px', height: '100px' }} />
                                )}
                            </td>
                            <td>
                                <select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                >
                                    <option value="open">Open</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </td>
                            <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                            <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default AdminAllTickets;