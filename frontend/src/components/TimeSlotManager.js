import React, { useState, useEffect } from 'react';
import { getTimeSlots, createTimeSlot, deleteTimeSlot } from '../api';

function TimeSlotManager() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [formData, setFormData] = useState({ start_time: '', end_time: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const response = await getTimeSlots();
      setTimeSlots(response.data);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTimeSlot(formData);
      setMessage('✅ Time slot added successfully!');
      setFormData({ start_time: '', end_time: '' });
      fetchTimeSlots();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to add time slot'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        await deleteTimeSlot(id);
        fetchTimeSlots();
        setMessage('✅ Time slot deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error deleting time slot');
      }
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2>Add New Time Slot</h2>
        {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>End Time *</label>
            <input
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Time Slot</button>
        </form>
      </div>

      <div className="table-container">
        <h2>All Time Slots</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.id}</td>
                <td>{slot.start_time}</td>
                <td>{slot.end_time}</td>
                <td>
                  <button onClick={() => handleDelete(slot.id)} className="btn btn-danger">
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

export default TimeSlotManager;
