let isEditMode = false;
let editTourId = null;

async function loadAdminTours() {
    const container = document.getElementById('admin-tour-list');
    if (!container) return;

    try {
        const response = await fetch(`${BASE_URL}/tours`);

        if (response.ok) {
            const tours = await response.json();

            if (tours.length === 0) {
                container.innerHTML = "<p>No packages found in the database.</p>";
                return;
            }

            container.innerHTML = tours.map(t => `
                <div class="card" style="border-left: 5px solid #007bff; margin-bottom: 15px; padding: 15px; background: white;">
                    <h4>${t.title ?? "Untitled Tour"}</h4>
                    <p>ID: ${t.id} | Base Price: LKR ${t.basePrice ?? 0}</p>
                    <p style="font-size: 0.85em; color: #666;">
                        Location: ${t.location?.cityName ?? "Not Set"} | 
                        Category: ${t.category?.name ?? "Not Set"}
                    </p>
                    <div style="margin-top: 10px;">
                        <button onclick="editTour(${t.id})" class="btn-review">Edit</button>
                        <button onclick="deleteTour(${t.id})" class="btn-logout">Delete</button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = "<p style='color:red;'>Failed to load tours from server.</p>";
        }
    } catch (error) {
        console.error("Critical Load Error:", error);
        container.innerHTML = "<p style='color:red;'>JSON Error: Check backend for Circular Dependencies.</p>";
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

async function editTour(id) {
    try {
        // 1. Fetch the specific TourPackage by ID
        const response = await fetch(`${BASE_URL}/tours/${id}`);
        if (!response.ok) throw new Error("Failed to fetch tour details");

        const t = await response.json();
        document.getElementById('tour-title').value = t.title ?? "";
        document.getElementById('tour-desc').value = t.description ?? "";
        document.getElementById('tour-price').value = t.basePrice ?? "";
        document.getElementById('tour-capacity').value = t.maxCapacity ?? "";

        document.getElementById('tour-category').value = t.category?.id ?? "";
        document.getElementById('tour-location').value = t.location?.id ?? "";

        document.getElementById('tour-guide').value = t.assignedGuide?.username ?? "";

        isEditMode = true;
        editTourId = id;

        const submitBtn = document.querySelector('.btn-save');
        if (submitBtn) {
            submitBtn.innerText = "🆙 Update Package";
            submitBtn.style.backgroundColor = "#28a745"; // Optional: Change color to green for edit
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error("Error in editTour:", error);
        alert("Could not load tour details. Check the browser console for errors.");
    }
}

document.addEventListener('DOMContentLoaded', loadAdminTours);