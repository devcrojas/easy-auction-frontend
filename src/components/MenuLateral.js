import React from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { ReactComponent as ProductIco } from "../images/products_nav.svg"
import { ReactComponent as ComprasIco } from "../images/compras_nav.svg"
import { ReactComponent as OfertasIco } from "../images/ofertas_nav.svg"
import { ReactComponent as ResenasIco } from "../images/resenas_nav.svg"
import { ReactComponent as ProfileIco } from "../images/profile_nav.svg"
import { Link } from 'react-router-dom'

function MenuLateral() {
  return (
    <Container>
      <Row className='p-2 d-flex align-items-center justify-content-center'>
        <Col>
          <Image className='profilePicture-sidebar' src="profile_cr.jpeg"></Image>
          <label className='m-2'>Arthur Barker</label>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Link to="/producto">
            <Button variant="link" className='btn-sidebar btn-sidebar-activate'>
              <ProductIco className="ico-sidebar"></ProductIco>
              <label className='m-2'>Mis productos</label>
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Link to="/compras">
            <Button variant="link" className='btn-sidebar'>
              <ComprasIco className="ico-sidebar"></ComprasIco>
              <label className='m-2'>Mis compras</label>
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Link to="/ofertas">
            <Button variant="link" className='btn-sidebar'>
              <OfertasIco className="ico-sidebar"></OfertasIco>
              <label className='m-2'>Mis ofertas</label>
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Link to="/resenas">
            <Button variant="link" className='btn-sidebar'>
              <ResenasIco className="ico-sidebar"></ResenasIco>
              <label className='m-2'>Mis Reseñas</label>
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Link to="/perfil">
            <Button variant="link" className='btn-sidebar'>
              <ProfileIco className="ico-sidebar"></ProfileIco>
              <label className='m-2'>Mi perfil</label>
            </Button>
          </Link>
        </Col>
      </Row>
    </Container >
  )
}

export default MenuLateral