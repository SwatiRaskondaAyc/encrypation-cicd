async function fetchAllNews() {
    const JSON_URL = 'news-data.json'; // Path to your JSON file

    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Assuming data.data contains the array of news articles
        const newsArray = data.data || [];
        renderAllNews(newsArray);
    } catch (error) {
        console.error('Error fetching all news:', error);
    }
}

function renderAllNews(newsArray) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Clear existing news

    newsArray.forEach(newsItem => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <h2 class="news-title">${newsItem.title}</h2>
            <p class="news-summary">${newsItem.summary || 'No summary available.'}</p>
            <p>${newsItem.content || 'No content available.'}</p>
            <a href="${newsItem.link || '#'}" class="read-more-btn" target="_blank">Read Full Article</a>
        `;
        newsContainer.appendChild(newsCard);
    });
}

// Fetch all news on page load
fetchAllNews();
