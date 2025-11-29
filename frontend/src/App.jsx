import React, { useState } from "react";

// Grade chart: Letter grades with their corresponding grade points
const GRADE_OPTIONS = [
  { letter: "A+", point: 4.0 },
  { letter: "A", point: 3.75 },
  { letter: "A-", point: 3.5 },
  { letter: "B+", point: 3.25 },
  { letter: "B", point: 3.0 },
  { letter: "B-", point: 2.75 },
  { letter: "C+", point: 2.5 },
  { letter: "C", point: 2.25 },
  { letter: "D", point: 2.0 },
  { letter: "F", point: 0.0 },
  { letter: "I", point: 0.0 },
];

// Available credit hour options
const CREDIT_OPTIONS = [1.5, 2, 3, 4];

const App = () => {
  // State to store all courses
  // Each course has: id (unique identifier), courseName, credit, and gradePoint
  const [courses, setCourses] = useState([
    { id: 1, courseName: "", credit: "", gradePoint: "" },
  ]);

  // Function to add a new course row
  const addCourse = () => {
    // Create a new course object with a unique ID (using current timestamp)
    const newCourse = {
      id: Date.now(),
      courseName: "",
      credit: "",
      gradePoint: "",
    };

    // Add the new course to the existing courses array
    setCourses([...courses, newCourse]);
  };

  // Function to remove a course row
  const removeCourse = (courseId) => {
    // Only allow removal if there's more than one course
    // (we always want at least one row visible)
    if (courses.length > 1) {
      // Filter out the course with the matching ID
      const updatedCourses = courses.filter((course) => course.id !== courseId);
      setCourses(updatedCourses);
    }
  };

  // Function to update a specific field of a course
  const updateCourse = (courseId, fieldName, newValue) => {
    // Map through all courses and update the one that matches the ID
    const updatedCourses = courses.map((course) => {
      if (course.id === courseId) {
        // Return a new object with the updated field
        return { ...course, [fieldName]: newValue };
      }
      // Return unchanged course for all others
      return course;
    });

    setCourses(updatedCourses);
  };

  // Function to calculate the GPA
  const calculateGPA = () => {
    let totalPoints = 0; // Sum of (grade point × credit) for all courses
    let totalCredits = 0; // Sum of all credit hours

    // Loop through each course
    courses.forEach((course) => {
      // Convert credit and gradePoint to numbers (default to 0 if empty)
      const credit = parseFloat(course.credit) || 0;
      const gradePoint = parseFloat(course.gradePoint) || 0;

      // Only calculate if both credit and grade point are valid
      if (credit > 0 && gradePoint >= 0) {
        // Add (grade point × credit) to total points
        totalPoints += gradePoint * credit;
        // Add credit to total credits
        totalCredits += credit;
      }
    });

    // Avoid division by zero
    if (totalCredits === 0) {
      return 0;
    }

    // GPA formula: Total Points / Total Credits
    return totalPoints / totalCredits;
  };

  // Calculate and store the current GPA
  const currentGPA = calculateGPA();

  // Calculate total credits
  const totalCredits = courses.reduce((sum, course) => {
    const credit = parseFloat(course.credit) || 0;
    return sum + credit;
  }, 0);

  return (
    <div className="app-container">
      <div className="calculator-wrapper">
        <h1 className="title">GPA Calculator</h1>
        <p className="subtitle">
          Calculate your Grade Point Average (out of 4.0)
        </p>

        <div className="courses-container">
          {/* Table header row - only visible on desktop */}
          <div className="table-header">
            <div className="header-cell course-name-header">
              Course Name (Optional)
            </div>
            <div className="header-cell credit-header">Credit *</div>
            <div className="header-cell grade-header">Letter Grade *</div>
            <div className="header-cell action-header">Action</div>
          </div>

          {/* Render each course as a row */}
          {courses.map((course, index) => (
            <div key={course.id} className="course-row">
              {/* Course Name Input */}
              <div className="input-wrapper">
                <label className="mobile-label">Course Name (Optional)</label>
                <input
                  type="text"
                  className="input-field course-name-input"
                  placeholder="Enter course name"
                  value={course.courseName}
                  onChange={(e) =>
                    updateCourse(course.id, "courseName", e.target.value)
                  }
                />
              </div>

              {/* Credit Hours Dropdown */}
              <div className="input-wrapper">
                <label className="mobile-label">Credit *</label>
                <select
                  className="input-field credit-select"
                  value={course.credit}
                  onChange={(e) =>
                    updateCourse(course.id, "credit", e.target.value)
                  }
                  required
                >
                  <option value="">Select Credit</option>
                  {CREDIT_OPTIONS.map((credit) => (
                    <option key={credit} value={credit}>
                      {credit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Letter Grade Dropdown */}
              <div className="input-wrapper">
                <label className="mobile-label">Letter Grade *</label>
                <select
                  className="input-field grade-select"
                  value={course.gradePoint}
                  onChange={(e) =>
                    updateCourse(course.id, "gradePoint", e.target.value)
                  }
                  required
                >
                  <option value="">Select Grade</option>
                  {GRADE_OPTIONS.map((grade) => (
                    <option key={grade.letter} value={grade.point}>
                      {grade.letter} ({grade.point.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                {/* Show remove button only if there's more than one course */}
                {courses.length > 1 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeCourse(course.id)}
                    aria-label="Remove course"
                  >
                    ×
                  </button>
                )}
                {/* Show add button only on the last row */}
                {index === courses.length - 1 && (
                  <button
                    className="add-btn"
                    onClick={addCourse}
                    aria-label="Add course"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Results Section */}
        <div className="results-container">
          <div className="result-card">
            <div className="result-label">Total Credits</div>
            <div className="result-value">{totalCredits.toFixed(2)}</div>
          </div>
          <div className="result-card gpa-card">
            <div className="result-label">GPA</div>
            <div className="result-value gpa-value">
              {currentGPA.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
