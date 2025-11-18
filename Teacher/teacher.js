const baseURL = "http://localhost:9999/api"; // your backend endpoint
const tableBody = document.querySelector("#TeacherTable tbody");
const teacherForm = document.querySelector("#teacherForm");
const departmentSelect = document.querySelector("#departmentSelect");
const searchInput = document.querySelector("#searchInput");

// Function to fetch and display all students
async function loadTeacher() {
  try {
    const response = await axios.get(`${baseURL}/teachers`);
    const students = response.data;

    // Clear old rows
    tableBody.innerHTML = "";

    // Loop through each student and create a table row
    students.forEach((teacher) => {
      const row = `
        <tr>
          <td>${teacher.id}</td>
          <td>${teacher.name}</td>
          <td>${teacher.email}</td>
          <td>${teacher.phoneNumber}</td>
          <td>${teacher.courses}</td>
          <td>${teacher.departmentName}</td>
          <td>
            <button id ="action" onclick="editTeacher(${teacher.id})">Edit</button>
            <button class = "delete" onclick="deleteTeacher(${teacher.id})">Delete</button>
          </td>

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

//list of department
async function loadDropdowns() {
  try {
    const departments = await axios.get(`${baseURL}/departments`);
    departments.data.forEach((d) => {
      const option = document.createElement("option");
      option.value = d.id;
      option.textContent = d.name;
      departmentSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading dropdowns:", err);
  }
}

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

//add teacher
teacherForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const teacherData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phoneNumber: document.getElementById("phone").value,

    department: {
      id: parseInt(document.getElementById("departmentSelect").value),
    },
  };
  try {
    if (editMode && editingId) {
      // UPDATE
      await axios.put(`${baseURL}/teachers/${editingId}`, teacherData);
      alert("Teacher updated successfully!");
      editMode = false;
      editingId = null;
      document.querySelector("#teacherForm button").textContent = "Add Teacher";
    } else {
      // ADD NEW
      await axios.post(`${baseURL}/teachers`, teacherData);
      alert("Teacher added successfully!");
    }
    teacherForm.reset();
    loadTeacher();
  } catch (err) {
    console.error("Error submitting Teacher:", err);
    alert("Failed to submit Teacher");
  }
});

//update or edit teacher
async function editTeacher(id) {
  try {
    const response = await axios.get(`${baseURL}/teachers/${id}`);
    const teacher = response.data;
    document.getElementById("name").value = teacher.name;
    document.getElementById("email").value = teacher.email;
    document.getElementById("phone").value = teacher.phoneNumber;

    const departmentOption = [...departmentSelect.options].find(
      (opt) => opt.text === teacher.departmentName
    );
    if (departmentOption) departmentSelect.value = departmentOption.value;
    editMode = true;
    editingId = id;

    document.querySelector("#teacherForm button").textContent =
      "Update Teacher";
  } catch (error) {
    console.error("Error fetching teacher:", error);
  }
}
//delete teacher
async function deleteTeacher(id) {
  if (!confirm("Are you sure you want to delete this teacher?")) return;
  try {
    await axios.delete(`${baseURL}/teachers/${id}`);
    alert("Teacher deleted successfully!");
    loadTeacher();
  } catch (error) {
    alert(error.response.data.error);
    console.error("Error deleting teacher:", error);
    alert("Failed to delete teacher.");
  }
}

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "../Home/login.html";
}

// Run when page loads
loadDropdowns();
loadTeacher();
