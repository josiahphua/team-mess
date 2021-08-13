import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button, ButtonGroup, Image} from "react-bootstrap";
import axios from "axios";
import {useHistory} from "react-router-dom";
import Alert from './Alert';
require('dotenv').config()

function EditProfile({auth,setAuth,user,setUser, setEditState}) {

    let history = useHistory()
    const [formData, setFormData] = useState();
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [publicID, setPublicID] = useState()



    useEffect(()=>{

        //This function is to check if a user has logged in..
        async function setUserStats() {
            try {
                let {data} = await axios.get("/api/auth/user", {
                    headers: {
                        authorization: `Bearer ${localStorage.token}`
                    }
                })
                await setAuth(true)
                await setUser(data.user)
                await setPublicID(data.user.profilePic)
            } catch (e) {
                await setAuth(false)
                await setUser(null)
                localStorage.removeItem("token")
            }
        }
        setUserStats()
    },[auth])

    // main submit function for the registration form
    async function submit(e) {
        e.preventDefault()
        if (!selectedFile) {
            postUser({...formData, profilePic: publicID})
            setEditState(false)
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);   // reads content of selectedFile and calls onloadend when done
            reader.onloadend = async function () {
                let public_id = await uploadImage(reader.result);  // calls uploadImage function to upload image, which returns public_id of the uploaded image
                postUser({...formData, profilePic: public_id}) // calls postUser to save the user. public_id is passed in directly to bypass the delay in setFormdata
            };
            reader.onerror = () => {
                setErrMsg('something went wrong!'); // error reporting for reader function
            };
            setEditState(false)
        }
    }

    // function to upload image to cloudinary
    async function uploadImage(base64EncodedImage){
        try {
            let imgJSON = JSON.stringify({ data: base64EncodedImage })
            let {data: {public_id}} = await axios.post('/api/auth/upload', imgJSON, {
                headers: {'Content-Type': 'application/json'}});
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Image uploaded successfully');
            return public_id


        } catch (err) {
            console.error(err);
            setErrMsg('Something went wrong!');
        }
    };

    //function to save new user and save token
    async function postUser(userObj) {
        try{
            let {data: {token}} = await axios.post("/api/auth/update", userObj, {
                headers: {
                    authorization: `Bearer ${localStorage.token}`
                }
            })
            localStorage.setItem("token",token)
            setAuth(true)
            history.push("/api/user/home")

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
            <Row className={"justify-content-center"}>
                <h3>Edit Profile</h3>
            </Row>
            <Row className={"justify-content-center"}>

            <Col md={4}>
                        <h5>Upload a Profile Pic</h5>
                        <Alert msg={errMsg} type="danger" />
                        <Alert msg={successMsg} type="success" />
                        <Form.Group>

                            { (!selectedFile) ?
                                <Image
                                src={user.profilePic}
                                />
                                : previewSource && (
                                <img
                                    src={previewSource}
                                    alt="chosen"
                                    style={{ height: '150px' }}
                                />
                            )
                            }
                            <input
                                id="fileInput"
                                type="file"
                                name="image"
                                onChange={handleFileInputChange}
                                value={fileInputState}
                                className="form-input"
                            />

                        </Form.Group>




                </Col>
                <Col md={4}>
                    <h5>User ID</h5>
                    <p>{user.id}</p>
                    <Form onSubmit={submit}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control name="name"
                                      type="name"
                                      placeholder={user.name}
                                      onChange={change}
                                      />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control name="email"
                                      type="email"
                                      placeholder={user.email}
                                      onChange={change}
                                      />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password"
                                      type="password"
                                      placeholder="Enter New Password"
                                      onChange={change}
                                      />
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
                        <ButtonGroup>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                        <Button variant="secondary" onClick={()=>setEditState(false)}>Go Back</Button>
                        </ButtonGroup>
                    </Form>
                </Col>

            </Row>
        </Container>

    )
}

export default EditProfile
