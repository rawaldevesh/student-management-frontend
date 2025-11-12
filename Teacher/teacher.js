const baseURL = "http://localhost:9999/api/teachers"; // your backend endpoint
const tableBody = document.querySelector("#TeacherTable tbody");

// Function to fetch and display all students
async function loadTeacher() {
  try {
    const response = await axios.get(baseURL);
    const students = response.data;

    // Clear old rows
    tableBody.innerHTML = "";

 // Loop through each student and create a table row
    students.forEach(teacher => {
      const row = `
        <tr>
          <td>${teacher.id}</td>
          <td>${teacher.name}</td>
          <td>${teacher.email}</td>
          <td>${teacher.phoneNumber}</td>
          <td>${teacher.departmentName}</td>
          <td>${teacher.courses}</td>

        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (error) {
    console.error("Error fetching students:", error);
    tableBody.innerHTML = `
      <tr><td colspan="7" style="color:red;">Failed to load Teacher</td></tr>
    `;
  }
}

// Run when page loads
loadTeacher();
