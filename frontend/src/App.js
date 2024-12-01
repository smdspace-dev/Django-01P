import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

// Components
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import StaffManagement from './components/StaffManagement';
import StudentManagement from './components/StudentManagement';
import ClubManagement from './components/ClubManagement';
import ClusterManagement from './components/ClusterManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <Layout>
              <AdminDashboard />
            </Layout>
          } />
          <Route path="/staff" element={
            <Layout>
              <StaffManagement />
            </Layout>
          } />
          <Route path="/students" element={
            <Layout>
              <StudentManagement />
            </Layout>
          } />
          <Route path="/clubs" element={
            <Layout>
              <ClubManagement />
            </Layout>
          } />
          <Route path="/clusters" element={
            <Layout>
              <ClusterManagement />
            </Layout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
