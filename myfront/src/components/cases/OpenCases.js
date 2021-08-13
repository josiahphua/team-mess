import React, {useEffect, useState} from 'react';
import {Card, Container, Row} from 'react-bootstrap';
import {useHistory } from 'react-router-dom';

import axios from "axios";

function OpenCases() {

    const [openCase, setOpenCase] = useState()
    let reverseOpen = []
    let history = useHistory();

    useEffect(() => {
        async function getOpen() {

            try {
                let {data} = await axios.get("/api/issue/staff/open", {
                    headers: {
                        authorization: `Bearer ${localStorage.token}`
                    }
                })

                await setOpenCase(data.globalOpenIssues)
            } catch (e) {
                console.log(e)
            }
        }
        getOpen()
    }, [])

    if (openCase) {
        reverseOpen = [...openCase]
        reverseOpen.reverse()
    }


    function redirect(id){
        history.push(`/api/cases/pending/${id}`)
    }

    return (
        <Container className="border" >
            <Row className="text-center">
            <h5>Open Issues</h5>
            </Row>
            {(reverseOpen && reverseOpen.length>0)?
                <Row className="d-flex flex-row flex-nowrap overflow-auto">
                    {reverseOpen.map((issue,id) => (

                        <Card className="text-center" style={{ width: '14rem' }} key={id}>
                            <Card.Header>{issue.issueType}</Card.Header>
                            <Card.Img variant="top" src={issue.picture} style={{width: '100%', height: '150px', margin: "auto"}}/>
                            <Card.Body>{issue.description}</Card.Body>
                            <Card.Footer>
                                <small className="text-muted">Status: {issue.issueStatus}</small>
                            </Card.Footer>
                            <a className={"stretched-link"} style={{ cursor: 'pointer' }} onClick={()=>redirect(issue._id)}></a>
                        </Card>

                    ))}
                </Row> :
                <div> No Open Issues.</div>

            }


            <br/>


        </Container>
    )
}

export default OpenCases
