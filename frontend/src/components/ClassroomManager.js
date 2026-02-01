import React, { useState, useEffect } from 'react';
import { getClassrooms, createClassroom, deleteClassroom } from '../api';

function ClassroomManager() {
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({ name: '', capacity: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      console.log('Fetching classrooms...');
      const response = await getClassrooms();
      console.log('Classrooms response:', response.data);
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      console.error('Error details:', error.response);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClassroom({
        name: formData.name,
        capacity: formData.capacity ? parseInt(formData.capacity) : null
      });
      setMessage('✅ Classroom added successfully!');
      setFormData({ name: '', capacity: '' });
      fetchClassrooms();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to add classroom'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await deleteClassroom(id);
        fetchClassrooms();
        setMessage('✅ Classroom deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error deleting classroom');
      }
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2>Add New Classroom</h2>
        {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Classroom Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Room 101, Lab A"
              required
            />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="e.g., 50"
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Classroom</button>
        </form>
      </div>

      <div className="table-container">
        <h2>All Classrooms</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Capacity</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr key={classroom.id}>
                <td>{classroom.id}</td>
                <td>{classroom.name}</td>
                <td>{classroom.capacity || 'N/A'}</td>
                <td>{new Date(classroom.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(classroom.id)} className="btn btn-danger">
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

export default ClassroomManager;
