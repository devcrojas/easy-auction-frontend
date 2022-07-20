import React, { useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Card, CardContent, CardMedia, Typography, CardActionArea, ListItem, CardHeader, Avatar, Button } from '@mui/material'
import 'react-slideshow-image/dist/styles.css'
import { Zoom } from 'react-slideshow-image';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import axios from 'axios';

const ProductCard = (props) => {
    // Manejadores para cerrar o mostrar el modal del detalle del producto
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    // Se obtienen los datos necesarios para el card del producto
    const producto = props.product;
    let initialDate = new Date(producto.auctionDate.initialD).toLocaleDateString();
    let finalDate = new Date(producto.auctionDate.final).toLocaleDateString() + ' ' + new Date(producto.auctionDate.final).toLocaleTimeString();
    let imag = (producto.file) ? producto.file.filePath : 'uploads\\sin.jpg'
    // Se obtienen las opciones por vista
    let editOptions;
    // Opciones dependiendo de la vista
    if(props.actualView === 'myProducts'){
        switch (producto.status) {
            case 'active':
                editOptions = 
                    <>
                        <h5 className='text-success'>ACTIVA</h5>
                    </>
            break;
            case 'inactive':
                editOptions = 
                    <>
                        <Button variant="contained" color="warning" className='w-25 rounded-5 mx-2' onClick={() => {window.location.href = "/updateProduct/"+producto._id}}>
                            <BorderColorIcon/>
                        </Button>
                        <Button variant="contained" color="error" className='w-25 rounded-5 mx-2' onClick ={() => cancelProduct()}>
                            <DeleteForeverIcon/>
                        </Button>
                    </>
            break;
            case 'cancelled':
                editOptions = 
                    <>
                        <h5 className='text-danger'>CANCELADA</h5>
                    </>
            break;
        
            default:
            break;
        }
    }
    const cancelProduct = async () => {
        
        Swal.fire({
            title: '¿Estas seguro de cancelar la subasta?',
            text: "No podras deshacer esta accion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cancelar subasta',
            cancelButtonText: 'Volver',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Prepara los datos para su envio
                const cancelObject = {
                    status: 'cancelled',
                    id:producto._id
                }
                //Realiza la peticion
                let resp = await axios.put('/api/products/status/'+producto._id,JSON.stringify(cancelObject),{
                        headers: { 'Authorization': localStorage.getItem("token"),
                                'Content-Type': 'application/json' }});
                // Obtiene la respuesta
                if(resp.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Ah cancelado la subasta de forma exitosa!'
                    })
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error: '+resp.status,
                        text: resp.statusText,
                    })
                }
            }
        });

    }
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
        <Card sx={{ height:'100%', borderRadius: 5,  marginBottom: 10 }} elevation={10} key={producto._id}>
                <CardHeader avatar={ <Avatar src={producto.email.file.filePath} /> }
                            title={producto.email.firstName + " " + producto.email.lastName}
                            subheader={producto.email.email} 
                            action={editOptions}/>
                <CardActionArea onClick={ () => { handleShow(); }}>
                    <Row className="justify-content-center my-2">
                        <div className="modal-image-container">
                            <CardMedia id={producto._id}
                                    component="img"
                                    image={`\\${imag}`}
                                    alt={producto.nameProduct}
                                    className='modal-image' />
                        </div>
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
        {/* Modal que muestra la informacion de los productos */}
        <Modal show={show} size="xl" centered onHide={handleClose} >
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
