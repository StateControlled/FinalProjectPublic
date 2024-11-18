import '../styles/text.css';
import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import dayjs from 'dayjs';

/**
 * Renders information about the user obtained from MS Graph
 * @param props 
 */
export const ProfileData = (props) => {
    return (
        <Container>
            <Container>
                    <Row>
                        <Col className="d-flex justify-content-end"><strong>First Name: </strong></Col>
                        <Col className="d-flex justify-content-start">{props.graphData.givenName}</Col>
                    </Row>

                    <Row>
                        <Col className="d-flex justify-content-end"><strong>Last Name: </strong></Col>
                        <Col className="d-flex justify-content-start">{props.graphData.surname}</Col>
                    </Row>

                    <Row>
                        <Col className="d-flex justify-content-end"><strong>Email: </strong></Col>
                        <Col className="d-flex justify-content-start">{props.graphData.userPrincipalName}</Col>
                    </Row>

                    <Row>
                        <Col className="d-flex justify-content-end"><strong>Id: </strong></Col>
                        <Col className="d-flex justify-content-start">{props.graphData.id}</Col>
                    </Row>
            </Container>

            <hr />
            
            <Container>
                <h3><strong>Your scheduled events</strong></h3>
                    <Row>
                        <Col>
                            <strong>Event</strong>
                        </Col>
                        <Col>
                            <strong>Description</strong>
                        </Col>
                        <Col>
                            <strong>Date</strong>
                        </Col>
                    </Row>
                {props.myEvents.map((e) => (
                    <Row key={e.id} className={dayjs(e.date).format() <= dayjs().format() ? "gray-text" : "black-text"}>
                        <Col>
                            <p>{e.title}</p>
                        </Col>
                        <Col>
                            <p>{e.description}</p>
                        </Col>
                        <Col>
                            <p>{e.date}</p>
                        </Col>
                    </Row>
                ))}
            </Container>

        </Container>
    );
};