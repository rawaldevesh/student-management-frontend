const baseURL = "http://localhost:9999/api/courses"; // your backend endpoint
const tableBody = document.querySelector("#CourseTable tbody");

// Function to fetch and display all students
async function loadCourses() {
  try {
    const response = await axios.get(baseURL);
    const students = response.data;

    // Clear old rows
    tableBody.innerHTML = "";

 // Loop through each student and create a table row
    students.forEach(course => {
      const row = `
        <tr>
          <td>${course.id}</td>
          <td>${course.courseName}</td>
          <td>${course.duration}</td>
     
          <td>${course.teacherName || "-"}</td>
          <td>${course.departmentName || "-"}</td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (error) {
    console.error("Error fetching students:", error);
    tableBody.innerHTML = `
      <tr><td colspan="7" style="color:red;">Failed to load courses</td></tr>
    `;
  }
}

// Run when page loads
loadCourses();
