// register.js
const REGISTER_URL = "http://localhost:8080/api/v1/auth/register";

async function submitRegistration() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const msg = document.getElementById('reg-msg');

    if (!username || !password) {
        msg.innerText = "Username and Password are required!";
        return;
    }

    try {
        const response = await fetch(REGISTER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
                role: role
            })
        });

        if (response.ok) {
            alert("Registration Successful! Redirecting to Login...");
            window.location.href = "login.html";
        } else {
            const errorText = await response.text();
            msg.innerText = "Error: " + errorText;
        }
    } catch (error) {
        msg.innerText = "Backend Server is Offline!";
        console.error(error);
    }
}