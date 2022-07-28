import React from 'react';
import NavBarMenu from './NavBarMenu';
import ProductsList from './ProductsList';
import { Col, Container, Row } from 'react-bootstrap';
import MenuLateral from './MenuLateral';
import AuthService from '../services/auth.service';
import { useState, useEffect } from 'react';
function Productos() {
  const [profile] = useState(AuthService.getCurrentUser().profile);
  const [user] = useState(AuthService.getCurrentUser());
  const [products, setProducts] = useState(null);
  const [productListX, setproductListX] = useState("");



  return (
    <>
      <NavBarMenu view={"Products"} user={user.profile} ></NavBarMenu>
      <Container fluid style={{ background: "#F0F2F5",  minHeight: "100vh" }}>
        <Row>
          <Col id="sidebarEasy" xs={3} style={{position:"fixed", width:"25%"}} className="sidebarEasy">
            <MenuLateral view={""} imgProfile={profile.file}></MenuLateral>
          </Col>
          <Col xs={9} style={{width:"75%", marginLeft:"25%"}}>
            <ProductsList filter={true} filterField={'status'} filterValue={'active'}  actualView='productsList' ></ProductsList>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Productos;