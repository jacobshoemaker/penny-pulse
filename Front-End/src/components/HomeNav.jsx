import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomeNav = () => {
  const navigate = useNavigate();

  const pages = [
    { path: '/register/', title: 'Register', description: 'Register a new account' },
    { path: '/login/', title: 'Login', description: 'Login to your account' },
    { path: '/transactions/', title: 'Transactions', description: 'View your transactions' },
    { path: '/goals/', title: 'Goals', description: 'Set and view your financial goals' },
    { path: '/news/', title: 'News', description: 'Read the latest financial news' },
    { path: '/logout/', title: 'Logout', description: 'Logout from your account' },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container>
      <Row>
        {pages.map((page, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card style={{ cursor: 'pointer' }} onClick={() => handleCardClick(page.path)}>
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