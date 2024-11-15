import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * A footer for the homepage
 */
function Footer() {

    /**
     * @returns Today's date formatted as dddd mmm dd, yyyy
     */
    function today() {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    }

    return (
        <Container className="mt-2 mb-2">
            <div className="text-center">
                <Row>
                    <Col>
                        <p>William Berthouex's Final Project</p>
                    </Col>
                </Row>
            </div>

            <div className="text-center">
                <Row>
                    <Col>
                        <strong>Volunteer Scheduling Application</strong>
                    </Col>
                    <Col>
                        <i>CSC436 Section 710</i>
                    </Col>
                    <Col>
                        <i>{today()}</i>
                    </Col>
                </Row>
            </div>
        </Container>
    );
}

export default Footer;