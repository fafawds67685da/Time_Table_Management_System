import React, { useState, useEffect } from 'react';
import { getCourses, createCourse, deleteCourse } from '../api';

function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ name: '', code: '', hours_required: '', is_lab: false });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse({
        name: formData.name,
        code: formData.code,
        hours_required: parseInt(formData.hours_required),
        is_lab: formData.is_lab
      });
      setMessage('✅ Course added successfully!');
      setFormData({ name: '', code: '', hours_required: '', is_lab: false });
      fetchCourses();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to add course'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        fetchCourses();
        setMessage('✅ Course deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error deleting course');
      }
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2>Add New Course</h2>
        {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Data Structures"
              required
            />
          </div>
          <div className="form-group">
            <label>Course Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., CS201"
              required
            />
          </div>
          <div className="form-group">
            <label>Hours Required (per week) *</label>
            <input
              type="number"
              value={formData.hours_required}
              onChange={(e) => setFormData({ ...formData, hours_required: e.target.value })}
              placeholder="e.g., 4"
              required
            />
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={formData.is_lab}
                onChange={(e) => setFormData({ ...formData, is_lab: e.target.checked })}
              />
              <span>Is Lab Course (2-hour sessions)</span>
            </label>
          </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Course</button>
        </form>
      </div>

      <div className="table-container">
        <h2>All Courses</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Hours/Week</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.hours_required}</td>
                <td>
                  <span className={course.is_lab ? 'badge badge-lab' : 'badge badge-regular'}>
                    {course.is_lab ? '🔬 Lab' : '📚 Regular'}
                  </span>
                </td>
                <td>{new Date(course.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(course.id)} className="btn btn-danger">
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

export default CourseManager;
