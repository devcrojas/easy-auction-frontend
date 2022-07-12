import React, { useEffect, useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { Card, CardContent, CardMedia, Typography, CardActionArea, ListItem, CardHeader, Avatar } from '@mui/material'
import 'react-slideshow-image/dist/styles.css'
import { Zoom } from 'react-slideshow-image';

function ProductsCards() {

    const [show, setShow] = useState(false);
    const [apis, setApis] = useState([]);
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

    useEffect(() => {
        getProductos()
    }, [])

    let getProductos = async function () {
        let produc = await fetch("/api/products",
            {
                method: "GET"
            }
        );
        let awProduc = await produc.json();
        setApis(awProduc);
        return;
    };

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const cards = () => {
        let card = apis.map((producto) => {
            let initialDate = new Date(producto.auctionDate.initialD).toLocaleDateString();
            let finalDate = new Date(producto.auctionDate.final).toLocaleDateString() + ' ' + new Date(producto.auctionDate.final).toLocaleTimeString();
            let imag = (producto.file) ? producto.file.filePath : 'uploads\\sin.jpg' 
            return (
                <Col sx={12} lg={6} key={producto._id} className='mb-5'>
                <Card sx={{ width:'100%',height:'100%', borderRadius: 5,  marginBottom: 10 }} elevation={10} key={producto._id}>
                    <CardActionArea onClick={ () => {
                        setDetalles(apis.find(product => product._id === producto._id));
                        handleShow();
                    }}>
                        <CardHeader
                            avatar={
                                <Avatar src={producto.sellerData.file.filePath} />
                            }
                            title={producto.sellerData.firstName + " " + producto.sellerData.lastName}
                            subheader={producto.sellerData.email} />
                        <Row className="justify-content-center my-2">
                            <CardMedia
                                id={producto._id}
                                component="img"
                                image={`\\${imag}`}
                                alt={producto.nameProduct}
                                sx={{ width: 350,height: 350 }}
                                />
                        </Row>
                        <CardContent>
                            <Row className='my-2'>
                                <Col >
                                    <div className='w-100'>
                                        <div><Typography component="div" variant="h5">{producto.nameProduct}</Typography></div>
                                        <div><Typography component="div" >{producto.category}  </Typography></div>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='my-2'>
                                <Col >
                                    <div className='w-100'>
                                        <div><Typography component="div">Precio inicial: </Typography></div>
                                        <div><Typography component="div"><em><b>$</b></em> {producto.price.initialP} </Typography></div>
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
                                        <div><Typography component="div">Comprar ahora: </Typography></div>
                                        <div><Typography component="div"><em><b>$</b></em>  {producto.price.buyNow} </Typography></div>
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
                                        <Typography component="div" variant='h5' color='success'>Ofertado:<em><b>$</b></em></Typography>
                                        <Typography component="div" variant='h5' className="text-success">{producto.price.offered} </Typography>
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
                            <p>Categoria: {detalle.category}</p>
                            <p>Material: {detalle.description.material}</p>
                            <p>Marca: {detalle.description.marca}</p>
                            <p>Dimensiones: {detalle.description.dimensions}</p>
                            <p>Condicion: {detalle.description.actualCondition}</p>
                            <p>Observaciones: {detalle.description.observations}</p>
                            <p>Precio inicial:${detalle.price.initialP}</p>
                            <p>Comprar ahora:${detalle.price.buyNow}</p>
                            <p>Precio ofertado:${detalle.price.offered}</p>
                            <p>Inicio subasta:{initialDate}</p>
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
        </>
    )
}

export default ProductsCards;