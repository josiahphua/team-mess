import React, {useState} from 'react';
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import axios from "axios";
import {useHistory} from "react-router-dom";
import Alert from './Alert';
import './login.css'


function Registration({setAuth}) {

    let history = useHistory()
    const [formData, setFormData] = useState();
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');


    // main submit function for the registration form
    async function submit(e) {
        e.preventDefault()
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);   // reads content of selectedFile and calls onloadend when done
        reader.onloadend = async function () {
            let url = await uploadImage(reader.result);  // calls uploadImage function to upload image, which returns public_id of the uploaded image

            postUser({...formData, profilePic: url}) // calls postUser to save the user. public_id is passed in directly to bypass the delay in setFormdata
        };
        reader.onerror = () => {
            setErrMsg('something went wrong!'); // error reporting for reader function
        };
    }

    // function to upload image to cloudinary
    async function uploadImage(base64EncodedImage){
        try {
            let imgJSON = JSON.stringify({ data: base64EncodedImage })
            let {data: {url}} = await axios.post('/api/auth/upload', imgJSON, {
                headers: {'Content-Type': 'application/json'}});
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Image uploaded successfully');

            return url


        } catch (err) {
            console.error(err);
            setErrMsg('Something went wrong!');
        }
    };

    //function to save new user and save token
    async function postUser(userObj) {
        try{
            let {data: {token}} = await axios.post("/api/auth/register", userObj)
            localStorage.setItem("token",token)
            setAuth(true)
            history.push("/user/home")

        }catch(e){
            console.log(e)
        }
    }

    //function to record form entry
    function change(e){
        setFormData(prevState => ({...prevState, [e.target.name] : e.target.value }))
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
            <Row className={"d-flex justify-content-center mt-3"}>
                <Col md={6}>
                    <h3>Registration Page</h3>

                    <Form onSubmit={submit}>
                        <h5>Upload a Profile Pic</h5>
                        <Alert msg={errMsg} type="danger" />
                        <Alert msg={successMsg} type="success" />
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
                                style={{ height: '300px' }}
                            />
                        )}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name"
                                          type="name"
                                          placeholder="Enter name"
                                          onChange={change}
                                          required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control name="email"
                                          type="email"
                                          placeholder="Enter email"
                                          onChange={change}
                                          required/>
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="password"
                                          type="password"
                                          placeholder="Enter Password"
                                          onChange={change}
                                          required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>User Type</Form.Label>
                            <div className="mb-3">
                                <Form.Check inline label="User"
                                            name="userType"
                                            type={"radio"}
                                            value={"User"}
                                            onChange={change} defaultChecked/>
                                <Form.Check inline label="Staff"
                                            name="userType"
                                            type={"radio"}
                                            value={"Staff"}
                                            onChange={change}/>
                            </div>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>

        </Container>

    )
}

export default Registration


