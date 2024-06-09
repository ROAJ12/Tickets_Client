import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import HomePage from './pages/HomaPage/HomePage';
import DashBoard from './pages/DashBoard/DashBoard';
import UserTicket from './pages/UserTickes/UserTicket';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ErrorPage from './pages/ErrorPage/ErrorPage';

const App = () => {

    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/tickets/:id" element={<UserTicket />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Router>
    );
};

export default App;

