# 📅 Time Table Management System

A comprehensive web-based timetable generation and management system built with FastAPI (backend) and React (frontend). Automates the complex process of scheduling classes while respecting faculty availability, classroom capacity, and course requirements.

## ✨ Features

### 🎯 Core Functionality
- **Automated Timetable Generation**: Intelligent algorithm schedules all courses automatically
- **Constraint Satisfaction**: Ensures no conflicts in faculty, classroom, or section schedules
- **Lab & Regular Class Support**: Handles 1-hour regular classes and 2-hour consecutive lab sessions
- **Complete Requirement Validation**: Guarantees all course hours are scheduled or rejects generation with detailed errors

### 📊 Data Management
- **Classroom Management**: Define and manage classroom inventory
- **Course Management**: Create courses with hours required and lab/regular designation
- **Faculty Management**: Track faculty members and their teaching assignments
- **Section Management**: Organize student sections/classes
- **Time Slot Management**: Configure available time periods

### 📋 Advanced Features
- **Availability Tracking**: 
  - Faculty availability by day and time slot
  - Classroom availability by day and time slot
- **Assignment Management**:
  - Assign courses to sections
  - Assign faculty to courses
- **Visual Timetable Grid**: Day-wise view with time slots showing classroom and course code
- **Detailed Error Reporting**: Shows exactly why timetable generation fails with actionable suggestions

## 🏗️ Technology Stack

### Backend
- **Framework**: FastAPI 0.109.0
- **ORM**: SQLAlchemy 2.0.25
- **Database**: PostgreSQL (Neon Serverless)
- **Server**: Uvicorn
- **Language**: Python 3.10+

### Frontend
- **Framework**: React 18.2.0
- **HTTP Client**: Axios 1.6.5
- **Styling**: Custom CSS
- **Build Tool**: Create React App

## 📁 Project Structure

```
Time_Table_Management_System/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app & endpoints
│   │   ├── models.py         # SQLAlchemy ORM models
│   │   ├── schemas.py        # Pydantic schemas
│   │   └── database.py       # Database connection
│   ├── migrate_*.py          # Database migration scripts
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables (not in git)
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ClassroomManager.js
│   │   │   ├── CourseManager.js
│   │   │   ├── FacultyManager.js
│   │   │   ├── SectionManager.js
│   │   │   ├── TimeSlotManager.js
│   │   │   ├── TimetableDesigner.js
│   │   │   └── ... (availability & assignment managers)
│   │   ├── App.js            # Main app component
│   │   ├── api.js            # API integration
│   │   └── index.css         # Global styles
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 16+ and npm
- PostgreSQL database (or Neon account)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `backend` folder:
   ```env
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   SECRET_KEY=your-secret-key-here
   ```

5. **Run migrations**
   ```bash
   python migrate.py
   python migrate_timeslots.py
   python migrate_availability_timeslots.py
   python migrate_add_lab_timetable.py
   ```

6. **Start the server**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   
   Backend will be available at: `http://localhost:8000`
   
   API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   
   Frontend will be available at: `http://localhost:3000`

## 📖 Usage Guide

### Step 1: Basic Setup (One-time Configuration)

1. **Add Classrooms**: Define all available rooms
2. **Add Courses**: Create courses with:
   - Name, Code
   - Hours required per week
   - Type (Regular or Lab)
3. **Add Faculty**: Register all teachers
4. **Add Sections**: Create student sections/classes
5. **Add Time Slots**: Define time periods (e.g., 8:00-9:00, 9:00-10:00)

### Step 2: Dynamic Management (Regular Updates)

1. **Assign Courses to Sections**: Link which courses each section will take
2. **Assign Faculty to Courses**: Link teachers to their subjects
3. **Set Classroom Availability**: Define when each room is available
   - Select classroom, day, and time slot
4. **Set Faculty Availability**: Define when each teacher is available
   - Select faculty, day, and time slot

### Step 3: Generate Timetable

1. Click **"Design Timetable"** in sidebar
2. Select a section from dropdown
3. Click **"🚀 Generate Timetable"**

**Success Criteria**:
- ✅ All course hours must be scheduled
- ✅ No faculty double-booking
- ✅ No classroom conflicts
- ✅ No section overlap
- ✅ Faculty available at assigned times
- ✅ Classrooms available at assigned times

**If Generation Fails**:
The system will show detailed errors:
- Which course failed
- How many hours were missing
- Why each time slot was unavailable (faculty busy, no classroom, etc.)
- Suggestions to fix (add more slots, increase availability, etc.)

### Step 4: View Timetable

Generated timetable displays as a grid:
- **Rows**: Days (Monday - Friday)
- **Columns**: Time slots
- **Each Cell**: Shows Classroom + Course Code

## 🗃️ Database Schema

### Core Tables
- `classrooms`: Physical rooms available
- `courses`: Subjects to be taught (with is_lab flag)
- `faculty`: Teachers/instructors
- `sections`: Student groups/classes
- `time_slots`: Time periods for scheduling

### Relationship Tables
- `section_courses`: Course assignments to sections
- `faculty_courses`: Faculty assignments to courses
- `classroom_availability`: When classrooms are free
- `faculty_availability`: When faculty are available

### Generated Data
- `timetable_entries`: Final scheduled classes

## 🔧 Configuration

### Time Slot Configuration
Time slots define when classes can occur. Example:
- 08:00 - 09:00
- 09:00 - 10:00
- 10:00 - 11:00
- ... up to 17:00 - 17:55

### Course Types
- **Regular Class**: 1-hour sessions, max 1 per day per course
- **Lab**: 2 consecutive hour sessions

### Days
Monday (0) through Friday (4)

## 🐛 Troubleshooting

### Timetable Won't Generate

**Problem**: "Only scheduled X/Y hours"

**Solutions**:
1. Check faculty availability covers enough time slots
2. Ensure enough classrooms are marked as available
3. Verify time slots don't conflict with existing classes
4. Reduce course hours if schedule is too tight
5. Add more time slots to the system

### Data Not Showing in UI

**Problem**: Frontend shows empty tables

**Solutions**:
1. Verify backend is running on port 8000
2. Check browser console (F12) for errors
3. Ensure database migrations have run
4. Check `.env` file has correct DATABASE_URL

### Backend Won't Start

**Problem**: Import errors or module not found

**Solutions**:
1. Activate virtual environment
2. Run `pip install -r requirements.txt`
3. Check Python version is 3.10+
4. Verify all migration scripts have run

## 📝 API Endpoints

### Classrooms
- `GET /classrooms/` - List all
- `POST /classrooms/` - Create
- `DELETE /classrooms/{id}` - Delete

### Courses
- `GET /courses/` - List all
- `POST /courses/` - Create
- `DELETE /courses/{id}` - Delete

### Faculty
- `GET /faculty/` - List all
- `POST /faculty/` - Create
- `DELETE /faculty/{id}` - Delete

### Sections
- `GET /sections/` - List all
- `POST /sections/` - Create
- `DELETE /sections/{id}` - Delete

### Timetable
- `POST /timetable/generate/{section_id}` - Generate timetable
- `GET /timetable/section/{section_id}` - View timetable
- `DELETE /timetable/section/{section_id}` - Clear timetable

*See full API documentation at `http://localhost:8000/docs`*

## 🔐 Security Notes

### Important: `.env` File
**NEVER commit `.env` to Git!**

The `.env` file contains:
- Database credentials
- Secret keys
- Sensitive configuration

Ensure `.gitignore` includes:
```
.env
__pycache__/
*.pyc
.venv/
node_modules/
```

### Data Storage
- All data is stored in **Neon PostgreSQL cloud**
- Database credentials are in `.env` (local only)
- Pushing to GitHub does **NOT** upload your data
- Data remains safe on Neon servers

## 🎯 Future Enhancements

- [ ] Manual timetable editing (drag-and-drop)
- [ ] Export timetable to PDF
- [ ] Multiple section view
- [ ] Faculty-wise timetable view
- [ ] Classroom utilization reports
- [ ] Conflict resolution suggestions
- [ ] Email notifications
- [ ] Mobile responsive design
- [ ] User authentication & roles

## 📄 License

This project is developed for educational/institutional use.

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Check browser console for frontend errors
4. Check terminal for backend errors

---

**Built with ❤️ using FastAPI and React**
