import React, { useState, useEffect } from 'react';
import { getSections, createSection, deleteSection, getTimeSlotGroups } from '../api';

function SectionManager() {
  const [sections, setSections] = useState([]);
  const [timeSlotGroups, setTimeSlotGroups] = useState([]);
  const [formData, setFormData] = useState({ name: '', strength: '', time_slot_group_id: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSections();
    fetchTimeSlotGroups();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await getSections();
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

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
      await createSection({
        name: formData.name,
        strength: formData.strength ? parseInt(formData.strength) : null,
        time_slot_group_id: formData.time_slot_group_id ? parseInt(formData.time_slot_group_id) : null
      });
      setMessage('✅ Section added successfully!');
      setFormData({ name: '', strength: '', time_slot_group_id: '' });
      fetchSections();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to add section'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteSection(id);
        fetchSections();
        setMessage('✅ Section deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error deleting section');
      }
    }
  };

  const getTimeSlotGroupName = (groupId) => {
    const group = timeSlotGroups.find(g => g.id === groupId);
    return group ? group.name : 'N/A';
  };

  return (
    <div>
      <div className="form-container">
        <h2>Add New Section</h2>
        {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Section Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Section A"
              required
            />
          </div>
          <div className="form-group">
            <label>Student Strength</label>
            <input
              type="number"
              value={formData.strength}
              onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
              placeholder="e.g., 45"
            />
          </div>
          <div className="form-group">
            <label>Time Slot Group</label>
            <select
              value={formData.time_slot_group_id}
              onChange={(e) => setFormData({ ...formData, time_slot_group_id: e.target.value })}
            >
              <option value="">Select a time slot group (optional)</option>
              {timeSlotGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Add Section</button>
        </form>
      </div>

      <div className="table-container">
        <h2>All Sections</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Strength</th>
              <th>Time Slot Group</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id}>
                <td>{section.id}</td>
                <td>{section.name}</td>
                <td>{section.strength || 'N/A'}</td>
                <td>{getTimeSlotGroupName(section.time_slot_group_id)}</td>
                <td>{new Date(section.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(section.id)} className="btn btn-danger">
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

export default SectionManager;
