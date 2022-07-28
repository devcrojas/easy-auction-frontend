import React, { useState, useEffect } from 'react'
import { Button, Col, Image, Row } from 'react-bootstrap'
import { ReactComponent as ProductIco } from "../images/new_products_nav.svg"
import { ReactComponent as ComprasIco } from "../images/compras_nav.svg"
import { ReactComponent as OfertasIco } from "../images/ofertas_nav.svg"
import { ReactComponent as ResenasIco } from "../images/resenas_nav.svg"
import { ReactComponent as ProfileIco } from "../images/profile_nav.svg"
import { ReactComponent as BuysIco } from "../images/buysMenu.svg"

import AuthService from '../services/auth.service'
import PointsService from '../services/points.service'


function MenuLateral(params) {
  const [view] = useState(params.view);
  const [user] = useState(AuthService.getCurrentUser());
  let imgProfile = user.profile.file;

  return (
    <Col>
      <Row className='p-2 d-flex align-items-center justify-content-center '>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" className="btn-sidebar d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block">
            <Image className='profilePicture-sidebar' src={"/" + imgProfile.filePath}></Image>
            <label className='m-2'>{user.profile.firstName}</label>
          </Button>
          <Button variant="link" className="btn-sidebar d-lg-none d-xl-block d-xl-none text-center">
            <Image className='profilePicture-sidebar' src={"/" + imgProfile.filePath}></Image>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/misproductos" }} className={(view === "MyProducts") ? "nav-activate btn-sidebar d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block" : "btn-sidebar d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block"}>
            <ProductIco className="ico-sidebar"></ProductIco>
            <label className='m-2'>Mis productos</label>
          </Button>
          <Button variant="link" onClick={() => { window.location.href = "/misproductos" }} className={(view === "MyProducts") ? "nav-activate btn-sidebar d-lg-none d-xl-block d-xl-none text-center" : "btn-sidebar d-lg-none d-xl-block d-xl-none text-center"}>
            <ProductIco className="ico-sidebar"></ProductIco>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/resenas" }} className={(view === "MyShops") ? "btn-sidebar nav-activate d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block" : "btn-sidebar d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block"}>
            <ComprasIco className="ico-sidebar"></ComprasIco>
            <label className='m-2'>Mis compras</label>
          </Button>
          <Button variant="link" onClick={() => { window.location.href = "/resenas" }} className={(view === "MyShops") ? "btn-sidebar nav-activate d-lg-none d-xl-block d-xl-none text-center" : "btn-sidebar d-lg-none d-xl-block d-xl-none text-center"}>
            <ComprasIco className="ico-sidebar"></ComprasIco>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/misofertas" }} className={(view === "MyOff") ? "btn-sidebar nav-activate d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block" : "btn-sidebar d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block"}>
            <OfertasIco className="ico-sidebar"></OfertasIco>
            <label className='m-2'>Mis ofertas</label>
          </Button>
          <Button variant="link" onClick={() => { window.location.href = "/misofertas" }} className={(view === "MyOff") ? "btn-sidebar nav-activate d-lg-none d-xl-block d-xl-none text-center" : "btn-sidebar d-lg-none d-xl-block d-xl-none text-center"}>
            <OfertasIco className="ico-sidebar"></OfertasIco>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/vistas" }} className={(view === "MyReviews") ? "btn-sidebar nav-activate d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block" : "btn-sidebar d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block"}>
            <ResenasIco className="ico-sidebar"></ResenasIco>
            <label className='m-2'>Mis Reseñas</label>
          </Button>
          <Button variant="link" onClick={() => { window.location.href = "/vistas" }} className={(view === "MyReviews") ? "btn-sidebar nav-activate d-lg-none d-xl-block d-xl-none text-center" : "btn-sidebar d-lg-none d-xl-block d-xl-none text-center"}>
            <ResenasIco className="ico-sidebar"></ResenasIco>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/profile" }} className={(view === "MyProfile") ? "btn-sidebar nav-activate d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block" : "btn-sidebar d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block"}>
            <ProfileIco className="ico-sidebar"></ProfileIco>
            <label className='m-2'>Mi perfil</label>
          </Button>
          <Button variant="link" onClick={() => { window.location.href = "/profile" }} className={(view === "MyProfile") ? "btn-sidebar nav-activate d-lg-none d-xl-block d-xl-none text-center" : "btn-sidebar d-lg-none d-xl-block d-xl-none text-center"}>
            <ProfileIco className="ico-sidebar"></ProfileIco>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/buys/points" }} className={(view === "Points") ? "btn-sidebar nav-activate d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block" : "btn-sidebar d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block"}>
            <BuysIco className="ico-sidebar"></BuysIco>
            <label className='m-2'>Puntos Easy</label>
          </Button>
          <Button variant="link" onClick={() => { window.location.href = "/buys/points" }} className={(view === "Points") ? "btn-sidebar nav-activate d-lg-none d-xl-block d-xl-none text-center" : "btn-sidebar d-lg-none d-xl-block d-xl-none text-center"}>
            <BuysIco className="ico-sidebar"></BuysIco>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <hr></hr>
          <label style={{ fontSize: ".9rem" }}>EasySoft © 2022</label>
        </Col>
      </Row>
    </Col >
  )
}

export default MenuLateral