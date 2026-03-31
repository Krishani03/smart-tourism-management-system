// login.js
const LOGIN_URL = "http://localhost:8080/api/v1/auth/login";

async function handleLogin() {
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;

    if (!userVal || !passVal) {
        alert("Please enter both username and password.");
        return;
    }

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userVal, password: passVal })
        });

        if (response.ok) {
            const data = await response.json(); // This contains your AuthResponseDTO {token: "..."}

            // 1. Save Token & Username (Required for Smart Search)
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', userVal);

            alert("Login Successful! Redirecting...");

            // 2. Logic-Based Routing
            // In a real app, your AuthResponseDTO should return the Role.
            // For now, we use your username-based logic:
            const name = userVal.toLowerCase();
            if (name.includes("admin")) {
                window.location.href = "admin.html";
            } else if (name.includes("guide")) {
                window.location.href = "guide_dashboard.html";
            } else {
                window.location.href = "dashboard.html";
            }
        } else {
            alert("Invalid Credentials. Please try again.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Connection failed. Is the Backend running on Port 8080?");
    }
}