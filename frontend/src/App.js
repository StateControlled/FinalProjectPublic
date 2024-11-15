import './styles/App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Calendar from './Calendar';
import Login from './Login';
import Header from './Header';

function App() {
    //const isAuthenticated = 
    return (
        <Router>
            <Header />
            <Routes>
                <Route exact path="/" element={<Calendar />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
