const BASE_URL = "http://localhost:8080/api/v1";

// 1. REGISTER LOGIC
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

// 2. SMART LOGIN LOGIC
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

            // SAVE THE KEY CARD (JWT Token)
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', userVal);

            alert("Login Successful!");

            // --- SMART REDIRECT ---
            // Check if the username contains "admin" (case insensitive)
            if (userVal.toLowerCase().includes("admin")) {
                window.location.href = "admin.html";
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

// 3. ADMIN: ADD NEW TOUR LOGIC (Use this in admin.html)
async function addNewTour() {
    const token = localStorage.getItem('token');

    // Ensure all these IDs exist in your admin.html form
    const tourData = {
        title: document.getElementById('tour-title').value,
        description: document.getElementById('tour-desc').value,
        basePrice: document.getElementById('tour-price').value,
        maxCapacity: document.getElementById('tour-capacity').value
    };

    try {
        const response = await fetch(`${BASE_URL}/tours`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send the JWT for security
            },
            body: JSON.stringify(tourData)
        });

        if (response.ok) {
            alert("Tour Package Created Successfully!");
            window.location.href = "dashboard.html"; // Go see the result
        } else if (response.status === 403) {
            alert("Access Denied: You do not have Admin permissions!");
        } else {
            alert("Failed to create tour. Check your inputs.");
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

// 4. LOGOUT LOGIC
function logout() {
    localStorage.clear(); // Clear token and username
    window.location.href = "login.html";
}