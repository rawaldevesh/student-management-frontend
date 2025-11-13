const baseURL = "http://localhost:9999/api"; // your backend endpoint
const tableBody = document.querySelector("#CourseTable tbody");
const courseForm = document.querySelector("#courseForm");
const teacherSelect = document.querySelector("#teacherSelect");
const departmentSelect = document.querySelector("#departmentSelect");
const searchInput = document.querySelector("#searchInput");

// Function to fetch and display all students
async function loadCourses() {
  try {
    const response = await axios.get(`${baseURL}/courses`);
    const courses = response.data;

    // Clear old rows
    tableBody.innerHTML = "";

    // Loop through each student and create a table row
    courses.forEach((course) => {
      const row = `
        <tr>
          <td>${course.id}</td>
          <td>${course.courseName}</td>
          <td>${course.duration}</td>
     
          <td>${course.teacherName || "-"}</td>
          <td>${course.departmentName || "-"}</td>
          <td>
            <button onclick="editCourse(${course.id})">Edit</button>
            <button onclick="deleteCourse(${course.id})">Delete</button>
          </td>
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

//list of teacher and department
async function loadDropdowns() {
  try {
    const teachers = await axios.get(`${baseURL}/teachers`);
    const departments = await axios.get(`${baseURL}/departments`);

    teachers.data.forEach((t) => {
      const option = document.createElement("option");
      option.value = t.id;
      option.textContent = t.name;
      teacherSelect.appendChild(option);
    });

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

//update or edit course
async function editCourse(id) {
  try {
    const response = await axios.get(`${baseURL}/courses/${id}`);
    const course = response.data;

    document.getElementById("name").value = course.courseName;
    document.getElementById("duration").value = course.duration;

    const teacherOption = [...teacherSelect.options].find(
      (opt) => opt.text === course.teacherName
    );
    if (teacherOption) teacherSelect.value = teacherOption.value;

    const departmentOption = [...departmentSelect.options].find(
      (opt) => opt.text === course.departmentName
    );
    if (departmentOption) departmentSelect.value = departmentOption.value;

    editMode = true;
    editingId = id;

    document.querySelector("#courseForm button").textContent = "Update Course";
  } catch (error) {
    console.error("Error fetching course:", error);
    alert("Failed to load course data for editing.");
  }
}

//add course
courseForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const courseData = {
    courseName: document.getElementById("name").value,
    duration: document.getElementById("duration").value,
    teacher: { id: parseInt(document.getElementById("teacherSelect").value) },
    department: {
      id: parseInt(document.getElementById("departmentSelect").value),
    },
  };

  try {
    if (editMode && editingId) {
      // UPDATE
      await axios.put(`${baseURL}/courses/${editingId}`, courseData);
      alert("Course updated successfully!");
      editMode = false;
      editingId = null;
      document.querySelector("#courseForm button").textContent = "Add Course";
    } else {
      // ADD NEW
      await axios.post(`${baseURL}/courses`, courseData);
      alert("Course added successfully!");
    }
    courseForm.reset();
    loadCourses();
  } catch (err) {
    console.error("Error submitting Course:", err);
    alert("Failed to submit Course");
  }
});

//delete course
async function deleteCourse(id) {
  if (!confirm("Are you sure you want to delete this course?")) return;
  try {
    await axios.delete(`${baseURL}/courses/${id}`);
    alert("Course deleted successfully!");
    loadCourses();
  } catch (error) {
    console.error("Error deleting course:", error);
    alert("Failed to delete course.");
  }
}

loadDropdowns();
// Run when page loads
loadCourses();
