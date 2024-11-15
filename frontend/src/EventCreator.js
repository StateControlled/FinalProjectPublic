import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormGroup from "react-bootstrap/FormGroup";
import Row from 'react-bootstrap/Row';

/**
 * For creating new events and updating existing events
 */
function EventCreator({addEvent, updateEvent}) {

    function newEvent(e) {
        const event = {
            id: -1,
            title: e.target.elements.title.value,
            description: e.target.elements.description.value,
            date: e.target.elements.date.value
        };
        addEvent(event);
    }

    function editEvent(e) {
        const event = {
            id: e.target.elements.id.value,
            title: e.target.elements.title.value,
            description: e.target.elements.description.value,
            date: e.target.elements.date.value
        };
        updateEvent(event);
    }

    return (
        <Container className="mb-5">
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Create a New Event</Accordion.Header>
                    <Accordion.Body>
                        <Container className="mb-3 d-flex justify-content-center">
                            <Row>
                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    newEvent(e);
                                    e.target.reset();
                                }}>
                                    <FormGroup className='mb-3'>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type="text" name="title" required />

                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows={4} name="description" required />

                                        <Form.Label>Date</Form.Label>
                                        <Form.Control type="date" name="date" required />
                                    </FormGroup>

                                    <Button variant='primary' type="submit" className="w-100">
                                        Create Event
                                    </Button>
                                </Form>
                            </Row>
                        </Container>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>Edit An Existing Event</Accordion.Header>
                    <Accordion.Body>
                        <Container className="mb-3 d-flex justify-content-center">
                            <Row>
                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    editEvent(e);
                                    e.target.reset();
                                }}>
                                    <FormGroup className='mb-3'>
                                        <Form.Label>Event ID</Form.Label>
                                        <Form.Control type="text" name="id" required />

                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type="text" name="title" required />

                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows={4} name="description" required />

                                        <Form.Label>Date</Form.Label>
                                        <Form.Control type="date" name="date" required />
                                    </FormGroup>

                                    <Button variant='secondary' type="submit" className="w-100">
                                        Update Event
                                    </Button>
                                </Form>
                            </Row>
                        </Container>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

        </Container>
    );
}

export default EventCreator;