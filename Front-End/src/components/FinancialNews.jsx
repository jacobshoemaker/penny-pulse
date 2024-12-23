import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Pagination } from 'react-bootstrap';

const FinancialNews = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(8);

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/news/rss-feed/');
        setArticles(response.data.articles);
      } catch (err) {
        setError('Failed to fetch RSS feed.');
        console.error(err);
      }
    };

    fetchRSS();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <div>Error: {error}</div>;
  }

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