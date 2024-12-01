import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Button, Table, Modal, Form, 
  Alert, Badge, Spinner, Dropdown
} from 'react-bootstrap';
import { apiService } from '../services/api';

const StudentManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [credentialsData, setCredentialsData] = useState({
    username: '',
    password: '',
    temp_password: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCluster, setFilterCluster] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [clusters, setClusters] = useState([]);

  // Individual student form data
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    email: '',
    phone: '',
    student_id: '',
    year_of_admission: new Date().getFullYear(),
    current_semester: 1,
    cluster: ''
  });

  // Load students and clusters on component mount
  useEffect(() => {
    loadStudents();
    loadClusters();
  }, []);

  const loadClusters = async () => {
    try {
      const response = await apiService.getClusters();
      setClusters(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading clusters:', error);
      setError('Failed to load clusters');
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await apiService.getStudents();
      setStudents(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      console.error('Error loading students:', error);
      setError('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Individual student form handlers
  const handleStudentInputChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.createStudent(studentFormData);
      console.log('Student created successfully:', response.data);
      setShowAddModal(false);
      resetStudentForm();
      loadStudents(); // Reload the student list
      
      // Show success message
      alert(`Student created successfully! Credentials have been sent to ${studentFormData.email}`);
    } catch (error) {
      console.error('Error adding student:', error);
      setError(error.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const resetStudentForm = () => {
    setStudentFormData({
      name: '',
      email: '',
      phone: '',
      student_id: '',
      year_of_admission: new Date().getFullYear(),
      current_semester: 1,
      cluster: ''
    });
  };

  const toggleClubChange = async (studentId, canChange) => {
    try {
      await apiService.updateStudentClubPermission(studentId, { can_change_club: canChange });
      loadStudents(); // Reload to reflect changes
    } catch (error) {
      console.error('Error updating club permission:', error);
      setError('Failed to update club permission');
    }
  };

  const deleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await apiService.deleteStudent(studentId);
        loadStudents(); // Reload the student list
      } catch (error) {
        console.error('Error deleting student:', error);
        setError('Failed to delete student');
      }
    }
  };

  const sendCredentials = async (studentId) => {
    try {
      await apiService.sendStudentCredentials(studentId);
      console.log('Credentials sent for student:', studentId);
      setError(null);
      alert('Credentials sent successfully!');
      loadStudents(); // Reload to update credential status
    } catch (error) {
      console.error('Error sending credentials:', error);
      setError('Failed to send credentials');
    }
  };

  const viewCredentials = (student) => {
    setSelectedStudent(student);
    setCredentialsData({
      username: student.username || student.email || '',
      password: '••••••••',
      temp_password: student.temp_password || ''
    });
    setShowCredentialsModal(true);
  };

  const resetPassword = async (studentId) => {
    if (window.confirm('Are you sure you want to reset this student\'s password?')) {
      try {
        await apiService.resetStudentPassword(studentId);
        console.log('Password reset for student:', studentId);
        setError(null);
        alert('Password reset email sent successfully!');
      } catch (error) {
        console.error('Error resetting password:', error);
        setError('Failed to reset password');
      }
    }
  };

  const generateNewPassword = async () => {
    if (selectedStudent) {
      try {
        const response = await apiService.generateStudentPassword(selectedStudent.id);
        setCredentialsData(prev => ({
          ...prev,
          temp_password: response.data.temp_password
        }));
      } catch (error) {
        console.error('Error generating password:', error);
        setError('Failed to generate new password');
      }
    }
  };

  const saveCredentials = async () => {
    if (selectedStudent) {
      try {
        await apiService.updateStudentCredentials(selectedStudent.id, {
          username: credentialsData.username,
          temp_password: credentialsData.temp_password
        });
        setShowCredentialsModal(false);
        loadStudents();
      } catch (error) {
        console.error('Error updating credentials:', error);
        setError('Failed to update credentials');
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCluster = filterCluster === '' || student.cluster === filterCluster;
    
    return matchesSearch && matchesCluster;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-user-graduate me-2"></i>
          Student Management
        </h2>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Search students by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
          <Form.Select 
            value={filterCluster} 
            onChange={(e) => setFilterCluster(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="">All Clusters</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </Form.Select>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus me-2"></i>
            Add Student
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
                <div>
                  <div className="text-muted small">Total Students</div>
                  <div className="fs-4 fw-bold">{students.length}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="fas fa-filter fa-2x text-info"></i>
                </div>
                <div>
                  <div className="text-muted small">Filtered Results</div>
                  <div className="fs-4 fw-bold">{filteredStudents.length}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="fas fa-envelope fa-2x text-success"></i>
                </div>
                <div>
                  <div className="text-muted small">Credentials Sent</div>
                  <div className="fs-4 fw-bold">
                    {students.filter(s => s.credentials_sent).length}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="fas fa-user-check fa-2x text-warning"></i>
                </div>
                <div>
                  <div className="text-muted small">Active in Clubs</div>
                  <div className="fs-4 fw-bold">
                    {students.filter(s => s.current_club).length}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Student List */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Cluster</th>
                  <th>Current Club</th>
                  <th>Can Change Club</th>
                  <th>Credentials</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <i className="fas fa-user-graduate text-muted fa-2x mb-2"></i>
                      <p className="text-muted mb-0">
                        {students.length === 0 ? 'No students found' : 'No students match your search criteria'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>{student.student_id}</td>
                      <td>
                        <div>
                          <div className="fw-bold">{student.name}</div>
                        </div>
                      </td>
                      <td>{student.email}</td>
                      <td><Badge bg="primary">{student.cluster}</Badge></td>
                      <td>
                        {student.current_club ? (
                          <Badge bg="info">{student.current_club}</Badge>
                        ) : (
                          <span className="text-muted">No Club</span>
                        )}
                      </td>
                      <td>
                        <Form.Check
                          type="switch"
                          checked={student.can_change_club}
                          onChange={(e) => toggleClubChange(student.id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <Badge bg={student.credentials_sent ? 'success' : 'warning'}>
                          {student.credentials_sent ? 'Sent' : 'Pending'}
                        </Badge>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-primary" size="sm">
                            <i className="fas fa-cog"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => viewCredentials(student)}>
                              <i className="fas fa-key me-2"></i>
                              View Credentials
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => sendCredentials(student.id)}>
                              <i className="fas fa-paper-plane me-2"></i>
                              Send Credentials
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => resetPassword(student.id)}>
                              <i className="fas fa-redo me-2"></i>
                              Reset Password
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                              className="text-danger"
                              onClick={() => deleteStudent(student.id)}
                            >
                              <i className="fas fa-trash me-2"></i>
                              Delete Student
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add Individual Student Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddStudentSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={studentFormData.name}
                    onChange={handleStudentInputChange}
                    required
                    placeholder="Enter student's full name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student ID *</Form.Label>
                  <Form.Control
                    type="text"
                    name="student_id"
                    value={studentFormData.student_id}
                    onChange={handleStudentInputChange}
                    required
                    placeholder="e.g., BCA001"
                  />
                  <Form.Text className="text-muted">
                    Unique identifier for the student (credentials will be sent automatically)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={studentFormData.email}
                    onChange={handleStudentInputChange}
                    required
                    placeholder="student@example.com"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={studentFormData.phone}
                    onChange={handleStudentInputChange}
                    placeholder="+91 9876543210"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cluster *</Form.Label>
                  <Form.Select 
                    name="cluster"
                    value={studentFormData.cluster} 
                    onChange={handleStudentInputChange}
                    required
                  >
                    <option value="">Choose cluster...</option>
                    {clusters.map(cluster => (
                      <option key={cluster.id} value={cluster.name}>{cluster.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Year of Admission *</Form.Label>
                  <Form.Control
                    type="number"
                    name="year_of_admission"
                    value={studentFormData.year_of_admission}
                    onChange={handleStudentInputChange}
                    required
                    min="2020"
                    max="2030"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Semester *</Form.Label>
                  <Form.Select 
                    name="current_semester"
                    value={studentFormData.current_semester} 
                    onChange={handleStudentInputChange}
                    required
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Adding Student...
                </>
              ) : (
                <>
                  <i className="fas fa-plus me-2"></i>
                  Add Student
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View/Edit Credentials Modal */}
      <Modal show={showCredentialsModal} onHide={() => setShowCredentialsModal(false)} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Student Credentials</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div>
              <h6>{selectedStudent.name}</h6>
              <p className="text-muted">{selectedStudent.email}</p>
              <hr />
              
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={credentialsData.username}
                  onChange={(e) => setCredentialsData(prev => ({ ...prev, username: e.target.value }))}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  value={credentialsData.password}
                  readOnly
                  className="bg-light"
                />
                <Form.Text className="text-muted">
                  Password is hidden for security
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Temporary Password</Form.Label>
                <div className="d-flex gap-2">
                  <div className="position-relative flex-grow-1">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={credentialsData.temp_password}
                      onChange={(e) => setCredentialsData(prev => ({ ...prev, temp_password: e.target.value }))}
                      placeholder="Enter temporary password"
                    />
                    <Button
                      variant="link"
                      size="sm"
                      className="position-absolute top-0 end-0 border-0 text-muted"
                      style={{ zIndex: 10 }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </Button>
                  </div>
                  <Button variant="outline-secondary" onClick={generateNewPassword}>
                    <i className="fas fa-random me-1"></i>
                    Generate
                  </Button>
                </div>
                <Form.Text className="text-muted">
                  This password will be sent to the student's email
                </Form.Text>
              </Form.Group>

              <div className="d-flex gap-2 mb-3">
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => sendCredentials(selectedStudent.id)}
                >
                  <i className="fas fa-paper-plane me-1"></i>
                  Send via Email
                </Button>
                <Button 
                  variant="warning" 
                  size="sm"
                  onClick={() => resetPassword(selectedStudent.id)}
                >
                  <i className="fas fa-key me-1"></i>
                  Reset Password
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCredentialsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveCredentials}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentManagement;
