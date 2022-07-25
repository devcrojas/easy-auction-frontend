import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import "../nav.css"
import NavBarMenu from './NavBarMenu'
import MenuLateral from './MenuLateral';

function Home() {

  return (
    <>
      <NavBarMenu view={"Products"}></NavBarMenu>
      <Container fluid style={{ background: "#F0F2F5" }}>
        <Row>
          <Col xs={3} id="sidebarEasy" className="sidebarEasy">
            <MenuLateral view={""}></MenuLateral>
          </Col>
          <Col xs={9}>
            <h1>Contenido</h1>
          </Col>
        </Row>
      </Container>
    </>


  )
}

export default Home