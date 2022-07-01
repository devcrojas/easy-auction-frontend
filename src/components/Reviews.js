import React, { useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa";
import { Container, Row, Col, Card } from 'react-bootstrap';
//import { Card, CardContent, CardMedia, Typography, CardActionArea, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
//import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
//import 'react-slideshow-image/dist/styles.css';
//import { Zoom } from 'react-slideshow-image';


const colors = {
  yellow: "#ECFF00",
  grey: "#a9a9a9"
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}

const createArray = length => [...Array(length)];



function Reviews() {
  const [apis, setApis] = useState([]);

  useEffect(() => {
    getReviews()
  }, [])

  var getReviews = async function () {
    let review = await fetch("http://localhost:8080/reviews",
      {
        method: "GET"
      }
    );
    let awReview = await review.json();
    setApis(awReview);
    //console.log(awReview);
    return;
  };

  const cards = () => {
    let card = apis.map((review) => {
      return (
        
        <Card sx={{ minWidth: 345, maxWidth: 345, margin: 1 }} key={review._id}>

          <Card.Body>
            
            <Row>
              <Col><Card.Title>{review.seller}</Card.Title></Col>

              <Col>
              {Array(review.stars).fill(0).map((_, index) => {
                return (
                  <FaStar
                  key={index}
                  size={30}
                  style={{
                      marginRight: 10,
                      cursor: "pointer"
                  }}
                  color={colors.yellow}
                  />
                )
              })}
              {Array(5 - review.stars).fill(0).map((_, index) => {
                return (
                  <FaStar
                  key={index}
                  size={30}
                  style={{
                      marginRight: 10,
                      cursor: "pointer"
                  }}
                  color={colors.grey}
                  />
                )
              })}
              </Col>

            </Row>
            <Row>&nbsp;</Row>
            <Card.Text>{review.comment}</Card.Text>
            
            {/* <Card.Text>{review.type}</Card.Text> */}
            
            <Col align="right">Por {review.user}</Col>
              
            </Card.Body>
        </Card>
        
      )
    });

    return card;
  }

  return (
    <Container>
      <Row>
        <Col></Col>
          <Col md='8'>
            {
              cards()
            }
          </Col>
        <Col></Col>
      </Row>
    </Container>
  )
}

export default Reviews
