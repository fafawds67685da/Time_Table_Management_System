"""
Migration: Remove day column from time_slots table
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

print("🔄 Removing day column from time_slots table...")

with engine.connect() as conn:
    try:
        # Check if day column exists
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='time_slots' AND column_name='day'
        """))
        
        if result.fetchone():
            print("Removing day column...")
            conn.execute(text("""
                ALTER TABLE time_slots DROP COLUMN day
            """))
            print("✅ day column removed from time_slots table")
        else:
            print("ℹ️  day column not found (already removed)")
        
        conn.commit()
        print("\n🎉 Migration completed - all existing time slot data preserved!")
        
    except Exception as e:
        print(f"❌ Migration error: {e}")
        conn.rollback()
        raise

print("\nYou can now restart the backend server.")
