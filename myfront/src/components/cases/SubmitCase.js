import React, {useState} from 'react';
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import axios from "axios";
import {useHistory} from "react-router-dom";
import Alert from '../auth/Alert';

function SubmitCase({auth, setAuth, user}) {

    let history = useHistory()
    const [formData, setFormData] = useState();
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    async function submit(e) {
        e.preventDefault()
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);   // reads content of selectedFile and calls onloadend when done
        reader.onloadend = async function () {
            let url = await uploadImage(reader.result);  // calls uploadImage function to upload image, which returns public_id of the uploaded image
            postIssue({...formData, picture: url}) // calls postUser to save the user. public_id is passed in directly to bypass the delay in setFormdata
        };
        reader.onerror = () => {
            setErrMsg('something went wrong!'); // error reporting for reader function
        };
    }

    // function to upload image to cloudinary
    async function uploadImage(base64EncodedImage) {
        try {
            let imgJSON = JSON.stringify({data: base64EncodedImage})
            let {data: {url}} = await axios.post('/api/issue/upload', imgJSON, {
                headers: {'Content-Type': 'application/json'}
            });
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Image uploaded successfully');

            return url


        } catch (err) {
            console.error(err);
            setErrMsg('Something went wrong!');
        }
    }

    //function to submit new issue and save token
    async function postIssue(userObj) {
        try {
            await axios.post("/api/issue/submit", userObj,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.token}`
                    }
                })
            history.push("/user/home")

        } catch (e) {
            console.log(e)
        }
    }

    //function to record form entry
    function change(e) {
        setFormData(prevState => ({...prevState, [e.target.name]: e.target.value}))
    }


    function changeSelect(e) {
        setFormData(prevState => ({...prevState, issueType: e.target.value}))
    }

    //function to handle submission of image
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    //function to generate preview image
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <h3>Issue Submission Page</h3>

                    <Form onSubmit={submit}>
                        <h5>Upload a picture of the issue</h5>
                        <Alert msg={errMsg} type="danger"/>
                        <Alert msg={successMsg} type="success"/>

                        <Form.Group>
                            <input
                                id="fileInput"
                                type="file"
                                name="image"
                                onChange={handleFileInputChange}
                                value={fileInputState}
                                className="form-input"
                            />
                            {previewSource && (
                                <img
                                    src={previewSource}
                                    alt="chosen"
                                    style={{height: '300px'}}
                                />
                            )}
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>Description of Issue</Form.Label>
                            <Form.Control
                                name="description"
                                as="textarea"
                                placeholder="Please describe the issue"
                                style={{height: '100px'}}
                                onChange={change}
                                required
                            />
                        </Form.Group>
                        <br/>


                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <Form.Control name="date"
                                          type="date"
                                          onChange={change}
                                          required/>
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>Time</Form.Label>
                            <Form.Control name="time"
                                          type="time"
                                          onChange={change}
                                          required/>
                        </Form.Group>
                        <br/>

                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Control name="location"
                                          type="test"
                                          placeholder="Enter Location"
                                          onChange={change}
                                          required/>
                        </Form.Group>

                        <br/>
                        <Form.Group>
                            <Form.Label>Select Category of Issue</Form.Label>
                            <select className={"form-control"} onChange={changeSelect}>
                                <option value="General">General</option>
                                <option value="Pests">Pests</option>
                                <option value="Animal & Birds">Animal & Birds</option>
                                <option value="Cleanliness">Cleanliness</option>
                                <option value="Roads & Footpaths">Roads & Footpaths</option>
                                <option value="Facilities in HDB">Facilities in HDB</option>
                                <option value="Drinking Water">Drinking Water</option>
                                <option value="Drains & Sewers">Drains & Sewers</option>
                                <option value="Parks & Greenery">Parks & Greenery</option>
                                <option value="Construction Sites">Construction Sites</option>
                                <option value="Abandoned Trolleys">Abandoned Trolleys</option>
                                <option value="Shared Bicycles">Shared Bicycles</option>
                                <option value="Illegal Parking">Illegal Parking</option>

                            </select>
                        </Form.Group>
                        <br/>
                        <Form.Group>

                            <br/>

                            <Row>
                                <Button variant="primary" type="submit">
                                    Submit Issue
                                </Button>
                            </Row>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default SubmitCase
