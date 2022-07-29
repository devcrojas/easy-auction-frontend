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
import { Link } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import OffersService from '../services/offers.service';
const ENDPOINT = "/";


const ProductCard = (props) => {
    // Manejadores para cerrar o mostrar el modal del detalle del producto
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [product, setProduct] = useState(props.product);
    const [initialDate, setInitialDate] = useState(new Date(props.product.auctionDate.initialD).toLocaleDateString() + ' ' + new Date(props.product.auctionDate.final).toLocaleTimeString());
    const [finalDate, setFinalDate] = useState(new Date(props.product.auctionDate.final).toLocaleDateString() + ' ' + new Date(props.product.auctionDate.final).toLocaleTimeString());
    const [imag, setImag] = useState((props.product.file) ? props.product.file.filePath : 'uploads\\sin.jpg');
    const [offered, setOffered] = useState((typeof props.product.price.offered === "undefined") ? "0" : props.product.price.offered);
    const [minOffered, setMinOffered] = useState((typeof props.product.price.offered !== "undefined") ? props.product.price.offered + 1 : props.product.price.initialP);
    const [winOffered, setWinOffered] = useState((typeof props.product.price.winOffered !== "undefined" && props.product.price.winOffered !== "") ? props.product.price.winOffered : "");
    //Primer validacion, revisa que el usuario vaya ganando la subasta. Segunda revisa que tenga saldo suficiente para ofertar.

    const [disabledButtons, setDisabledButtons] = useState(((typeof props.product.price.winOffered !== "undefined" && props.product.price.winOffered === props.user.id)
        || (props.pointsUser.pts < props.product.price.initialP) || (typeof props.product.price.offered !== "undefined" && props.pointsUser.pts <= props.product.price.offered))
        ? true : null);

    const [mssgDisabledButtons, setMssgDisabledButtons] = useState(
        () => {
            if (typeof props.product.price.winOffered !== "undefined" && props.product.price.winOffered === props.user.id) {
                return "Vas ganando la subasta."
            } else if ((props.pointsUser.pts < props.product.price.initialP) || (typeof props.product.price.offered !== "undefined" && props.pointsUser.pts <= props.product.price.offered)) {
                return "No tienes fondos suficientes."
            }
            else {
                return null
            }
        });

    const [offerNow, setOfferNow] = useState((typeof props.product.price.offered !== "undefined") ? props.product.price.offered : 0);
    const [display, setDisplay] = useState();

    useEffect(() => {
        //console.log(product);
        if (props.actualView === "productsList") {
            const socket = socketIOClient(ENDPOINT);
            const handlerSocket = (data) => {
                console.log("socket send ...");
                //console.log(data);
                let x = data.find(arr => arr._id === props.product._id);
                //console.log(x);
                setWinOffered((typeof x.price.winOffered !== "undefined" && x.price.winOffered !== "") ? x.price.winOffered : "");
                setOffered((typeof x.price.offered === "undefined") ? "0" : x.price.offered)
                setMinOffered((typeof x.price.offered !== "undefined") ? x.price.offered + 1 : x.price.initialP);
                //console.log(props.pointsUser.pts);
                if (typeof x.price.winOffered !== "undefined" && x.price.winOffered === props.user.id) {
                    setDisabledButtons(true);
                    setMssgDisabledButtons("Vas ganando la subasta.");
                } else if ((typeof x.price.offered !== "undefined" && props.pointsUser.pts < x.price.offered + 1) || (typeof x.price.offered === "undefined" && props.pointsUser.pts < x.price.initialP)) {
                    //Valida si se puede participar por el saldo, si no bloquea los botones.
                    setDisabledButtons(true);
                    setMssgDisabledButtons("No tienes fondos suficientes.");
                } else {
                    setDisabledButtons(null);
                    setMssgDisabledButtons(null);
                }

                setOfferNow((typeof x.price.offered !== "undefined") ? x.price.offered : 0);
            }
            var date1 = new Date();
            var date2 = new Date(product.auctionDate.final);
            if (date2 < date1){
                const closeAuction = async () => {
                    let resultClose = await OffersService.auctionClose(product);
                    console.log(resultClose);
                    return resultClose;
                };
                closeAuction();
                console.log("Cerrar subasta");

            }
            const interval = setInterval(() => {

                if (date2 < date1) {
                    setDisplay("Subasta Finalizada");
                } else {
                    // get total seconds between the times
                    var delta = Math.abs(date2 - date1) / 1000;
                    // calculate (and subtract) whole days
                    var days = Math.floor(delta / 86400);
                    delta -= days * 86400;

                    // calculate (and subtract) whole hours
                    var hours = Math.floor(delta / 3600) % 24;
                    delta -= hours * 3600;

                    // calculate (and subtract) whole minutes
                    var minutes = Math.floor(delta / 60) % 60;
                    delta -= minutes * 60;

                    // what's left is seconds
                    var seconds = Math.floor(delta % 60);
                    //console.log(hours + ":" + minutes + ":" + seconds);
                    setDisplay(((days > 9) ? days : "0" + days) + ":" + ((hours > 9) ? hours : "0" + hours) + ":" + ((minutes > 9) ? minutes : "0" + minutes) + ":" + ((seconds > 9) ? seconds : "0" + seconds));
                }
                //console.log(Date.now() - date2);
            }, 1000);
            socket.on("FromAPI", handlerSocket);
            return () => { socket.off('FromAPI', handlerSocket); clearInterval(interval); };
        }


        //Validar que la fecha ya haya expirado para que se considere vendido el producto.
        //clearInterval(interval)
        //console.log(props);

    }, [])
    // Se obtienen los datos necesarios para el card del producto
    const producto = props.product;

    // Se obtienen las opciones por vista
    let editOptions;
    let viewOptions;
    let buttonReviews;
    let phaseProd;
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
            case 'purchased':
                editOptions =
                    <>
                        <h5 className='text-success'>PRODUCTO COMPRADO</h5>
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
                    <ProductsOffers minOffered={minOffered} setMinOffered={setMinOffered} setOffered={setOffered} product={product} pointsUser={props.pointsUser} setPointsUser={props.setPointsUser} setWinOffered={setWinOffered} user={props.user} disabledButtons={disabledButtons} setDisabledButtons={setDisabledButtons} mssgDisabledButtons={mssgDisabledButtons} setMssgDisabledButtons={setMssgDisabledButtons} offerNow={offerNow} setOfferNow={setOfferNow} variant="contained" color="info">Comprar ahora</ProductsOffers>
                </Col>
                <Col style={{ paddingLeft: "0" }}>
                    <Button style={{ width: "100%", borderRadius: "0" }} variant="contained" color="info">Comprar ahora</Button>
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

    if (props.actualView === 'myShoppings') {
        if (producto.status === 'purchased') {
            switch (producto.phase) {
                case 'packing':
                    phaseProd = <>
                        <Row>
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                <Badge bg="info" style={{ fontSize: "1rem", width: "100%", borderRadius: "0" }}>PRODUCTO COMPRADO</Badge>
                            </Col>
                        </Row>
                    </>
                    buttonReviews = <>
                        <Row>
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                <Tooltip title="Cancelar pedido">
                                    <Button variant="contained" style={{ width: "100%", borderRadius: "0", backgroundColor: "coral" }} onClick={() => { window.location.href = "/resenas" }}>
                                        Cancelar pedido
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>
                    </>
                    break;
                case 'transporting':
                    phaseProd = <>
                        <Row>
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                <Badge bg="primary" style={{ fontSize: "1rem", width: "100%", borderRadius: "0" }}>PRODUCTO EN ENVIO</Badge>
                            </Col>
                        </Row>
                    </>
                    buttonReviews = <>
                        <Row>
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                <Tooltip title="Cancelar pedido">
                                    <Button variant="contained" style={{ width: "100%", borderRadius: "0", backgroundColor: "coral" }} onClick={() => { window.location.href = "/resenas" }}>
                                        Cancelar pedido
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>
                    </>
                    break;
                case 'delivered':
                    phaseProd = <>
                        <Row>
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                <Badge bg="warning" style={{ fontSize: "1rem", width: "100%", borderRadius: "0" }}>PRODUCTO RECIBIDO</Badge>
                            </Col>
                        </Row>
                    </>
                    buttonReviews = <>
                        <Row>
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                <Tooltip title="Reseñar producto">
                                    <Link to={'/resenas'} state={producto._id} style={{ textDecoration: "none" }}>
                                        <Button variant="contained" style={{ width: "100%", borderRadius: "0", backgroundColor: "#00BFFF" }}>
                                            Hacer una reseña
                                        </Button>
                                    </Link>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                <Tooltip title="Devolver producto">
                                    <Button color="error" style={{ width: "100%", borderRadius: "0" }}>
                                        Devolver producto
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>
                    </>
                    break;

                default:
                    phaseProd = <>
                        <Row>
                            <Col style={{ paddingRight: "0", paddingLeft: "0" }}>
                                <Badge bg="secondary" style={{ fontSize: "1rem", width: "100%", borderRadius: "0" }}>COMPRADO</Badge>
                            </Col>
                        </Row>
                    </>
                    break;
            }
        }
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
                {(props.actualView === 'myShoppings') ? phaseProd : ""}
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
                                    <div className="text-center text-primary"><strong>{display}</strong></div>
                                    <div><Typography component="div" className="text-center" ><Badge bg="secondary" style={{ fontSize: "1rem" }}>{product.category}</Badge>  </Typography></div>
                                </div>
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col >
                                <div className='w-100'>
                                    <div><Typography component="div" className="text-center" style={{ fontSize: "1rem" }}>Precio inicial </Typography></div>
                                    <div><Typography component="div" className="text-center" ><Badge bg="success" style={{ fontSize: "1rem" }}><em><b>$</b></em> {product.price.initialP}</Badge> </Typography></div>
                                </div>
                            </Col>
                            <Col >
                                <div className='w-100'>
                                    <div><Typography component="div" className="text-center" style={{ fontSize: "1rem" }}>Fecha inicio</Typography></div>
                                    <div><Typography component="div" className="text-center" ><Badge bg="dark" style={{ fontSize: "1rem" }}>{initialDate}</Badge> </Typography></div>
                                </div>
                            </Col>
                        </Row>
                        <Row className='my-2'>
                            <Col>
                                <div className='w-100'>

                                    <div><Typography component="div" className="text-center" style={{ fontSize: "1rem" }}>Comprar ahora</Typography></div>
                                    <div><Typography component="div" className="text-center" > <Badge bg="info" style={{ fontSize: "1rem" }}> <em><b>$</b></em>  {product.price.buyNow} </Badge></Typography></div>

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
                                {(props.actualView === 'myShoppings') ?
                                    <>
                                        <Typography component="div" variant='h5' color='success' className='text-center'>Comprado por: {winOffered}<em className='text-success'><b>${offered}</b></em></Typography>
                                    </>
                                    :
                                    <>
                                        <Typography component="div" variant='h5' color='success' className='text-center'>Ofertado<em className='text-success'><b>${offered}</b></em></Typography>
                                        {(winOffered !== "") ?
                                            <div><Typography component="div" style={{ fontSize: "1rem" }} className="text-center text-success" >Ganando: {winOffered}</Typography></div>
                                            :
                                            <div><Typography component="div" style={{ fontSize: "1rem" }} className="text-center text-danger" >Nadie a ofertado</Typography></div>
                                        }
                                    </>
                                }

                            </Col>
                        </Row>
                    </CardContent>
                </CardActionArea>
                {(props.actualView === 'productsList') ? viewOptions(product) : ""}
                {(props.actualView === 'myShoppings') ? buttonReviews : ""}
            </Card>
            <Modal show={show} size="xl" centered onHide={handleClose} >
                <Modal.Header closeButton>
                    <h1> {product.nameProduct}</h1>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <div className="slide-container text-center" sx={{ height: 'auto' }}>
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
