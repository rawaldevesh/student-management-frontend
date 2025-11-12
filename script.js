const baseURL = "http://localhost:9999/api"; 
const tableBody = document.querySelector("#studentsTable tbody");
const studentForm = document.querySelector("#studentForm");
const teacherSelect = document.querySelector("#teacherSelect");
const courseSelect = document.querySelector("#courseSelect");

// student table display
async function loadStudents() {
  try {
    const response = await axios.get(`${baseURL}/students`);
    const students = response.data;
    tableBody.innerHTML = "";

    students.forEach(student => {
      const row = `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.phone}</td>
          <td>${student.address}</td>
          <td>${student.teacherName || "-"}</td>
          <td>${student.coursesName || "-"}</td>
          <td>
            <button onclick="editStudent(${student.id})">Edit</button>
            <button onclick="deleteStudent(${student.id})">Delete</button>
          </td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (error) {
    console.error("Error fetching students:", error);
    tableBody.innerHTML = `
      <tr><td colspan="8" style="color:red;">Failed to load students</td></tr>
    `;
  }
}
// list of teacher and course
async function loadDropdowns() {
  try {
    const teachers = await axios.get(`${baseURL}/teachers`);
    const courses = await axios.get(`${baseURL}/courses`);

    teachers.data.forEach(t => {
      const option = document.createElement("option");
      option.value = t.id;
      option.textContent = t.name;
      teacherSelect.appendChild(option);
    });

    courses.data.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.courseName;
      courseSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading dropdowns:", err);
  }
}

// Add Stdent 
studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    teacher: { id: parseInt(document.getElementById("teacherSelect").value) },
    course: { id: parseInt(document.getElementById("courseSelect").value) }
  };

  try {
    if (editMode && editingId) {
      //  UPDATE EXISTING STUDENT
      await axios.put(`${baseURL}/students/${editingId}`, studentData);
      alert("Student updated successfully!");
      editMode = false;
      editingId = null;
      document.querySelector("#studentForm button").textContent = "Add Student";
    } else {
      // ➕ ADD NEW STUDENT
      await axios.post(`${baseURL}/students`, studentData);
      alert("Student added successfully!");
    }

    studentForm.reset();
    loadStudents();

  } catch (err) {
    console.error("Error submitting student:", err);
    alert("Failed to submit student");
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
async function editStudent(id) {
  try {
    const res = await axios.get(`${baseURL}/students/${id}`);
    const s = res.data;

    // populate form fields
    document.getElementById("name").value = s.name;
    document.getElementById("email").value = s.email;
    document.getElementById("phone").value = s.phone;
    document.getElementById("address").value = s.address;

    // you can’t select by name, so match teacher/course by name if available
    const teacherOption = [...teacherSelect.options].find(opt => opt.text === s.teacherName);
    if (teacherOption) teacherSelect.value = teacherOption.value;

    const courseOption = [...courseSelect.options].find(opt => opt.text === s.coursesName);
    if (courseOption) courseSelect.value = courseOption.value;

    // switch mode
    editMode = true;
    editingId = id;

    // change button text
    document.querySelector("#studentForm button").textContent = "Update Student";
  } catch (err) {
    console.error("Error fetching student for edit:", err);
  }
}

// delete student
async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;
  try {
    await axios.delete(`${baseURL}/students/${id}`);
    alert("Student deleted successfully!");
    loadStudents();
  } catch (err) {
    console.error("Error deleting student:", err);
    alert("Failed to delete student");
  }
}

loadDropdowns();
loadStudents();
