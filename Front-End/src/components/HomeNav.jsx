import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomeNav = () => {
  // Use the useNavigate hook to navigate to different pages
  const navigate = useNavigate();

  // Array of objects containing page path, title, and description
  const pages = [
    { path: '/register/', title: 'Register', description: 'Register a new account' },
    { path: '/login/', title: 'Login', description: 'Login to your account' },
    { path: '/transactions/', title: 'Transactions', description: 'View your transactions' },
    { path: '/goals/', title: 'Goals', description: 'Set and view your financial goals' },
    { path: '/news/', title: 'News', description: 'Read the latest financial news' },
    { path: '/logout/', title: 'Logout', description: 'Logout from your account' },
  ];

  // Function to take path as argument and navigate to that path
  // using the navigate function from useNavigate hook
  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container>
      {/* Display the pages as cards */}
      {/* Map over the pages array and display each page as a Card component */}
      <Row>
        {pages.map((page, index) => (
          {/* Display the page as a Card component */},
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            {/* Set the cursor to pointer and add an onClick handler to navigate to the page */}
            <Card style={{ cursor: 'pointer' }} onClick={() => handleCardClick(page.path)}>
              {/* Display the page title and description */}
              <Card.Body>
                <Card.Title>{page.title}</Card.Title>
                <Card.Text>{page.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomeNav;