import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import EventCreator from './EventCreator';
import Footer from './Footer';

import { useEffect, useState } from 'react';

import { HOSTNAME } from './Host';

const hostname = HOSTNAME;

function Calendar() {
    const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const today  = new Date();

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
                });
        }
        //console.log(events);
    }, [events]);

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
            return response.text();
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
            const response = await fetch(hostname + '/postEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            });

            console.log('Added event ' + event.title);
            const data = await response.json();
            setEvents([...events, data]);
        } catch (error) {
            console.log('Failed to POST event!', error);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const [selectedMonth, setMonth] = useState(today.getMonth());
    //const [selectedYear, setYear] = useState(today.getFullYear());
    const selectedYear = today.getFullYear();

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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // CALENDAR

    const startOfMonth = (year, month) => new Date(year, month, 1);
    const endOfMonth = (year, month) => new Date(year, month + 1, 0);

    /**
     * @param {*} date 
     * @returns The start of the week based on the given date.
     */
    const startOfWeek = (date) => {
        const day = date.getDay();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
    };

    /**
     * @param {*} date 
     * @returns The end of the week based on the given date.
     */
    const endOfWeek = (date) => {
        const day = date.getDay();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - day));
    };

    /**
     * Generate the calendar grid for the current month. This function was corrected by ChatGPT-4
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // Handling Calendar

    const [selectedDayEvents, setSelectedDayEvents] = useState([]);

    // Retrieves events for selected day when View button is clicked
    // This function was suggested by ChatGPT-4o
    const getEventsForDay = (date) => {
        return events.filter(event => event.date === date.toISOString().split('T')[0]);
    };

    const handleEventClick = (date) => {
        setSelectedDayEvents(getEventsForDay(date));
    };

    // For Sign Up button
    function signUp(e) {
        console.log(e.target.elements.id.value);
        console.log(e.target.elements.title.value);
        console.log(e.target.elements.description.value);
        console.log(e.target.elements.date.value);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <Container>
            <Row className="mt-3 mb-1">
                <h1 className="text-center">Scheduling Application</h1>
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
                                    <Button variant="success" onClick={() => handleEventClick(day)}>
                                        <strong>View</strong>
                                    </Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                        </Col>
                    ))}
                </Row>
            ))}

            <hr />

            {/* Display events for the selected day at the bottom of the page */}
            {selectedDayEvents.length > 0 && (
                <Container>
                    <Row>
                        <h4>Scheduled Opportunities:</h4>
                    </Row>
                    <Row>
                        <Col>
                            <ul>
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
                                        signUp(e);
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
                                                <Button className="ms-3" variant="info" size="sm" type="submit">
                                                    Sign Up
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    </Form>
                                </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>
                </Container>
            )}

            <hr />

            <Container>
                <EventCreator addEvent={addEvent} updateEvent={updateEvent} />
            </Container>

            <hr />

            <Container className="border border-secondary mb-5">
                <Footer />
            </Container>

        </Container>
    );
}

export default Calendar;
