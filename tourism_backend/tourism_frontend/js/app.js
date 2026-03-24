const BASE_URL = "http://localhost:8080/api/v1";


async function submitRegistration() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const msg = document.getElementById('reg-msg');

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        if (response.ok) {
            alert("Registration Successful! Please Login.");
            window.location.href = "login.html";
        } else {
            const errorText = await response.text();
            msg.innerText = "Error: " + errorText;
        }
    } catch (error) {
        msg.innerText = "Cannot connect to Backend Server!";
        console.error(error);
    }
}

async function handleLogin() {
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userVal, password: passVal })
        });

        if (response.ok) {
            const data = await response.json();

            // Save credentials
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', userVal);

            alert("Login Successful!");

            const userLower = userVal.toLowerCase();
            if (userLower.includes("admin")) {
                window.location.href = "admin.html";
            } else if (userLower.includes("guide")) {
                window.location.href = "guide_dashboard.html";
            } else {
                window.location.href = "dashboard.html";
            }

        } else {
            alert("Invalid Username or Password!");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Server is down. Make sure Spring Boot is running on port 8080!");
    }

}

async function addNewTour() {
    const token = localStorage.getItem('token');

    const tourData = {
        title: document.getElementById('tour-title').value,
        startDestination: document.getElementById('tour-start').value,
        description: document.getElementById('tour-desc').value,
        guideUsername: document.getElementById('tour-guide').value,
        basePrice: document.getElementById('tour-price').value,
        maxCapacity: document.getElementById('tour-capacity').value
    };

    try {
        const response = await fetch(`${BASE_URL}/tours`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tourData)
        });

        if (response.ok) {
            alert("Tour Package Created Successfully!");
            window.location.href = "dashboard.html";
        } else if (response.status === 403) {
            alert("Access Denied: You do not have Admin permissions!");
        } else {
            alert("Failed to create tour. Check your inputs.");
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}


function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}