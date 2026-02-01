from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Classroom Schemas
class ClassroomBase(BaseModel):
    name: str
    capacity: Optional[int] = None


class ClassroomCreate(ClassroomBase):
    pass


class Classroom(ClassroomBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# TimeSlot Schemas
class TimeSlotBase(BaseModel):
    start_time: str
    end_time: str


class TimeSlotCreate(TimeSlotBase):
    pass


class TimeSlot(TimeSlotBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# TimeSlotGroup Schemas
class TimeSlotGroupBase(BaseModel):
    name: str
    description: Optional[str] = None


class TimeSlotGroupCreate(TimeSlotGroupBase):
    pass


class TimeSlotGroup(TimeSlotGroupBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# TimeSlotGroupAssignment Schemas
class TimeSlotGroupAssignmentBase(BaseModel):
    time_slot_group_id: int
    time_slot_id: int


class TimeSlotGroupAssignmentCreate(TimeSlotGroupAssignmentBase):
    pass


class TimeSlotGroupAssignment(TimeSlotGroupAssignmentBase):
    id: int

    class Config:
        from_attributes = True


# Course Schemas
class CourseBase(BaseModel):
    name: str
    code: str
    hours_required: int
    is_lab: bool = False


class CourseCreate(CourseBase):
    pass


class Course(CourseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Faculty Schemas
class FacultyBase(BaseModel):
    name: str


class FacultyCreate(FacultyBase):
    pass


class Faculty(FacultyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Section Schemas
class SectionBase(BaseModel):
    name: str
    strength: Optional[int] = None
    time_slot_group_id: Optional[int] = None


class SectionCreate(SectionBase):
    pass


class Section(SectionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ClassroomAvailability Schemas
class ClassroomAvailabilityBase(BaseModel):
    classroom_id: int
    day_of_week: int
    time_slot_id: int


class ClassroomAvailabilityCreate(ClassroomAvailabilityBase):
    pass


class ClassroomAvailability(ClassroomAvailabilityBase):
    id: int

    class Config:
        from_attributes = True


# FacultyAvailability Schemas
class FacultyAvailabilityBase(BaseModel):
    faculty_id: int
    day_of_week: int
    time_slot_id: int


class FacultyAvailabilityCreate(FacultyAvailabilityBase):
    pass


class FacultyAvailability(FacultyAvailabilityBase):
    id: int

    class Config:
        from_attributes = True


# FacultyCourse Schemas
class FacultyCourseBase(BaseModel):
    faculty_id: int
    course_id: int


class FacultyCourseCreate(FacultyCourseBase):
    pass


class FacultyCourse(FacultyCourseBase):
    id: int

    class Config:
        from_attributes = True


# TimetableEntry Schemas
class TimetableEntryBase(BaseModel):
    section_id: int
    course_id: int
    faculty_id: int
    classroom_id: int
    day_of_week: int
    time_slot_id: int


class TimetableEntryCreate(TimetableEntryBase):
    pass


class TimetableEntry(TimetableEntryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# SectionCourse Schemas
class SectionCourseBase(BaseModel):
    section_id: int
    course_id: int


class SectionCourseCreate(SectionCourseBase):
    pass


class SectionCourse(SectionCourseBase):
    id: int

    class Config:
        from_attributes = True
