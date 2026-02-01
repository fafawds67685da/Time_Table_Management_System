from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import text
from app.database import engine, Base, get_db
from app import models, schemas

# Create database tables (already created via migration script)
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="Timetable Management System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Classroom Endpoints
@app.post("/classrooms/", response_model=schemas.Classroom)
def create_classroom(classroom: schemas.ClassroomCreate, db: Session = Depends(get_db)):
    db_classroom = models.Classroom(**classroom.dict())
    db.add(db_classroom)
    db.commit()
    db.refresh(db_classroom)
    return db_classroom


@app.get("/classrooms/", response_model=List[schemas.Classroom])
def get_classrooms(db: Session = Depends(get_db)):
    return db.query(models.Classroom).all()


@app.delete("/classrooms/{classroom_id}")
def delete_classroom(classroom_id: int, db: Session = Depends(get_db)):
    classroom = db.query(models.Classroom).filter(models.Classroom.id == classroom_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    db.delete(classroom)
    db.commit()
    return {"message": "Classroom deleted"}


# Course Endpoints
@app.post("/courses/", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = models.Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course


@app.get("/courses/", response_model=List[schemas.Course])
def get_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()


@app.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"message": "Course deleted"}


# Faculty Endpoints
@app.post("/faculty/", response_model=schemas.Faculty)
def create_faculty(faculty: schemas.FacultyCreate, db: Session = Depends(get_db)):
    db_faculty = models.Faculty(**faculty.dict())
    db.add(db_faculty)
    db.commit()
    db.refresh(db_faculty)
    return db_faculty


@app.get("/faculty/", response_model=List[schemas.Faculty])
def get_faculty(db: Session = Depends(get_db)):
    return db.query(models.Faculty).all()


@app.delete("/faculty/{faculty_id}")
def delete_faculty(faculty_id: int, db: Session = Depends(get_db)):
    faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    db.delete(faculty)
    db.commit()
    return {"message": "Faculty deleted"}


# Section Endpoints
@app.post("/sections/", response_model=schemas.Section)
def create_section(section: schemas.SectionCreate, db: Session = Depends(get_db)):
    db_section = models.Section(**section.dict())
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section


@app.get("/sections/", response_model=List[schemas.Section])
def get_sections(db: Session = Depends(get_db)):
    return db.query(models.Section).all()


@app.delete("/sections/{section_id}")
def delete_section(section_id: int, db: Session = Depends(get_db)):
    section = db.query(models.Section).filter(models.Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    db.delete(section)
    db.commit()
    return {"message": "Section deleted"}


# SectionCourse Endpoints
@app.post("/section-courses/", response_model=schemas.SectionCourse)
def create_section_course(section_course: schemas.SectionCourseCreate, db: Session = Depends(get_db)):
    db_section_course = models.SectionCourse(**section_course.dict())
    db.add(db_section_course)
    db.commit()
    db.refresh(db_section_course)
    return db_section_course


@app.get("/section-courses/", response_model=List[schemas.SectionCourse])
def get_section_courses(db: Session = Depends(get_db)):
    return db.query(models.SectionCourse).all()


@app.get("/section-courses/section/{section_id}", response_model=List[schemas.SectionCourse])
def get_section_courses_by_section(section_id: int, db: Session = Depends(get_db)):
    return db.query(models.SectionCourse).filter(models.SectionCourse.section_id == section_id).all()


@app.delete("/section-courses/{section_course_id}")
def delete_section_course(section_course_id: int, db: Session = Depends(get_db)):
    section_course = db.query(models.SectionCourse).filter(models.SectionCourse.id == section_course_id).first()
    if not section_course:
        raise HTTPException(status_code=404, detail="Section-Course mapping not found")
    db.delete(section_course)
    db.commit()
    return {"message": "Section-Course mapping deleted"}


# TimeSlot Endpoints
@app.post("/time-slots/", response_model=schemas.TimeSlot)
def create_time_slot(time_slot: schemas.TimeSlotCreate, db: Session = Depends(get_db)):
    db_time_slot = models.TimeSlot(**time_slot.dict())
    db.add(db_time_slot)
    db.commit()
    db.refresh(db_time_slot)
    return db_time_slot


@app.get("/time-slots/", response_model=List[schemas.TimeSlot])
def get_time_slots(db: Session = Depends(get_db)):
    return db.query(models.TimeSlot).all()


@app.delete("/time-slots/{time_slot_id}")
def delete_time_slot(time_slot_id: int, db: Session = Depends(get_db)):
    time_slot = db.query(models.TimeSlot).filter(models.TimeSlot.id == time_slot_id).first()
    if not time_slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    db.delete(time_slot)
    db.commit()
    return {"message": "Time slot deleted"}


# TimeSlotGroup Endpoints
@app.post("/time-slot-groups/", response_model=schemas.TimeSlotGroup)
def create_time_slot_group(time_slot_group: schemas.TimeSlotGroupCreate, db: Session = Depends(get_db)):
    db_time_slot_group = models.TimeSlotGroup(**time_slot_group.dict())
    db.add(db_time_slot_group)
    db.commit()
    db.refresh(db_time_slot_group)
    return db_time_slot_group


@app.get("/time-slot-groups/", response_model=List[schemas.TimeSlotGroup])
def get_time_slot_groups(db: Session = Depends(get_db)):
    return db.query(models.TimeSlotGroup).all()


@app.delete("/time-slot-groups/{time_slot_group_id}")
def delete_time_slot_group(time_slot_group_id: int, db: Session = Depends(get_db)):
    time_slot_group = db.query(models.TimeSlotGroup).filter(models.TimeSlotGroup.id == time_slot_group_id).first()
    if not time_slot_group:
        raise HTTPException(status_code=404, detail="Time slot group not found")
    db.delete(time_slot_group)
    db.commit()
    return {"message": "Time slot group deleted"}


# TimeSlotGroupAssignment Endpoints
@app.post("/time-slot-group-assignments/", response_model=schemas.TimeSlotGroupAssignment)
def create_time_slot_group_assignment(assignment: schemas.TimeSlotGroupAssignmentCreate, db: Session = Depends(get_db)):
    db_assignment = models.TimeSlotGroupAssignment(**assignment.dict())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@app.get("/time-slot-group-assignments/", response_model=List[schemas.TimeSlotGroupAssignment])
def get_time_slot_group_assignments(db: Session = Depends(get_db)):
    return db.query(models.TimeSlotGroupAssignment).all()


@app.get("/time-slot-group-assignments/group/{group_id}", response_model=List[schemas.TimeSlotGroupAssignment])
def get_assignments_by_group(group_id: int, db: Session = Depends(get_db)):
    return db.query(models.TimeSlotGroupAssignment).filter(models.TimeSlotGroupAssignment.time_slot_group_id == group_id).all()


@app.delete("/time-slot-group-assignments/{assignment_id}")
def delete_time_slot_group_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(models.TimeSlotGroupAssignment).filter(models.TimeSlotGroupAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted"}


# ClassroomAvailability Endpoints
@app.post("/classroom-availability/", response_model=schemas.ClassroomAvailability)
def create_classroom_availability(availability: schemas.ClassroomAvailabilityCreate, db: Session = Depends(get_db)):
    db_availability = models.ClassroomAvailability(**availability.dict())
    db.add(db_availability)
    db.commit()
    db.refresh(db_availability)
    return db_availability


@app.get("/classroom-availability/", response_model=List[schemas.ClassroomAvailability])
def get_classroom_availability(db: Session = Depends(get_db)):
    return db.query(models.ClassroomAvailability).all()


@app.delete("/classroom-availability/{availability_id}")
def delete_classroom_availability(availability_id: int, db: Session = Depends(get_db)):
    availability = db.query(models.ClassroomAvailability).filter(models.ClassroomAvailability.id == availability_id).first()
    if not availability:
        raise HTTPException(status_code=404, detail="Availability not found")
    db.delete(availability)
    db.commit()
    return {"message": "Availability deleted"}


# FacultyAvailability Endpoints
@app.post("/faculty-availability/", response_model=schemas.FacultyAvailability)
def create_faculty_availability(availability: schemas.FacultyAvailabilityCreate, db: Session = Depends(get_db)):
    db_availability = models.FacultyAvailability(**availability.dict())
    db.add(db_availability)
    db.commit()
    db.refresh(db_availability)
    return db_availability


@app.get("/faculty-availability/", response_model=List[schemas.FacultyAvailability])
def get_faculty_availability(db: Session = Depends(get_db)):
    return db.query(models.FacultyAvailability).all()


@app.delete("/faculty-availability/{availability_id}")
def delete_faculty_availability(availability_id: int, db: Session = Depends(get_db)):
    availability = db.query(models.FacultyAvailability).filter(models.FacultyAvailability.id == availability_id).first()
    if not availability:
        raise HTTPException(status_code=404, detail="Availability not found")
    db.delete(availability)
    db.commit()
    return {"message": "Availability deleted"}


# FacultyCourse Endpoints
@app.post("/faculty-courses/", response_model=schemas.FacultyCourse)
def create_faculty_course(faculty_course: schemas.FacultyCourseCreate, db: Session = Depends(get_db)):
    db_faculty_course = models.FacultyCourse(**faculty_course.dict())
    db.add(db_faculty_course)
    db.commit()
    db.refresh(db_faculty_course)
    return db_faculty_course


@app.get("/faculty-courses/", response_model=List[schemas.FacultyCourse])
def get_faculty_courses(db: Session = Depends(get_db)):
    return db.query(models.FacultyCourse).all()


@app.delete("/faculty-courses/{faculty_course_id}")
def delete_faculty_course(faculty_course_id: int, db: Session = Depends(get_db)):
    faculty_course = db.query(models.FacultyCourse).filter(models.FacultyCourse.id == faculty_course_id).first()
    if not faculty_course:
        raise HTTPException(status_code=404, detail="Faculty-Course mapping not found")
    db.delete(faculty_course)
    db.commit()
    return {"message": "Faculty-Course mapping deleted"}


# Timetable Endpoints
@app.post("/timetable/generate/{section_id}")
def generate_timetable(section_id: int, db: Session = Depends(get_db)):
    """Generate complete timetable - ALL course hours must be met or generation fails"""
    
    # Get section
    section = db.query(models.Section).filter(models.Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    # Get all courses for this section
    section_courses = db.query(models.SectionCourse).filter(models.SectionCourse.section_id == section_id).all()
    if not section_courses:
        raise HTTPException(status_code=400, detail="No courses assigned to this section")
    
    # Get all time slots
    time_slots = db.query(models.TimeSlot).order_by(models.TimeSlot.start_time).all()
    if not time_slots:
        raise HTTPException(status_code=400, detail="No time slots defined")
    
    # Clear existing timetable for this section
    db.query(models.TimetableEntry).filter(models.TimetableEntry.section_id == section_id).delete()
    db.commit()
    
    # Days: Monday(0) to Friday(4)
    days = [0, 1, 2, 3, 4]
    
    # Pre-fetch all data
    all_classrooms = db.query(models.Classroom).all()
    
    # Track results
    all_entries = []
    course_results = []
    generation_failed = False
    
    for sc in section_courses:
        course = db.query(models.Course).filter(models.Course.id == sc.course_id).first()
        
        # Get faculty assigned to this course
        faculty_course = db.query(models.FacultyCourse).filter(
            models.FacultyCourse.course_id == course.id
        ).first()
        
        if not faculty_course:
            raise HTTPException(
                status_code=400, 
                detail=f"❌ GENERATION FAILED: No faculty assigned to {course.code}. Please assign a faculty member first."
            )
        
        faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_course.faculty_id).first()
        
        # Calculate sessions needed
        if course.is_lab:
            sessions_needed = course.hours_required // 2
            slots_per_session = 2
        else:
            sessions_needed = course.hours_required
            slots_per_session = 1
        
        scheduled_sessions = 0
        used_days = set()
        failed_attempts = []
        course_entries = []
        
        # Try EVERY possible day and time slot combination
        for day in days:
            if scheduled_sessions >= sessions_needed:
                break
                
            # For regular classes, skip if day already used
            if not course.is_lab and day in used_days:
                continue
            
            for slot_idx, time_slot in enumerate(time_slots):
                if scheduled_sessions >= sessions_needed:
                    break
                
                # For labs, need 2 consecutive slots
                if course.is_lab:
                    if slot_idx >= len(time_slots) - 1:
                        continue
                    slots_to_book = [time_slot, time_slots[slot_idx + 1]]
                else:
                    slots_to_book = [time_slot]
                
                # Track why this slot failed
                failure_reason = None
                
                # Check faculty availability
                for slot in slots_to_book:
                    if not db.query(models.FacultyAvailability).filter(
                        models.FacultyAvailability.faculty_id == faculty.id,
                        models.FacultyAvailability.day_of_week == day,
                        models.FacultyAvailability.time_slot_id == slot.id
                    ).first():
                        failure_reason = f"Faculty {faculty.name} not available"
                        break
                
                if failure_reason:
                    failed_attempts.append(f"  • {['Mon','Tue','Wed','Thu','Fri'][day]} {time_slot.start_time}: {failure_reason}")
                    continue
                
                # Check faculty not double-booked
                for slot in slots_to_book:
                    if db.query(models.TimetableEntry).filter(
                        models.TimetableEntry.faculty_id == faculty.id,
                        models.TimetableEntry.day_of_week == day,
                        models.TimetableEntry.time_slot_id == slot.id
                    ).first():
                        failure_reason = f"Faculty {faculty.name} teaching another class"
                        break
                
                if failure_reason:
                    failed_attempts.append(f"  • {['Mon','Tue','Wed','Thu','Fri'][day]} {time_slot.start_time}: {failure_reason}")
                    continue
                
                # Check section not double-booked
                for slot in slots_to_book:
                    if db.query(models.TimetableEntry).filter(
                        models.TimetableEntry.section_id == section_id,
                        models.TimetableEntry.day_of_week == day,
                        models.TimetableEntry.time_slot_id == slot.id
                    ).first():
                        failure_reason = "Section has another class"
                        break
                
                if failure_reason:
                    failed_attempts.append(f"  • {['Mon','Tue','Wed','Thu','Fri'][day]} {time_slot.start_time}: {failure_reason}")
                    continue
                
                # Find available classroom
                classroom_found = None
                
                for classroom in all_classrooms:
                    classroom_ok = True
                    
                    for slot in slots_to_book:
                        # Check availability
                        if not db.query(models.ClassroomAvailability).filter(
                            models.ClassroomAvailability.classroom_id == classroom.id,
                            models.ClassroomAvailability.day_of_week == day,
                            models.ClassroomAvailability.time_slot_id == slot.id
                        ).first():
                            classroom_ok = False
                            break
                        
                        # Check not booked
                        if db.query(models.TimetableEntry).filter(
                            models.TimetableEntry.classroom_id == classroom.id,
                            models.TimetableEntry.day_of_week == day,
                            models.TimetableEntry.time_slot_id == slot.id
                        ).first():
                            classroom_ok = False
                            break
                    
                    if classroom_ok:
                        classroom_found = classroom
                        break
                
                if not classroom_found:
                    failed_attempts.append(f"  • {['Mon','Tue','Wed','Thu','Fri'][day]} {time_slot.start_time}: No classroom available")
                    continue
                
                # SUCCESS - Create entries for all slots
                for slot in slots_to_book:
                    entry = models.TimetableEntry(
                        section_id=section_id,
                        course_id=course.id,
                        faculty_id=faculty.id,
                        classroom_id=classroom_found.id,
                        day_of_week=day,
                        time_slot_id=slot.id
                    )
                    db.add(entry)
                    course_entries.append(entry)
                
                db.commit()
                scheduled_sessions += 1
                used_days.add(day)
                break
        
        # Check if ALL required hours were scheduled
        hours_scheduled = scheduled_sessions * slots_per_session
        hours_required = course.hours_required
        
        if hours_scheduled < hours_required:
            generation_failed = True
            error_detail = f"\n❌ {course.code} ({course.name}): FAILED\n"
            error_detail += f"   Required: {hours_required} hours | Scheduled: {hours_scheduled} hours | Missing: {hours_required - hours_scheduled} hours\n"
            error_detail += f"   Why scheduling failed:\n"
            
            if failed_attempts:
                error_detail += "\n".join(failed_attempts[:10])
                if len(failed_attempts) > 10:
                    error_detail += f"\n  ... and {len(failed_attempts) - 10} more time slots unavailable"
            
            course_results.append(error_detail)
        else:
            all_entries.extend(course_entries)
            course_results.append(f"✅ {course.code}: {hours_scheduled} hours scheduled")
    
    # If ANY course failed, rollback everything and return error
    if generation_failed:
        db.query(models.TimetableEntry).filter(models.TimetableEntry.section_id == section_id).delete()
        db.commit()
        
        error_message = "🚫 TIMETABLE GENERATION FAILED - Requirements not met for all courses\n\n"
        error_message += "\n".join(course_results)
        error_message += "\n\n💡 Suggestions:\n"
        error_message += "  • Add more time slots\n"
        error_message += "  • Add more classrooms or classroom availability\n"
        error_message += "  • Increase faculty availability hours\n"
        error_message += "  • Reduce course hours required"
        
        raise HTTPException(status_code=400, detail=error_message)
    
    # SUCCESS - All courses fully scheduled
    return {
        "success": True,
        "message": f"✅ COMPLETE TIMETABLE GENERATED - All {len(all_entries)} classes scheduled successfully!",
        "created_entries": len(all_entries),
        "details": course_results
    }
    
    # Get section
    section = db.query(models.Section).filter(models.Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    # Get all courses for this section
    section_courses = db.query(models.SectionCourse).filter(models.SectionCourse.section_id == section_id).all()
    if not section_courses:
        raise HTTPException(status_code=400, detail="No courses assigned to this section")
    
    # Get all time slots
    time_slots = db.query(models.TimeSlot).order_by(models.TimeSlot.start_time).all()
    if not time_slots:
        raise HTTPException(status_code=400, detail="No time slots defined")
    
    errors = []
    warnings = []
    created_entries = []
    
    # Clear existing timetable for this section
    db.query(models.TimetableEntry).filter(models.TimetableEntry.section_id == section_id).delete()
    db.commit()
    
    # Days: Monday(0) to Friday(4)
    days = [0, 1, 2, 3, 4]
    
    # Pre-fetch all data
    all_classrooms = db.query(models.Classroom).all()
    
    for sc in section_courses:
        course = db.query(models.Course).filter(models.Course.id == sc.course_id).first()
        
        # Get faculty assigned to this course
        faculty_course = db.query(models.FacultyCourse).filter(
            models.FacultyCourse.course_id == course.id
        ).first()
        
        if not faculty_course:
            errors.append(f"❌ {course.code}: No faculty assigned to this course")
            continue
        
        faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_course.faculty_id).first()
        
        # Calculate sessions needed
        if course.is_lab:
            sessions_needed = course.hours_required // 2
            slots_per_session = 2
        else:
            sessions_needed = course.hours_required
            slots_per_session = 1
        
        scheduled_sessions = 0
        used_days = set()
        failed_attempts = []
        
        # Try to schedule all required sessions
        for day in days:
            if scheduled_sessions >= sessions_needed:
                break
                
            # For regular classes, skip if day already used
            if not course.is_lab and day in used_days:
                continue
            
            for slot_idx, time_slot in enumerate(time_slots):
                if scheduled_sessions >= sessions_needed:
                    break
                
                # For labs, need 2 consecutive slots
                if course.is_lab:
                    if slot_idx >= len(time_slots) - 1:
                        continue
                    slots_to_book = [time_slot, time_slots[slot_idx + 1]]
                else:
                    slots_to_book = [time_slot]
                
                # Track why this slot failed
                failure_reason = None
                
                # Check faculty availability
                for slot in slots_to_book:
                    if not db.query(models.FacultyAvailability).filter(
                        models.FacultyAvailability.faculty_id == faculty.id,
                        models.FacultyAvailability.day_of_week == day,
                        models.FacultyAvailability.time_slot_id == slot.id
                    ).first():
                        failure_reason = f"Faculty {faculty.name} not available"
                        break
                
                if failure_reason:
                    failed_attempts.append(f"{days[day][:3]} {time_slot.start_time}: {failure_reason}")
                    continue
                
                # Check faculty not double-booked
                for slot in slots_to_book:
                    if db.query(models.TimetableEntry).filter(
                        models.TimetableEntry.faculty_id == faculty.id,
                        models.TimetableEntry.day_of_week == day,
                        models.TimetableEntry.time_slot_id == slot.id
                    ).first():
                        failure_reason = f"Faculty {faculty.name} already teaching another class"
                        break
                
                if failure_reason:
                    failed_attempts.append(f"{days[day][:3]} {time_slot.start_time}: {failure_reason}")
                    continue
                
                # Check section not double-booked
                for slot in slots_to_book:
                    if db.query(models.TimetableEntry).filter(
                        models.TimetableEntry.section_id == section_id,
                        models.TimetableEntry.day_of_week == day,
                        models.TimetableEntry.time_slot_id == slot.id
                    ).first():
                        failure_reason = "Section already has another class"
                        break
                
                if failure_reason:
                    failed_attempts.append(f"{days[day][:3]} {time_slot.start_time}: {failure_reason}")
                    continue
                
                # Find available classroom
                classroom_found = None
                classroom_failure = None
                
                for classroom in all_classrooms:
                    classroom_ok = True
                    
                    for slot in slots_to_book:
                        # Check availability
                        if not db.query(models.ClassroomAvailability).filter(
                            models.ClassroomAvailability.classroom_id == classroom.id,
                            models.ClassroomAvailability.day_of_week == day,
                            models.ClassroomAvailability.time_slot_id == slot.id
                        ).first():
                            classroom_failure = f"No classrooms available"
                            classroom_ok = False
                            break
                        
                        # Check not booked
                        if db.query(models.TimetableEntry).filter(
                            models.TimetableEntry.classroom_id == classroom.id,
                            models.TimetableEntry.day_of_week == day,
                            models.TimetableEntry.time_slot_id == slot.id
                        ).first():
                            classroom_failure = f"All classrooms occupied"
                            classroom_ok = False
                            break
                    
                    if classroom_ok:
                        classroom_found = classroom
                        break
                
                if not classroom_found:
                    failed_attempts.append(f"{days[day][:3]} {time_slot.start_time}: {classroom_failure}")
                    continue
                
                # SUCCESS - Create entries for all slots
                for slot in slots_to_book:
                    entry = models.TimetableEntry(
                        section_id=section_id,
                        course_id=course.id,
                        faculty_id=faculty.id,
                        classroom_id=classroom_found.id,
                        day_of_week=day,
                        time_slot_id=slot.id
                    )
                    db.add(entry)
                    created_entries.append(entry)
                
                db.commit()
                scheduled_sessions += 1
                used_days.add(day)
                break
        
        # Check if all required hours were scheduled
        hours_scheduled = scheduled_sessions * slots_per_session
        hours_required = course.hours_required
        
        if hours_scheduled < hours_required:
            error_msg = f"❌ {course.code}: Only scheduled {hours_scheduled}/{hours_required} hours"
            if failed_attempts:
                error_msg += f"\nReasons:\n  - " + "\n  - ".join(failed_attempts[:5])
                if len(failed_attempts) > 5:
                    error_msg += f"\n  ... and {len(failed_attempts) - 5} more conflicts"
            errors.append(error_msg)
        elif hours_scheduled == hours_required:
            warnings.append(f"✅ {course.code}: Successfully scheduled {hours_scheduled} hours")
    
    # Determine response
    if errors:
        return {
            "success": False,
            "message": "Timetable generation incomplete",
            "created_entries": len(created_entries),
            "errors": errors,
            "warnings": warnings
        }
    else:
        return {
            "success": True,
            "message": f"✅ Timetable generated successfully! {len(created_entries)} classes scheduled.",
            "created_entries": len(created_entries),
            "errors": [],
            "warnings": warnings
        }
    
    # Get section
    section = db.query(models.Section).filter(models.Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    # Get all courses for this section
    section_courses = db.query(models.SectionCourse).filter(models.SectionCourse.section_id == section_id).all()
    if not section_courses:
        raise HTTPException(status_code=400, detail="No courses assigned to this section")
    
    # Get all time slots
    time_slots = db.query(models.TimeSlot).order_by(models.TimeSlot.start_time).all()
    if not time_slots:
        raise HTTPException(status_code=400, detail="No time slots defined")
    
    errors = []
    created_entries = []
    
    # Clear existing timetable for this section
    db.query(models.TimetableEntry).filter(models.TimetableEntry.section_id == section_id).delete()
    db.commit()
    
    # Days: Monday(0) to Friday(4)
    days = [0, 1, 2, 3, 4]
    
    for sc in section_courses:
        course = db.query(models.Course).filter(models.Course.id == sc.course_id).first()
        
        # Get faculty assigned to this course
        faculty_course = db.query(models.FacultyCourse).filter(
            models.FacultyCourse.course_id == course.id
        ).first()
        
        if not faculty_course:
            errors.append(f"No faculty assigned to course {course.code}")
            continue
        
        faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_course.faculty_id).first()
        
        # Calculate sessions needed
        if course.is_lab:
            # Lab: 2-hour consecutive blocks
            sessions_needed = course.hours_required // 2
            hours_per_session = 2
        else:
            # Regular: 1-hour sessions, max 1 per day
            sessions_needed = course.hours_required
            hours_per_session = 1
        
        scheduled_sessions = 0
        used_days = set()
        
        # Try to schedule all sessions
        attempts = 0
        max_attempts = 100
        
        while scheduled_sessions < sessions_needed and attempts < max_attempts:
            attempts += 1
            
            # Pick a random day (that hasn't been used for this course if regular class)
            available_days = [d for d in days if (course.is_lab or d not in used_days)]
            if not available_days:
                break
            
            shuffle(available_days)
            day = available_days[0]
            
            # Pick random time slot
            shuffle(time_slots)
            
            for time_slot in time_slots:
                # For labs, check if next consecutive slot exists
                if course.is_lab:
                    slot_index = next((i for i, ts in enumerate(time_slots) if ts.id == time_slot.id), None)
                    if slot_index is None or slot_index >= len(time_slots) - 1:
                        continue
                    next_slot = time_slots[slot_index + 1]
                    slots_to_check = [time_slot, next_slot]
                else:
                    slots_to_check = [time_slot]
                
                # Check faculty availability for all slots
                faculty_available = True
                for slot in slots_to_check:
                    faculty_avail = db.query(models.FacultyAvailability).filter(
                        models.FacultyAvailability.faculty_id == faculty.id,
                        models.FacultyAvailability.day_of_week == day,
                        models.FacultyAvailability.time_slot_id == slot.id
                    ).first()
                    if not faculty_avail:
                        faculty_available = False
                        break
                
                if not faculty_available:
                    continue
                
                # Find available classroom
                classrooms = db.query(models.Classroom).all()
                classroom_found = None
                
                for classroom in classrooms:
                    # Check classroom availability for all slots
                    classroom_available = True
                    for slot in slots_to_check:
                        classroom_avail = db.query(models.ClassroomAvailability).filter(
                            models.ClassroomAvailability.classroom_id == classroom.id,
                            models.ClassroomAvailability.day_of_week == day,
                            models.ClassroomAvailability.time_slot_id == slot.id
                        ).first()
                        if not classroom_avail:
                            classroom_available = False
                            break
                        
                        # Check if classroom is already booked
                        existing_entry = db.query(models.TimetableEntry).filter(
                            models.TimetableEntry.classroom_id == classroom.id,
                            models.TimetableEntry.day_of_week == day,
                            models.TimetableEntry.time_slot_id == slot.id
                        ).first()
                        if existing_entry:
                            classroom_available = False
                            break
                    
                    if classroom_available:
                        classroom_found = classroom
                        break
                
                if not classroom_found:
                    continue
                
                # Check faculty not double-booked
                faculty_conflict = False
                for slot in slots_to_check:
                    existing_faculty_entry = db.query(models.TimetableEntry).filter(
                        models.TimetableEntry.faculty_id == faculty.id,
                        models.TimetableEntry.day_of_week == day,
                        models.TimetableEntry.time_slot_id == slot.id
                    ).first()
                    if existing_faculty_entry:
                        faculty_conflict = True
                        break
                
                if faculty_conflict:
                    continue
                
                # Check section not double-booked
                section_conflict = False
                for slot in slots_to_check:
                    existing_section_entry = db.query(models.TimetableEntry).filter(
                        models.TimetableEntry.section_id == section_id,
                        models.TimetableEntry.day_of_week == day,
                        models.TimetableEntry.time_slot_id == slot.id
                    ).first()
                    if existing_section_entry:
                        section_conflict = True
                        break
                
                if section_conflict:
                    continue
                
                # All checks passed - create entries
                for slot in slots_to_check:
                    entry = models.TimetableEntry(
                        section_id=section_id,
                        course_id=course.id,
                        faculty_id=faculty.id,
                        classroom_id=classroom_found.id,
                        day_of_week=day,
                        time_slot_id=slot.id
                    )
                    db.add(entry)
                    created_entries.append(entry)
                
                db.commit()
                scheduled_sessions += 1
                used_days.add(day)
                break
        
        if scheduled_sessions < sessions_needed:
            errors.append(
                f"Could only schedule {scheduled_sessions}/{sessions_needed} sessions for {course.code}. "
                f"Need more available slots or classrooms."
            )
    
    return {
        "message": "Timetable generation completed",
        "created_entries": len(created_entries),
        "errors": errors
    }


@app.get("/timetable/section/{section_id}", response_model=List[schemas.TimetableEntry])
def get_section_timetable(section_id: int, db: Session = Depends(get_db)):
    """Get timetable for a section"""
    entries = db.query(models.TimetableEntry).filter(
        models.TimetableEntry.section_id == section_id
    ).all()
    return entries


@app.delete("/timetable/section/{section_id}")
def clear_section_timetable(section_id: int, db: Session = Depends(get_db)):
    """Clear all timetable entries for a section"""
    db.query(models.TimetableEntry).filter(
        models.TimetableEntry.section_id == section_id
    ).delete()
    db.commit()
    return {"message": f"Timetable cleared for section {section_id}"}


@app.get("/")
def root():
    return {"message": "Timetable Management API", "docs": "/docs"}
