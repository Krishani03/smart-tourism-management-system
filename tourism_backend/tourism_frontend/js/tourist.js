async function handleSmartSearch() {
    const username = localStorage.getItem('username');
    const query = document.getElementById('searchInput').value;

    if (!query) return;

    try {
        await fetch(`${BASE_URL}/recommendations/search?username=${username}&query=${query}`, {
            method: 'POST'
        });

        if (typeof loadRecommendations === "function") {
            loadRecommendations();
        }
    } catch (error) {
        console.error("Search tracking failed", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.addEventListener('click', handleSmartSearch);
});