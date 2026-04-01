const BASE_URL = "http://localhost:8080/api/v1";
let isEditMode = false;
let editTourId = null;

async function loadAdminTours() {
    const container = document.getElementById('admin-tour-list');
    if (!container) return;

    const response = await fetch(`${BASE_URL}/tours`);
    if (response.ok) {
        const tours = await response.json();
        container.innerHTML = tours.map(t => `
            <div class="card" style="border-left: 5px solid #007bff; margin-bottom: 15px; padding: 15px;">
                <h4>${t.title}</h4>
                <p>ID: ${t.id} | Base Price: LKR ${t.basePrice}</p>
                <button onclick="editTour(${t.id})" class="btn-review">Edit</button>
                <button onclick="deleteTour(${t.id})" class="btn-logout">Delete</button>
            </div>
        `).join('');
    }
}

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

    const url = isEditMode ? `${BASE_URL}/tours/${editTourId}` : `${BASE_URL}/tours`;
    const method = isEditMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tourData)
    });

    if (response.ok) {
        alert(isEditMode ? "Tour Updated!" : "Tour Created!");
        location.reload();
    }
}

async function deleteTour(id) {
    if (!confirm("Delete this package?")) return;
    const token = localStorage.getItem('token');
    await fetch(`${BASE_URL}/tours/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadAdminTours();
}

document.addEventListener('DOMContentLoaded', loadAdminTours);