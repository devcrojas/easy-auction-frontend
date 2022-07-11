import React, { useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Card, CardContent, CardMedia, Typography, CardActionArea, ListItem, CardHeader, Avatar } from '@mui/material'
import 'react-slideshow-image/dist/styles.css'
import { Zoom } from 'react-slideshow-image';

const ProductCard = (props) => {
    // Manejadores para cerrar o mostrar el modal del producto
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    // Se obtienen los datos necesarios para el card del producto
    const producto = props.product;
    let initialDate = new Date(producto.auctionDate.initialD).toLocaleDateString();
    let finalDate = new Date(producto.auctionDate.final).toLocaleDateString() + ' ' + new Date(producto.auctionDate.final).toLocaleTimeString();
    let imag = (producto.file) ? producto.file.filePath : 'uploads\\sin.jpg'
    // Funcion para mostrar el slider con las fotos del producto
    const showSlider = (detImages,principal) => {
        if (detImages.length >= 1) {
            return (
                <Zoom scale={0.4}>
                    <img style={{ width: "100%", height: 350, border: 5 }} src={`\\${principal.filePath}`} alt={principal.nameProduct} />
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
        <Card sx={{ width:'100%',height:'100%', borderRadius: 5,  marginBottom: 10 }} elevation={10} key={producto._id}>
            <CardActionArea onClick={ () => { handleShow(); }}>
                <CardHeader avatar={ <Avatar src={producto.sellerData.file.filePath} /> }
                            title={producto.sellerData.firstName + " " + producto.sellerData.lastName}
                            subheader={producto.sellerData.email} />
                <Row className="justify-content-center my-2">
                    <CardMedia  id={producto._id}
                                component="img"
                                image={`\\${imag}`}
                                alt={producto.nameProduct}
                                sx={{ width: 350,height: 350 }} />
                </Row>
                <CardContent>
                    <Row className='my-2'>
                        <Col>
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

        <Modal show={show} size="xl"  centered onHide={handleClose} >
            <Modal.Header closeButton>
                <h1> {producto.nameProduct}</h1>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <div className="slide-container" sx={{ width: '75%', height: 'auto' }}>
                                { showSlider(producto.files,producto.file) }
                        </div>
                    </Col>
                    <Col md={6} className="fuente">
                        <p>Categoria: {producto.category}</p>
                        <p>Material: {producto.description.material}</p>
                        <p>Marca: {producto.description.marca}</p>
                        <p>Dimensiones: {producto.description.dimensions}</p>
                        <p>Condicion: {producto.description.actualCondition}</p>
                        <p>Observaciones: {producto.description.observations}</p>
                        <p>Precio inicial:${producto.price.initialP}</p>
                        <p>Comprar ahora:${producto.price.buyNow}</p>
                        <p>Precio ofertado:${producto.price.offered}</p>
                        <p>Inicio subasta:{initialDate}</p>
                        <p>Fin de la subasta: {finalDate}</p>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    </>
)
}
export default ProductCard