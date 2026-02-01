import requests

print("Testing API endpoints...\n")

try:
    # Test courses endpoint
    response = requests.get('http://localhost:8000/courses/')
    print(f"Courses API Status: {response.status_code}")
    print(f"Courses Data: {response.json()}\n")
except Exception as e:
    print(f"Error fetching courses: {e}\n")

try:
    # Test classrooms endpoint
    response = requests.get('http://localhost:8000/classrooms/')
    print(f"Classrooms API Status: {response.status_code}")
    print(f"Classrooms Data: {response.json()}\n")
except Exception as e:
    print(f"Error fetching classrooms: {e}\n")

try:
    # Test faculty endpoint
    response = requests.get('http://localhost:8000/faculty/')
    print(f"Faculty API Status: {response.status_code}")
    print(f"Faculty Data: {response.json()}\n")
except Exception as e:
    print(f"Error fetching faculty: {e}\n")
