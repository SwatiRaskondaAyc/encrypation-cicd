let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

setInterval(nextSlide, 3000);


document.querySelectorAll('.read-more-btn').forEach(button => {
  button.onclick = function() {
      const modalId = this.getAttribute('data-modal');
      if (modalId) {
          document.getElementById(modalId).style.display = "block";
      }
  }
});

document.querySelectorAll('.close').forEach(span => {
  span.onclick = function() {
      const modal = this.parentElement.parentElement;
      modal.style.display = "none";
  }
});

window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  });
};


function openTab(evt, tabName) {
  // Hide all tab contents
  const tabcontents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontents.length; i++) {
      tabcontents[i].style.display = "none";
  }

  // Remove "active" class from all tab links
  const tablinks = document.getElementsByClassName("tablink");
  for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("active");
  }

  // Show the current tab and add "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}




// Asia Pacific Section
const NEWS_API_KEY = 'd9e49e83a62a4dc8a642b1bbee25d871'; // Replace with your API key
const ASIA_PACIFIC_NEWS_URL = `https://newsapi.org/v2/everything?q=Asia&apiKey=${NEWS_API_KEY}`;
let asiaArticles = []; // To store Asia Pacific articles

async function fetchAsiaPacificNews() {
    try {
        const response = await fetch(ASIA_PACIFIC_NEWS_URL);
        const newsData = await response.json();
        console.log("Fetched Asia Pacific news:", newsData);

        if (newsData.articles && newsData.articles.length > 0) {
            asiaArticles = newsData.articles; // Store all articles
            displaySingleAsiaArticle(asiaArticles[0]); // Display the first article
            document.getElementById('asia-read-more-btn').style.display = 'block'; // Show Read More button
        } else {
            console.error("No news articles found.");
        }
    } catch (error) {
        console.error("Error fetching Asia Pacific news:", error);
    }
}

function displaySingleAsiaArticle(article) {
    const articleElement = document.getElementById('single-article');
    articleElement.innerHTML = `
        <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
        <p>${article.description}</p>
        <p><small>Source: ${article.source.name} | Published: ${new Date(article.publishedAt).toLocaleString()}</small></p>
    `;
}

// Function to redirect to the new page with all articles
function redirectToAsiaNewsPage() {
    localStorage.setItem('asiaPacificArticles', JSON.stringify(asiaArticles)); // Store articles in localStorage
    window.location.href = '/asia-pacific-news'; // Redirect to the new page
}

// Event listener for the Read More button
document.getElementById('asia-read-more-btn').addEventListener('click', redirectToAsiaNewsPage);

// Call the function to fetch news on page load
document.addEventListener("DOMContentLoaded", fetchAsiaPacificNews);


// US Market Section
const US_NEWS_API_URL = 'https://newsapi.org/v2/everything?q=stockmarket&apiKey=d9e49e83a62a4dc8a642b1bbee25d871';
let usArticles = []; // To store US Market articles

async function fetchUSMarketNews() {
    try {
        const response = await fetch(US_NEWS_API_URL);
        const newsData = await response.json();
        console.log("Fetched US Market news:", newsData);

        if (newsData.articles && newsData.articles.length > 0) {
            usArticles = newsData.articles; // Store all articles
            displaySingleUSArticle(usArticles[0]); // Display the first article
            document.getElementById('us-read-more-btn').style.display = 'block'; // Show Read More button
        } else {
            console.error("No news articles found.");
        }
    } catch (error) {
        console.error("Error fetching US Market news:", error);
    }
}

function displaySingleUSArticle(article) {
    const articleElement = document.getElementById('us-single-article');
    articleElement.innerHTML = `
        <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
        <p>${article.description}</p>
        <p><small>Source: ${article.source.name} | Published: ${new Date(article.publishedAt).toLocaleString()}</small></p>
    `;
}

// Function to redirect to the new page with all articles
function redirectToUSNewsPage() {
    localStorage.setItem('usMarketArticles', JSON.stringify(usArticles)); // Store articles in localStorage
    window.location.href = '/us-market-news'; // Redirect to the new page
}

// Event listener for the Read More button
document.getElementById('us-read-more-btn').addEventListener('click', redirectToUSNewsPage);

// Call the function to fetch news on page load
document.addEventListener("DOMContentLoaded", fetchUSMarketNews);


//Landon Europe Africa NewsS
const LEA_NEWS_API_URL = 'https://newsapi.org/v2/everything?q=economy+OR+equity&domains=bbc.co.uk,ft.com,wsj.com&apiKey=d9e49e83a62a4dc8a642b1bbee25d871';
let leaArticles = []; // To store articles

async function fetchLEANews() {
    try {
        const response = await fetch(LEA_NEWS_API_URL);
        const newsData = await response.json();
        console.log("Fetched London/Europe/Africa Market news:", newsData);

        if (newsData.articles && newsData.articles.length > 0) {
            leaArticles = newsData.articles; // Store all articles
            displaySingleLEArticle(leaArticles[0]); // Display the first article
            document.getElementById('lea-read-more-btn').style.display = 'block';
        } else {
            console.error("No news articles found.");
        }
    } catch (error) {
        console.error("Error fetching London/Europe/Africa Market news:", error);
    }
}

function displaySingleLEArticle(article) {
    const articleElement = document.getElementById('lea-single-article');
    articleElement.innerHTML = `
        <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
        <p>${article.description}</p>
        <p><small>Source: ${article.source.name} | Published: ${new Date(article.publishedAt).toLocaleString()}</small></p>
    `;
}

// Redirect to the new page with all articles
function redirectToLEANewsPage() {
    localStorage.setItem('leaMarketArticles', JSON.stringify(leaArticles)); // Store articles in localStorage
    window.location.href = '/lea-market-news'; // Redirect to the new page
}

// Event listener for the Read More button
document.getElementById('lea-read-more-btn').addEventListener('click', redirectToLEANewsPage);

// Call the function to fetch news on page load
document.addEventListener("DOMContentLoaded", fetchLEANews);

