async function submitRegistration() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const msg = document.getElementById('reg-msg');

    const userData = {
        username: username,
        password: password,
        role: role
    };

    try {
        const response = await fetch('http://localhost:8080/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert("Registration Successful! Please Login.");
            window.location.href = "login.html"; // Redirect to login
        } else {
            const errorText = await response.text();
            msg.innerText = "Error: " + errorText;
        }
    } catch (error) {
        console.error("Connection Error:", error);
        msg.innerText = "Cannot connect to Backend Server!";
    }
}