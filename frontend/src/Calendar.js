import './styles/text.css';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import EventCreator from './EventCreator';
import Footer from './Footer';

import { useEffect, useState } from 'react';

import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from './authConfig';

const hostname = process.env.REACT_APP_LOCAL_HOST;
// const frontendAzure = process.env.REACT_APP_FRONT_AZ;

function Calendar() {
    const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const today  = new Date();

    const { instance, accounts } = useMsal();

    const getToken = async () => {
        const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
        });
        return response.accessToken;
    };

    /**
     * Event = {
     *  id: int
     *  title: string
     *  description: string
     *  date: string
     * }
     */
    const [events, setEvents] = useState([]);

    /**
     * Fetch events if the events array is empty
     */
    useEffect(() => {
        if (events.length === 0) {
            fetch(hostname + '/getEvents')
                .then(response => response.json())
                .then(data => {
                    setEvents(data)
                })
                .catch(error => console.error('Error fetching events: ', error));
        }
    }, [events]);

    /**
     * I hoped this would make the Azure deployment work, but it doesn't and I've run out of time to debug
     */
    // useEffect(() => {
    //     if (events.length === 0) {
    //         fetch(hostname + '/getEvents', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Access-Control-Allow-Origin': frontendAzure
    //                 }
    //             })
    //             .then(response => response.json())
    //             .then(data => {
    //                 setEvents(data)
    //             })
    //             .catch(error => console.error('Error fetching events: ', error));
    //     }
    // }, [events]);

    /**
     * This helper function is passed to Admin.js
     */
    function updateEvent(event) {
        putEvent(event);
    }

    /**
     * Updates an existing event
     */
    async function putEvent(event) {
        try {
            const response = await fetch(hostname + '/updateEvent', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            });

            const updatedEvent = await response.json();
            console.log('Updated event: ' + updatedEvent);
            setEvents(events.map((e) => {
                return e.id === updatedEvent.id ? { ...e, ...updatedEvent} : e
            }));
            return updateEvent;
        } catch (error) {
            console.log('Failed to PUT event!', error);
        }
    }

    /**
     * This helper function is passed to Admin.js
     */
    function addEvent(event) {
        postEvent(event);
    }

    /**
     * Add a new Event to the Calendar
     */
    async function postEvent(event) {
        try {
            const token = await getToken();
            
            const response = await fetch(hostname + '/postEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(event)
            });

            const data = await response.json();
            setEvents([...events, data]);
            console.log('Added event ' + event.title);
        } catch (error) {
            console.log('Failed to POST event!', error);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // CALENDAR - many functions in this section were corrected by ChatGPT-4o

    const [selectedMonth, setMonth] = useState(today.getMonth());
    //const [selectedYear, setYear] = useState(today.getFullYear());
    const selectedYear = today.getFullYear();

    const startOfMonth = (year, month) => new Date(year, month, 1);
    const endOfMonth = (year, month) => new Date(year, month + 1, 0);

    /** @returns Cycles month forward */
    const nextMonth = () => {
        if (selectedMonth === 11) {
            setMonth(0);
            //setYear(selectedYear + 1);
        } else {
            setMonth(selectedMonth + 1);
        }
    };

    /** @returns Cycles month backward */
    const previousMonth = () => {
        if (selectedMonth === 0) {
            setMonth(11);
            //ectedYear - 1);
        } else {
            setMonth(selectedMonth - 1);
        }
    };

    /**
     * @returns The start of the week based on the given date.
     */
    const startOfWeek = (date) => {
        const day = date.getDay();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
    };

    /**
     * @returns The end of the week based on the given date.
     */
    const endOfWeek = (date) => {
        const day = date.getDay();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - day));
    };

    /**
     * Generate the calendar grid for the current month.
     * @returns The calendar as an array[][]
     */
    const generateCalendar = () => {
        const year          = today.getFullYear();
        const monthStart    = startOfMonth(year, selectedMonth);
        const monthEnd      = endOfMonth(year, selectedMonth);
        const weekStart     = startOfWeek(monthStart);
        const weekEnd       = endOfWeek(monthEnd);

        const calendar = [];
        let day = new Date(weekStart);

        while (day <= weekEnd) {
            const week = Array(7).fill(0).map(() => {
                const dayCopy = new Date(day);
                day.setDate(day.getDate() + 1);
                return dayCopy;
            });
            calendar.push(week);
        }
        return calendar;
    };

    const [selectedDayEvents, setSelectedDayEvents] = useState([]);

    // Retrieves events for selected day when View button is clicked
    const getEventsForDay = (date) => {
        return events.filter(event => event.date === date.toISOString().split('T')[0]);
    };

    const handleEventClick = (date) => {
        setSelectedDayEvents(getEventsForDay(date));
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // Signing Up for Events

    // For Sign Up button
    async function signUp(event, user) {
        console.log('ID: ' + event.id);
        console.log('TITLE: ' + event.title);
        console.log('DESCRIPTION: ' + event.description);
        console.log('DATE: ' + event.date);
        console.log('FNAME ' + user.fname);
        console.log('LNAME ' + user.lname);

        const sendData = {
            EventId : event.id,
            UserFirstName : user.fname,
            UserLastName : user.lname
        };

        try {
            const response = await fetch(hostname + '/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });

            const receiveData = await response.json();
            console.log('Successfully signed up: ' + receiveData);
            
        } catch (error) {
            console.log('Failed to Sign Up for event!', error);
        }
        setShowModal(false);
    }

    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleCloseModal = () => setShowModal(false);

    const handleShowModal = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    const isAuthenticated = useIsAuthenticated();

    return (
        <Container>
            <Row className="mt-3 mb-1">
                <h2 className="text-center"><strong>Schedule of Events</strong></h2>
                {isAuthenticated ? <h3>Welcome!</h3> : <></>}
            </Row>

            <Row className="mb-3 mt-3 text-center">
                {/* The Month/Year and next/previous buttons */}
                <Col>
                    <Button variant="warning" onClick={previousMonth}>
                        Previous Month
                    </Button>
                </Col>

                <Col>
                    <h2>{months[selectedMonth]} {selectedYear}</h2>
                </Col>

                <Col>
                    <Button variant="warning" onClick={nextMonth}>
                        Next Month
                    </Button>
                </Col>
            </Row>

            {/* Print the day headers */}
            <Row>
                {days.map((day) => (
                    <Col className="text-center font-weight-bold mb-1" key={day}>
                        <strong>{day}</strong>
                    </Col>
                ))}
            </Row>

            {generateCalendar().map((week, i) => (
                <Row key={i}>
                    {week.map((day, j) => (
                        <Col key={j} className={`text-center border ${day.getMonth() === selectedMonth ? '' : 'text-muted'}`}>
                            <div className="mb-2">{day.getDate()}</div>

                            <ButtonToolbar className="mb-2 mx-auto">
                                <ButtonGroup size="sm" className="mx-auto">
                                    <Button variant="success" onClick={() => handleEventClick(day)} aria-label={`View events for ${day.toDateString()}`}>
                                        <strong>View</strong>
                                    </Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                        </Col>
                    ))}
                </Row>
            ))}

            <hr />

            {/* Corrections suggested by ChatGPT-4o */}
            {!!selectedEvent && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sign up for <span className="blue-text"><strong>{selectedEvent.title}</strong></span></Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <span  className="event-info">Event Information</span> <br />
                        <strong>Description:</strong> <br />
                        {selectedEvent.description}<br />
                        <hr />
                        <strong>Date:</strong><br />
                        {selectedEvent.date}
                    </Modal.Body>

                    <Modal.Footer className="justify-content-center mb-1">
                        <Form onSubmit={(e) => {
                                e.preventDefault();
                                const user = {
                                    fname: e.target.elements.fname.value,
                                    lname: e.target.elements.lname.value
                                }
                                signUp(selectedEvent, user);
                                e.target.reset();
                            }}>
                            <Form.Group className='mb-3'>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="fname" required />

                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="lname" required />
                            </Form.Group>

                            <Button variant="success" type="submit">
                                Sign Up
                            </Button>
                            <Button className="ms-5" variant="danger" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                        </Form>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Display events for the selected day at the bottom of the page */}
            {selectedDayEvents.length > 0 && (
                <Container>
                    <Row>
                        <h4>Scheduled Opportunities:</h4>
                    </Row>
                    
                    <Row>
                        <ul className="no-bullets">
                            <li className="mb-2">
                                {/* Header Row */}
                                <Row>
                                    <Col xs={1}>
                                        Event ID
                                    </Col>
                                    <Col>
                                        Event Title
                                    </Col>
                                    <Col>
                                        Description
                                    </Col>
                                    <Col>
                                        Date
                                    </Col>
                                    <Col>

                                    </Col>
                                </Row>
                            </li>

                            {selectedDayEvents.map(event => (
                            <li key={event.id} className="mb-2">
                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    const event = {
                                        id: e.target.elements.id.value,
                                        title: e.target.elements.title.value,
                                        description: e.target.elements.description.value,
                                        date: e.target.elements.date.value
                                    };
                                    handleShowModal(event);
                                }}>
                                    <Form.Group>
                                        <Row>
                                            <Col xs={1}>
                                                <Form.Control size="sm" value={event.id} id="id" readOnly />
                                            </Col>
                                            <Col>
                                                <Form.Control size="sm" value={event.title} id="title" readOnly />
                                            </Col>
                                            <Col>
                                                <Form.Control size="sm" value={event.description} id="description" readOnly />
                                            </Col>
                                            <Col>
                                                <Form.Control type="date" size="sm" value={event.date} id="date" readOnly />
                                            </Col>
                                            <Col>
                                                <Button className="ms-3" 
                                                        variant={isAuthenticated ? "info" : "outline-secondary"} 
                                                        size="sm" 
                                                        type="submit" 
                                                        disabled={!isAuthenticated}>
                                                    Sign Up
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Form>
                            </li>
                            ))}
                        </ul>
                    </Row>
                </Container>
            )}

            <hr />

            <Container>
                {isAuthenticated ? <EventCreator addEvent={addEvent} updateEvent={updateEvent} /> : <></>}
            </Container>

            <hr />

            <Container className="border border-secondary mb-5">
                <Footer />
            </Container>

        </Container>
    );
}

export default Calendar;
