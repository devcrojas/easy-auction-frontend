import React, { useEffect, useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { Card, CardContent, CardMedia, Typography, CardActionArea, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import 'react-slideshow-image/dist/styles.css'
import { Zoom } from 'react-slideshow-image';


let p = {}
let productDesc = {}
let productPrice = {}
let productDate = {}
let initialDate;
let finalDate;
function Productos() { 

  const [show, setShow] = useState(false);
  const [apis,setApis] = useState([]); 
  const [detalle,setDetalle] = useState([]);

  
  useEffect(() => {
    getProductos()
  },[])

  var getProductos= async function(){
    let produc= await fetch("http://localhost:8080/products",
      {
        method:"GET"
      }
    );
    let awProduc= await produc.json();
    setApis(awProduc);
    console.log(awProduc);
    return;
  };

  const handleShow = (id) => {
    setShow(true);
    p = apis.find(product => product._id === id)
    productDesc = p.description
    productPrice = p.price
    productDate = p.auctionDate
    initialDate = new Date(productDate.initialD).toLocaleDateString() +' - '+ new Date(productDate.initialD).toLocaleTimeString() ;
    finalDate = new Date(productDate.final).toLocaleDateString() +' - '+ new Date(productDate.final).toLocaleTimeString() ;
    setDetalle(p);
    console.log("detalle",detalle);
  }


  const cards = () => {
    let card = apis.map((producto) => {

      //let img = showImages(producto.images);
      return (
        <Card sx={{ minWidth:345, maxWidth: 345, margin: 1 }} key= {producto._id}>
          <CardActionArea onClick={() => handleShow(producto._id) }>
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

      <Modal show={show}  size="xl" onHide={() => setShow(false)}>
        <Modal.Header closeButton>
        <Typography gutterBottom variant="h2" component="div" sx={{ height: 50, width: 'auto'}}>
                {p.nameProduct}
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
            <Col md={6} className="fuente">
             
                <p>Categoria: {p.category}</p>
                <div>Material: {productDesc.material}</div>
                <div>Marca: {productDesc.marca}</div>
                <div>Dimensiones: {productDesc.dimensions}</div>
                <div>Condicion: {productDesc.actualCondition}</div>
                <div>Observaciones: {productDesc.observations}</div>
                <div>Precio inicial:${productPrice.initialP}</div>
                <div>Precio actual:{productPrice.buyNow}</div>
                <div>Precio ofertado:{productPrice.offered}</div>
                <div>Inicio subasta:{initialDate}</div>
          <div>Final subasta {finalDate}</div>
              
          </Col>

          </Row>
         
        </Modal.Body>
      </Modal>
    </Container>
  ) 
     
    
}

export default Productos;