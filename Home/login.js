const baseURL = "http://localhost:9999/api/users";

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await axios.post(`${baseURL}/login`, {
      userName: username,
      password: password,
    });

    // save user data
    localStorage.setItem("user", JSON.stringify(res.data));

    // redirect to student index page
    window.location.href = "../User/user.html";
  } catch (err) {
    console.error(err);
    errorMsg.textContent = err.response?.data?.error || "Invalid login!";
  }
});
