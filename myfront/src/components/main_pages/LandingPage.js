import React, {useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import './landingpage.css'
import {Button, Container} from "react-bootstrap";

function LandingPage({auth}) {

    let history = useHistory();
    const background = "https://images.pexels.com/photos/3771790/pexels-photo-3771790.jpeg?cs=srgb&dl=pexels-andrea-piacquadio-3771790.jpg&fm=jpg"

    useEffect(() => {
        if (auth) {
            history.push("/user/home")
        }
    }, [auth])

    return (
        <>
            <Container>
                <div>
                    <h1>Encounter an issue??</h1>
                    <h3>And don't know how to resolve it?</h3>
                    <h5>Ask for help here!</h5>
                </div>
                {/* KIV items commented */}
                {/* <NavLink>Sign in with Google</NavLink> */}
                {/* <NavLink>Sign in with Facebook</NavLink> */}
                {/*<div style={btnStyle}>*/}
                {/*    <NavLink to="/api/auth/login">Sign in with Email</NavLink>*/}
                {/*</div>*/}
                <div className="d-flex justify-content-center align-self-center flex-column" id={"logindiv"}>
                    <Link to="/api/auth/login"><Button variant={"dark"}>Yes I'm in</Button></Link>
                    <Link to="/api/auth/register"><Button variant={"success"}>Sign up now</Button></Link>
                </div>
                <div className="d-flex justify-content-center align-self-center flex-column">
                    <Link to="/api/auth/login"><Button>Let us help you</Button></Link>
                    <Link to="/api/auth/register"><Button>Register with us</Button></Link>
                </div>
            </Container>

        </>
    )
}

export default LandingPage
