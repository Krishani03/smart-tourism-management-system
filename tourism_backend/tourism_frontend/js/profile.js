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


async function generateReceipt(bookingId) {
    try {
        const response = await fetch(`${BASE_URL}/bookings/user/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Fetch failed");

        const bookings = await response.json();

        const b = bookings.find(item => item.id === bookingId);

        if (!b) {
            alert("Booking not found.");
            return;
        }

        const receiptContent = `
            ==========================================
                 SMART TOURISM - OFFICIAL RECEIPT
            ==========================================
            DATE: ${new Date().toLocaleDateString()}
            RECEIPT NO: RECP-${b.id}-${Math.floor(Math.random() * 1000)}
            ------------------------------------------
            CUSTOMER DETAILS:
            Username: ${username}
            
            TOUR DETAILS:
            Package:  ${b.tourPackage.title}
            Location: ${b.tourPackage.location?.cityName || 'Sri Lanka'}
            Category: ${b.tourPackage.category?.name || 'General'}
            
            BOOKING DETAILS:
            No. of Travelers: ${b.numberOfPeople}
            Booking Status:   ${b.status}
            ------------------------------------------
            TOTAL PAID:       LKR ${b.totalAmount.toLocaleString()}
            ==========================================
            Thank you for exploring Sri Lanka with us!
            ==========================================
        `;

        const printWindow = window.open('', '_blank', 'width=600,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Receipt - #${b.id}</title>
                    <style>
                        body { font-family: 'Courier New', Courier, monospace; padding: 40px; line-height: 1.6; }
                        pre { white-space: pre-wrap; word-wrap: break-word; font-size: 14px; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <pre>${receiptContent}</pre>
                    <button class="no-print" onclick="window.print()" style="margin-top:20px; padding:10px 20px; cursor:pointer;">
                        🖨️ Click to Print Receipt
                    </button>
                </body>
            </html>
        `);
        printWindow.document.close();

    } catch (err) {
        console.error(err);
        alert("Could not generate receipt. Please try again.");
    }
}

function openReviewModal(tourId, tourTitle) {
    document.getElementById('reviewTourId').value = tourId;
    document.getElementById('reviewTourTitle').innerText = "Review for: " + tourTitle;
    document.getElementById('reviewModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('reviewModal').classList.add('hidden');
}

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
        window.location.href = "profile.html";
        location.reload();
    } else {
        alert("Failed to submit review.");
    }
}