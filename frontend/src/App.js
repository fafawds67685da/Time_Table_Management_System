import React, { useState } from 'react';
import TimetableDesigner from './components/TimetableDesigner';
import ClassroomManager from './components/ClassroomManager';
import CourseManager from './components/CourseManager';
import FacultyManager from './components/FacultyManager';
import SectionManager from './components/SectionManager';
import TimeSlotManager from './components/TimeSlotManager';
import SectionCourseManager from './components/SectionCourseManager';
import ClassroomAvailabilityManager from './components/ClassroomAvailabilityManager';
import FacultyAvailabilityManager from './components/FacultyAvailabilityManager';
import FacultyCourseManager from './components/FacultyCourseManager';

function App() {
  const [activeSection, setActiveSection] = useState('design');
  const [activeTab, setActiveTab] = useState('classrooms');

  const renderEditRecords = () => {
    switch (activeTab) {
      case 'classrooms':
        return <ClassroomManager />;
      case 'courses':
        return <CourseManager />;
      case 'faculty':
        return <FacultyManager />;
      case 'sections':
        return <SectionManager />;
      case 'time-slots':
        return <TimeSlotManager />;
      case 'section-courses':
        return <SectionCourseManager />;
      case 'classroom-availability':
        return <ClassroomAvailabilityManager />;
      case 'faculty-availability':
        return <FacultyAvailabilityManager />;
      case 'faculty-courses':
        return <FacultyCourseManager />;
      default:
        return <ClassroomManager />;
    }
  };

  return (
    <div className="app-layout">
      <div className="sidebar">
        <h2>📚 Timetable System</h2>
        <button 
          className={`sidebar-btn ${activeSection === 'design' ? 'active' : ''}`}
          onClick={() => setActiveSection('design')}
        >
          📅 Design Timetable
        </button>
        <button 
          className={`sidebar-btn ${activeSection === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveSection('edit')}
        >
          ✏️ Edit Records
        </button>
      </div>

      <div className="main-content">
        {activeSection === 'design' ? (
          <TimetableDesigner />
        ) : (
          <div>
            <h1>Edit Records</h1>
            
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '8px' }}>
                📋 Basic Setup (Infrequent Changes)
              </h2>
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'classrooms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('classrooms')}
                >
                  Classrooms
                </button>
                <button 
                  className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('courses')}
                >
                  Courses
                </button>
                <button 
                  className={`tab ${activeTab === 'faculty' ? 'active' : ''}`}
                  onClick={() => setActiveTab('faculty')}
                >
                  Faculty
                </button>
                <button 
                  className={`tab ${activeTab === 'sections' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sections')}
                >
                  Sections
                </button>
                <button 
                  className={`tab ${activeTab === 'time-slots' ? 'active' : ''}`}
                  onClick={() => setActiveTab('time-slots')}
                >
                  Time Slots
                </button>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#2c3e50', borderBottom: '2px solid #e67e22', paddingBottom: '8px' }}>
                🔄 Dynamic Management (Frequent Changes)
              </h2>
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'section-courses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('section-courses')}
                >
                  Assign Courses to Sections
                </button>
                <button 
                  className={`tab ${activeTab === 'classroom-availability' ? 'active' : ''}`}
                  onClick={() => setActiveTab('classroom-availability')}
                >
                  Classroom Availability
                </button>
                <button 
                  className={`tab ${activeTab === 'faculty-availability' ? 'active' : ''}`}
                  onClick={() => setActiveTab('faculty-availability')}
                >
                  Faculty Availability
                </button>
                <button 
                  className={`tab ${activeTab === 'faculty-courses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('faculty-courses')}
                >
                  Assign Faculty to Courses
                </button>
              </div>
            </div>

            {renderEditRecords()}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
