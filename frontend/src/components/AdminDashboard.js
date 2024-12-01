import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const dashboardStats = [
    { title: 'Total Staff', count: 25, icon: 'fas fa-chalkboard-teacher', color: 'primary' },
    { title: 'Total Students', count: 1250, icon: 'fas fa-user-graduate', color: 'success' },
    { title: 'Active Clubs', count: 15, icon: 'fas fa-users', color: 'info' },
    { title: 'Clusters', count: 8, icon: 'fas fa-layer-group', color: 'warning' },
  ];

  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        {dashboardStats.map((stat, index) => (
          <Col lg={3} md={6} className="mb-3" key={index}>
            <Card className={`text-white bg-${stat.color} h-100`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="mb-1">{stat.count}</Card.Title>
                    <Card.Text className="mb-0">{stat.title}</Card.Text>
                  </div>
                  <i className={`${stat.icon} fa-2x opacity-75`}></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Recent Activities</h5>
            </Card.Header>
            <Card.Body>
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <small className="text-muted">2 hours ago</small>
                  <div>New staff member added: John Doe</div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <small className="text-muted">5 hours ago</small>
                  <div>Club "Photography Club" created</div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <small className="text-muted">1 day ago</small>
                  <div>50 new students uploaded for BCA cluster</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link to="/staff" className="btn btn-outline-primary">
                  <i className="fas fa-plus me-2"></i>Add New Staff
                </Link>
                <Link to="/students" className="btn btn-outline-success">
                  <i className="fas fa-upload me-2"></i>Upload Students
                </Link>
                <Link to="/clubs" className="btn btn-outline-info">
                  <i className="fas fa-plus-circle me-2"></i>Create Club
                </Link>
                <Link to="/clusters" className="btn btn-outline-warning">
                  <i className="fas fa-cog me-2"></i>Manage Clusters
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
