import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Footer from './Footer';

function Project() {
    return (
        <Container>
            <Row className="text-center font-weight-bold mb-1 mt-2">
                <h1>CSC436 Final Project</h1>
            </Row>

            <Row>
                <h2>Requirements</h2>
            </Row>

            <Row>
                <Col>
                    Choose a project that fulfills the following requirements:
                    <ol>
                        <li>
                            Front end must be a react application
                        </li>
                        <li>
                            Back end must be a dotnet application
                            <ol type="a">
                                <li>
                                    Must include GET, POST and PUT api calls
                                </li>
                            </ol>
                        </li>
                        <li>
                            Must have data persistence to a database.  This can be a SQL lite database, MS SQL, MySQL, Mongo, etc.  You can use multiple databases if you'd like.
                        </li>
                        <li>
                            The Entity Framework must handle all communication between the dotnet application and the database
                        </li>
                        <li>
                            Your application must have a login page with support of Oauth2.0 Authentication and handle multiple users.
                            <ol type="a">
                                <li>
                                    It should have a workflow for creating a new account
                                </li>
                                <li>
                                    Authenticating against that new account
                                </li>
                                <li>
                                    Being able to login with that new account
                                </li>
                            </ol>
                        </li>
                        <li>
                        Must have multiple pages and/or views
                        </li>
                        <li>
                        Project demo will be live during week 10 or by video and submitted via D2L
                            <ol type="a">
                                <li>
                                Submission will require a document or PowerPoint presentation describing your project
                                    <ol type="i">
                                        <li>
                                        Describe each of the above requirements and how your project meets them
                                        </li>
                                        <li>
                                        Why did you choose this specific project
                                        </li>
                                        <li>
                                        If you had more time, what would you do differently
                                        </li>
                                    </ol>
                                </li>
                                <li>
                                Project source code must be committed to GitHub. If you submit a presentation but do not commit source code then you will receive a 0%.
                                </li>
                            </ol>
                        </li>
                    </ol>
                </Col>
                <Col>
                    Example Projects
                    <ul>
                        <li>
                        Blogging Platform
                        </li>
                        <li>
                        Bank / ATM application
                        </li>
                        <li>
                        Personalized Weather Application
                        </li>
                        <li>
                        Chat application
                        </li>
                        <li>
                        Gradebook supporting multiple students
                        </li>
                        <li>
                        Reservation system (restaurants, equipment, cars, etc.)
                        </li>
                        <li>
                        Shopping application (limit the scope)
                        </li>
                        <li>
                        Finance app (Display stocks, Crypto etc.)
                        </li>
                        <li>
                        Crime alert by location/user
                        </li>
                        <li>
                        Book Review site
                        </li>
                        <li>
                        Resale of used items (aka Craigslist)
                        </li>
                    </ul>
                </Col>
            </Row>

            <Container className="border border-secondary mt-5 mb-5">
                <Footer />
            </Container>
        </Container>
    );
}

export default Project;