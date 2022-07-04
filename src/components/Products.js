import React, { useState } from 'react';
import objecProducts from '../json/products.json';
import { Container, Modal, Row } from 'react-bootstrap';
import { Card, CardContent, CardMedia, Typography, CardActionArea, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
function Productos() {
  const [show, setShow] = useState(false);
  let products = objecProducts.products;

  function handleShow() {
    setShow(true);
  }
  function cards() {
    let card = products.map((producto) => {
      let img = showImages(producto.images);
      return (
        <Card sx={{ width: 'auto', margin: 0.7 }} key={producto.nameProduct}>
          <CardActionArea onClick={(e) => {
            handleShow();
            console.log(e);
          }}>
            <CardMedia
              id={producto._id.$oid}
              component="img"
              height="150"
              width="200"
              image={require(`../images/${img[0]}`)}
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
                    <ListItemText primary="Inicial" secondary={producto.price.initial} />
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
                  <ListItemText primary="Inicio de Subasta:" secondary={producto.auctionDate.initial} sx={{ marginRight: 5 }} />
                  <CalendarMonthIcon sx={{ width: '1.5rem', height: '1.5rem' }} />
                  <ListItemText primary="Fin de Subasta:" secondary={producto.auctionDate.final} />
                </Typography>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )
    });
    return card
  }
  function showImages(images) {
    let image = images.map((ur => {
      return ur.split('/').reverse()
    }));
    return image[0];
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
      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>Modal body content</Modal.Body>
      </Modal>
    </Container>
  )
}
export default Productos


