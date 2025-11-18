const baseURL = "http://localhost:9999/api"; // your backend endpoint
const tableBody = document.querySelector("#DepartmentTable tbody");
const departmentForm = document.querySelector("#departmentForm");

// Function to fetch and display all students
async function loadDepartment() {
  try {
    const response = await axios.get(`${baseURL}/departments`);
    const departments = response.data;

    tableBody.innerHTML = "";

    // Loop through each student and create a table row
    departments.forEach((department) => {
      const row = `
        <tr>
          <td>${department.id}</td>
          <td>${department.name}</td>
          <td>${department.code}</td>
          <td>${department.hodName}</td>
          <td>
            <button id ="action" onclick="editDepartment(${department.id})">Edit</button>
            <button class = "delete" onclick="deleteDepartment(${department.id})">Delete</button>
          </td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    tableBody.innerHTML = `
      <tr><td colspan="7" style="color:red;">Failed to load Departments</td></tr>
    `;
  }
}

//add department

departmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const departmentData = {
    name: document.getElementById("name").value,
    code: document.getElementById("Code").value,
    hodName: document.getElementById("Hod").value,
  };

  try {
    if (editMode && editingId) {
      //  UPDATE
      await axios.put(`${baseURL}/departments/${editingId}`, departmentData);
      alert("Department updated successfully!");
      editMode = false;
      editingId = null;
      document.querySelector("#departmentForm button").textContent =
        "Add Department";
    } else {
      //ADD NEW
      await axios.post(`${baseURL}/departments`, departmentData);
      alert("Department added successfully!");
    }

    departmentForm.reset();
    loadDepartment();
  } catch (err) {
    console.error("Error submitting Department:", err);
    alert("Failed to submit Department");
  }
});

//serch
searchInput.addEventListener("keyup", function () {
  const searchValue = this.value.toLowerCase();
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchValue) ? "" : "none";
  });
});

let editMode = false;
let editingId = null;

//update or edit student
async function editDepartment(id) {
  try {
    const res = await axios.get(`${baseURL}/departments/${id}`);
    const s = res.data;

    // populate form fields
    document.getElementById("name").value = s.name;
    document.getElementById("Code").value = s.code;
    document.getElementById("Hod").value = s.hodName;

    // switch mode
    editMode = true;
    editingId = id;

    // change button text
    document.querySelector("#departmentForm button").textContent =
      "Update Departments";
  } catch (err) {
    console.error("Error fetching department for edit:", err);
  }
}

// delete student
async function deleteDepartment(id) {
  if (!confirm("Are you sure you want to delete this departments?")) return;
  try {
    await axios.delete(`${baseURL}/departments/${id}`);
    alert("Department deleted successfully!");
    loadDepartment();
  } catch (err) {
    alert(err.response.data.error);
    console.error("Error deleting departments:", err);
    alert("Failed to delete departments");
  }
}

//login check
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "../Home/login.html";
}

// Run when page loads
loadDepartment();
