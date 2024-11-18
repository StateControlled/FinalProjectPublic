import './styles/App.css';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { PageLayout } from './components/PageLayout';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';

import Calendar from './Calendar';
import Header from './Header';
import HelpPage from './HelpPage';
import Project from './Project';

import { loginRequest } from './authConfig';
import { callMsGraph } from './graph';
import { ProfileData } from './components/ProfileData';

const hostname = process.env.REACT_APP_LOCAL_HOST;

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });
    }

    const [myEvents, setMyEvents] = useState([]);

    function getMyEvents() {
        const user = {
            FirstName: graphData.givenName,
            LastName: graphData.surname
        };

        try {
            fetch(hostname + '/getSignUps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                setMyEvents(data);
            });
            myEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

            return myEvents;
        } catch (error) {
            console.error('[Profile] Error fetching events: ', error);
        }
    }

    return (
        <Container>
            <h5 className="mb-3">Welcome {accounts[0].name}</h5>

            {graphData ? (
                <ProfileData graphData={graphData} myEvents={getMyEvents()} />
            ) : (
                <Button variant="secondary" onClick={RequestProfileData}>
                    Show Profile Information
                </Button>
            )}
        </Container>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    return (
        <div className="App mt-3">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <Router>
                <Header />
                <Routes>
                    <Route exact path="/" element={<MainContent />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/project" element={<Project />} />
                    <Route path="/help" element={<HelpPage />} />
                </Routes>
            </Router>

            {/* <MainContent /> */}
        </PageLayout>
    );
}

