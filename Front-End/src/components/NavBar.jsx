import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'

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
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };
    return (
        <ul style={{ display:"flex", justifyContent: "space-around" }}>
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
                <button onClick={logoutUser}>Logout</button>
            </li>
        </ul>
    );
};

export default NavBar;