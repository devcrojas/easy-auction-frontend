import React, { useEffect, useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { Card, CardContent, CardMedia, Typography, CardActionArea, ListItem, CardHeader } from '@mui/material'
import 'react-slideshow-image/dist/styles.css'
import { Zoom } from 'react-slideshow-image';
import NavBarMenu from './NavBarMenu';

function Productos() {

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
    "files": []
  });

  useEffect(() => {
    getProductos()
  }, [])


  var getProductos = async function () {
    let produc = await fetch("http://localhost:8080/products",
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
      let imag = showPrincipalImage(producto.files)
      let initialDate = new Date(producto.auctionDate.initialD).toLocaleDateString();
      let finalDate = new Date(producto.auctionDate.final).toLocaleDateString() + ' ' + new Date(producto.auctionDate.final).toLocaleTimeString();
      return (
        <Card sx={{ minWidth: 450, maxWidth: 450, margin: 1, borderRadius: 5, marginTop: 3, marginBottom: 3 }} elevation={10} key={producto._id}>
          <CardActionArea onClick={async () => {
            await setDetalles(apis.find(product => product._id === producto._id))
            handleShow();
          }
          }>

            <CardHeader
              sx={{ text: 'center' }}
              title={producto.nameProduct}
              subheader={producto.category}
            />
            <Row className="justify-content-center">
              <CardMedia
                md={6}

                id={producto._id}
                component="img"
                image={`http://localhost:8080\\${imag}`}
                alt={producto.nameProduct}
                sx={{ width: 250 }
                }
              />
            </Row>
            <CardContent>
              <Row className='my-2'>
                <Col>
                  <div className='w-100'>
                    <div><Typography component="div" >Precio inicial: </Typography></div>
                    <div><Typography component="div" ><em><b>$</b></em> {producto.price.initialP} </Typography></div>
                  </div>
                </Col>
                <Col>
                  <div className='w-100'>
                    <div><Typography component="div" >Fecha inicio: </Typography></div>
                    <div><Typography component="div" >{initialDate} </Typography></div>
                  </div>
                </Col>
              </Row>
              <Row className='my-2'>
                <Col>
                  <div className='w-100'>
                    <div><Typography component="div" >Comprar ahora: </Typography></div>
                    <div><Typography component="div" ><em><b>$</b></em>  {producto.price.buyNow} </Typography></div>
                  </div>
                </Col>
                <Col>
                  <div className='w-100'>
                    <div><Typography component="div" >Fecha fin: </Typography></div>
                    <div><Typography component="div" >{finalDate} </Typography></div>
                  </div>
                </Col>
              </Row>
              <Row className='my-5'>
                <Col></Col>
                <Col>
                  <ListItem>
                    <Typography component="div" variant='h5' color='success' >Ofertado:<em><b>$</b></em></Typography>
                    <Typography component="div" variant='h5' className="text-success">{producto.price.offered} </Typography>
                  </ListItem>
                </Col>
              </Row>
            </CardContent>
          </CardActionArea>
        </Card>
      )
    });
    return card
  }

  function showPrincipalImage(images) {
    let uri = "uploads\\sin.jpg"
    if (images !== undefined && images.length > 0) {
      uri = images[0].filePath;
    }
    return uri;

  }

  function verModal(detalle) {

    let imagenArreglo = detalle.files !== undefined ? detalle.files : [{ filePath: "uploads\\sin.jpg" }]
    let initialDate = new Date(detalle.auctionDate.initialD).toLocaleDateString();
    let finalDate = new Date(detalle.auctionDate.final).toLocaleDateString() + ' ' + new Date(detalle.auctionDate.final).toLocaleTimeString();
    return (
      <Modal show={show} size="xl" onHide={handleClose} >
        <Modal.Header closeButton>
          <Typography gutterBottom variant="h2" component="div" sx={{ height: 50, width: 'auto' }}>
            {detalle.nameProduct}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <div className="slide-container" sx={{ width: '75%', height: 'auto', }}>
                <Zoom scale={0.4}>
                  {
                    showSlider(imagenArreglo)
                  }
                </Zoom>
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
      </Modal>
    )
  }

  function showSlider(detImages) {
    if (detImages.length > 0) {
      let slider = detImages.map(((im, index) => {
        return <img key={index} style={{ width: "100%", height: 350, border: 5 }} src={`http://localhost:8080\\${im.filePath}`} alt={index} />
      }));
      return slider;
    }
  }

  return (
    <>
      <NavBarMenu></NavBarMenu>
      <Container fluid style={{ background: "#F0F2F5" }}>
        <Row>
          <Col xs={3} className="sidebarEasy">

          </Col>
          <Col xs={9 }>
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

export default Productos;


