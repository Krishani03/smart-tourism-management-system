// guide_dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    initGuideDashboard();
});

async function initGuideDashboard() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById('guide-name').innerText = username;
    loadAssignedTours(username, token);
}

// 1. Fetch TourPackages (Entity #3) linked to this Guide
async function loadAssignedTours(username, token) {
    try {
        const response = await fetch(`${BASE_URL}/tours/guide/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const tours = await response.json();
            renderGuideTours(tours);
        }
    } catch (err) {
        console.error("Failed to load tours:", err);
    }
}

function renderGuideTours(tours) {
    const container = document.getElementById('guide-tours-container');
    if (tours.length === 0) {
        container.innerHTML = "<div class='card'>No tours assigned to you yet.</div>";
        return;
    }

    container.innerHTML = tours.map(tour => `
        <div class="card">
            <h3>🌴 ${tour.title}</h3>
            <p><strong>Category:</strong> ${tour.category ? tour.category.name : 'General'}</p>
            <p><strong>Location:</strong> ${tour.location ? tour.location.cityName : 'N/A'}</p>
            <p><strong>Capacity:</strong> ${tour.currentBookings} / ${tour.maxCapacity}</p>
            <button onclick="viewTravelers(${tour.id}, '${tour.title}')" class="btn-view">View Passenger List</button>
        </div>
    `).join('');
}

// 2. Fetch Bookings (Entity #4) for a specific Tour
async function viewTravelers(tourId, tourTitle) {
    const token = localStorage.getItem('token');
    const section = document.getElementById('traveler-section');
    const container = document.getElementById('travelers-container');
    const title = document.getElementById('traveler-title');

    try {
        // We will assume you have a backend endpoint to find bookings by tourId
        const response = await fetch(`${BASE_URL}/bookings/tour/${tourId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const bookings = await response.json();
            section.classList.remove('hidden');
            title.innerText = `📋 Passenger List for: ${tourTitle}`;

            if (bookings.length === 0) {
                container.innerHTML = "<p>No bookings for this tour yet.</p>";
                return;
            }

            container.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Group Size</th>
                            <th>Booking Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(b => `
                            <tr>
                                <td>${b.user.username}</td>
                                <td>${b.numberOfPeople} People</td>
                                <td>${new Date(b.bookingDate).toLocaleDateString()}</td>
                                <td>${b.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            // Scroll to the list
            section.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (err) {
        console.error("Error loading travelers:", err);
    }
}