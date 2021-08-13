import React from 'react';
import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import {Link, NavLink} from 'react-router-dom';
import './navigation.css'

function Navigation({auth, user}) {


    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg" style={{"textAlign" : "center"}} >
                <Container fluid>
                    <Navbar.Brand href="/" style={{"margin" : "auto"}} >MessyGoWhere</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavLink className={"nav-link active"} to="/user/home">Home</NavLink>
                            {auth ? <>

                                <NavLink className={"nav-link active"} to="/api/auth/profile">Profile</NavLink>
                                <NavLink className={"nav-link active"} to="/case/submit">Submit Issue </NavLink>
                                <NavLink className={"nav-link active"} to="/vouchers">Vouchers</NavLink>
                                <NavLink className={"nav-link active"} id={"emailnav"} to="/api/auth/profile">{user && user.email}</NavLink>

                            </> :<>
                                <Link to="/api/auth/login"><Button variant="outline-success">Login</Button></Link>
                                <Link to="/api/auth/register"><Button variant="outline-success">Register</Button></Link>
                                {/*<NavLink className={"nav-link active"} to="/api/auth/login" >Login</NavLink>*/}
                                {/*<NavLink className={"nav-link active"} to="/api/auth/register" >Register</NavLink>*/}
                            </> }

                            {/*  KIV <NavLink to="/redeem">Redeem</NavLink> */}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default Navigation
