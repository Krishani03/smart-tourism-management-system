const BASE_URL = "http://localhost:8080/api/v1";

// --- AUTHENTICATION ---

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
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userVal, password: passVal })
        });

        if (response.ok) {
            const data = await response.json();

            // CRITICAL: Save both token and username for Smart Features
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', userVal);

            const role = passVal.toLowerCase(); // Temporary role check or get from data.role
            if (userVal.includes("admin")) window.location.href = "admin.html";
            else if (userVal.includes("guide")) window.location.href = "guide_dashboard.html";
            else window.location.href = "dashboard.html";

        } else {
            alert("Invalid Credentials!");
        }
    } catch (error) {
        alert("Server Error!");
    }
}

// --- ADMIN: CREATE TOUR (Upgraded for Category/Location) ---

async function addNewTour() {
    const token = localStorage.getItem('token');

    // Matches your TourRequestDTO
    const tourData = {
        title: document.getElementById('tour-title').value,
        description: document.getElementById('tour-desc').value,
        basePrice: document.getElementById('tour-price').value,
        maxCapacity: document.getElementById('tour-capacity').value,
        categoryId: document.getElementById('tour-category').value, // Entity #5
        locationId: document.getElementById('tour-location').value, // Entity #6
        guideUsername: document.getElementById('tour-guide').value  // Entity #1
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
            alert("Tour Created with Smart Linking!");
            window.location.href = "admin.html";
        } else {
            alert("Error creating tour. Ensure Category/Location IDs exist.");
        }
    } catch (error) {
        console.error(error);
    }
}

// --- TOURIST: SMART SEARCH & RECOMMENDATIONS (Entity #9) ---

async function handleSmartSearch() {
    const username = localStorage.getItem('username');
    const query = document.getElementById('searchInput').value;

    if (!query) return;

    try {
        // 1. Train the Recommendation Engine (Save Search History)
        await fetch(`${BASE_URL}/recommendations/search?username=${username}&query=${query}`, {
            method: 'POST'
        });

        // 2. Refresh the UI (This calls your loadRecommendations in dashboard.js)
        if (typeof loadRecommendations === "function") {
            loadRecommendations();
        }

        console.log("Search history updated for: " + query);
    } catch (error) {
        console.error("Search tracking failed", error);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}