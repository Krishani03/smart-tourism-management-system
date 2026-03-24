
window.onload = async () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById('guide-name').innerText = username;

    try {
        const response = await fetch(`${BASE_URL}/tours/guide/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const tours = await response.json();
        renderGuideTours(tours);
    } catch (err) {
        console.error("Error:", err);
    }
};

function renderGuideTours(tours) {
    const container = document.getElementById('guide-tours-container');
    if (tours.length === 0) {
        container.innerHTML = "<p>No tours assigned yet.</p>";
        return;
    }

    container.innerHTML = tours.map(tour => `
        <div class="assignment-card">
            <h3>🌴 ${tour.title}</h3>
            <p>${tour.description}</p>
            <button onclick="viewPassengers(${tour.id})" class="btn-view">View Travelers</button>
        </div>
    `).join('');
}