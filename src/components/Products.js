import React from 'react';
import NavBarMenu from './NavBarMenu';
import ProductsList from './ProductsList';
import { Col, Container, Row } from 'react-bootstrap';
import MenuLateral from './MenuLateral';
import AuthService from '../services/auth.service';
import { useState } from 'react';
function Productos() {
  const [profile] = useState(AuthService.getCurrentUser().profile);
  const [user] = useState(AuthService.getCurrentUser());

  return (
    <>
      <NavBarMenu view={"Products"} user={user.profile}></NavBarMenu>
      <Container fluid style={{ background: "#F0F2F5" }}>
        <Row>
          <Col xs={3} className="sidebarEasy">
            <MenuLateral view={""} imgProfile={profile.file}></MenuLateral>
          </Col>
          <Col xs={9}>    
            <ProductsList filter={true} filterField={'status'} filterValue={'active'} ></ProductsList>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Productos;