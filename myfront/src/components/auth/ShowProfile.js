import React from 'react';
import {Col, Container, Row, Image, Card} from "react-bootstrap";


function ShowProfile({user}) {
    return (
        <Container>

                <Card>
                    <Card.Header>Profile Page</Card.Header>
                    <br/>
                    <Card.Img variant="top" src={user.profilePic} style={{width: '80%', margin: "auto"}}/>
                    <Card.Body>
                    <Card.Title>Name</Card.Title>
                    <Card.Text>{user.name}</Card.Text>
                    <Card.Title>Email</Card.Title>
                    <Card.Text>{user.email}</Card.Text>
                    </Card.Body>



                    <Card.Footer>User ID: {user.id}</Card.Footer>
                </Card>
            <br/>

        </Container>
    );
}

export default ShowProfile;
