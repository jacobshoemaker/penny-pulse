import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import logo from '../../public/pennypulse-high-resolution-logo.png';

// Navbar component
const NavBar = () => {
    // Use the useNavigate hook to navigate to different pages
    const navigate = useNavigate();

    // Function to logout user
    const logoutUser = async () => {
        try {
            // Get the token from local storage
            const token = localStorage.getItem('token');
            // If no token is found, throw an error
            if (!token) {
                throw new Error('No token found');
            }
            // Otherwise, send a POST request to the logout endpoint
            await axios.post(
                'http://127.0.0.1:8000/api/v1/users/logout/',
                {},
                // Include the token in the headers
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            // Remove the token from local storage
            localStorage.removeItem('token');
            // Navigate to the logout page
            navigate('/logout');
        // If an error occurs, log it to the console
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    // Return React Bootstrap Navbar component
    // with links to different pages
    // and a logout button that calls the logoutUser function
    return (
        <Navbar bg="dark" variant="dark" expand="lg" style={{ backgroundColor: '#003366' }}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Penny Pulse Logo" style={{ height: '75px', borderRadius: '10px' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/register/">Register</Nav.Link>
            <Nav.Link as={Link} to="/login/">Login</Nav.Link>
            <Nav.Link as={Link} to="/transactions/">Transactions</Nav.Link>
            <Nav.Link as={Link} to="/goals/">Goals</Nav.Link>
            <Nav.Link as={Link} to="/news/">News</Nav.Link>
            <Nav.Link onClick={logoutUser}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
};

export default NavBar;