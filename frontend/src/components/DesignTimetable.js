import React, { useState, useEffect } from 'react';
import { getSections, getCourses, getFacultyCourses, getSectionCourses } from '../api';

function DesignTimetable() {
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [facultyCourses, setFacultyCourses] = useState([]);
  const [sectionCourses, setSectionCourses] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [sectionOverview, setSectionOverview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sectionsRes, coursesRes, facultyCoursesRes, sectionCoursesRes] = await Promise.all([
        getSections(),
        getCourses(),
        getFacultyCourses(),
        getSectionCourses()
      ]);
      setSections(sectionsRes.data);
      setCourses(coursesRes.data);
      setFacultyCourses(facultyCoursesRes.data);
      setSectionCourses(sectionCoursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSectionChange = (e) => {
    const sectionId = parseInt(e.target.value);
    setSelectedSection(sectionId);
    
    if (sectionId) {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        // Get all courses assigned to this section
        const assignedCourseIds = sectionCourses
          .filter(sc => sc.section_id === sectionId)
          .map(sc => sc.course_id);
        
        const assignedCoursesList = courses.filter(c => assignedCourseIds.includes(c.id));
        
        // Calculate total hours
        const totalHours = assignedCoursesList.reduce((sum, course) => sum + course.hours_required, 0);
        
        // Check faculty assignments for all courses
        const coursesWithFaculty = assignedCoursesList.map(course => {
          const facultyCount = facultyCourses.filter(fc => fc.course_id === course.id).length;
          return {
            ...course,
            facultyCount
          };
        });
        
        setSectionOverview({
          section: section,
          assignedCourses: coursesWithFaculty,
          totalHours: totalHours,
          totalCourses: assignedCoursesList.length
        });
      }
    } else {
      setSectionOverview(null);
    }
  };

  return (
    <div>
      <h1>📅 Design Timetable</h1>
      
      <div className="form-container">
        <h2>Select Section</h2>
        <div className="form-group">
          <label>Section *</label>
          <select
            value={selectedSection}
            onChange={handleSectionChange}
            style={{ fontSize: '16px', padding: '12px' }}
          >
            <option value="">-- Select a section --</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sectionOverview && (
        <div className="table-container">
          <h2>Section Overview</h2>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="overview-card">
                <h3>📚 Section Details</h3>
                <p><strong>Section Name:</strong> {sectionOverview.section.name}</p>
                <p><strong>Student Strength:</strong> {sectionOverview.section.strength || 'Not specified'}</p>
                <p><strong>Total Courses:</strong> {sectionOverview.totalCourses}</p>
              </div>
              
              <div className="overview-card">
                <h3>📊 Course Summary</h3>
                <p><strong>Total Hours/Week:</strong> {sectionOverview.totalHours} hours</p>
                <p><strong>Courses Assigned:</strong> {sectionOverview.totalCourses} course(s)</p>
              </div>
            </div>

            {sectionOverview.totalCourses === 0 && (
              <div className="error-message">
                ⚠️ No courses assigned to this section. Please assign courses in "Edit Records → Assign Courses".
              </div>
            )}

            {sectionOverview.totalCourses > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ marginBottom: '15px' }}>Assigned Courses</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Course Code</th>
                      <th>Hours/Week</th>
                      <th>Faculty Assigned</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionOverview.assignedCourses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.name}</td>
                        <td>{course.code}</td>
                        <td>{course.hours_required}</td>
                        <td>{course.facultyCount}</td>
                        <td>
                          {course.facultyCount > 0 ? (
                            <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓ Ready</span>
                          ) : (
                            <span style={{ color: '#dc2626', fontWeight: 'bold' }}>✗ No Faculty</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedSection && (
        <div className="table-container">
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>👆 Select a section to get started</h2>
            <p>Choose a section from the dropdown above to view its overview and design the timetable.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignTimetable;
