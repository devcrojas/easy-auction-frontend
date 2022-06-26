import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Image, Navbar, Nav, Container, Row, Col, Button, NavDropdown } from 'react-bootstrap'
import "../nav.css"
import authService from '../services/auth.service'

import { ReactComponent as ProductIco } from "../images/products_nav.svg"
import { ReactComponent as ComprasIco } from "../images/compras_nav.svg"
import { ReactComponent as OfertasIco } from "../images/ofertas_nav.svg"
import { ReactComponent as ResenasIco } from "../images/resenas_nav.svg"
import { ReactComponent as ProfileIco } from "../images/profile_nav.svg"
import { ReactComponent as EasyicoNavBar } from "../images/ico-navbar.svg"

function Home() {
  const navigate = useNavigate();
  
  useEffect(() => {
    //console.log("Hola");
    let x = async function(){
      let getF = new Promise(async (resolve, reject) => {
        try{
          const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem("token") }
          };
          var loginCheck = await fetch("/books", requestOptions);
          if(loginCheck.ok){
            resolve(loginCheck.json());
          }else{
            if(loginCheck.status === 403){
              localStorage.removeItem("token");
              navigate("/")
            }
            resolve({status: loginCheck.status});
          }
        }catch(e){ 
          reject({status: -1})
        }
      });
      let resp = await getF;
      console.log(resp);
    }
    x();
  });

  return (
    <>
      <Navbar collapseOnSelect expand="lg" >
        <Container fluid>
          <Navbar.Brand href="#home"><EasyicoNavBar className="profilePicture-sidebar"></EasyicoNavBar></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/home">Productos</Nav.Link>
              <Nav.Link href="#pricing">Vendedores</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title="Arthur Barker" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Reiniciar Password</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={event => authService.logout(navigate)}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link eventKey={2} href="#memes">
                Administrador
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid style={{ background: "#F0F2F5" }}>
        <Row>
          <Col xs={3} className="sidebarEasy">
            <Row className='p-2 d-flex align-items-center justify-content-center'>
              <Col>
                <Image className='profilePicture-sidebar' src="profile_cr.jpeg"></Image>
                <label className='m-2'>Arthur Barker</label>
              </Col>
            </Row>
            <Row>
              <Col style={{ paddingRight: "0" }}>
                <Button variant="link" className='btn-sidebar btn-sidebar-activate'>
                  <ProductIco className="ico-sidebar"></ProductIco>
                  <label className='m-2'>Mis productos</label>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col style={{ paddingRight: "0" }}>
                <Button variant="link" className='btn-sidebar'>
                  <ComprasIco className="ico-sidebar"></ComprasIco>
                  <label className='m-2'>Mis compras</label>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col style={{ paddingRight: "0" }}>
                <Button variant="link" className='btn-sidebar'>
                  <OfertasIco className="ico-sidebar"></OfertasIco>
                  <label className='m-2'>Mis ofertas</label>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col style={{ paddingRight: "0" }}>
                <Button variant="link" className='btn-sidebar'>
                  <ResenasIco className="ico-sidebar"></ResenasIco>
                  <label className='m-2'>Mis Reseñas</label>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col style={{ paddingRight: "0" }}>
                <Button variant="link" className='btn-sidebar'>
                  <ProfileIco className="ico-sidebar"></ProfileIco>
                  <label className='m-2'>Mi perfil</label>
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs={6}>
                <h1>Contenido</h1>
              </Col>
              <Col xs={6}>
                <h1>Contenido</h1>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <h1>Contenido</h1>
              </Col>
              <Col xs={6}>
                <h1>Contenido</h1>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <h1>Contenido</h1>
              </Col>
              <Col xs={6}>
                <h1>Contenido</h1>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>


  )
}

export default Home