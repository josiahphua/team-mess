import React, {useState} from 'react';
import Rating from '@material-ui/lab/Rating';
import {Button, Col, Row} from "react-bootstrap";
import axios from "axios";
import {useHistory} from "react-router-dom";

export default function HoverRating({issue}) {
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);


  let history = useHistory()

  async function submitRating(id){
    try {

      await axios.post(`/api/issue/iRating/${id}`,{"rating":value},{
        headers: {
          authorization: `Bearer ${localStorage.token}`
        }
      })
      history.goBack()
    }catch (e) {
      console.log(e)
    }
  }

  return (
      <Row>
          <Col>
              <Rating
                  name="hover-feedback"
                  value={value}
                  size="large"
                  onChange={(event, newValue) => {
                      setValue(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                      setHover(newHover);
                  }}
              />
          </Col>
          <Col>
              <Button onClick={() => submitRating(issue._id)}> Submit Rating</Button>
          </Col>

      </Row>
  );
}

