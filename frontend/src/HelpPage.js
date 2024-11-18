import './styles/text.css';

import Container from "react-bootstrap/esm/Container";

function HelpPage() {
    return (
        <Container className="mt-2">
            <h1>Help</h1>
            <p>
                Click the green <span className="green-text"><strong>View</strong></span> button to see events scheduled for that day.
                If nothing happens, no events were scheduled.
            </p>
            <p>
                Click the blue <span className="blue-text"><strong>Sign Up</strong></span> button to sign up for the event.
            </p>
            <p>
                You must be logged in to <i>sign up</i> for or to <i>create</i> or <i>edit</i> events.
            </p>
        </Container>
    );
}

export default HelpPage;