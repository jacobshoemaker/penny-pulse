import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import logo from '../../public/pennypulse-high-resolution-logo.png';

const NavBar = () => {
    const navigate = useNavigate();

    const logoutUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            await axios.post(
                'http://127.0.0.1:8000/api/v1/users/logout/',
                {},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            localStorage.removeItem('token');
            navigate('/logout');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };
    return (
        <Navbar bg="dark" variant="dark" expand="lg" style={{ backgroundColor: '#003366' }}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Penny Pulse Logo" style={{ height: '60px' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
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