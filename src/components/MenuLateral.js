import React, { useState } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { ReactComponent as ProductIco } from "../images/new_products_nav.svg"
import { ReactComponent as ComprasIco } from "../images/compras_nav.svg"
import { ReactComponent as OfertasIco } from "../images/ofertas_nav.svg"
import { ReactComponent as ResenasIco } from "../images/resenas_nav.svg"
import { ReactComponent as ProfileIco } from "../images/profile_nav.svg"
import { ReactComponent as BuysIco } from "../images/buysMenu.svg"

import AuthService from '../services/auth.service'


function MenuLateral(params) {
  const [view ] = useState(params.view);
  const [user] = useState(AuthService.getCurrentUser());
  let imgProfile = user.profile.file;
  return (
    <Container>
      <Row className='p-2 d-flex align-items-center justify-content-center'>
        <Col>
          <Image className='profilePicture-sidebar' src={"/" + imgProfile.filePath}></Image>
          <label className='m-2'>{user.profile.firstName}</label>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => {window.location.href = "/misproductos"}} className={(view === "MyProducts") ? "nav-activate btn-sidebar" : "btn-sidebar"}>
            <ProductIco className="ico-sidebar"></ProductIco>
            <label className='m-2'>Mis productos</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => {window.location.href = "/resenas"}} className={(view === "MyShops") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <ComprasIco className="ico-sidebar"></ComprasIco>
            <label className='m-2'>Mis compras</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => {window.location.href = "/misofertas"}} className={(view === "MyOff") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <OfertasIco className="ico-sidebar"></OfertasIco>
            <label className='m-2'>Mis ofertas</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => {window.location.href = "/vistas"}} className={(view === "MyReviews") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <ResenasIco className="ico-sidebar"></ResenasIco>
            <label className='m-2'>Mis Reseñas</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link"  onClick={() => {window.location.href = "/profile"}} className={(view === "MyProfile") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <ProfileIco className="ico-sidebar"></ProfileIco>
            <label className='m-2'>Mi perfil</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => {window.location.href = "/buys/points"}} className={(view === "Points") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <BuysIco className="ico-sidebar"></BuysIco>
            <label className='m-2'>Puntos Easy</label>
          </Button>
        </Col>
      </Row>
      <hr></hr>
    </Container >
  )
}

export default MenuLateral