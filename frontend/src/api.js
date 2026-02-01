import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Classrooms
export const getClassrooms = () => api.get('/classrooms/');
export const createClassroom = (data) => api.post('/classrooms/', data);
export const deleteClassroom = (id) => api.delete(`/classrooms/${id}`);

// Courses
export const getCourses = () => api.get('/courses/');
export const createCourse = (data) => api.post('/courses/', data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Faculty
export const getFaculty = () => api.get('/faculty/');
export const createFaculty = (data) => api.post('/faculty/', data);
export const deleteFaculty = (id) => api.delete(`/faculty/${id}`);

// Sections
export const getSections = () => api.get('/sections/');
export const createSection = (data) => api.post('/sections/', data);
export const deleteSection = (id) => api.delete(`/sections/${id}`);

// Classroom Availability
export const getClassroomAvailability = () => api.get('/classroom-availability/');
export const createClassroomAvailability = (data) => api.post('/classroom-availability/', data);
export const deleteClassroomAvailability = (id) => api.delete(`/classroom-availability/${id}`);

// Faculty Availability
export const getFacultyAvailability = () => api.get('/faculty-availability/');
export const createFacultyAvailability = (data) => api.post('/faculty-availability/', data);
export const deleteFacultyAvailability = (id) => api.delete(`/faculty-availability/${id}`);

// Faculty Courses
export const getFacultyCourses = () => api.get('/faculty-courses/');
export const createFacultyCourse = (data) => api.post('/faculty-courses/', data);
export const deleteFacultyCourse = (id) => api.delete(`/faculty-courses/${id}`);

// Section Courses
export const getSectionCourses = () => api.get('/section-courses/');
export const getSectionCoursesBySection = (sectionId) => api.get(`/section-courses/section/${sectionId}`);
export const createSectionCourse = (data) => api.post('/section-courses/', data);
export const deleteSectionCourse = (id) => api.delete(`/section-courses/${id}`);

// Time Slots
export const getTimeSlots = () => api.get('/time-slots/');
export const createTimeSlot = (data) => api.post('/time-slots/', data);
export const deleteTimeSlot = (id) => api.delete(`/time-slots/${id}`);

// Time Slot Groups
export const getTimeSlotGroups = () => api.get('/time-slot-groups/');
export const createTimeSlotGroup = (data) => api.post('/time-slot-groups/', data);
export const deleteTimeSlotGroup = (id) => api.delete(`/time-slot-groups/${id}`);

// Time Slot Group Assignments
export const getTimeSlotGroupAssignments = () => api.get('/time-slot-group-assignments/');
export const getTimeSlotGroupAssignmentsByGroup = (groupId) => api.get(`/time-slot-group-assignments/group/${groupId}`);
export const createTimeSlotGroupAssignment = (data) => api.post('/time-slot-group-assignments/', data);
export const deleteTimeSlotGroupAssignment = (id) => api.delete(`/time-slot-group-assignments/${id}`);
