import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import NavBarMenu from './NavBarMenu';
import MenuLateral from './MenuLateral';
//import 'react-slideshow-image/dist/styles.css'
//import { Zoom } from 'react-slideshow-image';

function Productos() {
  return (
    <>
      <NavBarMenu></NavBarMenu>
      <Container fluid style={{ background: "#F0F2F5" }}>
        <Row>
          <Col xs={3} className="sidebarEasy">
            <MenuLateral></MenuLateral>
          </Col>
          <Col xs={9}>
          </Col>
        </Row>
      </Container>
    </>
  )
}
export default Productos;