const BASE_URL = "http://localhost:8080/api/v1";

// Global state to track if we are editing an existing tour
let isEditMode = false;
let editTourId = null;

// --- 1. AUTHENTICATION (Login & Register) ---

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

            // Save for API calls and personalization
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', userVal);

            // Logic-based routing
            const userLower = userVal.toLowerCase();
            if (userLower.includes("admin")) {
                window.location.href = "admin.html";
            } else if (userLower.includes("guide")) {
                window.location.href = "guide_dashboard.html";
            } else {
                window.location.href = "dashboard.html";
            }
        } else {
            alert("Invalid Credentials!");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Server Error! Ensure backend is running on 8080.");
    }
}

// --- 2. ADMIN: MANAGE TOURS (Full CRUD Logic) ---

// Load all tours for the Admin list
async function loadAdminTours() {
    const container = document.getElementById('admin-tour-list');
    if (!container) return; // Prevent errors if not on Admin page

    try {
        const response = await fetch(`${BASE_URL}/tours`);
        if (response.ok) {
            const tours = await response.json();
            container.innerHTML = tours.map(t => `
                <div class="card" style="border-left: 5px solid #007bff; margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px;">
                    <h4>${t.title}</h4>
                    <p>ID: ${t.id} | Base Price: LKR ${t.basePrice} | Current: LKR ${t.currentPrice}</p>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="editTour(${t.id})" style="background: #ffc107; color: black; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Edit</button>
                        <button onclick="deleteTour(${t.id})" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error("Failed to fetch tours:", error);
    }
}

// Create or Update a Tour
async function addNewTour() {
    const token = localStorage.getItem('token');

    const tourData = {
        title: document.getElementById('tour-title').value,
        description: document.getElementById('tour-desc').value,
        basePrice: document.getElementById('tour-price').value,
        maxCapacity: document.getElementById('tour-capacity').value,
        categoryId: document.getElementById('tour-category').value,
        locationId: document.getElementById('tour-location').value,
        guideUsername: document.getElementById('tour-guide').value
    };

    // Determine method and URL based on Mode (New vs Update)
    const url = isEditMode ? `${BASE_URL}/tours/${editTourId}` : `${BASE_URL}/tours`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tourData)
        });

        if (response.ok) {
            alert(isEditMode ? "Tour Updated Successfully!" : "Tour Created with Smart Linking!");
            resetAdminForm();
            loadAdminTours();
        } else {
            alert("Action failed. Ensure Category/Location IDs exist.");
        }
    } catch (error) {
        console.error("Save error:", error);
    }
}

// Prepare the form for Editing
async function editTour(id) {
    try {
        const response = await fetch(`${BASE_URL}/tours/${id}`);
        if (response.ok) {
            const t = await response.json();

            // Populate form fields
            document.getElementById('tour-title').value = t.title;
            document.getElementById('tour-desc').value = t.description;
            document.getElementById('tour-price').value = t.basePrice;
            document.getElementById('tour-capacity').value = t.maxCapacity;
            document.getElementById('tour-category').value = t.category ? t.category.id : '';
            document.getElementById('tour-location').value = t.location ? t.location.id : '';
            document.getElementById('tour-guide').value = t.assignedGuide ? t.assignedGuide.username : '';

            // Update UI State
            isEditMode = true;
            editTourId = id;

            const submitBtn = document.querySelector('.btn-save');
            if (submitBtn) submitBtn.innerText = "🆙 Update Package";

            // Scroll to form smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Delete a Tour
async function deleteTour(id) {
    if (!confirm("Are you sure you want to delete this package?")) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BASE_URL}/tours/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert("Tour Deleted Successfully");
            loadAdminTours();
        } else {
            alert("Delete failed. Check if this tour has existing bookings.");
        }
    } catch (error) {
        console.error("Delete error:", error);
    }
}

// Reset form back to "Create" mode
function resetAdminForm() {
    isEditMode = false;
    editTourId = null;
    document.querySelectorAll('.card input, .card textarea').forEach(el => el.value = '');
    const submitBtn = document.querySelector('.btn-save');
    if (submitBtn) submitBtn.innerText = "🚀 Publish Package";
}

// --- 3. TOURIST: SMART SEARCH & RECOMMENDATIONS ---

async function handleSmartSearch() {
    const username = localStorage.getItem('username');
    const query = document.getElementById('searchInput').value;

    if (!query) return;

    try {
        // Track the search in SearchHistory (Entity #9)
        await fetch(`${BASE_URL}/recommendations/search?username=${username}&query=${query}`, {
            method: 'POST'
        });

        // Refresh recommendations if the function exists on the current page
        if (typeof loadRecommendations === "function") {
            loadRecommendations();
        }
        console.log("Search history updated for: " + query);
    } catch (error) {
        console.error("Search tracking failed", error);
    }
}

// --- 4. GLOBAL UTILITIES ---

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// Auto-run when page loads
document.addEventListener('DOMContentLoaded', () => {
    // If we are on the admin page, load the tour list automatically
    if (document.getElementById('admin-tour-list')) {
        loadAdminTours();
    }

    // Bind search button if it exists
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSmartSearch);
    }
});