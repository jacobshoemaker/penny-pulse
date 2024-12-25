import './pages.css';
import HomeNav from '../components/HomeNav';
import Weather from '../components/Weather';

const HomePage = () => {
    return (
        <>
        <div className="main-content">
            <h1>PennyPulse</h1>
            <Weather />
            <HomeNav />
        </div>
        </>
    );
};
export default HomePage;