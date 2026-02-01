import React, { useState, useEffect } from 'react';
import { getTimeSlotGroups, createTimeSlotGroup, deleteTimeSlotGroup } from '../api';

function TimeSlotGroupManager() {
  const [timeSlotGroups, setTimeSlotGroups] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTimeSlotGroups();
  }, []);

  const fetchTimeSlotGroups = async () => {
    try {
      const response = await getTimeSlotGroups();
      setTimeSlotGroups(response.data);
    } catch (error) {
      console.error('Error fetching time slot groups:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTimeSlotGroup({
        name: formData.name,
        description: formData.description || null
      });
      setMessage('✅ Time slot group added successfully!');
      setFormData({ name: '', description: '' });
      fetchTimeSlotGroups();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to add time slot group'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this time slot group?')) {
      try {
        await deleteTimeSlotGroup(id);
        fetchTimeSlotGroups();
        setMessage('✅ Time slot group deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error deleting time slot group');
      }
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2>Add New Time Slot Group</h2>
        {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Group Name * (e.g., "8 AM to 4 PM")</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., 8 to 4, Morning Shift"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              rows="3"
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Group</button>
        </form>
      </div>

      <div className="table-container">
        <h2>All Time Slot Groups</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeSlotGroups.map((group) => (
              <tr key={group.id}>
                <td>{group.id}</td>
                <td>{group.name}</td>
                <td>{group.description || 'N/A'}</td>
                <td>{new Date(group.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(group.id)} className="btn btn-danger">
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

export default TimeSlotGroupManager;
