import React, {useEffect, useState} from 'react'
import {Container, Row, Col, Button, Modal, Form, Card} from "react-bootstrap";
import {useParams, useHistory} from "react-router-dom";
import axios from "axios";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import {withStyles, makeStyles} from "@material-ui/core";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import HoverRating from "./Rating";
import ShowRating from "./ShowRating";

function SingleCaseView({user}) {

    const history = useHistory()
    const [issue, setIssue] = useState({})
    const [expanded, setExpanded] = useState("Panel1");

    const [showResolve, setShowResolve] = useState(false);
    const [showClose, setShowClose] = useState(false);
    const [formData, setFormData] = useState();
    const form = "dummy"

    const handleCloseResolve = () => setShowResolve(false);
    const handleShowResolve = () => setShowResolve(true);
    const handleCloseClose = () => setShowClose(false);
    const handleShowClose = () => setShowClose(true);

    const id = useParams()
    let updates = []

    useEffect(() => {

        async function getSingleIssue() {
            try {
                let {data} = await axios.get(`/api/issue/single/${id.id}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.token}`
                    }
                })
                await setIssue(data.singleIssue)


            } catch (e) {
                console.log(e)
            }
        }

        getSingleIssue()
    }, [])

    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
    }));

    const classes = useStyles();

    const Accordion = withStyles({
        root: {
            border: '1px solid rgba(0, 0, 0, .125)',
            boxShadow: 'none',
            '&:not(:last-child)': {
                borderBottom: 0,
            },
            '&:before': {
                display: 'none',
            },
            '&$expanded': {
                margin: 'auto',
            },
        },
        expanded: {},
    })(MuiAccordion);

    const AccordionSummary = withStyles({
        root: {
            backgroundColor: 'rgba(0, 0, 0, .03)',
            borderBottom: '1px solid rgba(0, 0, 0, .125)',
            marginBottom: -1,
            minHeight: 56,
            '&$expanded': {
                minHeight: 56,
            },
        },
        content: {
            '&$expanded': {
                margin: '12px 0',
            },
        },
        expanded: {},
    })(MuiAccordionSummary);

    const AccordionDetails = withStyles((theme) => ({
        root: {
            padding: theme.spacing(2),
        },
    }))(MuiAccordionDetails);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    async function deleteIssue(id) {
        try {
            await axios.post(`/api/issue/iDeleted/${id}`, formData, {
                headers: {
                    authorization: `Bearer ${localStorage.token}`
                }
            })
            history.goBack()
        } catch (e) {
            console.log(e)
        }
    }

    async function acceptIssue(id) {
        try {
            await axios.post(`/api/issue/iAccept/${id}`, form, {
                headers: {
                    authorization: `Bearer ${localStorage.token}`
                }
            })
            history.goBack()
        } catch (e) {
            console.log(e)
        }
    }

    async function resolveIssue(id) {
        try {

            await axios.post(`/api/issue/iResolved/${id}`, formData, {
                headers: {
                    authorization: `Bearer ${localStorage.token}`
                }
            })
            history.goBack()
        } catch (e) {
            console.log(e)
        }
    }

    function change(e) {
        setFormData(prevState => ({...prevState, [e.target.name]: e.target.value}))
    }


    updates = issue.updates

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header>Status: {issue.issueStatus}</Card.Header>
                        <Card.Header>Category: {issue.issueType}</Card.Header>
                        <Card.Img variant="top" src={issue.picture} style={{width: '80%', margin: "auto"}}/>
                        <Card.Body>

                            <Card.Title>Description</Card.Title>
                            <Card.Text>
                                {issue.description}
                            </Card.Text>
                            <Card.Title>Location</Card.Title>
                            <Card.Text>
                                {issue.location}
                            </Card.Text>
                            <Card.Title>Submission Date & Time</Card.Title>
                            <Card.Text>
                                {issue.date} / {issue.time}
                            </Card.Text>

                            <Card.Title>Issue Updates</Card.Title>
                            <div>
                                {updates && updates.map((update, id) => (
                                    <Accordion square expanded={expanded === `panel${id + 1}`}
                                               onChange={handleChange(`panel${id + 1}`)}>
                                        <AccordionSummary aria-controls={`panel${id + 1}d-content`}
                                                          id={`panel${id + 1}d-header`}>
                                            <Typography className={classes.heading}>{update.updateStatus}</Typography>
                                            <Typography
                                                className={classes.secondaryHeading}>{update.date} / {update.time}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {update.updateDescription}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>

                                ))}
                            </div>
                            <br/>

                            {(user && user.userType === "User") ?
                                (issue && issue.issueStatus === "Resolved") ?
                                    (issue.rating === -1) ? <>
                                            <Card.Title>Issue Rating</Card.Title>
                                            <HoverRating issue={issue}/>
                                        </>

                                        : <>
                                            <Card.Title>Issue Rating</Card.Title>
                                            <ShowRating issue={issue}/>
                                        </>
                                    : <></>
                                : (issue.rating > -1) ?
                                    <>
                                        <Card.Title>Issue Rating</Card.Title>
                                        <ShowRating issue={issue}/>
                                    </>
                                    : <></>
                            }

                            <Button onClick={() => history.goBack()}>Go Back</Button>

                            {(issue && !(issue.issueStatus === "Deleted" || issue.issueStatus === "Resolved")) ?
                                <Button onClick={handleShowClose}>Close Issue</Button>
                                : <></>
                            }

                            {(user && user.userType === "Staff") ?
                                (issue && issue.issueStatus === "Open") ?
                                    <Button onClick={() => acceptIssue(issue._id)}>Accept Issue</Button>
                                    : (issue && issue.issueStatus === "In Progress") ?
                                    <Button onClick={handleShowResolve}>Resolve Issue</Button>
                                    : <></>
                                : <></>
                            }


                        </Card.Body>
                        <Card.Footer className="text-muted">Issue Ref: {issue.issueID}</Card.Footer>
                    </Card>

                    <Modal show={showResolve} onHide={handleCloseResolve}>
                        <Modal.Header>
                            <Modal.Title>Resolve Issue</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Issue Update</Form.Label>
                                    <Form.Control
                                        name="description"
                                        as="textarea"
                                        placeholder="Please describe how the issue was resolved"
                                        style={{height: '100px'}}
                                        onChange={change}
                                        required
                                    ></Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseResolve}>
                                Go Back
                            </Button>
                            <Button variant="primary" onClick={() => resolveIssue(issue._id)}>
                                Submit and Resolve
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showClose} onHide={handleCloseClose}>
                        <Modal.Header>
                            <Modal.Title>Close Issue</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Issue Update</Form.Label>
                                    <Form.Control
                                        name="description"
                                        as="textarea"
                                        placeholder="Please describe why this issue was closed"
                                        style={{height: '100px'}}
                                        onChange={change}
                                        required
                                    ></Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseClose}>
                                Go Back
                            </Button>
                            <Button variant="primary" onClick={() => deleteIssue(issue._id)}>
                                Submit and Close
                            </Button>
                        </Modal.Footer>
                    </Modal>


                </Col>
            </Row>
        </Container>
    )
}

export default SingleCaseView

