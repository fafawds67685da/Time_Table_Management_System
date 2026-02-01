import React, { useState, useEffect } from 'react';
import { getFacultyCourses, createFacultyCourse, deleteFacultyCourse, getFaculty, getCourses } from '../api';

function FacultyCourseManager() {
  const [facultyCourses, setFacultyCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ faculty_id: '', course_id: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFacultyCourses();
    fetchFaculty();
    fetchCourses();
  }, []);

  const fetchFacultyCourses = async () => {
    try {
      const response = await getFacultyCourses();
      setFacultyCourses(response.data);
    } catch (error) {
      console.error('Error fetching faculty-courses:', error);
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
      await createFacultyCourse({
        faculty_id: parseInt(formData.faculty_id),
        course_id: parseInt(formData.course_id)
      });
      setMessage('✅ Faculty-Course mapping added successfully!');
      setFormData({ faculty_id: '', course_id: '' });
      fetchFacultyCourses();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to add mapping'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      try {
        await deleteFacultyCourse(id);
        fetchFacultyCourses();
        setMessage('✅ Mapping deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error deleting mapping');
      }
    }
  };

  const getFacultyName = (facultyId) => {
    const f = faculty.find(f => f.id === facultyId);
    return f ? f.name : 'N/A';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? `${course.name} (${course.code})` : 'N/A';
  };

  return (
    <div>
      <div className="form-container">
        <h2>Assign Course to Faculty</h2>
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
            <label>Course *</label>
            <select
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Assign Course</button>
        </form>
      </div>

      <div className="table-container">
        <h2>All Faculty-Course Assignments</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Faculty</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {facultyCourses.map((fc) => (
              <tr key={fc.id}>
                <td>{fc.id}</td>
                <td>{getFacultyName(fc.faculty_id)}</td>
                <td>{getCourseName(fc.course_id)}</td>
                <td>
                  <button onClick={() => handleDelete(fc.id)} className="btn btn-danger">
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

export default FacultyCourseManager;
