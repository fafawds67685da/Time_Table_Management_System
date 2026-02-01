import React, { useState, useEffect } from 'react';
import { 
  getTimeSlotGroupAssignments, 
  createTimeSlotGroupAssignment, 
  deleteTimeSlotGroupAssignment,
  getTimeSlotGroups,
  getTimeSlots
} from '../api';

function TimeSlotGroupAssignmentManager() {
  const [assignments, setAssignments] = useState([]);
  const [timeSlotGroups, setTimeSlotGroups] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [formData, setFormData] = useState({ time_slot_group_id: '', time_slot_id: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, groupsRes, slotsRes] = await Promise.all([
        getTimeSlotGroupAssignments(),
        getTimeSlotGroups(),
        getTimeSlots()
      ]);
      setAssignments(assignmentsRes.data);
      setTimeSlotGroups(groupsRes.data);
      setTimeSlots(slotsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTimeSlotGroupAssignment({
        time_slot_group_id: parseInt(formData.time_slot_group_id),
        time_slot_id: parseInt(formData.time_slot_id)
      });
      setMessage('✅ Time slot assigned to group successfully!');
      setFormData({ time_slot_group_id: '', time_slot_id: '' });
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to assign time slot'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this time slot from the group?')) {
      try {
        await deleteTimeSlotGroupAssignment(id);
        fetchData();
        setMessage('✅ Assignment removed successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error removing assignment');
      }
    }
  };

  const getGroupName = (groupId) => {
    const group = timeSlotGroups.find(g => g.id === groupId);
    return group ? group.name : 'N/A';
  };

  const getTimeSlotInfo = (slotId) => {
    const slot = timeSlots.find(s => s.id === slotId);
    return slot ? `${slot.start_time} - ${slot.end_time}` : 'N/A';
  };

  return (
    <div>
      <div className="form-container">
        <h2>Assign Time Slot to Group</h2>
        {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Time Slot Group *</label>
            <select
              value={formData.time_slot_group_id}
              onChange={(e) => setFormData({ ...formData, time_slot_group_id: e.target.value })}
              required
            >
              <option value="">Select a group</option>
              {timeSlotGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
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
          <button type="submit" className="btn btn-primary">Assign Time Slot</button>
        </form>
      </div>

      <div className="table-container">
        <h2>All Time Slot Assignments</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Group</th>
              <th>Time Slot</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.id}</td>
                <td>{getGroupName(assignment.time_slot_group_id)}</td>
                <td>{getTimeSlotInfo(assignment.time_slot_id)}</td>
                <td>
                  <button onClick={() => handleDelete(assignment.id)} className="btn btn-danger">
                    Remove
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

export default TimeSlotGroupAssignmentManager;
