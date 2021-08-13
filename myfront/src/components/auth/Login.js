import React, {useState} from 'react';
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import axios from "axios";
import {useHistory} from "react-router-dom";
import './login.css'

function Login({setAuth}) {

    let history = useHistory()
    const [cred, setCred] = useState({})

    async function submit(e){
        e.preventDefault()
        try{
            let {data: {token}}= await axios.post("/api/auth/login", cred)

            localStorage.setItem("token",token)

            setAuth(true)
            history.push("/user/home")

        }catch(e){
            console.log(e)
        }
    }

    function change(e){
        setCred(prevState => ({...prevState, [e.target.name] : e.target.value }))
    }

    return (
        <Container>
            <Row className={"d-flex justify-content-center align-content-md-center mt-3"}>
                <Col md={6}>
                    <h3>Login</h3>
                    <Form onSubmit={submit}>
                        <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control name="email"
                                          type="email"
                                          placeholder="Enter email"
                                          onChange={change}
                                          required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="password"
                                          type="password"
                                          placeholder="Enter Password"
                                          onChange={change}
                                          required />
                        </Form.Group>

                        <Button variant="dark"
                                type="submit"
                                block>
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>

        </Container>
    );
}

export default Login;
