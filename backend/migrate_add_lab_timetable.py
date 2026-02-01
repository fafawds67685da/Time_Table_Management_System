"""
Migration script to add is_lab to courses and create timetable_entries table
"""

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        trans = conn.begin()
        
        try:
            print("🔄 Starting migration for lab courses and timetable entries...")
            
            # Add is_lab column to courses
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='courses' AND column_name='is_lab'
            """))
            
            if result.fetchone() is None:
                print("➕ Adding is_lab column to courses...")
                conn.execute(text("""
                    ALTER TABLE courses 
                    ADD COLUMN is_lab BOOLEAN DEFAULT FALSE
                """))
                print("✅ is_lab column added to courses")
            else:
                print("⏭️  is_lab column already exists in courses")
            
            # Create timetable_entries table
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name='timetable_entries'
            """))
            
            if result.fetchone() is None:
                print("📋 Creating timetable_entries table...")
                conn.execute(text("""
                    CREATE TABLE timetable_entries (
                        id SERIAL PRIMARY KEY,
                        section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
                        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
                        faculty_id INTEGER NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
                        classroom_id INTEGER NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
                        day_of_week INTEGER NOT NULL,
                        time_slot_id INTEGER NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                print("✅ timetable_entries table created")
            else:
                print("⏭️  timetable_entries table already exists")
            
            trans.commit()
            print("\n🎉 Migration completed successfully!")
            
        except Exception as e:
            trans.rollback()
            print(f"\n❌ Migration failed: {str(e)}")
            raise

if __name__ == "__main__":
    migrate()
