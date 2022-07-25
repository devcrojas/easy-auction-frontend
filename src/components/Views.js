import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Modal } from 'react-bootstrap';
import { CardHeader, Card, Rating, CardContent, Divider, Stack, Typography, List, ListItemText, CardActions, Button, TextField, FormGroup } from '@mui/material'
import StarIcon from '@mui/icons-material/Star';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import AuthService from '../services/auth.service'

import "../nav.css"
import NavBarMenu from './NavBarMenu'
import MenuLateral from './MenuLateral';

function Views() {
    let user = AuthService.getCurrentUser();
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState();
    const [resena, setResena] = useState({ type: "" })
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        getReviews()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    async function getReviews() {
        let respReviews = await fetch("/api/reviews/myreviews",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailU: user.id })
            });
        if (respReviews.status === 200) {
            let response = await respReviews.json();
            let rews = response.filter((re) => {
                if (re.status) {
                    return re.status !== 'delet'
                } else {
                    return re
                }
            })
            setReviews(rews);
        } else {
            setReviews([]);
        }

    };

    const handleChange = (event) => {
        setResena({
            ...resena,
            [event.target.name]: event.target.value
        })
    }
    function eliminarResena(id) {
        let options = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ 'status': 'delet' })
        }
        Swal.fire({
            title: 'Quieres Eliminar esta reseña?',
            text: "No podrás revertir esto.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let resp = await fetch(`/api/reviews/${id}`, options);
                if (resp.status === 201) {
                    getReviews()
                    Swal.fire(
                        'Eliminada!',
                        'Tu reseña ha sido eliminada.',
                        'success'
                    )
                }

            }
        })
    }
    const handleClick = (event, id) => {
        if (event.target.name === 'showModal') {
            let rew = reviews.filter((re) => { return re._id === id })[0];
            setReview(rew);
            handleShow();

        }
    }
    const createCards = () => {
        let card = reviews.map((review, index) => {
            return (
                <Col key={review._id} xs={12} md={12} className="d-flex justify-content-center">
                    <Card id={review._id} sx={{ width: '60%', borderRadius: 5 }} className="mb-2" elevation={10}>
                        <Row >
                            <Col md={6}>
                                <CardHeader sx={{ width: '100%', height: "100%" }}
                                    title={`${review.emailP.firstName} ${review.emailP.lastName}`}
                                    subheader={"Vendedor"}
                                />
                            </Col>
                            <Col md={6} className="my-3 ">
                                <Stack spacing={1} sx={{ width: '100%', height: "100%" }} >
                                    <Rating
                                        name="text-feedback"
                                        value={review.stars}
                                        readOnly
                                        size="large"
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        className="justify-content-end me-3"
                                    />
                                    <Typography variant="button" className="d-flex justify-content-end me-3">
                                        {review.type}
                                    </Typography>
                                </Stack>
                            </Col>

                        </Row>
                        <Divider variant="middle" color="#000000" />
                        <CardContent >
                            <List component="div">
                                <ListItemText
                                    primaryTypographyProps={{ component: "div" }}
                                    primary={<h5><Badge bg="primary" variant="string">Fecha de publicación:</Badge></h5>}
                                    secondaryTypographyProps={{ component: "div" }}
                                    secondary={<h5 style={{ textAlign: "justify" }}>{review.datePublished}</h5>}
                                />
                                <ListItemText
                                    primaryTypographyProps={{ component: "div" }}
                                    primary={<h5><Badge bg="primary" variant="string">Producto comprado:</Badge></h5>}
                                    secondaryTypographyProps={{ component: "div" }}
                                    secondary={<h5 style={{ textAlign: "justify" }}>{review.productId.nameProduct}</h5>}
                                />
                                <ListItemText
                                    primaryTypographyProps={{ component: "div" }}
                                    primary={<h5><Badge bg="primary" variant="string">Mi comentario:</Badge></h5>}
                                    secondaryTypographyProps={{ component: "div" }}
                                    secondary={<h5 style={{ textAlign: "justify" }}>{review.comment}</h5>}
                                />
                            </List>
                        </CardContent>
                        <CardActions className='mx-3 my-2 justify-content-end'>
                            <Button variant="contained" size="large" color="error" onClick={() => { eliminarResena(review._id) }}>
                                Eliminar
                            </Button>
                            <Button name='showModal' variant="contained" size="large" color="success" onClick={(event) => { handleClick(event, review._id) }} >
                                Actualizar
                            </Button>
                        </CardActions>
                    </Card>
                </Col>
            )
        });
        return card
    }

    async function updateResena(id) {
        if (parseInt(resena.stars) < 3) {
            resena.type = "Pesimo servicio"
        } else {
            resena.type = "Excelente servicio"
        }
        let options = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(resena)
        }
         let resp = await fetch(`/api/reviews/${id}`, options);
         if (resp.status === 201) {
             getReviews();
             handleClose();
             Swal.fire(
                 'Actualizada!',
                 'Tu reseña ha sido Actualizada con exito.',
                 'success'
             )
         }

    }
    return (
        <>
            <NavBarMenu view={""}></NavBarMenu>
            <Container fluid style={{ background: "#F0F2F5" }}>
                <Row>
                    <Col xs={3} className="sidebarEasy">
                        <MenuLateral view={"MyReviews"}></MenuLateral>
                    </Col>
                    <Col xs={9}>
                        <Container fluid>
                            <Row className="my-2">

                                <>
                                    {
                                        (reviews.length > 0) ? createCards()
                                            : <h4>Sin datos por mostrar</h4>
                                    }
                                </>
                                <Modal show={show} onHide={handleClose}
                                    size="lg"
                                    centered
                                    backdrop="static"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Modificar Reseña</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Row className="my-3">
                                            <Col className="d-flex justify-content-center">
                                                <Rating
                                                    name="stars"
                                                    value={(resena.stars) ? parseInt(resena.stars) : 0}
                                                    size="large"
                                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                    onChange={(event) => handleChange(event)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="my-3">
                                            <FormGroup>
                                                <TextField
                                                    name="comment"
                                                    value={(resena.comment) ? resena.comment : ""}
                                                    label="Nuevo comentario"
                                                    multiline
                                                    onChange={(event) => handleChange(event)}
                                                />
                                            </FormGroup>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button className="mx-2" variant="contained" size="large" color="error" onClick={handleClose}>
                                            Cancelar
                                        </Button>
                                        <Button className="mx-2" variant="contained" size="large" color="success" onClick={() => { updateResena(review._id) }}>
                                            Actualizar
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>

    )
}

export default Views