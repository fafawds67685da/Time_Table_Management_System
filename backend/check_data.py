from app.database import engine
from sqlalchemy import text

conn = engine.connect()

print("\n=== CHECKING DATABASE RECORDS ===\n")

# Check courses
result = conn.execute(text('SELECT * FROM courses LIMIT 5'))
print("COURSES:")
for row in result:
    print(row)

# Check classrooms
result = conn.execute(text('SELECT * FROM classrooms LIMIT 5'))
print("\nCLASSROOMS:")
for row in result:
    print(row)

# Check faculty
result = conn.execute(text('SELECT * FROM faculty LIMIT 5'))
print("\nFACULTY:")
for row in result:
    print(row)

# Check sections
result = conn.execute(text('SELECT * FROM sections LIMIT 5'))
print("\nSECTIONS:")
for row in result:
    print(row)

conn.close()
print("\n=== DONE ===")
