import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Pagination } from 'react-bootstrap';

// This component displays the latest financial news from an RSS feed.
const FinancialNews = () => {
  // State to store the articles and error message
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  // State to store the current page number
  const [currentPage, setCurrentPage] = useState(1);
  // State to store the number of articles per page
  const [articlesPerPage] = useState(8);

  // Hook to fetch the RSS feed when the component mounts
  useEffect(() => {
    // Function to fetch the RSS feed
    const fetchRSS = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/news/rss-feed/');
        // Set the articles in the state
        setArticles(response.data.articles);
      } catch (err) {
        // Set the error message in the state
        setError('Failed to fetch RSS feed.');
        console.error(err);
      }
    };

    // Call the fetchRSS function
    fetchRSS();
  }, []);

  // Logic to paginate the articles
  // Calculate the index of the last article and the index of the first article
  const indexOfLastArticle = currentPage * articlesPerPage;
  // Calculate the index of the first article
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  // Get the current articles by slicing the articles array
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Function to change the current page by setting the current page state
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // If there is an error, display the error message
  if (error) {
    return <div>Error: {error}</div>;
  }
  // Display the articles
  // by mapping over the current articles and displaying them in a Card component
  // Linking to full article and open it in new tab
  // Article publication date in card footer.
  // Pagination to navigate through the articles using bootstrap pagination component
  // Creating an array of pagination items based on number of pages.
  // Renders each pagination item, setting it as active if it matches the 
  // current page and adding an onClick handler to change the page.
  return (
    <div>
      <h1>Financial News</h1>
      <div className="d-flex flex-wrap">
        {currentArticles.map((article, index) => (
          <Card key={index} style={{ width: '18rem', margin: '10px' }}>
            <Card.Body>
              <Card.Title>{article.title}</Card.Title>
              <Card.Text>{article.description}</Card.Text>
              <Card.Link href={article.link} target="_blank" rel="noopener noreferrer">
                Read more
              </Card.Link>
              <Card.Footer>
                <small className="text-muted">{article.pubDate}</small>
              </Card.Footer>
            </Card.Body>
          </Card>
        ))}
      </div>
      <Pagination>
        {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }, (_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default FinancialNews;