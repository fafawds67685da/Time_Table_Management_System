import React, { useState, useEffect } from 'react';
import { getSectionCourses, createSectionCourse, deleteSectionCourse, getSections, getCourses } from '../api';

function SectionCourseManager() {
  const [sectionCourses, setSectionCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ section_id: '', course_id: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSectionCourses();
    fetchSections();
    fetchCourses();
  }, []);

  const fetchSectionCourses = async () => {
    try {
      const response = await getSectionCourses();
      setSectionCourses(response.data);
    } catch (error) {
      console.error('Error fetching section-courses:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await getSections();
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
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
      await createSectionCourse({
        section_id: parseInt(formData.section_id),
        course_id: parseInt(formData.course_id)
      });
      setMessage('✅ Course assigned to section successfully!');
      setFormData({ section_id: '', course_id: '' });
      fetchSectionCourses();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to assign course'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this course from the section?')) {
      try {
        await deleteSectionCourse(id);
        fetchSectionCourses();
        setMessage('✅ Course removed from section successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error removing course');
      }
    }
  };

  const getSectionName = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.name : 'N/A';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? `${course.name} (${course.code})` : 'N/A';
  };

  return (
    <div>
      <div className="form-container">
        <h2>Assign Course to Section</h2>
        {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Section *</label>
            <select
              value={formData.section_id}
              onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
              required
            >
              <option value="">Select a section</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
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
        <h2>All Section-Course Assignments</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Section</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sectionCourses.map((sc) => (
              <tr key={sc.id}>
                <td>{sc.id}</td>
                <td>{getSectionName(sc.section_id)}</td>
                <td>{getCourseName(sc.course_id)}</td>
                <td>
                  <button onClick={() => handleDelete(sc.id)} className="btn btn-danger">
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

export default SectionCourseManager;
