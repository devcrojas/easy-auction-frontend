import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Container, Button, Row, Card, Form, Col } from "react-bootstrap";
import { TextField } from '@mui/material';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import AuthService from '../services/auth.service'
import "../nav.css"
import NavBarMenu from './NavBarMenu'
import MenuLateral from './MenuLateral';

//Estilos de las estrellas
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
    const [product, setProduct] = useState([]);
    const [comentario, setComentario] = useState("");
    const [tipo, setTipo] = useState("");
    const [user, setUser] = useState(AuthService.getCurrentUser());
    const [selectProducts, setSelectProducts] = useState('');

    //useEffect para traer los productos
    useEffect(() => {
        getProducts()
    }, [])
    let getProducts = async function () {
        let prod = await fetch('/api/products',
            {
                method: 'GET'
            });
        let awProduc = await prod.json();
        setProduct(awProduc);
    }
    //Muestra el tipo dependiendo las estrellas
    const handleClick = value => {
        setEstrellas(value)
        if (value <= 2) {
            setTipo("Pésimo Servicio")
        }
        else {
            setTipo("Excelente servicio")
        }
    };
    const handleChange = (event) => {
        setSelectProducts(event.target.value)
    }
    const handleMouseOver = value => {
        setHoverValue(value)
    };
    const handleMouseLeave = () => {
        setHoverValue(undefined)
    }
    //Envia los datos al back
    const sendReview = async () => {
        
        let emailSeller = product.filter((e) => e._id === selectProducts);
        const resena = {
            emailU: user.profile.email,
            productId: selectProducts,
            comment: comentario,
            stars: estrellas,
            type: tipo,
            emailP: emailSeller[0].sellerData.email

        }
        //Envia la reseña
        let resp = await fetch('/api/reviews/',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resena)
            })
        if (resp.status === 201) {
            Swal.fire({
                icon: 'success',
                title: '¡Tu Comentario se envió con éxito!',
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        setEstrellas(0);
                        setComentario("");
                        setTipo("");
                        setSelectProducts('');
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

    return (
        <>
            <NavBarMenu view={"Reviews"}></NavBarMenu>
            <Container style={{ background: "#F0F2F5" }} fluid>
                <Row>
                    <Col xs={3} className="sidebarEasy">
                        <MenuLateral view={"MyReviews"}></MenuLateral>
                    </Col>
                    <Col xs={9}>
                        <Row className="justify-content-center align-items-center">
                            <Card style={{ width: '50%', padding: "0" }} className="m-3">
                                <Card.Header className='text-center bg-dark text-white' style={{ width: "100%" }}>¿Cómo estuvo tu experiencia?</Card.Header>
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
                                                                    onMouseLeave={handleMouseLeave}

                                                                />
                                                            )
                                                        })}
                                                    </div>
                                                </Form.Group>
                                            </Row>
                                            <Row>&nbsp;</Row>
                                            <Row>
                                                <Form.Group>
                                                    <Form.Control className='text-center bg-danger text-white' value={tipo} onChange={(handleClick) => setTipo()} disabled />
                                                </Form.Group>
                                            </Row>
                                            <Row>
                                                <FormControl className='w-100 my-5'>
                                                    <InputLabel id="productos">Productos</InputLabel>
                                                    <Select onChange={handleChange} displayEmpty labelId="productos" label="Productos" value={selectProducts}>

                                                        {
                                                            product.map((product) => {
                                                                return <MenuItem value={product._id} key={product._id}>{product.nameProduct}</MenuItem>
                                                            }
                                                            )
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <FormControl className='w-100 my-2' controlId="comentario">
                                                    <TextField required id="outlined-multiline-flexible" value={comentario} label="¿Qué te pareció tu producto?" multiline maxRows={4} onChange={(event) => setComentario(event.target.value)} />
                                                    </FormControl>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <Button variant="primary" type="button" className='btn btn-success text-center' onClick={sendReview}>
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

export default Reviews;