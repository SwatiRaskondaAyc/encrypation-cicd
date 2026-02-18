import React, { useEffect, useState } from 'react'
import News from './News';

const NewsBoard = () => {
    const [articles,setArticles]=useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
      const fetchNews = async () => {
        try {
          const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${import.meta.env.VITE_API_KEY}`;
          const response = await fetch(url); // Correctly define response
          const data = await response.json(); // Correctly access the parsed JSON data
          setArticles(data.articles || []); // Handle undefined articles
        } catch (error) {
          console.error('Error fetching news:', error);
          setArticles([]); // Set to an empty array on error
        } finally {
          setLoading(false);
        }
      };
      fetchNews();
    }, []);
  return (
    <div>
     {articles.map((news,index)=>{
      return<News key={index} title={news.title} description={news.description} src={news.urlToImage} url={news.url}/>
     })}
    </div>
  )
}

export default NewsBoard