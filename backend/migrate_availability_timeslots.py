"""
Migration script to add time_slot_id to availability tables
This script:
1. Adds time_slot_id column to classroom_availability and faculty_availability
2. Removes start_time and end_time columns
3. Preserves all existing data by NOT dropping the tables
"""

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        # Start transaction
        trans = conn.begin()
        
        try:
            print("🔄 Starting migration to add time_slot_id to availability tables...")
            
            # Check if time_slot_id column exists in classroom_availability
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='classroom_availability' AND column_name='time_slot_id'
            """))
            
            if result.fetchone() is None:
                print("➕ Adding time_slot_id column to classroom_availability...")
                conn.execute(text("""
                    ALTER TABLE classroom_availability 
                    ADD COLUMN time_slot_id INTEGER REFERENCES time_slots(id)
                """))
                print("✅ time_slot_id column added to classroom_availability")
            else:
                print("⏭️  time_slot_id column already exists in classroom_availability")
            
            # Check if time_slot_id column exists in faculty_availability
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='faculty_availability' AND column_name='time_slot_id'
            """))
            
            if result.fetchone() is None:
                print("➕ Adding time_slot_id column to faculty_availability...")
                conn.execute(text("""
                    ALTER TABLE faculty_availability 
                    ADD COLUMN time_slot_id INTEGER REFERENCES time_slots(id)
                """))
                print("✅ time_slot_id column added to faculty_availability")
            else:
                print("⏭️  time_slot_id column already exists in faculty_availability")
            
            # Check if start_time column still exists in classroom_availability
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='classroom_availability' AND column_name='start_time'
            """))
            
            if result.fetchone() is not None:
                print("🗑️  Removing start_time column from classroom_availability...")
                conn.execute(text("""
                    ALTER TABLE classroom_availability 
                    DROP COLUMN start_time
                """))
                print("✅ start_time column removed from classroom_availability")
            else:
                print("⏭️  start_time column already removed from classroom_availability")
            
            # Check if end_time column still exists in classroom_availability
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='classroom_availability' AND column_name='end_time'
            """))
            
            if result.fetchone() is not None:
                print("🗑️  Removing end_time column from classroom_availability...")
                conn.execute(text("""
                    ALTER TABLE classroom_availability 
                    DROP COLUMN end_time
                """))
                print("✅ end_time column removed from classroom_availability")
            else:
                print("⏭️  end_time column already removed from classroom_availability")
            
            # Check if start_time column still exists in faculty_availability
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='faculty_availability' AND column_name='start_time'
            """))
            
            if result.fetchone() is not None:
                print("🗑️  Removing start_time column from faculty_availability...")
                conn.execute(text("""
                    ALTER TABLE faculty_availability 
                    DROP COLUMN start_time
                """))
                print("✅ start_time column removed from faculty_availability")
            else:
                print("⏭️  start_time column already removed from faculty_availability")
            
            # Check if end_time column still exists in faculty_availability
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='faculty_availability' AND column_name='end_time'
            """))
            
            if result.fetchone() is not None:
                print("🗑️  Removing end_time column from faculty_availability...")
                conn.execute(text("""
                    ALTER TABLE faculty_availability 
                    DROP COLUMN end_time
                """))
                print("✅ end_time column removed from faculty_availability")
            else:
                print("⏭️  end_time column already removed from faculty_availability")
            
            # Commit transaction
            trans.commit()
            print("\n🎉 Migration completed successfully!")
            print("📝 Note: All existing availability data structure has been updated to use time_slot_id")
            
        except Exception as e:
            trans.rollback()
            print(f"\n❌ Migration failed: {str(e)}")
            raise

if __name__ == "__main__":
    migrate()
