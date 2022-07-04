import React, { useEffect, useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { Card, CardContent, CardMedia, Typography, CardActionArea, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
//import 'react-slideshow-image/dist/styles.css'
//import { Zoom } from 'react-slideshow-image';

function Productos() {

  const [show, setShow] = useState(false);
  const [apis, setApis] = useState([]);
  const [detalle, setDetalle] = useState();


  useEffect(() => {
    getProductos()
  }, [])

  /* useEffect(() => {
    let p = apis.find(product => product._id === id)
    setDetalle(p);
    return () => {
      cleanup
    };
  }, [show]);
 */
  var getProductos = async function () {
    let produc = await fetch("http://localhost:8080/products",
      {
        method: "GET"
      }
    );
    let awProduc = await produc.json();
    console.log(awProduc);
    setApis(awProduc);
    return;
  };

  const cards = () => {
    let card = apis.map((producto) => {

      //let img = showImages(producto.images);
      return (
        <Card sx={{ minWidth: 345, maxWidth: 345, margin: 1 }} key={producto._id}>
          <CardActionArea onClick={() => handleShow(producto._id)}>
            <CardMedia
              id={producto._id}
              component="img"
              height="400"
              width="250"
              image={producto.images}
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

  const handleShow = (id) => {
    setShow(true);
  }
  function showModal(det) {
    console.log(det.price.initialP)
    return (
      <Modal show={show} size="xl" onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Typography gutterBottom variant="h2" component="div" sx={{ height: 50, width: 'auto' }}>
          </Typography>

        </Modal.Header>
        <Modal.Body>
          <Row>
            {/*<Col md={6}>
            <div className="slide-container">
                <Zoom scale={0.4}>
                 {
                  showSlider(detalle.images)
                 }
                </Zoom>
            </div>
                
            </Col>*/}
            <Typography component="div">
              {/* <p>{detalle.description.material}</p>
              <p>{detalle.description.dimensions}</p> */}
            </Typography>
            <Col md={6} className="fuente">
              <div>Final subasta</div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    )
  }

  /*function showImages(images) {
    
    let image = images.map((ur => {
      return ur.split('/').reverse()
    }));
    return image;
  }*/

  /*function showSlider(detImages){
    let img = showImages(detImages);
    let slider = img.map(((im,index) =>{
      console.log(im);
      return <img key={index} style={{width: "100%", height:350, border:5 }} src={require(`../../public/images/${im[0]}`)} alt={index} /> 
    }));
    return slider;
  }*/

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
          showModal(detalle)
        }
      </>
    </Container>
  )
}

export default Productos;