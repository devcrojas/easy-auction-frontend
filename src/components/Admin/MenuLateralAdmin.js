import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { ReactComponent as ProductIco } from "../../images/new_products_nav.svg"
import { ReactComponent as ComprasIco } from "../../images/compras_nav.svg"
import { ReactComponent as OfertasIco } from "../../images/ofertas_nav.svg"
import { ReactComponent as ResenasIco } from "../../images/resenas_nav.svg"
import { ReactComponent as BuysIco } from "../../images/buysMenu.svg"
import AuthService from '../../services/auth.service'


function MenuLateral(params) {
  const [view, setView] = useState(params.view);
  const [user, setUser] = useState(AuthService.getCurrentUser());
  let imgProfile = user.profile.file;

  
  return (
    <Col>
      <Row className='p-2 d-flex align-items-center justify-content-center'>
        <Col>
          <Image className='profilePicture-sidebar' src={"/" + imgProfile.filePath}></Image>
          <label className='m-2'>{user.profile.firstName}</label>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => {window.location.href = "/admin/productos"}} className={(view === "productsAdmin") ? "nav-activate btn-sidebar" : "btn-sidebar"}>
            <ProductIco className="ico-sidebar"></ProductIco>
            <label className='m-2'>Productos</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => {window.location.href = "#/comprasAdmin"}} className={(view === "MyShops") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <ComprasIco className="ico-sidebar"></ComprasIco>
            <label className='m-2'>Compras</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => {window.location.href = "#/ofertasAdmin"}} className={(view === "MyOff") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <OfertasIco className="ico-sidebar"></OfertasIco>
            <label className='m-2'>Ofertas</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => {window.location.href = "#/vendedoresAdmin"}} className={(view === "MyReviews") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <ResenasIco className="ico-sidebar"></ResenasIco>
            <label className='m-2'>Vendedores</label>
          </Button>
        </Col>
      </Row>
      <hr></hr>
    </Col >
  )
}

export default MenuLateral