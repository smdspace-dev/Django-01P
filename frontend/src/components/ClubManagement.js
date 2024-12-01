import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Button, Table, Modal, Form, 
  Alert, Badge, Nav, Spinner, Dropdown
} from 'react-bootstrap';
import { apiService } from '../services/api';

const ClubManagement = () => {
  const [activeTab, setActiveTab] = useState('clubs');
  const [showClubModal, setShowClubModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [editingClub, setEditingClub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [clubs, setClubs] = useState([]);
  const [staff, setStaff] = useState([]);

  // Load clubs and staff on component mount
  useEffect(() => {
    loadClubs();
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const response = await apiService.getStaff();
      setStaff(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading staff:', error);
      setError('Failed to load staff');
    }
  };

  const loadClubs = async () => {
    setLoading(true);
    try {
      const response = await apiService.getClubs();
      setClubs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading clubs:', error);
      setError('Failed to load clubs');
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coordinator: '',
    max_members: 50
  });

  const [clubSettings, setClubSettings] = useState({
    isJoiningOpen: false,
    joinPeriodStart: '',
    joinPeriodEnd: '',
    maxClubsPerStudent: 1
  });

  const staffMembers = [
    { id: 1, name: 'Dr. John Smith', department: 'Computer Science', photo: null },
    { id: 2, name: 'Prof. Sarah Johnson', department: 'Commerce', photo: null },
    { id: 3, name: 'Dr. Mike Wilson', department: 'Arts', photo: null }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClubSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (editingClub) {
        // Update existing club
        await apiService.updateClub(editingClub.id, formData);
      } else {
        // Create new club
        await apiService.createClub(formData);
      }
      
      setShowClubModal(false);
      resetForm();
      loadClubs(); // Reload clubs list
    } catch (error) {
      console.error('Error saving club:', error);
      setError(error.response?.data?.message || 'Failed to save club');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      coordinator: '',
      max_members: 50
    });
    setEditingClub(null);
  };

  const editClub = (club) => {
    setEditingClub(club);
    setFormData({
      name: club.name || '',
      description: club.description || '',
      coordinator: club.coordinator || '',
      max_members: club.max_members || 50
    });
    setShowClubModal(true);
  };

  const deleteClub = async (clubId) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      setLoading(true);
      try {
        await apiService.deleteClub(clubId);
        loadClubs(); // Reload clubs list
      } catch (error) {
        console.error('Error deleting club:', error);
        setError('Failed to delete club');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleClubStatus = async (clubId) => {
    try {
      await apiService.toggleClubStatus(clubId);
      loadClubs(); // Reload clubs list
    } catch (error) {
      console.error('Error toggling club status:', error);
      setError('Failed to toggle club status');
    }
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Settings:', clubSettings);
    setShowSettingsModal(false);
  };

  const openClubDetails = (club) => {
    setSelectedClub(club);
  };

  const deleteAllClubs = async () => {
    if (window.confirm('Are you sure you want to delete ALL clubs? This will remove all club data and memberships permanently.')) {
      if (window.confirm('This action cannot be undone. Are you absolutely sure?')) {
        setLoading(true);
        try {
          // Delete all clubs one by one
          await Promise.all(clubs.map(club => apiService.deleteClub(club.id)));
          loadClubs();
        } catch (error) {
          console.error('Error deleting all clubs:', error);
          setError('Failed to delete all clubs');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-users me-2"></i>
          Club Management
        </h2>
        <div className="btn-group">
          <Button variant="primary" onClick={() => setShowClubModal(true)}>
            <i className="fas fa-plus me-2"></i>
            Create Club
          </Button>
          <Button variant="outline-secondary" onClick={() => setShowSettingsModal(true)}>
            <i className="fas fa-cog me-2"></i>
            Settings
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="clubs">
            <Nav.Item>
              <Nav.Link 
                eventKey="clubs" 
                active={activeTab === 'clubs'}
                onClick={() => setActiveTab('clubs')}
              >
                <i className="fas fa-users me-2"></i>
                Club List
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="cluster-view" 
                active={activeTab === 'cluster-view'}
                onClick={() => setActiveTab('cluster-view')}
              >
                <i className="fas fa-layer-group me-2"></i>
                Cluster View
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="settings" 
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
              >
                <i className="fas fa-cog me-2"></i>
                Global Settings
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Card.Body>
          {activeTab === 'clubs' && (
            <div>
              <Row>
                {clubs.map(club => (
                  <Col lg={4} md={6} className="mb-4" key={club.id}>
                    <Card className="h-100 shadow-sm">
                      <Card.Header className="bg-primary text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">{club.name}</h6>
                          <Badge bg="light" text="dark">{club.clubId}</Badge>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-2">
                          <small className="text-muted">Coordinator:</small>
                          <div className="fw-bold">{club.coordinator}</div>
                        </div>
                        
                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted">Members:</small>
                            <div className="fw-bold">{club.memberCount}/{club.maxMembers}</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Representatives:</small>
                            <div className="fw-bold">{club.representatives}</div>
                          </div>
                        </div>
                        
                        <div className="progress mb-3" style={{height: '6px'}}>
                          <div 
                            className="progress-bar" 
                            style={{width: `${(club.memberCount/club.maxMembers)*100}%`}}
                          ></div>
                        </div>
                      </Card.Body>
                      <Card.Footer className="bg-light">
                        <div className="btn-group w-100">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => openClubDetails(club)}
                          >
                            <i className="fas fa-eye me-1"></i>
                            View
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </Button>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
                
                {clubs.length === 0 && (
                  <Col className="text-center">
                    <div className="py-5">
                      <i className="fas fa-users fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">No clubs created yet</h5>
                      <Button variant="primary" onClick={() => setShowClubModal(true)}>
                        Create Your First Club
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          )}

          {activeTab === 'cluster-view' && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>Select Cluster</Form.Label>
                <Form.Select>
                  <option>Select cluster to view students...</option>
                  <option value="0">0 - BCA</option>
                  <option value="1">1 - BCOM</option>
                  <option value="2">2 - MCOM</option>
                </Form.Select>
              </Form.Group>
              
              <Alert variant="info">
                <i className="fas fa-info-circle me-2"></i>
                Select a cluster above to view students and manage their club memberships.
              </Alert>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <Alert variant="warning" className="mb-4">
                <h6><i className="fas fa-exclamation-triangle me-2"></i>Danger Zone</h6>
                <p className="mb-2">These actions are irreversible and will affect all clubs and students.</p>
                <Button variant="danger" onClick={deleteAllClubs}>
                  <i className="fas fa-trash-alt me-2"></i>
                  Delete All Clubs & Data
                </Button>
              </Alert>

              <Card>
                <Card.Header>
                  <h6 className="mb-0">Club Join Settings</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Students can join clubs:</span>
                        <Badge bg={clubSettings.isJoiningOpen ? 'success' : 'danger'}>
                          {clubSettings.isJoiningOpen ? 'OPEN' : 'CLOSED'}
                        </Badge>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Max clubs per student:</span>
                        <Badge bg="primary">{clubSettings.maxClubsPerStudent}</Badge>
                      </div>
                    </Col>
                  </Row>
                  <Button variant="outline-primary" onClick={() => setShowSettingsModal(true)}>
                    <i className="fas fa-cog me-2"></i>
                    Configure Settings
                  </Button>
                </Card.Body>
              </Card>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create Club Modal */}
      <Modal show={showClubModal} onHide={() => setShowClubModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Club</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleClubSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Club Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Maximum Members</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxMembers"
                    value={formData.maxMembers}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Club Coordinator *</Form.Label>
              <Form.Select 
                name="coordinator" 
                value={formData.coordinator} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select coordinator...</option>
                {staff.map(staffMember => (
                  <option key={staffMember.staff_id} value={staffMember.staff_id}>
                    {staffMember.name} - {staffMember.department_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowClubModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Club
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Settings Modal */}
      <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Club Settings</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSettingsSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="joining-open"
                label="Allow students to join clubs"
                name="isJoiningOpen"
                checked={clubSettings.isJoiningOpen}
                onChange={handleSettingsChange}
              />
            </Form.Group>

            {clubSettings.isJoiningOpen && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Join Period Start</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="joinPeriodStart"
                        value={clubSettings.joinPeriodStart}
                        onChange={handleSettingsChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Join Period End</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="joinPeriodEnd"
                        value={clubSettings.joinPeriodEnd}
                        onChange={handleSettingsChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Max Clubs Per Student</Form.Label>
              <Form.Control
                type="number"
                name="maxClubsPerStudent"
                value={clubSettings.maxClubsPerStudent}
                onChange={handleSettingsChange}
                min="1"
                max="5"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Settings
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Club Details Modal */}
      {selectedClub && (
        <Modal show={!!selectedClub} onHide={() => setSelectedClub(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedClub.name} - Members</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Cluster</th>
                    <th>Representative</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>BCA001</td>
                    <td><Badge bg="primary">BCA</Badge></td>
                    <td>
                      <Form.Check type="switch" />
                    </td>
                    <td>
                      <Button size="sm" variant="outline-danger">Remove</Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>BCA002</td>
                    <td><Badge bg="primary">BCA</Badge></td>
                    <td>
                      <Form.Check type="switch" defaultChecked />
                    </td>
                    <td>
                      <Button size="sm" variant="outline-danger">Remove</Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedClub(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ClubManagement;
