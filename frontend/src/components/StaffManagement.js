import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Button, Table, Modal, Form, 
  Badge, Nav, Dropdown, Alert, Spinner
} from 'react-bootstrap';
import { apiService } from '../services/api';

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [clusters] = useState([
    { id: 0, name: 'BCA', code: 'BCA' },
    { id: 1, name: 'B.Com', code: 'BCOM' },
    { id: 2, name: 'M.Com', code: 'MCOM' }
  ]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [staffResponse, departmentsResponse] = await Promise.all([
        apiService.getStaff(),
        apiService.getDepartments()
      ]);
      setStaffList(staffResponse.data || []);
      setDepartments(departmentsResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    staff_id: '',
    email: '',
    phone: '',
    subject_expertise: '',
    qualification: '',
    department: '',
    departmental_access_enabled: false,
    mentor_access_enabled: false,
    mentor_cluster: '',
    photo: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData[key]) {
          formDataToSend.append('photo', formData[key]);
        } else if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      let response;
      if (editingStaff) {
        // Update existing staff
        response = await apiService.updateStaff(editingStaff.id, formDataToSend);
      } else {
        // Create new staff
        response = await apiService.createStaff(formDataToSend);
      }
      
      console.log('Staff saved successfully:', response.data);
      setShowModal(false);
      resetForm();
      loadData(); // Reload the staff list
      
    } catch (error) {
      console.error('Error saving staff:', error);
      setError(error.response?.data?.message || 'Failed to save staff member');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      staff_id: '',
      email: '',
      phone: '',
      subject_expertise: '',
      qualification: '',
      department: '',
      departmental_access_enabled: false,
      mentor_access_enabled: false,
      mentor_cluster: '',
      photo: null
    });
    setEditingStaff(null);
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({ ...staffMember, photo: null }); // Reset photo field
    setShowModal(true);
  };

  const handleDelete = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setLoading(true);
      try {
        await apiService.deleteStaff(staffId);
        console.log('Staff deleted successfully');
        loadData(); // Reload the staff list
      } catch (error) {
        console.error('Error deleting staff:', error);
        setError('Failed to delete staff member');
      } finally {
        setLoading(false);
      }
    }
  };

  // Department management functions
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentCode, setNewDepartmentCode] = useState('');
  const [editingDepartment, setEditingDepartment] = useState(null);

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim() || !newDepartmentCode.trim()) {
      setError('Department name and code are required');
      return;
    }
    
    try {
      const departmentData = {
        name: newDepartmentName.trim(),
        code: newDepartmentCode.trim().toUpperCase()
      };
      
      if (editingDepartment) {
        // Update existing department
        await apiService.updateDepartment(editingDepartment.id, departmentData);
        setEditingDepartment(null);
      } else {
        // Create new department
        await apiService.createDepartment(departmentData);
      }
      
      setNewDepartmentName('');
      setNewDepartmentCode('');
      loadData();
    } catch (error) {
      console.error('Error saving department:', error);
      setError(`Failed to ${editingDepartment ? 'update' : 'add'} department`);
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setNewDepartmentName(department.name);
    setNewDepartmentCode(department.code);
  };

  const cancelDepartmentEdit = () => {
    setEditingDepartment(null);
    setNewDepartmentName('');
    setNewDepartmentCode('');
  };

  const handleDeleteDepartment = async (deptId, deptName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the department "${deptName}"?\n\n` +
      'This action cannot be undone and may affect staff members assigned to this department.'
    );
    
    if (isConfirmed) {
      try {
        await apiService.deleteDepartment(deptId);
        loadData();
      } catch (error) {
        console.error('Error deleting department:', error);
        setError('Failed to delete department. It may have staff members assigned to it.');
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-users-cog me-2"></i>
          Staff Management
        </h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus me-2"></i>
          Add New Staff
        </Button>
      </div>

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

      {/* Navigation Tabs */}
      <Card>
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="list">
            <Nav.Item>
              <Nav.Link 
                eventKey="list" 
                active={activeTab === 'list'}
                onClick={() => setActiveTab('list')}
              >
                <i className="fas fa-list me-2"></i>
                Staff List
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="departments" 
                active={activeTab === 'departments'}
                onClick={() => setActiveTab('departments')}
              >
                <i className="fas fa-building me-2"></i>
                Departments
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Card.Body>
          {activeTab === 'list' && (
            <div>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-dark">
                    <tr>
                      <th>Staff ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Qualification</th>
                      <th>Subject Expertise</th>
                      <th>Access</th>
                      <th>Mentor Cluster</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <i className="fas fa-users text-muted fa-2x mb-2"></i>
                          <p className="text-muted mb-0">No staff members found</p>
                        </td>
                      </tr>
                    ) : (
                      staffList.map(staffMember => (
                        <tr key={staffMember.id}>
                          <td>{staffMember.staff_id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-secondary rounded-circle me-2 d-flex align-items-center justify-content-center" 
                                   style={{width: '32px', height: '32px'}}>
                                {staffMember.photo ? (
                                  <img 
                                    src={staffMember.photo} 
                                    alt={staffMember.name}
                                    className="rounded-circle"
                                    style={{width: '32px', height: '32px', objectFit: 'cover'}}
                                  />
                                ) : (
                                  <i className="fas fa-user text-white"></i>
                                )}
                              </div>
                              <div>
                                <div className="fw-bold">{staffMember.name}</div>
                                <small className="text-muted">{staffMember.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>{staffMember.department}</td>
                          <td>{staffMember.qualification}</td>
                          <td>{staffMember.subject_expertise}</td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              <Badge bg={staffMember.departmental_access_enabled ? 'success' : 'secondary'}>
                                Dept: {staffMember.departmental_access_enabled ? 'Enabled' : 'Disabled'}
                              </Badge>
                              <Badge bg={staffMember.mentor_access_enabled ? 'info' : 'secondary'}>
                                Mentor: {staffMember.mentor_access_enabled ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            {staffMember.mentor_cluster ? (
                              <Badge bg="primary">{staffMember.mentor_cluster}</Badge>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <Badge bg={staffMember.is_active ? 'success' : 'danger'}>
                              {staffMember.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(staffMember)}>
                                  <i className="fas fa-edit me-2"></i>Edit
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => handleDelete(staffMember.id)}
                                >
                                  <i className="fas fa-trash me-2"></i>Delete
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
            </div>
          )}

          {activeTab === 'departments' && (
            <div>
              <div className="d-flex justify-content-between mb-3">
                <h5>Department Management</h5>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Department name"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    style={{ width: '200px' }}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Code"
                    value={newDepartmentCode}
                    onChange={(e) => setNewDepartmentCode(e.target.value)}
                    style={{ width: '100px' }}
                  />
                  <Button 
                    variant={editingDepartment ? "success" : "outline-primary"} 
                    onClick={handleAddDepartment} 
                    disabled={loading}
                  >
                    <i className={`fas ${editingDepartment ? 'fa-save' : 'fa-plus'} me-2`}></i>
                    {editingDepartment ? 'Update' : 'Add'}
                  </Button>
                  {editingDepartment && (
                    <Button variant="secondary" onClick={cancelDepartmentEdit}>
                      <i className="fas fa-times me-2"></i>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
              <Row>
                {departments.length === 0 ? (
                  <Col>
                    <div className="text-center py-4">
                      <i className="fas fa-building text-muted fa-2x mb-2"></i>
                      <p className="text-muted mb-0">No departments found</p>
                    </div>
                  </Col>
                ) : (
                  departments.map(dept => (
                    <Col md={4} key={dept.id} className="mb-3">
                      <Card>
                        <Card.Body>
                          <h6>{dept.name}</h6>
                          <p className="text-muted mb-1">Code: {dept.code}</p>
                          <div className="d-flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              onClick={() => handleEditDepartment(dept)}
                              title="Edit Department"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-danger"
                              onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                              title="Delete Department"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                )}
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Staff Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
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
                  <Form.Label>Staff ID *</Form.Label>
                  <Form.Control
                    type="text"
                    name="staff_id"
                    value={formData.staff_id}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject Expertise *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject_expertise"
                    value={formData.subject_expertise}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Qualification *</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department *</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="departmental-access"
                    label="Departmental Access Enabled"
                    name="departmental_access_enabled"
                    checked={formData.departmental_access_enabled}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="mentor-access"
                    label="Mentor Access Enabled"
                    name="mentor_access_enabled"
                    checked={formData.mentor_access_enabled}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.mentor_access_enabled && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mentor Cluster</Form.Label>
                    <Form.Select
                      name="mentor_cluster"
                      value={formData.mentor_cluster}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Cluster</option>
                      {clusters.map(cluster => (
                        <option key={cluster.id} value={cluster.id}>
                          {cluster.id} - {cluster.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {editingStaff ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  {editingStaff ? 'Update' : 'Add'} Staff
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;
