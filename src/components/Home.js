import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap'
import "../nav.css"
import NavBarMenu from './NavBarMenu'
import MenuLateral from './MenuLateral';
import AuthService from '../services/auth.service';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    let user = AuthService.getCurrentUser();
    console.log(user);
  });

  return (
    <>
      <NavBarMenu view={"Products"}></NavBarMenu>
      <Container fluid style={{ background: "#F0F2F5" }}>
        <Row>
          <Col xs={3} className="sidebarEasy">
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