// profile.js
const username = localStorage.getItem('username');
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    loadBookings();
    loadSearchHistory();
});

async function loadBookings() {
    try {
        const response = await fetch(`${BASE_URL}/bookings/user/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookings = await response.json();
        const tbody = document.getElementById('booking-table-body');

        tbody.innerHTML = bookings.map(b => `
            <tr>
                <td>${b.tourPackage.title}</td>
                <td>${b.numberOfPeople}</td>
                <td>LKR ${b.totalAmount}</td>
                <td class="status-${b.status.toLowerCase()}">${b.status}</td>
                <td>
                    <button onclick="generateReceipt(${b.id})" class="btn-receipt">📄 Receipt</button>
                    ${b.status === 'CONFIRMED' ? `<button onclick="openReviewModal(${b.tourPackage.id}, '${b.tourPackage.title}')" class="btn-review">⭐ Review</button>` : ''}
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Failed to load bookings", err);
    }
}

async function loadSearchHistory() {
    try {
        // This endpoint links to your RecommendationController
        const response = await fetch(`${BASE_URL}/recommendations/history/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const history = await response.json();
        const list = document.getElementById('search-history-list');

        list.innerHTML = history.map(h => `
            <li>
                <strong>"${h.searchTerm}"</strong> - searched on ${new Date(h.searchDate).toLocaleDateString()}
            </li>
        `).join('');
    } catch (err) {
        console.error("Failed to load search history", err);
    }
}

// profile.js Add-on

// 1. GENERATE RECEIPT (Uses Payment & Booking entities)
async function generateReceipt(bookingId) {
    try {
        // Fetch specific booking to get full details
        const response = await fetch(`${BASE_URL}/bookings/user/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookings = await response.json();
        const b = bookings.find(item => item.id === bookingId);

        const receiptHTML = `
            ------------------------------------
            SMART TOURISM - OFFICIAL RECEIPT
            ------------------------------------
            Booking ID: ${b.id}
            Customer: ${username}
            Tour: ${b.tourPackage.title}
            Travelers: ${b.numberOfPeople}
            Total Paid: LKR ${b.totalAmount}
            Status: ${b.status}
            ------------------------------------
            Thank you for exploring Sri Lanka!
        `;

        alert(receiptHTML); // Simplified receipt. In real app, use window.print()
    } catch (err) {
        alert("Could not generate receipt.");
    }
}

// 2. REVIEW MODAL LOGIC
function openReviewModal(tourId, tourTitle) {
    document.getElementById('reviewTourId').value = tourId;
    document.getElementById('reviewTourTitle').innerText = "Review for: " + tourTitle;
    document.getElementById('reviewModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('reviewModal').classList.add('hidden');
}

// 3. SUBMIT REVIEW (Matches ReviewDTO.java)
async function submitReview() {
    const tourId = document.getElementById('reviewTourId').value;
    const rating = document.getElementById('ratingSelect').value;
    const comment = document.getElementById('commentText').value;

    const reviewData = {
        tourId: parseInt(tourId),
        username: username,
        rating: parseInt(rating),
        comment: comment
    };

    const response = await fetch(`${BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
    });

    if (response.ok) {
        alert("Review Submitted! Popularity Score Updated.");
        closeModal();
        location.reload(); // Refresh to show popularity change
    } else {
        alert("Failed to submit review.");
    }
}