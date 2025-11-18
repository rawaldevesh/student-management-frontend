const baseURL = "http://localhost:9999/api"; // your backend endpoint
const tableBody = document.querySelector("#UserTable tbody");
const userForm = document.querySelector("#userForm");
// Function to fetch and display all students
async function loadUsers() {
  try {
    const response = await axios.get(`${baseURL}/users`);
    const users = response.data;

    // Clear old rows
    tableBody.innerHTML = "";

    // Loop through each student and create a table row
    users.forEach((user) => {
      const row = `
        <tr>
          <td>${user.id}</td>
          <td>${user.userName}</td>
          <td>${user.password}</td>
          <td>
            <button id ="action" onclick="editUser(${user.id})">Edit</button>
            <button class = "delete" onclick="deleteUsers(${user.id})">Delete</button>
          </td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error fetching Users:", error);
    tableBody.innerHTML = `
      <tr><td colspan="8" style="color:red;">Failed to load User</td></tr>
    `;
  }
}

//add user
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    userName: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  try {
    if (editMode && editingId) {
      //  UPDATE
      await axios.put(`${baseURL}/users/${editingId}`, userData);
      alert("User updated successfully!");
      editMode = false;
      editingId = null;
      document.querySelector("#userForm button").textContent = "Add User";
    } else {
      //ADD NEW
      await axios.post(`${baseURL}/users/register`, userData);
      alert("users added successfully!");
    }

    userForm.reset();
    loadUsers();
  } catch (err) {
    console.error("Error submitting users:", err);
    alert("Failed to submit users");
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
async function editUser(id) {
  try {
    const res = await axios.get(`${baseURL}/users/${id}`);
    const s = res.data;

    // populate form fields
    document.getElementById("username").value = s.userName;
    document.getElementById("password").value = s.password;

    // switch mode
    editMode = true;
    editingId = id;

    // change button text
    document.querySelector("#userForm button").textContent = "Update Users";
  } catch (err) {
    console.error("Error fetching Users for edit:", err);
  }
}

// delete user
async function deleteUsers(id) {
  if (!confirm("Are you sure you want to delete this Users?")) return;
  try {
    await axios.delete(`${baseURL}/users/${id}`);
    alert("User deleted successfully!");
    loadUsers();
  } catch (err) {
    console.error("Error deleting Users:", err);
    alert("Failed to delete Users");
  }
}

// check login status
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  // if not logged in, redirect to login
  window.location.href = "../Home/login.html";
}
// } else {
//   document.getElementById("username").textContent = user.userName;
// }

// handle logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  alert("You have been logged out.");
  window.location.href = "../Home/login.html";
});

// Run when page loads
loadUsers();
