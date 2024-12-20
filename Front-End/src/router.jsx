import { createBrowserRouter } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import App from './App.jsx';

const router = createBrowserRouter([{
    path:'/',
    element:<App/>,
    children: [
        {
            index:true,
            element:<HomePage/>,
        },
        {
            path:"/register/",
            element:<RegistrationPage/>,
        },
        {
            path:"/login/",
            element:<LoginPage/>,
        },
    ],
}]);

export default router;