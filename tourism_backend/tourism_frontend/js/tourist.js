// tourist.js - Dashboard Logic for Tourist Entity
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

/**
 * 1. Load All Trending Packages (Entity #3)
 * Populates the 'tourContainer' with global packages.
 */
async function loadAllTours() {
    const container = document.getElementById('tourContainer');
    if (!container) return;

    try {
        const response = await fetch(`${BASE_URL}/tours`);
        if (response.ok) {
            const tours = await response.json();

            if (tours.length === 0) {
                container.innerHTML = "<p>No trending tours found.</p>";
                return;
            }

            container.innerHTML = tours.map(t => `
                <div class="card">
                    <div class="card-content">
                        <span class="popularity">🔥 Popularity: ${t.popularityScore?.toFixed(1) || '0.0'}</span>
                        <h3 style="margin: 10px 0;">${t.title}</h3>
                        <p style="color: #6c757d; font-size: 0.9rem;">${t.description.substring(0, 90)}...</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                            <span class="price">LKR ${t.currentPrice}</span>
                            <button onclick="bookTour(${t.id})" style="background: #1e3c72; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer;">View Details</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error("Error loading tours:", error);
    }
}

/**
 * 2. Smart Search Tracking (Entity #9)
 * Sends the query to the backend and then refreshes the recommendations.
 */
async function handleSmartSearch() {
    const query = document.getElementById('searchInput').value;
    if (!query || !token) return;

    try {
        const response = await fetch(`${BASE_URL}/recommendations/search?username=${username}&query=${query}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            console.log("Preference updated for:", query);
            loadRecommendations(); // Immediately refresh the top section
        }
    } catch (error) {
        console.error("Search tracking failed:", error);
    }
}

/**
 * 3. Load Recommendations (Entity #11)
 * Uses your #recommendationWrapper and .hidden classes.
 */
async function loadRecommendations() {
    const wrapper = document.getElementById('recommendationWrapper');
    const container = document.getElementById('recommendationContainer');
    if (!container || !token) return;

    try {
        const response = await fetch(`${BASE_URL}/recommendations/user/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const recommended = await response.json();

            if (recommended.length > 0) {
                wrapper.classList.remove('hidden'); // Show the yellow dashed section
                container.innerHTML = recommended.map(t => `
                    <div class="card" style="border: 1px solid var(--warning);">
                        <div class="card-content">
                            <span style="color: var(--warning); font-weight: 600; font-size: 0.8rem;">✨ MATCHED FOR YOU</span>
                            <h3 style="margin: 5px 0;">${t.title}</h3>
                            <span class="price">LKR ${t.currentPrice}</span>
                            <button onclick="bookTour(${t.id})" style="width: 100%; margin-top: 15px; background: var(--warning); border: none; padding: 10px; border-radius: 10px; font-weight: 600; cursor: pointer;">Book Special Offer</button>
                        </div>
                    </div>
                `).join('');
            } else {
                wrapper.classList.add('hidden');
            }
        }
    } catch (error) {
        console.error("Error loading recommendations:", error);
    }
}

// 4. Booking Redirect
function bookTour(tourId) {
    window.location.href = `booking.html?tourId=${tourId}`;
}

// 5. Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Safety check: redirect to login if no token found
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadAllTours();
    loadRecommendations();

    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.addEventListener('click', handleSmartSearch);
});