const articles = JSON.parse(localStorage.getItem('leaMarketArticles')) || [];
const additionalArticlesDiv = document.getElementById('additional-articles');

function displayAllArticles() {
    additionalArticlesDiv.innerHTML = ''; // Clear existing articles

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';
        articleElement.innerHTML = `
            <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
            ${article.urlToImage ? `<img src="${article.urlToImage}" alt="News Image" class="news-image">` : ''}
            <p>${article.description}</p>
            <p><small>Source: ${article.source.name} | Published: ${new Date(article.publishedAt).toLocaleString()}</small></p>
        `;
        additionalArticlesDiv.appendChild(articleElement);
    });
}

// Event listener for the Back button
document.getElementById('back-btn').addEventListener('click', () => {
    window.history.back();
});

// Display all articles when the page loads
document.addEventListener("DOMContentLoaded", displayAllArticles);
