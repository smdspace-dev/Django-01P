import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const location = useLocation();

  // Test API connection on component mount
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await apiService.getStatus();
        setApiStatus(response.data);
      } catch (error) {
        console.error('API connection failed:', error);
        setApiStatus({ status: 'error', message: 'Backend connection failed' });
      }
    };
    testAPI();
  }, []);

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/' },
    { key: 'staff', label: 'Staff', icon: 'fas fa-users-cog', path: '/staff' },
    { key: 'students', label: 'Students', icon: 'fas fa-user-graduate', path: '/students' },
    { key: 'clubs', label: 'Clubs', icon: 'fas fa-users', path: '/clubs' },
    { key: 'clusters', label: 'Clusters', icon: 'fas fa-layer-group', path: '/clusters' },
  ];

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  return (
    <div className="min-vh-100">
      {/* Top Navigation */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-0">
        <Container fluid>
          <Button 
            variant="outline-light" 
            className="me-3 d-lg-none"
            onClick={handleShowSidebar}
          >
            <i className="fas fa-bars"></i>
          </Button>
          
          <Navbar.Brand>
            <i className="fas fa-graduation-cap me-2"></i>
            Education Platform Admin
          </Navbar.Brand>
          
          <Nav className="ms-auto">
            <Nav.Link className="text-light">
              {apiStatus && (
                <span className={`badge ${apiStatus.status === 'success' ? 'bg-success' : 'bg-danger'} me-2`}>
                  {apiStatus.status === 'success' ? 'API Connected' : 'API Error'}
                </span>
              )}
            </Nav.Link>
            <Nav.Link>
              <i className="fas fa-user-circle me-1"></i>
              Admin
            </Nav.Link>
            <Nav.Link>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="d-flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
        {/* Desktop Sidebar */}
        <div className="bg-light border-end d-none d-lg-block" style={{ width: '250px' }}>
          <div className="list-group list-group-flush">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`list-group-item list-group-item-action border-0 ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <i className={`${item.icon} me-3`}></i>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Sidebar */}
        <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <i className="fas fa-graduation-cap me-2"></i>
              Navigation
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="list-group list-group-flush">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`list-group-item list-group-item-action border-0 ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  onClick={handleCloseSidebar}
                >
                  <i className={`${item.icon} me-3`}></i>
                  {item.label}
                </Link>
              ))}
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
