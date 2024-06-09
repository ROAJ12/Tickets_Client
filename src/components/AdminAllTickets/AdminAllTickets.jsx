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

    useEffect(() => {
        const fetchAllTickets = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
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
        
        fetchAllTickets();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>All Tickets</h2>
            <table>
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Creator ID</th>
                        <th>Creator Name</th>
                        <th>Image</th>
                        <th>Status</th> 
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
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
                            <td>{ticket.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default AdminAllTickets;