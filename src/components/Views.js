import React, { useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa";
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import AuthService from '../services/auth.service'

const colors = {
    yellow: "#ECFF00",
    grey: "#a9a9a9"
}

function Views() {
    const [apis, setApis] = useState([]);

    //Modal Modificar
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Se obtiene el usuario de sesion
    let user = AuthService.getCurrentUser();
    let userAuth = user.id;

    useEffect(() => {
        getReviews()
    }, [])

    const resena = { emailU: userAuth };
    let getReviews = async function () {
        let review = await fetch("/api/reviews/myreviews",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resena)
            }
        );
        let awReview = await review.json();
        setApis(awReview);
        //console.log(awReview);
        return;
    };


    //Modificar Reseña
    const modifyReview = async (id) => {
        const options = {
            method: 'PUT',
            body: JSON.stringify()
        }
        const res = await fetch(`/api/reviews/${id}`, options);
        const data = await res.json();
        console.log(data)
    };

    //Eliminar reseña
    function deleteReview(id) {
        Swal.fire({
            title: 'Estas seguro?',
            text: "No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#27AE60',
            cancelButtonColor: '#C00000',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            const options = {
                method: 'PUT',
                body: JSON.stringify({ 'status': 'delete' })
            }
            let res = await fetch(`/api/reviews/${id}`, options)
            if (res.status === 201) {
                Swal.fire(
                    'Eliminado!',
                    'Tu comentario ha sido eliminado.',
                    'success'
                )
            }
        })
    }


    const cards = () => {
        let card = apis.map((review) => {
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
                                    <Button variant="danger" type="button" className='btn btn-danger text-center' onClick={deleteReview(review._id)}>
                                        Eliminar
                                    </Button>
                                </Col>

                                <>
                                    <Col align="center">
                                        <Button variant="success" type="button" className='btn btn-success text-center' onClick={() => {showModal(review._id); handleShow();}}>
                                            Modificar
                                        </Button>
                                    </Col>


                                </>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            )
        });
        return card;
    }

    const showModal = (id) => {
        let reviewFilter = apis.filter(fil => fil._id === id)
        let review = reviewFilter[0]  
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modificar Reseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Col align="center">
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
                            <Row align="center"><h4><small>Calificación</small></h4></Row>
                            {<Card.Text>{review.type} </Card.Text>}
                            <Row align="center"><h4><small>Mi comentario:</small></h4></Row>
                            <Form.Group>
                                <Form.Control as="textarea" rows={3} className='text-center' value={review.comment} />
                            </Form.Group>
                        </Col>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={modifyReview(id)}>
                        Modificar
                    </Button>
                </Modal.Footer>
            </Modal>
        )
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

export default Views