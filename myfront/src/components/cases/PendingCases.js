import React from 'react';
import {Card, Container, Row} from 'react-bootstrap';
import {NavLink, useHistory} from 'react-router-dom';



function PendingCases({pending}) {
    let history = useHistory();

    let reversePending = [...pending]
    reversePending.reverse()

    function redirect(id){
        history.push(`/api/cases/pending/${id}`)
    }

    return (
        <Container className="border" >
            <Row className="text-center">
            <h5>Open and In Progress Issues</h5>
            </Row>
            {(reversePending.length>0)?

                <Row className="d-flex flex-row flex-nowrap overflow-auto">
                    {reversePending.map((issue,id) => (
                        <Card className="text-center" style={{ width: '14rem' }} key={id}>
                            <Card.Header>{issue.issueType}</Card.Header>
                                <Card.Img variant="top" src={issue.picture} style={{width: '80%', height: '150px', margin: "auto"}}/>
                            <Card.Body>{issue.description}</Card.Body>
                            <Card.Footer>
                                <small className="text-muted">Status: {issue.issueStatus}</small>
                            </Card.Footer>
                            <a className={"stretched-link"} style={{ cursor: 'pointer' }} onClick={()=>redirect(issue._id)}></a>
                        </Card>
                    ))}
                </Row> :
                <div> No Pending Issues! <NavLink to="/case/submit" >Click here to submit</NavLink></div>

            }


            <br/>


        </Container>
    )
}

export default PendingCases

