import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
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
        <ul style={{ display: "flex", justifyContent: "space-around", alignItems: "center", listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
            <li style={{ position: "absolute", top: 0, left: 0 }}>
                <img src={logo} alt="Penny Pulse Logo" style={{ height: "60px", margin: "0px" }} />
            </li>
            <li>
                <Link to='/'>Home</Link>
            </li>
            <li>
                <Link to='/register/'>Register</Link>
            </li>
            <li>
                <Link to='/login/'>Login</Link>
            </li>
            <li>
                <Link to='/transactions/'>Transactions</Link>
            </li>
            <li>
                <Link to='/goals/'>Goals</Link>
            </li>
            <li>
                <Button variant="danger" size="sm" onClick={logoutUser}>Logout</Button>
            </li>
        </ul>
    );
};

export default NavBar;