import React, { useState, useEffect } from 'react';
import { Col, Modal, Row, Badge } from 'react-bootstrap';
import { Card, CardContent, CardMedia, Typography, CardActionArea, CardHeader, Avatar, Button, Tooltip } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CategoryIcon from '@mui/icons-material/Category';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CarpenterIcon from '@mui/icons-material/Carpenter';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PaidIcon from '@mui/icons-material/Paid';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import 'react-slideshow-image/dist/styles.css'
import { Zoom } from 'react-slideshow-image';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import axios from 'axios';
import ProductsOffers from './ProductsOffers'


const ProductCard = (props) => {
    // Manejadores para cerrar o mostrar el modal del detalle del producto
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [product, setProduct] = useState({email:{file:{ filePath: null }}, price:{}, files:[], file: {filePath: null }, description: {}});
    const [initialDate, setInitialDate] = useState(null);
    const [finalDate, setFinalDate] = useState(null);
    const [imag, setImag] = useState(null);
    const [offered, setOffered] = useState();

    useEffect(()=>{
        setProduct(props.product);
        setInitialDate(new Date(props.product.auctionDate.initialD).toLocaleDateString() + ' ' + new Date(props.product.auctionDate.final).toLocaleTimeString());
        setFinalDate(new Date(props.product.auctionDate.final).toLocaleDateString() + ' ' + new Date(props.product.auctionDate.final).toLocaleTimeString());
        setImag((props.product.file) ? props.product.file.filePath : 'uploads\\sin.jpg');
        setOffered((typeof props.product.price.offered === "undefined") ? "0" : props.product.price.offered)
        //console.log(props.product);
    },[])   
    // Se obtienen los datos necesarios para el card del producto
    const producto = props.product;

    // Se obtienen las opciones por vista
    let editOptions;
    let viewOptions;
    // Opciones dependiendo de la vista
    if (props.actualView === 'myProducts') {
        switch (producto.status) {
            case 'active':
                editOptions =
                    <>
                        <h5 className='text-success'>SUBASTA ACTIVA</h5>
                    </>
                break;
            case 'inactive':
                editOptions =
                    <>
                        <Tooltip title="Editar subasta">
                            <Button variant="contained" color="warning" className='w-25 rounded-5 mx-2' onClick={() => { window.location.href = "/updateProduct/" + producto._id }}>
                                <BorderColorIcon />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Cancelar subasta">
                            <Button variant="contained" color="error" className='w-25 rounded-5 mx-2' onClick={() => cancelProduct()}>
                                <DeleteForeverIcon />
                            </Button>
                        </Tooltip>
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
    if (props.actualView === 'productsList') {
       
        viewOptions = function (product) {
            return (<> <Row>
                <Col style={{ paddingRight: "0" }}>
                    <ProductsOffers setOffered={setOffered} product={product} pointsUser={props.pointsUser} setPoints={props.setPoints}  variant="contained" color="info">Comprar ahora</ProductsOffers>
                </Col>
                <Col style={{ paddingLeft: "0" }}>
                    <Button style={{ width: "100%", borderRadius: "0"}} variant="contained" color="info">Comprar ahora</Button>
                </Col>
            </Row>
            </>);
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
                    id: producto._id
                }
                //Realiza la peticion
                let resp = await axios.put('/api/products/status/' + producto._id, JSON.stringify(cancelObject), {
                    headers: {
                        'Authorization': localStorage.getItem("token"),
                        'Content-Type': 'application/json'
                    }
                });
                // Obtiene la respuesta
                if (resp.status === 200) {
                    document.getElementById(producto._id).style.display = "none";
                    Swal.fire({
                        icon: 'success',
                        title: '¡Ah cancelado la subasta de forma exitosa!'
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error: ' + resp.status,
                        text: resp.statusText,
                    })
                }
            }
        });

    }
    // Funcion para mostrar el slider con las fotos del producto
    const showSlider = (detImages, principal) => {
        if (detImages.length >= 1) {
            return (
                    <div className="modal-image-body-container">
                <Zoom scale={0.4}>
                        <img className='modal-image' src={`\\${principal.filePath}`} alt={principal.nameProduct} />
                        {
                            detImages.map(((im, index) => {
                                return <img key={index} className='modal-image' src={`\\${im.filePath}`} alt={index} />
                            }))
                        }
                </Zoom>
                    </div>
            );
        } else {
            return <img style={{ width: "100%", height: "auto", border: 5 }} src={`\\${principal.filePath}`} alt={principal.nameProduct} />
        }
    }
    return (
        <>
            <Card sx={{ height: '100%', borderRadius: 5 }}
                elevation={10} key={product._id} id={product._id}>
                    {(producto.profile) ?
                        <>
                            <CardHeader avatar={<Avatar src={producto.profile.file.filePath} />}
                                title={producto.profile.firstName + " " + producto.profile.lastName}
                                subheader={producto.profile.email}
                                action={editOptions} />
                        </>
                        :
                        <>
                            <CardHeader avatar={<Avatar src={producto.email.file.filePath} />}
                                title={producto.email.firstName + " " + producto.email.lastName}
                                subheader={producto.email.email}
                                action={editOptions} />
                        </>
                    }
                <CardActionArea onClick={() => { handleShow(); }}>
                    <Row className="justify-content-center my-2">
                        <div className="modal-image-container">
                            <CardMedia id={product._id}
                                component="img"
                                image={`\\${imag}`}
                                alt={product.nameProduct}
                                className='modal-image' />
                        </div>
                    </Row>
                    <CardContent>
                        <Row className='my-2'>
                            <Col>
                                <div className='w-100'>
                                    <div className='text-center' style={{ minHeight: "6rem" }}><Typography component="div" variant="h6" >{product.nameProduct}</Typography></div>
                                    <div><Typography component="div" className="text-center" ><Badge bg="secondary" style={{ fontSize: "1rem" }}>{product.category}</Badge>  </Typography></div>
                                </div>
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col >
                                <div className='w-100'>
                                    <div><Typography component="div" className="text-center"  style={{ fontSize: "1rem" }}>Precio inicial </Typography></div>
                                    <div><Typography component="div" className="text-center" ><Badge bg="success" style={{ fontSize: "1rem" }}><em><b>$</b></em> {product.price.initialP}</Badge> </Typography></div>
                                </div>
                            </Col>
                            <Col >
                                <div className='w-100'>
                                    <div><Typography component="div" className="text-center"  style={{ fontSize: "1rem" }}>Fecha inicio</Typography></div>
                                    <div><Typography component="div" className="text-center" ><Badge bg="dark" style={{ fontSize: "1rem" }}>{initialDate}</Badge> </Typography></div>
                                </div>
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col>
                                <div className='w-100'>
                                    {(props.actualView === 'myShoppings') ?
                                        <>
                                            <div><Typography component="div">En posesion</Typography></div>
                                        </>
                                        :
                                        <>
                                            <div><Typography component="div" className="text-center"  style={{ fontSize: "1rem" }}>Comprar ahora</Typography></div>
                                            <div><Typography component="div" className="text-center" > <Badge bg="info" style={{ fontSize: "1rem" }}> <em><b>$</b></em>  {product.price.buyNow} </Badge></Typography></div>
                                        </>
                                    }
                                </div>
                            </Col>
                            <Col>
                                <div className='w-100'>
                                    <div><Typography component="div" style={{ fontSize: "1rem" }} className="text-center" >Fecha fin</Typography></div>
                                    <div><Typography component="div" className="text-center" > <Badge bg="dark" style={{ fontSize: "1rem" }}>{finalDate} </Badge></Typography></div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Typography component="div" variant='h5' color='success' className='text-center'>Ofertado<em className='text-success'><b>${offered}</b></em></Typography>
                            </Col>
                        </Row>
                    </CardContent>
                </CardActionArea>
                {(props.actualView === 'productsList') ? viewOptions(product) : ""}
            </Card>
            <Modal show={show} size="xl" centered onHide={handleClose} >
                <Modal.Header closeButton>
                    <h1> {product.nameProduct}</h1>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <div className="slide-container" sx={{ width: '75%', height: 'auto' }}>
                                {showSlider(product.files, product.file)}
                            </div>
                        </Col>
                        <Col md={6} className="fuente">
                            <p><CategoryIcon color="primary" /> Categoria: {product.category}</p>
                            <p><CarpenterIcon color="primary" /> Material: {product.description.material}</p>
                            <p><AssignmentTurnedInIcon color="primary" /> Marca: {product.description.marca}</p>
                            <p><SquareFootIcon color="primary" /> Dimensiones: {product.description.dimensions}</p>
                            <p><NewReleasesIcon color="primary" /> Condicion: {product.description.actualCondition}</p>
                            <p><RemoveRedEyeIcon color="primary" /> Observaciones: {product.description.observations}</p>
                            <p><PaidIcon color="primary" /> Precio inicial:<em><b>$</b></em>{product.price.initialP}</p>
                            <p><PaidIcon color="primary" /> Comprar ahora:<em><b>$</b></em>{product.price.buyNow}</p>
                            <p><PaidIcon color="primary" /> Precio ofertado:<em><b>$</b></em>{product.price.offered}</p>
                            <p><CalendarMonthIcon color="primary" /> Inicio subasta:{initialDate}</p>
                            <p><CalendarMonthIcon color="primary" />  Fin de la subasta: {finalDate}</p>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}
export default ProductCard
