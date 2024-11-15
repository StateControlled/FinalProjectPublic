import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Link } from 'react-router-dom';

function Header() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">Scheduling</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Calendar</Nav.Link>

                        <Nav.Link as={Link} to="/login">Login</Nav.Link>

                        <NavDropdown title="More" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/profile">
                                Profile
                            </NavDropdown.Item>

                            <NavDropdown.Item as={Link} to="/project">
                                Project
                            </NavDropdown.Item>

                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/help">
                                Help
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>

                <Navbar.Brand>{}</Navbar.Brand>

            </Container>
        </Navbar>
    );
}

export default Header;