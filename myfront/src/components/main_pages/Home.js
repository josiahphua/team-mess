import React, {useEffect, useState} from 'react';
import {Container, Row} from 'react-bootstrap';
import AllCases from '../cases/AllCases';
import axios from "axios";


function Home({user, setUser, setAuth}) {

    const [pending, setPending] = useState([])
    const [resolved, setResolved] = useState([])

    useEffect(() => {

        async function setUserStats() {
            try {
                let {data} = await axios.get("/api/auth/user", {
                    headers: {
                        authorization: `Bearer ${localStorage.token}`
                    }
                })
                await setAuth(true)
                await setUser(data.user)
                await setPending(data.user.pendingIssues)
                await setResolved(data.user.closedIssues)
            } catch (e) {
                await setAuth(false)
                await setUser(null)
                localStorage.removeItem("token")
            }
        }
        setUserStats()

    },[])

    return (
        <Container>
            <br/>
            <Row></Row>

            <Row>
                <AllCases user={user} pending={pending} resolved={resolved}/>
            </Row>
        </Container>
    )
}

export default Home
