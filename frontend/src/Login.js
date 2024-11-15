import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormGroup from "react-bootstrap/FormGroup";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Cookies from 'js-cookie';

import { useState } from 'react';

import { HOSTNAME } from './Host';

const hostname = HOSTNAME;
const exp = 7;

///////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Login for an existing User and Form to create new User
 */
function Login() {
    const [feedback, setFeedback] = useState({success: null, message: null});

        /**
     * Authenticate an existing user (login)
     */
    function Authenticate(e) {
        const userData = {
            username: e.target.elements.username.value,
            password: e.target.elements.password.value
        };

        fetch(hostname + '/login', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Basic " + btoa(e.target.elements.username.value + ":" + e.target.elements.password.value) // btoa - Base64-encoded ASCII string
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            // Check if response went through
            if (!response.ok) {
                throw new Error('Login failed!');
            }
            return response.text();
        })
        .then(data => {
            let dataObj = JSON.parse(data);
            console.log(dataObj);
            // Cookie : basic web storage, json data
            // Has limited lifespan set by developer and limited storage size
            Cookies.set('auth', data, { expires: exp }); 
            Cookies.set('base64', btoa(dataObj.username + ":" + dataObj.password), { expires: exp });
            setFeedback({ success: true, message: 'Login successful!' });
        })
        .catch(error => {
            console.log('Login Error: ', error);
            setFeedback({ success: false, message: error.message });
        });
    }

    /**
     * Create a new User
     */
    function NewUser(e) {
        const userData = {
            username: e.target.elements.newUsername.value,
            password: e.target.elements.newPassword.value
        };

        fetch(hostname + '/newUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        });
    }

    return (
        <Container>
            <Row className="mt-3 mb-3 text-center">
                <h2>Login or Create a New Account</h2>
            </Row>

            <Row>
                <h3 className="text-center">Login</h3>
            </Row>

            <Row>
                <Container className="mb-3 d-flex justify-content-center">
                    {feedback.message && (
                        <div className={feedback.success ? 'alert alert-success' : 'alert alert-danger'}>
                            {feedback.message}
                        </div>
                    )}
                    <Form className="mb-3" onSubmit={(e) => {
                        e.preventDefault();
                        Authenticate(e, setFeedback);
                        e.target.reset();
                    }}>
                        <FormGroup className='mb-3'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" required />

                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" required />
                        </FormGroup>

                        <Button variant='success' type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Container>
            </Row>

            <hr />

            <Row>
                <h4 className="text-center mt-3">Create New User</h4>
            </Row>

            <Row>
                <Container className="mb-5 mt-3 d-flex justify-content-center">
                    <Form className="mb-3" onSubmit={(e) => {
                        e.preventDefault();
                        NewUser(e);
                        e.target.reset();
                    }}>
                        <FormGroup className='mb-3'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="newUsername" required />

                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="newPassword" required />
                        </FormGroup>

                        <Button variant='primary' type="submit" className="w-100">
                            Create User
                        </Button>
                    </Form>
                </Container>
            </Row>

        </Container>
    );
}

export default Login;