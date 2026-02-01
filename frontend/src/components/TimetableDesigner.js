import React, { useState, useEffect } from 'react';
import { getSections, getTimeSlots, getCourses, getClassrooms } from '../api';
import axios from 'axios';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function TimetableDesigner() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSections();
    fetchTimeSlots();
    fetchCourses();
    fetchClassrooms();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await getSections();
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await getTimeSlots();
      setTimeSlots(response.data.sort((a, b) => a.start_time.localeCompare(b.start_time)));
    } catch (error) {
      console.error('Error fetching time slots:', error);
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

  const fetchClassrooms = async () => {
    try {
      const response = await getClassrooms();
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const fetchTimetable = async (sectionId) => {
    try {
      const response = await axios.get(`http://localhost:8000/timetable/section/${sectionId}`);
      setTimetable(response.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setTimetable([]);
    }
  };

  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
    if (sectionId) {
      fetchTimetable(sectionId);
    } else {
      setTimetable([]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedSection) {
      setMessage('❌ Please select a section first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`http://localhost:8000/timetable/generate/${selectedSection}`);
      console.log('Generation response:', response.data);
      
      if (response.data.success) {
        const details = response.data.details ? '\n\n' + response.data.details.join('\n') : '';
        setMessage(`${response.data.message}${details}`);
      }
      
      fetchTimetable(selectedSection);
    } catch (error) {
      console.error('Generation error:', error.response?.data);
      const errorDetail = error.response?.data?.detail || 'Failed to generate timetable';
      setMessage(errorDetail);
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!selectedSection) {
      setMessage('❌ Please select a section first');
      return;
    }

    if (!window.confirm('Are you sure you want to clear this timetable?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/timetable/section/${selectedSection}`);
      setMessage('✅ Timetable cleared successfully');
      setTimetable([]);
    } catch (error) {
      setMessage('❌ Error clearing timetable');
    }
  };

  const getCourseInfo = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.code : 'N/A';
  };

  const getClassroomInfo = (classroomId) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    return classroom ? classroom.name : 'N/A';
  };

  const getSectionName = (sectionId) => {
    const section = sections.find(s => s.id === parseInt(sectionId));
    return section ? section.name : '';
  };

  // Build grid structure - Days as rows, Time slots as columns
  const buildGrid = () => {
    const grid = {};
    
    // Initialize empty grid - one row per day
    DAYS.forEach((day, dayIndex) => {
      grid[dayIndex] = { day: day };
      timeSlots.forEach(slot => {
        grid[dayIndex][slot.id] = null;
      });
    });

    // Fill grid with timetable entries
    timetable.forEach(entry => {
      if (grid[entry.day_of_week]) {
        grid[entry.day_of_week][entry.time_slot_id] = {
          classroom: getClassroomInfo(entry.classroom_id),
          course: getCourseInfo(entry.course_id)
        };
      }
    });

    return grid;
  };

  const grid = buildGrid();

  return (
    <div>
      <div className="form-container">
        <h2>🎯 Timetable Designer</h2>
        
        <div className="timetable-controls">
          <div className="form-group">
            <label>Select Section *</label>
            <select
              value={selectedSection}
              onChange={(e) => handleSectionChange(e.target.value)}
              className="section-select"
            >
              <option value="">-- Select Section --</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <div className="button-group">
            <button 
              onClick={handleGenerate} 
              className="btn btn-primary"
              disabled={!selectedSection || loading}
            >
              {loading ? '⏳ Generating...' : '🚀 Generate Timetable'}
            </button>
            <button 
              onClick={handleClear} 
              className="btn btn-danger"
              disabled={!selectedSection || loading}
            >
              🗑️ Clear Timetable
            </button>
          </div>
        </div>

        {message && (
          <div 
            className={message.includes('✅') || message.includes('COMPLETE') ? 'success-message' : 'error-message'} 
            style={{ 
              whiteSpace: 'pre-line',
              maxHeight: '400px',
              overflowY: 'auto',
              fontSize: '13px',
              lineHeight: '1.6',
              fontFamily: 'monospace'
            }}
          >
            {message}
          </div>
        )}
      </div>

      {selectedSection && (
        <div className="table-container">
          <h2>Timetable for {getSectionName(selectedSection)}</h2>
          <div className="timetable-grid">
            <table className="timetable-table">
              <thead>
                <tr>
                  <th className="day-column">Day</th>
                  {timeSlots.map(slot => (
                    <th key={slot.id}>
                      {slot.start_time}<br/>
                      <small>{slot.end_time}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day, dayIndex) => (
                  <tr key={dayIndex}>
                    <td className="day-column">
                      <strong>{day}</strong>
                    </td>
                    {timeSlots.map(slot => {
                      const entry = grid[dayIndex] && grid[dayIndex][slot.id];
                      return (
                        <td key={slot.id} className={entry ? 'occupied' : 'empty'}>
                          {entry ? (
                            <div className="timetable-entry">
                              <div className="classroom">{entry.classroom}</div>
                              <div className="course">{entry.course}</div>
                            </div>
                          ) : (
                            <div className="empty-slot">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .timetable-controls {
          display: flex;
          gap: 20px;
          align-items: flex-end;
          margin-bottom: 20px;
        }

        .section-select {
          min-width: 250px;
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        .timetable-grid {
          overflow-x: auto;
        }

        .timetable-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .timetable-table th,
        .timetable-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
        }

        .timetable-table th {
          background-color: #4CAF50;
          color: white;
          font-weight: bold;
        }

        .time-column {
          background-color: #f8f9fa !important;
          font-weight: bold;
          min-width: 100px;
        }

        .day-column {
          background-color: #f8f9fa !important;
          font-weight: bold;
          min-width: 120px;
          text-align: left !important;
          padding-left: 20px !important;
        }

        .occupied {
          background-color: #e3f2fd;
        }

        .empty {
          background-color: #fafafa;
        }

        .timetable-entry {
          padding: 5px;
        }

        .classroom {
          font-weight: bold;
          color: #1976d2;
          margin-bottom: 4px;
        }

        .course {
          font-size: 0.9em;
          color: #666;
        }

        .empty-slot {
          color: #ccc;
        }
      `}</style>
    </div>
  );
}

export default TimetableDesigner;
