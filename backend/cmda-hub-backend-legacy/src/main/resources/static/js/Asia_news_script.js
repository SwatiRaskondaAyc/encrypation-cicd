const allArticles = JSON.parse(localStorage.getItem('asiaPacificArticles')) || [];

function displayAllArticles() {
    const newsContainer = document.getElementById('news-articles');
    newsContainer.innerHTML = '';

    allArticles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';
        articleElement.innerHTML = `
            <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
            ${article.urlToImage ? `<img src="${article.urlToImage}" alt="News Image" class="news-image">` : ''}
            ${article.videoUrl ? `<iframe src="${article.videoUrl}" class="news-video" frameborder="0" allowfullscreen></iframe>` : ''}
            <p>${article.description}</p>
            <p><small>Source: ${article.source.name} | Published: ${new Date(article.publishedAt).toLocaleString()}</small></p>
        `;
        newsContainer.appendChild(articleElement);
    });
}

// Event listener for the Back button
document.getElementById('back-btn').addEventListener('click', () => {
    window.history.back();
});

// Display all articles when the page loads
document.addEventListener("DOMContentLoaded", displayAllArticles);
