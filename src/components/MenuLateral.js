import React, { useState, useEffect} from 'react'
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

  useEffect(() => {
    createPoints();
  }, [])// eslint-disable-line react-hooks/exhaustive-deps
  

  async function createPoints() {
    let actualUrl = window.location.href;
    let path = actualUrl.split('/').reverse()[0];
    if (path === 'productos') {
      let pointsUpdate = await PointsService.updatePointsByUserId({ userId: user.id, pts: parseInt(0) });
    }
  }


  return (
    <Col>
      <Row className='p-2 d-flex align-items-center justify-content-center '>
        <Col style={{ paddingRight: "0" }}>
          <Image className='profilePicture-sidebar' src={"/" + imgProfile.filePath}></Image>
          <label className='m-2'>{user.profile.firstName}</label>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/misproductos" }} className={(view === "MyProducts") ? "nav-activate btn-sidebar" : "btn-sidebar"}>
            <ProductIco className="ico-sidebar"></ProductIco>
            <label className='m-2'>Mis productos</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/miscompras" }} className={(view === "MyShops") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <ComprasIco className="ico-sidebar"></ComprasIco>
            <label className='m-2'>Mis compras</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/misofertas" }} className={(view === "MyOff") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <OfertasIco className="ico-sidebar"></OfertasIco>
            <label className='m-2'>Mis ofertas</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/misresenas" }} className={(view === "MyReviews") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <ResenasIco className="ico-sidebar"></ResenasIco>
            <label className='m-2'>Mis Reseñas</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/profile" }} className={(view === "MyProfile") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <ProfileIco className="ico-sidebar"></ProfileIco>
            <label className='m-2'>Mi perfil</label>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingRight: "0" }}>
          <Button variant="link" onClick={() => { window.location.href = "/buys/points" }} className={(view === "Points") ? "btn-sidebar nav-activate" : "btn-sidebar"}>
            <BuysIco className="ico-sidebar"></BuysIco>
            <label className='m-2'>Puntos Easy</label>
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