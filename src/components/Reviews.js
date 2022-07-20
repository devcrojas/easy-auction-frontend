<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa";
import { Container, Row, Col, Card, CardMedia } from 'react-bootstrap';
//import { Card, CardContent, CardMedia, Typography, CardActionArea, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
//import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
//import 'react-slideshow-image/dist/styles.css';
//import { Zoom } from 'react-slideshow-image';
import AuthService from '../services/auth.service'


const colors = {
  yellow: "#ECFF00",
  grey: "#a9a9a9"
}

function Reviews() {
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
                <Col align="left">Por:<Card.Title>{review.profileData.lastName + ' ' + review.profileData.firstName}</Card.Title></Col>

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

export default Reviews
=======
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Container, Button, Row, Card, Form, Col } from "react-bootstrap";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import AuthService from '../services/auth.service'

import "../nav.css"
import NavBarMenu from './NavBarMenu'
import MenuLateral from './MenuLateral';

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
    const [user] = useState(AuthService.getCurrentUser());
    const [selectProducts, setSelectProducts] = useState('');

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
                                <Card.Header className='text-center bg-dark text-white' style={{ width: "100%" }}>Cuéntanos como te fue</Card.Header>
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
                                            <Row>&nbsp;</Row>
                                            <Row>
                                                <FormControl className='w-100 my-2'>
                                                    <InputLabel id="productos">Productos</InputLabel>
                                                    <Select onChange={handleChange} displayEmpty labelId="productos" value={selectProducts}>

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
                                                <Form.Group className="mb-3" controlId="comentario">
                                                    <Form.Label>¿Qué te parecio la subasta?</Form.Label>
                                                    <Form.Control as="textarea" rows="3" value={comentario} onChange={(event) => setComentario(event.target.value)} />
                                                </Form.Group>
                                            </Row>
                                            <Row>&nbsp;</Row>
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
>>>>>>> remotes/origin/staging
