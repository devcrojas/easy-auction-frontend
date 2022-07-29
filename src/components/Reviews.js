import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Container, Button, Row, Card, Form, Col } from "react-bootstrap";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import { FormControl, Typography, Tooltip } from '@mui/material';

import AuthService from '../services/auth.service'

import "../nav.css"
import NavBarMenu from './NavBarMenu'
import MenuLateral from './MenuLateral';
import { useLocation } from 'react-router-dom';

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

function Reviews() {
    const stars = Array(5).fill(0);
    const [estrellas, setEstrellas] = useState(0);
    const [hoverValue, setHoverValue] = useState();
    const [product, setProduct] = useState({});
    const [comentario, setComentario] = useState("");
    const [tipo, setTipo] = useState("");
    const [user] = useState(AuthService.getCurrentUser());
    //const [selectProducts, setSelectProducts] = useState('');

    const location = useLocation();
    //console.log(location.state);

    let getProducts;
    useEffect(() => {
        getProducts()
    }, [])
    /* useEffect(() => {
        
    }, []) */// eslint-disable-line react-hooks/exhaustive-deps
    if (location.state) {
        getProducts = async function () {
            let prod = await fetch('/api/products/' + location.state,
                {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") },
                });
            let awProduc = await prod.json();
            setProduct(awProduc);
        }
    } else {
        getProducts = async function () { }
    }

    const handleClick = value => {
        setEstrellas(value)
        switch (value) {
            case 1:
                setTipo("Pésimo producto")
                break;
            case 2:
                setTipo("No me gusto el producto")
                break;
            case 3:
                setTipo("Buen producto")
                break;
            case 4:
                setTipo("Me gusto el producto")
                break;
            case 5:
                setTipo("Excelente producto")
                break;
            default:
                setTipo("No se pudo leer la calificacion")
                break;
        }
    };
    const handleMouseOver = value => {
        setHoverValue(value)
    };
    const handleMouseLeave = () => {
        setHoverValue(undefined)
    }

    let sendReview;
    if (product.review !== 'ocuped') {
        sendReview = async () => {
            const resena = {
                userLog: user.id,
                comment: comentario,
                stars: estrellas,
                type: tipo,
                product: product._id,
                profile: product.profile,
                status: 'active'
            }
            const rewprod = {
                review: 'ocuped'
            }
            let resp = await fetch('/api/reviews/',
                {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token"), 'Content-Type': 'application/json' },
                    body: JSON.stringify(resena)
                })
            let resprp = await fetch('/api/products/review/' + product._id,
                {
                    method: 'PUT',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token"), 'Content-Type': 'application/json' },
                    body: JSON.stringify(rewprod)
                })
            if (resp.status === 201 && resprp.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Tu Comentario se envió con éxito!',
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            setEstrellas(0);
                            setComentario("");
                            setTipo("");
                            window.location.href = "/misresenas"
                            /* setSelectProducts(''); */
                        }
                    })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Ah ocurrido un error inesperado!',
                })
            }

        }
    } else {
        Swal.fire({
            title: 'Ya reseñaste este producto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#00BFFF',
            confirmButtonText: 'Ver mis reseñas',
            cancelButtonText: 'Regresar a mis compras',
        }).then(async (result) => {
            if (result.isConfirmed) {
                window.location.href = "/misresenas"
            } else {
                window.location.href = "/miscompras"
            }
        })
    }

    //Funcion para validar si el boton se bloquea o no
    const validateButton = () => {
        if (estrellas === '' || comentario === '' || tipo === '' || location.state === null) {
            return true;
        }
    }

    return (
        <>
            <NavBarMenu view={"Reviews"}></NavBarMenu>
            <Container style={{ background: "#F0F2F5" }} fluid>
                <Row>
                    <Col xs={3} id="sidebarEasy" className="sidebarEasy">
                        <MenuLateral view={"MyShops"}></MenuLateral>
                    </Col>
                    <Col xs={9}>
                        <Row className="justify-content-center align-items-center">
                            <Card style={{ width: '50%', padding: "0" }} className="m-3">
                                <Card.Header className='text-center bg-dark text-white' style={{ width: "100%" }}>Qué te parecio el producto</Card.Header>
                                <Card.Body>
                                    <Form className='text-center'>
                                        <Form.Group className="mb-3" controlId="stars">
                                            <Row>
                                                <Form.Group className='text-center'>
                                                    <div style={styles.stars}>
                                                        {stars.map((_, index) => {
                                                            return (
                                                                <FaStar
                                                                    key={index}
                                                                    size={30}
                                                                    style={{
                                                                        marginRight: 10,
                                                                        cursor: "pointer"
                                                                    }}
                                                                    color={(hoverValue || estrellas) > index ? colors.yellow : colors.grey}
                                                                    onClick={() => handleClick(index + 1)}
                                                                    onMouseOver={() => handleMouseOver(index + 1)}
                                                                    className="justify-content-end me-3"
                                                                    onMouseLeave={handleMouseLeave}
                                                                />
                                                            )
                                                        })}
                                                    </div>
                                                </Form.Group>
                                            </Row>
                                            <Row>&nbsp;</Row>
                                            <Row>
                                                {(estrellas <= 2) ?
                                                    <Form.Group>
                                                        <Form.Control className='text-center bg-danger text-white' value={tipo} onChange={(handleClick) => setTipo()} disabled />
                                                    </Form.Group>
                                                    :
                                                    <Form.Group>
                                                        <Form.Control className='text-center bg-success text-white' value={tipo} onChange={(handleClick) => setTipo()} disabled />
                                                    </Form.Group>
                                                }
                                            </Row>
                                            <Row>&nbsp;</Row>
                                            <Row>
                                                {(location.state) ?
                                                    <FormControl className='w-100 my-2'>
                                                        <div><Typography component="div" className="text-center" style={{ fontSize: "1rem" }}>Producto:</Typography></div>
                                                        <div className='text-center' style={{ backgroundColor: "grey", color: "white", borderRadius: "10px" }}><Typography component="div" variant="h6" style={{ fontWeight: "600" }}>{product.nameProduct}</Typography></div>
                                                    </FormControl>
                                                    :
                                                    <FormControl className='w-100 my-2' style={{ paddingBottom: '1rem' }}>
                                                        <div><Typography component="div" className="text-center" style={{ fontSize: "1rem" }}>Seleccione un producto de sus compras que ya le hayan entregado.</Typography></div>
                                                        <Tooltip title="Mis compras">
                                                            <Button variant="contained" type="button" className='btn btn-info text-center' onClick={() => { window.location.href = "/miscompras" }} style={{ color: 'white' }}>
                                                                Ir a Mis Compras
                                                            </Button>
                                                        </Tooltip>
                                                    </FormControl>
                                                }
                                            </Row>
                                            <Row>
                                                <Form.Group className="mb-3" controlId="comentario">
                                                    <Form.Label>¿Qué te parecio el producto?</Form.Label>
                                                    <Form.Control as="textarea" rows="3" value={comentario} onChange={(event) => setComentario(event.target.value)} />
                                                </Form.Group>
                                            </Row>
                                            <Row>&nbsp;</Row>
                                        </Form.Group>
                                        <Button variant="primary" type="button" className='btn btn-success text-center' onClick={sendReview} disabled={validateButton()}>
                                            Enviar
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Reviews
