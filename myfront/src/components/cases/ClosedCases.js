import React from 'react';
import {Card, Container, Row} from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';


function ClosedCases({resolved}) {
    let history = useHistory();

    let reversedResolved = [...resolved]
    reversedResolved.reverse()

    function redirect(id){
        history.push(`/api/cases/pending/${id}`)
    }

    return (
        <Container className="border" >
            <Row className="text-center">
            <h5>Resolved and Closed Issues</h5>
            </Row>
            {(reversedResolved.length>0)?
                <Row className="d-flex flex-row flex-nowrap overflow-auto">
                    {reversedResolved.map((issue,id) => (

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
                <div> No Closed Issues! <NavLink to="/case/submit" >Click here to submit</NavLink></div>

            }


            <br/>


        </Container>
    )
}

export default ClosedCases
