import React, { useState, useEffect } from 'react';
import { getFaculty, createFaculty, deleteFaculty } from '../api';

function FacultyManager() {
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await getFaculty();
      setFaculty(response.data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFaculty({
        name: formData.name
      });
      setMessage('✅ Faculty added successfully!');
      setFormData({ name: '' });
      fetchFaculty();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to add faculty'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty?')) {
      try {
        await deleteFaculty(id);
        fetchFaculty();
        setMessage('✅ Faculty deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error deleting faculty');
      }
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2>Add New Faculty</h2>
        {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Faculty Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Dr. John Smith"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Faculty</button>
        </form>
      </div>

      <div className="table-container">
        <h2>All Faculty</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculty.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.name}</td>
                <td>{new Date(f.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(f.id)} className="btn btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FacultyManager;
