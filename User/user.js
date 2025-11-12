const baseURL = "http://localhost:9999/api"; // your backend endpoint
const tableBody = document.querySelector("#UserTable tbody");

// Function to fetch and display all students
async function loadUser() {
  try {
    const response = await axios.get(`${baseURL}/users`);
    const students = response.data;

    // Clear old rows
    tableBody.innerHTML = "";

    // Loop through each student and create a table row
    students.forEach((user) => {
      const row = `
        <tr>
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.password}</td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    tableBody.innerHTML = `
      <tr><td colspan="7" style="color:red;">Failed to load User</td></tr>
    `;
  }
}


//add user





// Run when page loads
loadUser();
