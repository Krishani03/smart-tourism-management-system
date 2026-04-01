const BASE_URL = "http://localhost:8080/api/v1";

async function submitRegistration() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const msg = document.getElementById('reg-msg');

    try {
        const response = await fetch(`${BASE_URL}/auth/register`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        if (response.ok) {
            alert("Registration Successful!");
            window.location.href = "login.html";
        } else {
            msg.innerText = "Error: Registration failed.";
        }
    } catch (error) {
        msg.innerText = "Backend Server Offline!";
    }
}

async function handleLogin() {
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;

    try {
        const response = await fetch(`${BASE_URL}/auth/login`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userVal, password: passVal })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', userVal);

            const userLower = userVal.toLowerCase();
            if (userLower.includes("admin")) window.location.href = "admin.html";
            else if (userLower.includes("guide")) window.location.href = "guide_dashboard.html";
            else window.location.href = "dashboard.html";
        } else {
            alert("Invalid Credentials!");
        }
    } catch (error) {
        alert("Server Error!");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}