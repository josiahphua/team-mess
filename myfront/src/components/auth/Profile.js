import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button, Modal, ButtonGroup} from "react-bootstrap";
import axios from "axios";
import {useHistory} from "react-router-dom";
import ShowProfile from "./ShowProfile";
import EditProfile from "./EditProfile";

function Profile({setAuth,user,setUser}) {

    const [editState, setEditState] = useState(false)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let history = useHistory()

    useEffect(()=>{
        async function setUserStats() {
            try {
                let {data} = await axios.get("/api/auth/user", {
                    headers: {
                        authorization: `Bearer ${localStorage.token}`
                    }
                })
                setAuth(true)
                setUser(data.user)

            } catch (e) {
                setAuth(false)
                setUser(null)
                localStorage.removeItem("token")
            }
        }

        setUserStats()
    },[])

    function logout(){
        setAuth(false)
        setUser(null)
        localStorage.removeItem("token")
        history.push("/")
    }

    async function deleteAcct() {
        try{
            await axios.delete("/api/auth/delete", {
                headers: {
                    authorization: `Bearer ${localStorage.token}`
                }
            })
            setAuth(false)
            setUser(null)
            localStorage.removeItem("token")
            history.push("/")
        }catch (e) {
            console.log(e)
        }
    }


    return (
        <Container fluid>
            <Row>
                <Col md={6}>
                    <Row>


                        {!editState ?
                            <ShowProfile user={user}/>
                            :
                            <EditProfile setEditState={setEditState} setAuth={setAuth} user={user} setUser={setUser}
                                         exact/>
                        }

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header>
                                <Modal.Title>Confirm Deletion of Profile</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Please click "Delete" below to confirm deletion of profile.</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Go Back
                                </Button>
                                <Button variant="primary" onClick={deleteAcct}>
                                    Confirm Deletion
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Row>
                    <Row className={"justify-content-center"}>
                        <ButtonGroup>
                            <Button onClick={() => setEditState(true)}>Edit Profile</Button>
                            <Button variant="warning" onClick={logout}>Log Out</Button>
                            <Button variant="danger" onClick={handleShow}>Delete Profile</Button>
                        </ButtonGroup>

                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
