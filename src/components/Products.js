import React, { useEffect, useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { Card, CardContent, CardMedia, Typography, CardActionArea, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import 'react-slideshow-image/dist/styles.css'
import { Zoom } from 'react-slideshow-image';

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

      return (

        <Card sx={{ minWidth: 345, maxWidth: 345, margin: 1 }} key={producto._id}>
          <CardActionArea onClick={() => {
            handleShow();
            setDetalles(apis.find(product => product._id === producto._id))
          }
          }>

            <CardMedia
              id={producto._id}
              component="img"
              height="400"
              width="250"
              image={`http://localhost:8080\\${imag}`}
              alt={producto.nameProduct}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ height: 50, width: 'auto' }}>
                {producto.nameProduct}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="span">
                {producto.category}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                <List sx={{ width: '100%', height: 'auto' }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ width: '1.5rem', height: '1.5rem' }}>
                        <MonetizationOnRoundedIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Inicial" secondary={producto.price.initialP} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ width: '1.5rem', height: '1.5rem' }}>
                        <MonetizationOnRoundedIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Comprar Ahora" secondary={producto.price.buyNow} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ width: '1.5rem', height: '1.5rem' }}>
                        <MonetizationOnRoundedIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Ofertado" secondary={producto.price.offered} />
                  </ListItem>
                </List>
                <Typography component="span" display="flex" variant="overline">
                  <CalendarMonthIcon sx={{ width: '1.5rem', height: '1.5rem' }} />
                  <ListItemText primary="Inicio de Subasta: " secondary={producto.auctionDate.initialD} sx={{ marginRight: 5 }} />
                  <CalendarMonthIcon sx={{ width: '1.5rem', height: '1.5rem' }} />
                  <ListItemText primary="Fin de Subasta: " secondary={producto.auctionDate.final} />
                </Typography>
              </Typography>
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
              <div className="slide-container">
                <Zoom scale={0.4}>
                  {
                    showSlider(imagenArreglo)
                  }
                </Zoom>
              </div>

            </Col>
            <Col md={6} className="fuente">

              <p>Categoria: {detalle.category}</p>
              <div>Material: {detalle.description.material}</div>
              <div>Marca: {detalle.description.marca}</div>
              <div>Dimensiones: {detalle.description.dimensions}</div>
              <div>Condicion: {detalle.description.actualCondition}</div>
              <div>Observaciones: {detalle.description.observations}</div>
              <div>Precio inicial:${detalle.price.initialP}</div>
              <div>Precio actual:{detalle.price.buyNow}</div>
              <div>Precio ofertado:{detalle.price.offered}</div>
              <div>Inicio subasta:{detalle.auctionDate.initialD}</div>
              <div>Final subasta {detalle.auctionDate.final}</div>
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




  )
}

export default Productos;


