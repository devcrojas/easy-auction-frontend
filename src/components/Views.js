import React, { useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa";
import { Container, Row, Col, Card, Button, Form} from 'react-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import AuthService from '../services/auth.service'
import Reviews from './Reviews';


const colors = {
    yellow: "#ECFF00",
    grey: "#a9a9a9"
}

function Views() {
    const [apis, setApis] = useState([]);
    
    // Se obtiene el usuario de sesion
    let user = AuthService.getCurrentUser();
    let userAuth = user.id;
    
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


    //Eliminar reseña
    const deleteReview = async function () {
        let resp = await fetch('/api/reviews/',
            {
                method: 'DELETE'
            })
            if (resp.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Reseña eliminada con ¡ÉXITO!',
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Oh oh, Hubo un error!',
                    text: 'No se pudo eliminar',
                })
            }

    }


    //Modificar reseña
    const modifyReview = async () => {
        let emailSeller = product.filter((e) => e._id === selectProducts);   
        const resenaM = {
            comment: comentario,
            stars: estrellas,
            type: tipo
        }
        let resp = await fetch(`/api/reviews/`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resenaM)
            })
        if (resp.status === 201) {
        //console.log(resena),
            Swal.fire({
                icon: 'success',
                title: '¡LISTO!',
                text: 'Reseña modificada'
            })
        }
        else {
            Swal.fire({
                icon: 'error',
                title: '¡Oh oh, Hubo un error!',
                text: 'No se puede modificar',
            })
        }
    }  
   

    const cards = () => {
        let card = apis.map ((review) => {
        //console.log(review.profileData.email);
            /* Si se quieren mostrar las reseñas de que hizo el usuario
            if(review.profileData.email === userAuth) */
            if(review.emailU.email === userAuth){
                return (
                    <Col sx={12} lg={9} key={review._id} className='mb-4'>
                    <Card sx={{ minWidth: 345, maxWidth: 345, margin: 1 }} key={review._id}>
                        <Card.Header>
                            <Row>
                                <Col align="left">Para el vendedor:<Card.Title>{review.emailP.lastName + ' ' + review.emailP.firstName}</Card.Title></Col>
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
                                    <Row>&nbsp;</Row>
                                    {<Card.Text>{review.type}</Card.Text>}
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col align="center">Producto comprado:</Col>
                                <Form.Group>
                                    <Form.Control className='text-center' value={review.productId.nameProduct} disabled />
                                </Form.Group>
                            </Row>
                            <Row>&nbsp;</Row>
                            <Row>
                                <Col align="center">Mi comentario:</Col>
                                <Form.Group>
                                    <Form.Control className='text-center' value={review.comment} disabled />
                                </Form.Group>
                            </Row>
                            <Row>&nbsp;</Row>
                            <Col align="right">Fecha de publicación:  {review.datePublished}</Col>
                        </Card.Body>
                        <Card.Footer>
                            <Row>
                            <Col align="center">
                                <Button variant="danger" type="button" className='btn btn-danger text-center' onClick={deleteReview}>Eliminar</Button>
                            </Col>
                            <Col align="center">
                                <Button variant="success" type="button" className='btn btn-success text-center' onClick={modifyReview}>Modificar</Button>
                            </Col>
                            </Row>
                        </Card.Footer>              
                    </Card>
                    </Col>
                )
            }
        });
        return card;
    }

    return (
        <Container>
            <Row>&nbsp;</Row>
            <Col md='8'>
                {
                    cards()
                }
            </Col>
        </Container>
    )
}

export default Views;