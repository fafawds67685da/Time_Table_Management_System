"""
Migration script to update Section table structure:
- Remove course_id column from sections table
- Create section_courses table for many-to-many relationship
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine
engine = create_engine(DATABASE_URL)

print("🔄 Starting database migration...")

with engine.connect() as conn:
    try:
        # 1. Create time_slots table
        print("Creating time_slots table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS time_slots (
                id SERIAL PRIMARY KEY,
                day VARCHAR NOT NULL,
                start_time VARCHAR NOT NULL,
                end_time VARCHAR NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        print("✅ time_slots table created")
        
        # 2. Create time_slot_groups table
        print("Creating time_slot_groups table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS time_slot_groups (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                description VARCHAR,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        print("✅ time_slot_groups table created")
        
        # 3. Create time_slot_group_assignments table
        print("Creating time_slot_group_assignments table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS time_slot_group_assignments (
                id SERIAL PRIMARY KEY,
                time_slot_group_id INTEGER NOT NULL REFERENCES time_slot_groups(id) ON DELETE CASCADE,
                time_slot_id INTEGER NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE
            )
        """))
        print("✅ time_slot_group_assignments table created")
        
        # 4. Add time_slot_group_id to sections table if it doesn't exist
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='sections' AND column_name='time_slot_group_id'
        """))
        
        if not result.fetchone():
            print("Adding time_slot_group_id to sections table...")
            conn.execute(text("""
                ALTER TABLE sections 
                ADD COLUMN time_slot_group_id INTEGER REFERENCES time_slot_groups(id)
            """))
            print("✅ time_slot_group_id column added to sections table")
        else:
            print("ℹ️  time_slot_group_id column already exists in sections table")
        
        # 5. Create section_courses table if it doesn't exist
        print("Creating section_courses table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS section_courses (
                id SERIAL PRIMARY KEY,
                section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
                course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE
            )
        """))
        print("✅ section_courses table created")
        
        # 6. Check if course_id column exists in sections
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='sections' AND column_name='course_id'
        """))
        
        if result.fetchone():
            print("Found course_id column in sections table...")
            
            # Migrate existing data: Copy section-course relationships to section_courses table
            print("Migrating existing data...")
            conn.execute(text("""
                INSERT INTO section_courses (section_id, course_id)
                SELECT id, course_id FROM sections WHERE course_id IS NOT NULL
                ON CONFLICT DO NOTHING
            """))
            print("✅ Data migrated to section_courses table")
            
            # Drop the foreign key constraint
            print("Dropping foreign key constraint...")
            conn.execute(text("""
                ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_course_id_fkey CASCADE
            """))
            print("✅ Foreign key constraint dropped")
            
            # Drop the course_id column
            print("Dropping course_id column...")
            conn.execute(text("""
                ALTER TABLE sections DROP COLUMN course_id
            """))
            print("✅ course_id column removed from sections table")
        else:
            print("ℹ️  course_id column not found in sections table (already migrated)")
        
        # Commit all changes
        conn.commit()
        print("\n🎉 Migration completed successfully!")
        print("✓ time_slots table is ready")
        print("✓ time_slot_groups table is ready")
        print("✓ time_slot_group_assignments table is ready")
        print("✓ section_courses table is ready")
        print("✓ sections table updated")
        print("✓ Existing data preserved")
        
    except Exception as e:
        print(f"❌ Migration error: {e}")
        conn.rollback()
        raise

print("\nYou can now start the backend server.")
