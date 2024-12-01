import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Button, Table, Modal, Form, 
  Alert, Badge, Spinner, Dropdown
} from 'react-bootstrap';
import { apiService } from '../services/api';

const ClusterManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCluster, setEditingCluster] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clusters, setClusters] = useState([]);

  const [formData, setFormData] = useState({
    cluster_name: '',
    cluster_code: '',
    description: '',
    is_active: true
  });

  // Load clusters on component mount
  useEffect(() => {
    loadClusters();
  }, []);

  const loadClusters = async () => {
    setLoading(true);
    try {
      const response = await apiService.getClusters();
      setClusters(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading clusters:', error);
      setError('Failed to load clusters');
      setClusters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (editingCluster) {
        // Update existing cluster
        await apiService.updateCluster(editingCluster.cluster_id, formData);
      } else {
        // Add new cluster
        await apiService.createCluster(formData);
      }
      
      setShowModal(false);
      resetForm();
      loadClusters(); // Reload clusters list
    } catch (error) {
      console.error('Error saving cluster:', error);
      setError(error.response?.data?.message || 'Failed to save cluster');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cluster_name: '',
      cluster_code: '',
      description: '',
      is_active: true
    });
    setEditingCluster(null);
  };

  const handleEdit = (cluster) => {
    setEditingCluster(cluster);
    setFormData({
      cluster_name: cluster.cluster_name,
      cluster_code: cluster.cluster_code,
      description: cluster.description || '',
      is_active: cluster.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (clusterId) => {
    if (window.confirm('Are you sure you want to delete this cluster?')) {
      setLoading(true);
      try {
        await apiService.deleteCluster(clusterId);
        loadClusters(); // Reload clusters list
      } catch (error) {
        console.error('Error deleting cluster:', error);
        setError('Failed to delete cluster');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (clusterId) => {
    try {
      await apiService.toggleCluster(clusterId);
      loadClusters(); // Reload clusters list
    } catch (error) {
      console.error('Error toggling cluster status:', error);
      setError('Failed to toggle cluster status');
    }
  };

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Cluster Management</h5>
              <Button 
                variant="primary" 
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                disabled={loading}
              >
                Add Cluster
              </Button>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              {loading && clusters.length === 0 ? (
                <div className="text-center">
                  <Spinner animation="border" />
                  <div>Loading clusters...</div>
                </div>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Cluster ID</th>
                      <th>Cluster Name</th>
                      <th>Cluster Code</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusters.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No clusters found
                        </td>
                      </tr>
                    ) : (
                      clusters.map(cluster => (
                        <tr key={cluster.cluster_id}>
                          <td>{cluster.cluster_id}</td>
                          <td>{cluster.cluster_name}</td>
                          <td>{cluster.cluster_code}</td>
                          <td>{cluster.description || 'No description'}</td>
                          <td>
                            <Badge variant={cluster.is_active ? 'success' : 'secondary'}>
                              {cluster.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-primary" size="sm">
                                Actions
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(cluster)}>
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleToggleStatus(cluster.cluster_id)}>
                                  {cluster.is_active ? 'Deactivate' : 'Activate'}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => handleDelete(cluster.cluster_id)}
                                >
                                  Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Cluster Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        resetForm();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCluster ? 'Edit Cluster' : 'Add New Cluster'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Cluster Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="cluster_name"
                value={formData.cluster_name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cluster Code <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="cluster_code"
                value={formData.cluster_code}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

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
              <Form.Check
                type="checkbox"
                name="is_active"
                label="Active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              editingCluster ? 'Update Cluster' : 'Add Cluster'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClusterManagement;

