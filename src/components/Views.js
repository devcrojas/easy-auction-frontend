import React, { useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa";
import { Container, Row, Col, Card, CardMedia, Button } from 'react-bootstrap';
//import { Card, CardContent, CardMedia, Typography, CardActionArea, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
//import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
//import 'react-slideshow-image/dist/styles.css';
//import { Zoom } from 'react-slideshow-image';
import AuthService from '../services/auth.service'


const colors = {
    yellow: "#ECFF00",
    grey: "#a9a9a9"
}

function Views() {
    const [apis, setApis] = useState([]);

    // Se obtiene el usuario de sesion
    let user = AuthService.getCurrentUser();
    let userAuth = user.id;
    /*   // Prueba con:
    let userAuth = 't@gmail.com'; */

    useEffect(() => {
        getReviews()
    }, [])

    let getReviews = async function () {
        let review = await fetch("http://localhost:8080/api/reviews",
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
        //console.log(review.profileData.email);

        /* Si se quieren mostrar las reseñas de que hizo el usuario
        if(review.profileData.email === userAuth) */
        if(review.userData.email === userAuth){
            return (
                <Card sx={{ minWidth: 345, maxWidth: 345, margin: 1 }} key={review._id}>
                    <Card.Body>
                        <Row>
                            <Col align="left">Para el vendedor:<Card.Title>{review.profileData.lastName + ' ' + review.profileData.firstName}</Card.Title></Col>
                            <Col align="right">
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
                            <Col>Producto: {review.productData.nameProduct}</Col>
                        <Row>&nbsp;</Row>
                        <Col>
                            <Card.Text>{review.comment}</Card.Text>
                        </Col>
                        <Row>&nbsp;</Row>
              
                        {/* <Card.Text>{review.type}</Card.Text> */}
              
                        <Col align="right">Fecha de publicación:  {review.datePublished}</Col>
                        <Row>&nbsp;</Row>
                        <Col align="right">
                            <Button variant="success" type="button" className='btn btn-success text-center' /*onClick={sendReview}*/>
                                Modificar
                            </Button>
                        </Col>
                        <Row>&nbsp;</Row>
                        <Col align="right">
                            <Button variant="danger" type="button" className='btn btn-danger text-center' /*onClick={sendReview}*/>
                                Eliminar
                            </Button>
                        </Col>
                
                    </Card.Body>
                </Card>
            )
        }
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

export default Views