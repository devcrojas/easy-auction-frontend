import React, { useEffect, useState } from 'react';
import { Container, Col, Modal, Row } from 'react-bootstrap';
import { Card, CardContent, CardMedia, Typography, CardActionArea, ListItem, CardHeader, Avatar } from '@mui/material'
import { Zoom } from 'react-slideshow-image';
import NavBarMenu from './NavBarMenu';
import MenuLateral from './MenuLateral';
import profile from './Profile';
import 'react-slideshow-image/dist/styles.css'
import AuthService from '../services/auth.service';

function MyShoppings() {
    const [show, setShow] = useState(false);
    const [detalle, setDetalles] = useState({
        "_id": "",
        "nameProduct": "",
        "category": "",
        "description": {
            "material": "",
            "marca": "",
            "dimensions": "",
            "actualCondition": "",
            "observations": ""
        },
        "price": {
            "initialP": 0,
            "buyNow": 0,
            "offered": 0
        },
        "auctionDate": {
            "initialD": "",
            "final": ""
        },
        "files": [],
        "file": {},
    });


    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [products, setProducts] = useState([]);
    let user = AuthService.getCurrentUser();
    let userAuth = user.id;

    useEffect(() => {
        getMyEarnedProducts()
    }, []);

    const product = { profileWin: userAuth };
    let getMyEarnedProducts = async function () {
        let fProducts = await fetch("http://localhost:8080/api/products/myearnedproducts",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        }
        );
        let productsJson = await fProducts.json();
        setProducts(productsJson);
        //console.log(productsJson);
        return;
    };

    const cards = () => {
        let card = products.map((meproducto) => {
            let initialDate = new Date(meproducto.auctionDate.initialD).toLocaleDateString();
            let finalDate = new Date(meproducto.auctionDate.final).toLocaleDateString() + ' ' + new Date(meproducto.auctionDate.final).toLocaleTimeString();
            let imag = (meproducto.file) ? meproducto.file.filePath : 'uploads\\sin.jpg' 
            return (
                <Col sx={12} lg={6} key={meproducto._id} className='mb-5'>
                <Card sx={{ width:'100%', height:'100%', borderRadius: 5,  marginBottom: 10, marginTop: 1 }} elevation={10} key={meproducto._id}>
                    <CardActionArea onClick={ () => {
                        setDetalles(products.find(product => product._id === meproducto._id));
                        handleShow();
                    }}>
                        <CardHeader
                            avatar={
                                <Avatar src={meproducto.email.file.filePath} />
                            }
                            title={meproducto.email.firstName + " " + meproducto.email.lastName}
                            subheader={meproducto.email.email} />
                        <Row className="justify-content-center my-2">
                            <CardMedia id={meproducto._id}
                                    component="img"
                                    image={`\\${imag}`}
                                    alt={meproducto.nameProduct}
                                    className='modal-image' />
                        </Row>
                        <CardContent>
                            <Row className='my-2'>
                                <Col >
                                    <div className='w-100'>
                                        <div><Typography component="div" variant="h5">{meproducto.nameProduct}</Typography></div>
                                        <div><Typography component="div" >{meproducto.category}  </Typography></div>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='my-2'>
                                <Col >
                                    <div className='w-100'>
                                        <div><Typography component="div">Precio inicial: </Typography></div>
                                        <div><Typography component="div"><em><b>$</b></em> {meproducto.price.initialP} </Typography></div>
                                    </div>
                                </Col>
                                <Col >
                                    <div className='w-100'>
                                        <div><Typography component="div">Fecha inicio: </Typography></div>
                                        <div><Typography component="div">{initialDate} </Typography></div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className='my-2'>
                                <Col>
                                    <div className='w-100'>
                                        <div><Typography component="div">En posesión</Typography></div>
                                    </div>
                                </Col>
                                <Col>
                                    <div className='w-100'>
                                        <div><Typography component="div">Fecha fin: </Typography></div>
                                        <div><Typography component="div">{finalDate} </Typography></div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className='my-5'>
                                <Col></Col>
                                <Col>
                                    <ListItem>
                                        <Typography component="div" color='success'>Comprado por: <em><b>$</b></em></Typography>
                                        <Typography component="div" className="text-success">{meproducto.price.offered} </Typography>
                                    </ListItem>
                                </Col>
                            </Row>
                        </CardContent>
                    </CardActionArea>
                </Card>
               </Col>
            )
        });
        return card
    }

    function verModal(detalle) {
        let initialDate = new Date(detalle.auctionDate.initialD).toLocaleDateString();
        let finalDate = new Date(detalle.auctionDate.final).toLocaleDateString() + ' ' + new Date(detalle.auctionDate.final).toLocaleTimeString();
        return (
            <Modal show={show} size="xl"  centered onHide={handleClose} >
                <Modal.Header closeButton>
                 <h1> {detalle.nameProduct}</h1>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <div className="slide-container" sx={{ width: '75%', height: 'auto' }}>
                                <>
                                    {
                                        showSlider(detalle.files,detalle.file)
                                    }
                                </>
                            </div>
                        </Col>
                        <Col md={6} className="fuente">
                            <br></br>
                            <p>Categoria: {detalle.category}</p>
                            <p>Material: {detalle.description.material}</p>
                            <p>Marca: {detalle.description.marca}</p>
                            <p>Dimensiones: {detalle.description.dimensions}</p>
                            <p>Condicion: {detalle.description.actualCondition}</p>
                            <p>Observaciones: {detalle.description.observations}</p>
                            <p>Precio inicial: ${detalle.price.initialP}</p>
                            <p>Comprado por: ${detalle.price.offered}</p>
                            <p>Inicio subasta: {initialDate}</p>
                            <p>Fin de la subasta: {finalDate}</p>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal >
        )
    }

    function showSlider(detImages,principal) {

        if (detImages.length >= 1) {
            return (
                <Zoom scale={0.4}>
                    <img  style={{ width: "100%", height: 350, border: 5 }} src={`\\${principal.filePath}`} alt={principal.nameProduct} />
                    {
                        detImages.map(((im, index) => {
                            return <img key={index} style={{ width: "100%", height: 350, border: 5 }} src={`\\${im.filePath}`} alt={index} />
                        }))
                    }
                </Zoom>
            );
        }else{
            return <img  style={{ width: "100%", height: 350, border: 5 }} src={`\\${principal.filePath}`} alt={principal.nameProduct} />
        }
    }

    return (
        <>
            <NavBarMenu view={"Products"} user={user.profile}></NavBarMenu>
                <Container fluid style={{ background: "#F0F2F5" }}>
                    <Row>
                    <Col xs={3} className="sidebarEasy">
                        <MenuLateral view={""} imgProfile={profile.file}></MenuLateral>
                    </Col>
                    <Col xs={9}>
                    <Container>
                        <Row md="auto" className='d-flex justify-content-around mt-5'>
                            <>
                                {
                                    cards()
                                }
                            </>
                        </Row>
                            <>
                                {
                                    verModal(detalle)
                                }
                            </>
                    </Container>
                    </Col>
                    </Row>
                </Container>
        </>
    )
}

export default MyShoppings;