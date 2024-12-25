import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TransactionPage from './pages/TransactionPage';
import GoalsPage from './pages/GoalsPage';
import NewsPage from './pages/NewsPage';
import LogoutPage from './pages/LogoutPage.jsx';
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
        {
            path:"/transactions/",
            element:<TransactionPage/>,
        },
        {
            path:"/goals/",
            element:<GoalsPage/>,
        },
        {
            path:"/news/",
            element:<NewsPage/>,
        },
        {
            path:"/logout/",
            element:<LogoutPage/>,
        }
    ],
}]);


export default router;