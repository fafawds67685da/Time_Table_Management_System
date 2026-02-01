import React, { useState, useEffect } from 'react';
import { getFacultyAvailability, createFacultyAvailability, deleteFacultyAvailability, getFaculty, getTimeSlots } from '../api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function FacultyAvailabilityManager() {
  const [availabilities, setAvailabilities] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [formData, setFormData] = useState({ faculty_id: '', day_of_week: '', time_slot_id: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAvailabilities();
    fetchFaculty();
    fetchTimeSlots();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const response = await getFacultyAvailability();
      setAvailabilities(response.data);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await getFaculty();
      setFaculty(response.data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

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
      await createFacultyAvailability({
        faculty_id: parseInt(formData.faculty_id),
        day_of_week: parseInt(formData.day_of_week),
        time_slot_id: parseInt(formData.time_slot_id)
      });
      setMessage('✅ Availability added successfully!');
      setFormData({ faculty_id: '', day_of_week: '', time_slot_id: '' });
      fetchAvailabilities();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to add availability'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      try {
        await deleteFacultyAvailability(id);
        fetchAvailabilities();
        setMessage('✅ Availability deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error deleting availability');
      }
    }
  };

  const getFacultyName = (facultyId) => {
    const f = faculty.find(f => f.id === facultyId);
    return f ? f.name : 'N/A';
  };

  const getTimeSlotInfo = (timeSlotId) => {
    const slot = timeSlots.find(s => s.id === timeSlotId);
    return slot ? `${slot.start_time} - ${slot.end_time}` : 'N/A';
  };

  return (
    <div>
      <div className="form-container">
        <h2>Add Faculty Availability</h2>
        {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Faculty *</label>
            <select
              value={formData.faculty_id}
              onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
              required
            >
              <option value="">Select a faculty</option>
              {faculty.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Day *</label>
            <select
              value={formData.day_of_week}
              onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
              required
            >
              <option value="">Select a day</option>
              {DAYS.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Time Slot *</label>
            <select
              value={formData.time_slot_id}
              onChange={(e) => setFormData({ ...formData, time_slot_id: e.target.value })}
              required
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.start_time} - {slot.end_time}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Add Availability</button>
        </form>
      </div>

      <div className="table-container">
        <h2>All Faculty Availabilities</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Faculty</th>
              <th>Day</th>
              <th>Time Slot</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {availabilities.map((availability) => (
              <tr key={availability.id}>
                <td>{availability.id}</td>
                <td>{getFacultyName(availability.faculty_id)}</td>
                <td><span className="day-badge">{DAYS[availability.day_of_week]}</span></td>
                <td>{getTimeSlotInfo(availability.time_slot_id)}</td>
                <td>
                  <button onClick={() => handleDelete(availability.id)} className="btn btn-danger">
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

export default FacultyAvailabilityManager;
