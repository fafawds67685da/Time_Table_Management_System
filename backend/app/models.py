from sqlalchemy import Column, Integer, String, ForeignKey, Time, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Classroom(Base):
    __tablename__ = "classrooms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    capacity = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    
    availabilities = relationship("ClassroomAvailability", back_populates="classroom", cascade="all, delete-orphan")

class TimeSlot(Base):
    __tablename__ = "time_slots"
    
    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(String, nullable=False)  # e.g., "08:00"
    end_time = Column(String, nullable=False)  # e.g., "09:00"
    created_at = Column(DateTime, default=datetime.now)
    
    time_slot_group_assignments = relationship("TimeSlotGroupAssignment", back_populates="time_slot", cascade="all, delete-orphan")


class TimeSlotGroup(Base):
    __tablename__ = "time_slot_groups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "8 to 4", "8 to 6"
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    
    sections = relationship("Section", back_populates="time_slot_group")
    time_slot_assignments = relationship("TimeSlotGroupAssignment", back_populates="time_slot_group", cascade="all, delete-orphan")


class TimeSlotGroupAssignment(Base):
    __tablename__ = "time_slot_group_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    time_slot_group_id = Column(Integer, ForeignKey("time_slot_groups.id"), nullable=False)
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=False)
    
    time_slot_group = relationship("TimeSlotGroup", back_populates="time_slot_assignments")
    time_slot = relationship("TimeSlot", back_populates="time_slot_group_assignments")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    hours_required = Column(Integer, nullable=False)
    is_lab = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
    
    faculty_courses = relationship("FacultyCourse", back_populates="course", cascade="all, delete-orphan")
    section_courses = relationship("SectionCourse", back_populates="course", cascade="all, delete-orphan")
    timetable_entries = relationship("TimetableEntry", back_populates="course", cascade="all, delete-orphan")


class Faculty(Base):
    __tablename__ = "faculty"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    
    availabilities = relationship("FacultyAvailability", back_populates="faculty", cascade="all, delete-orphan")
    faculty_courses = relationship("FacultyCourse", back_populates="faculty", cascade="all, delete-orphan")


class Section(Base):
    __tablename__ = "sections"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    strength = Column(Integer, nullable=True)
    time_slot_group_id = Column(Integer, ForeignKey("time_slot_groups.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    
    time_slot_group = relationship("TimeSlotGroup", back_populates="sections")
    section_courses = relationship("SectionCourse", back_populates="section", cascade="all, delete-orphan")


class ClassroomAvailability(Base):
    __tablename__ = "classroom_availability"
    
    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=False)
    
    classroom = relationship("Classroom", back_populates="availabilities")
    time_slot = relationship("TimeSlot")


class FacultyAvailability(Base):
    __tablename__ = "faculty_availability"
    
    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=False)
    
    faculty = relationship("Faculty", back_populates="availabilities")
    time_slot = relationship("TimeSlot")


class FacultyCourse(Base):
    __tablename__ = "faculty_courses"
    
    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    
    faculty = relationship("Faculty", back_populates="faculty_courses")
    course = relationship("Course", back_populates="faculty_courses")


class TimetableEntry(Base):
    __tablename__ = "timetable_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    faculty_id = Column(Integer, ForeignKey("faculty.id"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    
    section = relationship("Section")
    course = relationship("Course", back_populates="timetable_entries")
    faculty = relationship("Faculty")
    classroom = relationship("Classroom")
    time_slot = relationship("TimeSlot")


class SectionCourse(Base):
    __tablename__ = "section_courses"
    
    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    
    section = relationship("Section", back_populates="section_courses")
    course = relationship("Course", back_populates="section_courses")
